const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const SECRET_KEY = process.env.SECRET_KEY;

async function logIn(req, res) {
    try {
        // 이미 로그인 한 상태이면
        const { token } = req.headers;
        jwt.verify(token, SECRET_KEY);
        res.status(400).send({
            success: false,
            errorMessage: '이미 로그인 된 상태입니다.'
        });
        return;
    } catch (err) { }

    const { id, password } = req.body;
    if (!(id && password)) {
        res.status(400).send({
            success: false,
            errorMessage: '아이디나 비밀번호를 확인해주세요.'
        });
        return;
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('base64');
    const existUser = await User.findOne({ where: { id, password: hashedPassword } });

    if (!existUser) {
        res.status(400).send({
            success: false,
            errorMessage: '아이디나 비밀번호를 확인해주세요.'
        });
        return;
    }

    const token = jwt.sign(
        { id },
        SECRET_KEY,
        { expiresIn: 3600 }
    );

    res.status(201).send({
        token,
        success: true
    });
}

module.exports = { logIn };