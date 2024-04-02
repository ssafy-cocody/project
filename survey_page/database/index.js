const mysql = require("mysql2/promise");
const milvue = require('@zilliz/milvus2-sdk-node');

const milvus_client = new milvue.MilvusClient({
    address: process.env.MILVUES_HOST
})

//array_contains_any(thickness, ['얇음', '약간|얇음'])
const create_expr = (gender, temperatures) => {

    let thick_expr = '[';
    temperatures.thick.forEach(thick => {
        thick_expr += `'${thick}',`;
    });
    thick_expr = thick_expr.slice(0, -1);
    thick_expr += ']';

    let season_expr = '[';
    temperatures.season.forEach(season => {
        season_expr += `'${season}',`;
    });
    season_expr = season_expr.slice(0, -1);
    season_expr += ']';
    
    return `(array_contains(gender, '${gender}') 
        and array_contains_any(thickness, ${thick_expr}) 
        and array_contains_any(season, ${season_expr}))
        or (array_contains(gender, '${gender}') and category == 'SHOES')`
}

const filtering_data = async (gender, temperatures) => {

    const expr = create_expr(gender, temperatures);

    const data = await milvus_client.query({
        collection_name: "clothes",
        expr: expr,
        output_fields: ['clothes_id', 'style', 'category']
    });

    return data.data;
}

const select_photo = async (ids) => {

    const connection = mysql.createConnection({
        host: process.env.MYSQL_HOST || "localhost",
        port: process.env.MYSQL_PORT || "3306",
        user: process.env.MYSQL_USER || "user",
        password: process.env.MYSQL_PWD || "1234",
        database: process.env.MYSQL_DB
    })
    
    let select_query = `
        SELECT clothes_id, image
        FROM clothes
        WHERE clothes_id in (
    `;

    ids.forEach(id => {
        select_query += `${id},`
    });
    select_query = select_query.slice(0, -1);
    select_query += ')';

    const result = (await connection).query((select_query));

    (await connection).end()

    return result;
}

const select_style = async (clothes_ids) => {

    const expr = `clothes_id in [${clothes_ids.join(', ')}]`

    const data = await milvus_client.query({
        collection_name: "clothes",
        expr: expr,
        output_fields: ['clothes_id', 'style']
    });

    return data.data;
}

const submit_feedback = async (feedback) => {

    return await milvus_client.insert({
        collection_name: "cody_log",
        fields_data: feedback
    });
}

module.exports = {filtering_data, select_photo, select_style, submit_feedback};