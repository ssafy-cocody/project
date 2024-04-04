import pandas as pd
import numpy as np
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori
from mlxtend.frequent_patterns import association_rules
import pymilvus
import json
import pickle

import RabbitMQUtils as mqUtils

# 리스너
exchange_name = "order_direct_exchange"
queue_name = "recommend_set_update_queue"
routing_key = "recommend_set_update"

# 연결
connection = mqUtils.create_connection()
channel = mqUtils.setup_channel(
    connection, exchange_name, "direct", queue_name, routing_key
)


# 콜백
def callback(ch, method, properties, body):
    update_association_rules()

    channel.basic_ack(delivery_tag=method.delivery_tag)


channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=False)

print("Waiting for messages. To exit press CTRL+C")
channel.start_consuming()


def update_association_rules():

    with open("./config.json", encoding="utf-8") as f:
        config = json.load(f)

    milvus_config = config["milvus_log"]

    pymilvus.connections.connect(host=milvus_config["uri"], port=milvus_config["port"])
    collection = pymilvus.Collection(milvus_config["collection"])

    # 차후 time travel 및 로그 삭제를 통해 로그양 조절
    data = list(map(lambda x: x["cody"], collection.query("log_id > 0", ["cody"])))

    # 조합 매트릭스
    te = TransactionEncoder()
    te_arr = te.fit_transform(data)
    df = pd.DataFrame(te_arr, columns=te.columns_)

    itemset = apriori(df, use_colnames=True, min_support=0.002)

    rules = association_rules(itemset, support_only=True, min_threshold=0.002)
    rules["consequents_len"] = rules["consequents"].apply(lambda x: len(x))
    rules = rules[rules["consequents_len"] == 1]

    rules = rules[
        (
            rules["antecedents"].apply(
                lambda x: any(map(lambda y: y.startswith("OUTER"), x))
            )
            & (
                rules["consequents"].apply(
                    lambda x: any(map(lambda y: y.startswith("ONEPIECE"), x))
                )
                | rules["consequents"].apply(
                    lambda x: any(map(lambda y: y.startswith("TOP"), x))
                )
            )
        )
        | (
            rules["antecedents"].apply(
                lambda x: any(map(lambda y: y.startswith("TOP"), x))
            )
            & rules["consequents"].apply(
                lambda x: any(map(lambda y: y.startswith("BOTTOM"), x))
            )
        )
        | (
            rules["antecedents"].apply(
                lambda x: any(map(lambda y: y.startswith("ONEPIECE"), x))
            )
            & rules["consequents"].apply(
                lambda x: any(map(lambda y: y.startswith("SHOES"), x))
            )
        )
        | (
            rules["antecedents"].apply(
                lambda x: any(map(lambda y: y.startswith("BOTTOM"), x))
            )
            & rules["consequents"].apply(
                lambda x: any(map(lambda y: y.startswith("SHOES"), x))
            )
        )
    ]

    # pickle 파일로 저장
    with open(config["path"]["association_rules"], "wb") as fw:
        pickle.dump(rules, fw)
