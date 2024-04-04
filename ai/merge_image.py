import io

import requests
from PIL import Image
from io import BytesIO
import pika
import base64
import json
import RabbitMQUtils as mqUtils

# 리스너
exchange_name = 'order_direct_exchange'
queue_name = 'cody_image_create'
routing_key = 'cody_image_create'

# 연결
connection = mqUtils.create_connection()
channel = mqUtils.setup_channel(connection, exchange_name, 'direct', queue_name, routing_key)


# URL에서 이미지 다운로드 후 PIL 이미지 객체로 변환하고 리사이징
def load_and_resize_image(url):
    if not url:  # URL이 비어있는 경우, 투명한 이미지 생성
        return Image.new('RGBA', (400, 400), (0, 0, 0, 0))  # 완전 투명한 이미지
    else:
        response = requests.get(url)
        image = Image.open(BytesIO(response.content))
        image.thumbnail((800, 800), Image.Resampling.LANCZOS)

        # 중앙에서 400x400으로 크롭
        width, height = image.size
        left = max(0, (width - 400) / 2)
        top = max(0, (height - 400) / 2)
        right = min(width, (width + 400) / 2)
        bottom = min(height, (height + 400) / 2)

        if width > 400 or height > 400:
            image = image.crop((left, top, right, bottom))
        return image


def conv(url_top, url_outer, url_bottom, url_shoes):
    # 이미지 로드 및 리사이징
    image_top = load_and_resize_image(url_top)
    image_outer = load_and_resize_image(url_outer)
    image_bottom = load_and_resize_image(url_bottom)
    image_shoes = load_and_resize_image(url_shoes)

    # 새로운 이미지 생성 (RGBA 모드로 투명도 지원)
    final_image = Image.new('RGBA', (800, 800))

    # 이미지 붙이기
    final_image.paste(image_outer, (350, 0))  # 우상단
    final_image.paste(image_bottom, (0, 350))  # 좌하단

    if url_bottom == "":
        final_image.paste(image_top, (0, 200))  # 좌상단
    else:
        final_image.paste(image_top, (0, 0))

    if url_outer == "":
        final_image.paste(image_shoes, (350, 200))  # 우하단
    else:
        final_image.paste(image_shoes, (350, 350))  # 우하단

    img_byte_arr = io.BytesIO()
    final_image.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()
    encoded_image = base64.b64encode(img_byte_arr).decode('utf-8')
    return encoded_image


def callback(ch, method, properties, body):
    message = json.loads(body)

    codies = message['data']['data']['codies']
    images = []
    codieIdList = []
    for codie in codies:
        url_top = codie['top']
        url_bottom = codie['bottom']
        url_outer = codie['outer']
        url_shoes = codie['shoes']
        encoded_image = conv(url_top, url_bottom, url_outer, url_shoes)
        images.append(encoded_image)
        codieIdList.append(codie['codyId'])


    response = {
        "sseId": message['data']['sseId'],
        "data": {
            "img": images,
            "codyId": codieIdList
        }
    }

    channel.basic_publish(exchange=message['exchange'], routing_key=message['routeKey'], body=json.dumps(response))
    print("Sent message to")
    channel.basic_ack(delivery_tag=method.delivery_tag)


channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=False)
print('Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
