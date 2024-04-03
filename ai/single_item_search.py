import csv
import io
from PIL import Image
from glob import glob
import towhee  # towhee를 사용한다고 가정합니다.
from towhee import pipe, ops, DataCollection
import pika
import json
from rembg import remove
import cv2
import base64
import numpy as np


# secrets 정보 가져오기
with open("./secrets.json", encoding="utf-8") as f:
    config = json.load(f)

milvus_config = config["milvus"]

milvus_host = milvus_config["url"]
milvus_port = milvus_config["port"]

# Load image path
def load_image(x):
    if isinstance(x, bytes):
        # 바이너리 데이터를 직접 yield
        yield x
    elif isinstance(x, str):
        # 파일 경로 패턴일 경우
        for item in glob(x):
            with open(item, 'rb') as image_file:  # 이미지 파일을 바이너리로 열기
                yield image_file.read()
    else:
        raise ValueError("Unsupported input type")
        
            
# Embedding pipeline
p_embed = (
    pipe.input('src')
        .flat_map('src', 'img_path', load_image)
        .map('img_path', 'img', ops.image_decode())
        .map('img', 'vec', ops.image_embedding.timm(model_name='resnet50'))
)

# vec와 메타 데이터를 collection에 저장
p_display = p_embed.output('img_path', 'img', 'vec') # 결과로 img_path, img, vec 나옴 

from pymilvus import connections, Collection

connections.connect(host=milvus_host, port=milvus_port)
collection = Collection(name="clothes")
collection.load()

p_search_pre = (
        p_embed.map('vec', ('search_res'), ops.ann_search.milvus_client(
                    host=milvus_host, port=milvus_port, limit=5, collection_name="clothes"))
                .map('search_res', 'pred', lambda x: [(y[0]) for y in x]) # 검색된 이미지의 id값과 유사도 점수 가져오기
)

p_search = p_search_pre.output('pred')

def search_image(image):
    result = DataCollection(p_search(image))
    print(result)
    return result[0]['pred']


# 서버에 있는 rabbitmq 정보
rabbitmq_config = config["rabbit_mq"]
host = rabbitmq_config["host"]
port = rabbitmq_config["port"]
username = rabbitmq_config["username"]
password = rabbitmq_config["password"]
credentials = pika.PlainCredentials(username, password)

# rabbitmq 연결
connection = pika.BlockingConnection(
    pika.ConnectionParameters(
        host=host,
        port=port,
        credentials=credentials
    )
)

channel = connection.channel()

# 리스너
listener_config = config["listener"]
exchange_name = listener_config["exchange_name"]
queue_name = listener_config["queue_name"]       # 라우팅 키를 가지고 큐에 넣어줌
routing_key = listener_config["routing_key"]     # 백엔드랑 통일 시켜야함

# 현재는 direct (1:1), 1:1 아닌 다른 옵션 있다.
# 교환기가 큐를 설정해주는 아이. 라우팅 키를 가지고 큐 연결해준다. direct라서 하나의 큐에 연결
channel.exchange_declare(exchange=exchange_name, exchange_type='direct', durable=True) # 교환기 선언
arguments = {'x-queue-mode': 'lazy'} # 이미지 통신이므로 lazy 걸어줘야함 (파일시스템으로 저장 지정 안하면 메모리에 쌓임)

# 큐 선언
channel.queue_declare(queue=queue_name, durable=True, arguments=arguments)
# 라우팅 키 가지고 
channel.queue_bind(exchange=exchange_name, queue=queue_name, routing_key=routing_key)


def is_image(data):
    # PNG
    if data[:8] == b'\x89PNG\r\n\x1a\n':
        return True, 'PNG'
    # JPEG
    elif data[:3] == b'\xff\xd8\xff':
        return True, 'JPEG'
    # GIF
    elif data[:6] in (b'GIF87a', b'GIF89a'):
        return True, 'GIF'
    # 여기에 다른 이미지 포맷 조건을 추가할 수 있습니다.
    else:
        return False, 'Unknown'
    

def sendResponse(message):
    img_data = base64.b64decode(message['data']['image'])
    if is_image(img_data):
        img_array = np.frombuffer(img_data, dtype=np.uint8)
        # cv2.imdecode()를 사용하여 이미지 디코드
        input_image = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        output_image = remove(input_image)

        original_height, original_width = output_image.shape[:2]

        new_height = 400
        ratio = new_height / original_height
        new_width = int(original_width * ratio)

        resized_image = cv2.resize(output_image, (new_width, new_height))

        if new_width < 500:
            delta_w = 500 - new_width
            left, right = delta_w // 2, delta_w - (delta_w // 2)
            color = [0, 0, 0, 0]  # 투명한 배경을 위한 색상 코드
            resized_image = cv2.copyMakeBorder(resized_image, 0, 0, left, right, cv2.BORDER_CONSTANT, value=color)

        cv2.imwrite("!.png", resized_image)
        _, buffer = cv2.imencode('.png', resized_image)
        encoded_image = base64.b64encode(buffer).decode('utf-8')
        
        search_clothes_list = search_image(buffer.tobytes())

        # response 구조
        response = {
            "sseId": message['data']['sseId'],
            "data": {
                "image": encoded_image,
                "list": search_clothes_list
            }
        }
        
        # return 값은 publish
        # 값을 다시 반환할 때 exchange랑 routekey 필요
        # 반환은 무조건 json
        channel.basic_publish(exchange=message['exchange'], routing_key=message['routeKey'], body=json.dumps(response))
        print("Sent message to")


# 콜백
def callback(ch, method, properties, body):
    try:
        message = json.loads(body)
        sendResponse(message)
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        channel.basic_ack(delivery_tag=method.delivery_tag)


channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=False)

print('Waiting for messages. To exit press CTRL+C')
channel.start_consuming()