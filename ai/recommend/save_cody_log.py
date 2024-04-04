import pymilvus
import json

import RabbitMQUtils as mqUtils

# 리스너
exchange_name = "order_direct_exchange"
queue_name = "record_ootd_queue"
routing_key = "record_ootd"

# 연결
connection = mqUtils.create_connection()
channel = mqUtils.setup_channel(
    connection, exchange_name, "direct", queue_name, routing_key
)


# 콜백
def callback(ch, method, properties, body):
    request = json.loads(body)
    save_cody_log(request["data"]["clothesList"])

    channel.basic_ack(delivery_tag=method.delivery_tag)


channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=False)

print("Waiting for messages. To exit press CTRL+C")
channel.start_consuming()


def make_comb(data, cnt, comb, result):

    if len(data) <= cnt:

        result.append({"cody": list(comb), "weather": [0, 0]})
        return

    for i in range(data[cnt].style.length):

        comb.append(data[cnt].style[i])
        make_comb(data, cnt + 1, comb, result)
        comb.pop()


def save_cody_log(cody):

    with open("./config.json", encoding="utf-8") as f:
        config = json.load(f)

    milvus_config = config["milvus_log"]

    pymilvus.connections.connect(host=milvus_config["uri"], port=milvus_config["port"])
    collection = pymilvus.Collection("cody_log")

    clothes = collection.query(
        "clothes_id in [{1}]".format(", ".join(map(str, cody))), ["clothes_id", "style"]
    )

    styles = []
    make_comb(clothes, 0, [], styles)
    collection.insert(styles)
