require('dotenv').config();

const express = require('express');
const Routes = require('./routes');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended : true }))

const router = Routes;

app.use('/', Routes);

app.listen(process.env.PORT || 8088, () => {
    console.log(`${process.env.PORT}번 포트 대기중`)
});