const { User } = require('../models/index');
const jwt = require('jsonwebtoken');
const router = require('express')();

router.get('/', async (req, res) => {
    const { token } = req.headers;
    try {
        const { id } = jwt.verify(token, 'secret');
    } catch (err) {
        res.send({
            success: false,
            errorMessage: '로그인 후 이용해주세요'
        });
        return;
    }

    const user = await User.findOne({
        where: { id },
        attributes: [nickname, profile_img_url]
    });
    res.send({
        success: true,
        id,
        nickname: user.nickname,
        profile_img_url: user.profile_img_url
    });
});

module.exports = router;
