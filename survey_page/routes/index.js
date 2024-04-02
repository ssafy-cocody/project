const Router = require('express');
const path = require('path');

const Service = require('../service');

const router = Router();

// 페이지 진입
router.get('/', (req, res) => {

    const filePath = path.join(__dirname, '..', 'views', 'survey.html');
    res.sendFile(filePath);
});

// 피드백 제출
router.post('/', async (req, res) => {
    await Service.feedback(req.body)
    res.send("okay");
});

// 옷 사진 요청
router.get('/photo', async (req, res) => {
    res.json(await Service.make());
});

module.exports = router;