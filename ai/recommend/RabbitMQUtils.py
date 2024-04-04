import pika
import json

with open("recommend/config.json", encoding="utf-8") as f:
    config = json.load(f)

rabbit_mq_config = config["rabbit_mq"]


def create_connection():
    credentials = pika.PlainCredentials(
        rabbit_mq_config["username"], rabbit_mq_config["password"]
    )
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            host=rabbit_mq_config["host"],
            port=rabbit_mq_config["port"],
            credentials=credentials,
        )
    )
    return connection


def setup_channel(
    connection, exchange_name, exchange_type, queue_name, routing_key, queue_mode="lazy"
):
    channel = connection.channel()
    channel.exchange_declare(
        exchange=exchange_name, exchange_type=exchange_type, durable=True
    )
    arguments = {"x-queue-mode": queue_mode}
    channel.queue_declare(queue=queue_name, durable=True, arguments=arguments)
    channel.queue_bind(
        exchange=exchange_name, queue=queue_name, routing_key=routing_key
    )
    return channel


def publish_message(channel, exchange, routing_key, message):
    channel.basic_publish(
        exchange=exchange, routing_key=routing_key, body=json.dumps(message)
    )


def start_consuming(channel, queue_name, callback):
    channel.basic_consume(
        queue=queue_name, on_message_callback=callback, auto_ack=False
    )
    print("Waiting for messages. To exit press CTRL+C")
    channel.start_consuming()
