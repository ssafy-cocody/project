import pymilvus
import json
import pickle
from collections import defaultdict
import random

import RabbitMQUtils as mqUtils


class Clothes:

    def __init__(self, id, style, category):
        self.id = id
        self.style = style
        self.category = category

    def get_id(self):
        return self.id

    def get_style(self):
        return self.style

    def get_category(self):
        return self.category


def set_preset(expr):

    styles = defaultdict(list)
    categories = defaultdict(list)
    clothes_data = collection.query(
        expr=expr, output_fields=["clothes_id", "style", "category"]
    )

    for clothes in clothes_data:

        for style in clothes["style"]:

            data = Clothes(clothes["clothes_id"], clothes["style"], clothes["category"])
            styles[style].append(data)
            categories[clothes["category"]].append(data)

    return [styles, categories]


def set_antecedents(cody, antecedents, cnt, result):

    if len(cody) <= cnt:
        result.append(set(antecedents))
        return

    for style in cody[cnt].get_style():
        antecedents.add(style)
        set_antecedents(cody, antecedents, cnt + 1, result)
        antecedents.remove(style)


def make_set(styles, item):

    stack = [item]

    while stack:

        curr = stack.pop()

        # 다음 아이템 탐색
        antecedents = []
        set_antecedents(curr, set(), 0, antecedents)

        # 선택한 아이템들의 조합으로 다음 아이템 특징 선택
        while antecedents:

            a = antecedents.pop()

            next_features = rules[rules["antecedents"] == a]["consequents"]
            for feature_set in next_features:

                feature = next(iter(feature_set))
                for clothes in styles[feature]:

                    # 데이터가 신발을 골랐다면 마무리
                    if clothes.get_category() == "SHOES":

                        return curr + (clothes,)

                    # 다음 유망한 조합을 포함함
                    stack.append(curr + (clothes,))


def find_recommend(styles, categories, count, is_warm):

    result = []
    stack = []

    # 카테고리 선택 순서에 해당하는 의류 검색
    # 검색 순서는 랜덤

    # 아우터를 입는 경우
    for outer in categories["OUTER"]:

        stack.append((outer,))

    # 아우터를 입지 않는 경우
    if is_warm:
        # 원피스를 입는 경우
        for onepiece in categories["ONEPIECE"]:

            stack.append((onepiece,))

        # 상의를 입는 경우
        for top in categories["TOP"]:

            stack.append((top,))

    # 한 가지 경우에 몰리는 것을 방지
    random.shuffle(stack)
    while stack:

        curr = stack.pop()

        comb = make_set(styles, curr)
        if not comb:
            continue

        result.append(comb)
        if len(result) >= count:
            return result

    # 갯수가 부족하다면 랜덤 매핑
    while len(result) < count:

        tmp = ()

        for category, items in categories.items():

            if category == "ONEPIECE":
                continue

            if not items:
                return result

            tmp + (random.choice(items),)

        # if categories["OUTER"]:
        #     tmp = tmp + (random.choice(categories["OUTER"]),)

        # if categories["TOP"]:
        #     tmp = tmp + (random.choice(categories["TOP"]),)
        #     if categories["BOTTOM"]:
        #         tmp = tmp + (random.choice(categories["BOTTOM"]),)

        # elif categories["ONEPIECE"]:
        #     tmp = tmp + (random.choice(categories["ONEPIECE"]),)

        # if categories["SHOES"]:
        #     tmp = tmp + (random.choice(categories["SHOES"]),)

        result.append(tmp)

    return result


def get_weather_feature(temperature):

    feature = config["weather"][-1]
    for i in range(len(config["temperature"])):

        if config["temperature"][i] <= temperature:

            feature = config["weather"][i]
            break

    return feature


def find_closet_recommend(closet, temperature, count=6):

    if not closet:
        return []

    feature = get_weather_feature(temperature)

    expr = (
        f"clothes_id in [{','.join(map(str, closet))}] "
        f"and ("
        f"(array_contains_any(thickness, {feature['thick']}) "
        f"and array_contains_any(season, {feature['season']})) "
        f"or (array_contains_any(season, {feature['season']}) and category == 'SHOES')"
        ")"
    )

    # 데이터 전처리
    styles = set_preset(expr)

    result = find_recommend(
        styles[0],
        styles[1],
        count,
        "봄" in feature["season"] or "여름" in feature["season"],
    )

    if not result:

        expr = f"clothes_id in [{','.join(map(str, closet))}] "

        styles = set_preset(expr)

        result = find_recommend(
            styles[0],
            styles[1],
            1,
            "봄" in feature["season"] or "여름" in feature["season"],
        )

    return [
        {item.get_category().lower(): item.get_id() for item in cody} for cody in result
    ]


