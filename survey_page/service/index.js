const Database = require('../database');

const category = [
    28, 23, 20, 17, 12, 9
]

const weather = [
    {
        "thick": ["얇음"],
        "season": ["여름"]
    },
    {
        "thick": ["얇음", "약간|얇음"],
        "season": ["여름"]
    },
    {
        "thick": ["약간|얇음", "보통"],
        "season": ["봄", "여름"]
    },
    {
        "thick": ["약간|얇음", "보통", "약간|두꺼움"],
        "season": ["봄"]
    },
    {
        "thick": ["보통", "약간|두꺼움"],
        "season": ["봄", "가을"]
    },
    {
        "thick": ["약간|두꺼움", "두꺼움"],
        "season": ["가을", "겨울"]
    },
    {
        "thick": ["두꺼움"],
        "season": ["겨울"]
    },
];

const select_images = async (gender, temperatures) => {

    // 성별, 기온 레벨 조건 걸고 랜덤 탐색
    const gender_str = gender == 1 ? "남성" : "여성";
    let feature = weather[weather.length - 1];

    for(let i = 0; i < category.length; i++) {
        
        if (category[i] <= temperatures) {

            feature = weather[i];
            break;
        }
    };

    data = await Database.filtering_data(gender_str, feature);

    // data 셋 구성

    const result = [];

    if (gender_str === '여성' && Math.random() >= 0.5) {

        // 원피스 입고 하의가 없는 경우
        onepiece_data = data.filter((item) => item['category'] === 'ONEPIECE');
        result.push(onepiece_data[Math.floor(Math.random() * onepiece_data.length)]['clothes_id']);
    }

    else {
        // 상하의로 입는 경우
        top_data = data.filter((item) => item['category'] === 'TOP');
        bottom_data = data.filter((item) => item['category'] === 'BOTTOM');

        result.push(top_data[Math.floor(Math.random() * top_data.length)]['clothes_id']);
        result.push(bottom_data[Math.floor(Math.random() * bottom_data.length)]['clothes_id']);
    }

    shoes_data = data.filter((item) => item['category'] === 'SHOES');
    result.push(shoes_data[Math.floor(Math.random() * shoes_data.length)]['clothes_id']);

    // 아우터는 입지 않는 경우 존재

    // 봄에는 랜덤으로 입지 않음
    // 여름은 아우터가 없음
    if (!(feature.season.includes('봄') && Math.random() >= 0.5)) {

        outer_data = data.filter((item) => item['category'] === 'OUTER');
        if (outer_data.length > 0) {

            result.push(outer_data[Math.floor(Math.random() * outer_data.length)]['clothes_id']);
        }
    }

    const res = await Database.select_photo(result);
    return res[0];
};

const make = () => {

    const gender = Math.floor(Math.random() * 2) + 1;
    const temperatures = Math.floor(Math.random() * 18) + 12;

    return select_images(gender, temperatures);
};

const make_comb = (data, cnt, comb, result) => {

    if (data.length <= cnt) {

        result.push({
            "cody" : [ ...comb ],
            "weather" : [0, 0]
        })
        return ;
    }

    for (let i = 0; i < data[cnt].style.length; i++) {

        comb.push(data[cnt].style[i])
        make_comb(data, cnt + 1, comb, result);
        comb.pop();
    }
}

const feedback = async (clothes_ids) => {

    const styles = [];
    const data = await Database.select_style(clothes_ids);

    make_comb(data, 0, [], styles);
    return await Database.submit_feedback(styles);
}

module.exports = { make, feedback };