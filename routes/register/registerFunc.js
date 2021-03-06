const Op = require('sequelize').Op;
const joi = require('joi');
const { User } = require('../../models');
const crypto = require('crypto');

const registerSchema = joi.object({
    id: joi.string().min(3).max(25).required().email({ minDomainSegments: 2 }),
    nickname: joi.string().alphanum().min(3).max(9).required(),
    profile_img_url: joi.string().required(),
    password: joi.string().min(5).max(20).required(),
    confirmPassword: joi.ref('password')
});

async function register(req, res) {
    const { id, nickname, password, profile_img_url } = req.body;

    if (registerSchema.validate(req.body).error ||
        password.includes(nickname)) {
        res.status(400).send({
            success: false,
            errorMessage: '다시 입력해주세요.'
        });
        return;
    }


    const existUser = await User.findOne({
        where: {
            [Op.or]: [
                { nickname },
                { id }
            ]
        }
    });

    if (existUser) {
        res.status(400).send({
            success: false,
            errorMessage: '닉네임 또는 아이디가 중복되는 유저가 있습니다.'
        });
        return;
    }
    const hashedPassword = crypto.createHash('sha256').update(password).digest('base64');
    // 가입 하면 됨!
    await User.create({
        id,
        nickname,
        password: hashedPassword,
        profile_img_url
    });

    res.status(200).send({
        success: true
    });
}

module.exports = { register };