def find_shop_recommend(closet, temperature, gender):

    if not closet:
        return {"cody": {}, "recommend": []}

    feature = get_weather_feature(temperature)

    closet_expr = (
        f"clothes_id in [{','.join(map(str, closet))}] "
        f"and ("
        f"(array_contains_any(thickness, {feature['thick']}) "
        f"and array_contains_any(season, {feature['season']})) "
        f"or (array_contains_any(season, {feature['season']}) and category == 'SHOES')"
        ")"
    )

    # 데이터 전처리
    styles = set_preset(closet_expr)

    cody = find_recommend(
        styles[0],
        styles[1],
        1,
        "봄" in feature["season"] or "여름" in feature["season"],
    )

    if not cody:

        expr = f"clothes_id in [{','.join(map(str, closet))}] "

        styles = set_preset(expr)

        cody = find_recommend(
            styles[0],
            styles[1],
            1,
            "봄" in feature["season"] or "여름" in feature["season"],
        )

    empty_category = ""
    new_cody = tuple()
    for clothes in cody:

        for item in clothes:

            if item.get_category() == "TOP" or item.get_category() == "ONEPIECE":
                empty_category = item.get_category()
                continue

            new_cody = new_cody + (item,)

    if empty_category == "":
        result = {item.get_category().lower(): item.get_id() for item in cody}
        return {"cody": {}, "recommend": []}

    antecedents = []
    set_antecedents(new_cody, set(), 0, antecedents)

    expr = (
        f"array_contains_any(thickness, {feature['thick']}) "
        f"and array_contains_any(season, {feature['season']}) "
        f"and array_contains(gender, '{gender}') "
        f"and category == '{empty_category}' "
    )

    style_condition = ("','").join(map(lambda x: next(iter(x)), antecedents))
    style_expr = f"and array_contains_any(style, ['{style_condition}'])"

    # 조건에 부합하는 의류 검색
    recommend_clothes = collection.query(
        expr=expr + style_expr,
        output_fields=["clothes_id"],
    )

    # 조건에 부합하는 의류가 없는 경우 랜덤 추천
    if not recommend_clothes:

        data = collection.query(expr=expr, output_fields=["clothes_id"])
        if not data:
            result = {item.get_category().lower(): item.get_id() for item in cody}
            return {"cody": result, "recommend": result[empty_category.lower()]}

        recommend_clothes = [random.choice(data)]

    recommend_result = {item.get_category().lower(): item.get_id() for item in new_cody}
    if recommend_clothes:
        recommend_result[empty_category.lower()] = recommend_clothes[0]["clothes_id"]

    return {"cody": recommend_result, "recommend": recommend_clothes[0]["clothes_id"]}


with open("./config.json", encoding="utf-8") as f:
    config = json.load(f)

milvus_config = config["milvus"]

pymilvus.connections.connect(host=milvus_config["uri"], port=milvus_config["port"])
collection = pymilvus.Collection(milvus_config["collection"])

# 기존에 저장한 연관 룰 로드
with open(config["path"]["association_rules"], "rb") as fr:
    rules = pickle.load(fr)

# 리스너
shop_recommend_config = {
    "exchange_name": "order_direct_exchange",
    "queue_name": "recommend_item_queue",
    "routing_key": "recommend_item",
}

closet_recommend_config = {
    "exchange_name": "order_direct_exchange",
    "queue_name": "closet_cody_recommend_queue",
    "routing_key": "closet_cody_recommend",
}

# 연결
connection = mqUtils.create_connection()

# 상점 추천 채널
shop_recommend_channel = mqUtils.setup_channel(
    connection,
    shop_recommend_config["exchange_name"],
    "direct",
    shop_recommend_config["queue_name"],
    shop_recommend_config["routing_key"],
)

# 옷장 추천 채널
closet_recommend_channel = mqUtils.setup_channel(
    connection,
    closet_recommend_config["exchange_name"],
    "direct",
    closet_recommend_config["queue_name"],
    closet_recommend_config["routing_key"],
)


# 콜백
def closet_recommend_callback(ch, method, properties, body):
    message = json.loads(body)
    closet_recommend_call(message)
    closet_recommend_channel.basic_ack(delivery_tag=method.delivery_tag)


def closet_recommend_call(message):

    body = message["data"]
    sse_id = body["sseId"]
    data = body["data"]

    result = find_closet_recommend(data["closet"], data["temperature"], data["count"])
    closet_recommend_channel.basic_publish(
        exchange=message["exchange"],
        routing_key=message["routeKey"],
        body=json.dumps({"sseId": sse_id, "data": {"codies": result}}),
    )

    print(result)


def shop_recommend_callback(ch, method, properties, body):
    message = json.loads(body)
    shop_recommend_call(message)
    shop_recommend_channel.basic_ack(delivery_tag=method.delivery_tag)


def shop_recommend_call(message):

    body = message["data"]
    sse_id = body["sseId"]
    data = body["data"]

    result = find_shop_recommend(data["closet"], data["temperature"], data["gender"])
    shop_recommend_channel.basic_publish(
        exchange=message["exchange"],
        routing_key=message["routeKey"],
        body=json.dumps({"sseId": sse_id, "data": {"codies": result}}),
    )

    print(result)


shop_recommend_channel.basic_consume(
    queue=shop_recommend_config["queue_name"],
    on_message_callback=shop_recommend_callback,
    auto_ack=False,
)


closet_recommend_channel.basic_consume(
    queue=closet_recommend_config["queue_name"],
    on_message_callback=closet_recommend_callback,
    auto_ack=False,
)

print("Waiting for messages. To exit press CTRL+C")

shop_recommend_channel.start_consuming()
closet_recommend_channel.start_consuming()
