const express = require("express");
const auth = require("../middleware/auth");
const User = require("../model/User");
const mailSender = require("../module/mailer");
const router = express.Router();

const generateAuthCode = () => {
  return Math.floor(Math.random() * 10 ** 8)
    .toString()
    .padStart("0", 8);
};

router.post("/register", (req, res) => {
  ///무작위 AUTH CODE 생성.
  /// 정보를 데이터 베이스에 추가한 뒤,
  /// AUTHCODE도 데이터베이스에 추가해준다.
  /// 해당 authcode는 실제 이메일에 발송해주어야 한다.

  const authCode = generateAuthCode();
  req.body.authCode = authCode;

  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.send({ success: false, err });
    // 이메일로 인증코드를 발송한다.
    mailSender.sendGmail({
      toEmail: userInfo.email,
      subject: "인증코드를 수신했습니다. 확인해주세요.",
      text: `인증번호 : ${authCode}`,
    });

    return res.send({ success: true, email: userInfo.email });
  });
});

router.post("/login", (req, res) => {
  ///이메일이 데이터베이스에 존재하는지 확인
  ///존재한다면 비밀번호가 매칭이 되는지 확인,
  ///매칭이 된다면, 인증토큰을 생성해서 브라우저에 전달.

  const { email, password } = req.body;

  User.findOne({
    email,
  }).exec((err, userInfo) => {
    if (err) return res.send({ success: false, err });
    if (!userInfo)
      return res.send({
        success: false,
        msg: "유효하지 않은 사용자 입니다.",
      });

    userInfo.comparePassword(password, (err, isMatch) => {
      if (err) return res.send({ success: false, err });
      if (!isMatch)
        return res.send({
          success: false,
          msg: "유효하지 않은 비밀번호 입니다.",
        });

      userInfo.generateToken((err, userInfo) => {
        if (err) return res.send({ success: false, err });

        res.cookie("x_auth", userInfo.token, {
          sameSite: "none",
          secure: true,
          httpOnly: true,
        });

        return res.send({ success: true });
      });
    });
  });
});

router.get("/auth", auth, (req, res) => {
  const { user } = req;
  res.send({
    _id: user._id,
    username: user.username,
    email: user.email,
    gender: user.gender,
    age: user.age,
    isAuth: true,
    image: user.image,
    imageUpdated: user.imageUpdated,
    emailCertificated: user.emailCertificated,
    passwordReset: user.passwordReset,
  });
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    {
      token: "",
    }
  ).exec((err, userInfo) => {
    if (err) return res.send({ success: false, err });
    return res.send({ success: true });
  });
});

router.post("/email/certificate", (req, res) => {
  const { email, authCode } = req.body;

  User.findOne({
    email,
  }).exec((err, userInfo) => {
    if (err) return res.send({ success: false, err });
    if (!userInfo)
      return res.send({ success: false, msg: "유효하지 않은 사용자입니다." });

    if (authCode == userInfo.authCode) {
      User.findOneAndUpdate(
        {
          email: userInfo.email,
        },
        {
          emailCertificated: true,
        }
      ).exec((err, info) => {
        if (err) return res.send({ success: false, err });
        return res.send({ success: true });
      });
    } else {
      return res.send({ success: false, err });
    }
  });
});

router.post("/tmp/password", (req, res) => {
  //tmppassword를 발급받을수 있는 페이지를
  //이메일로 전송해주는 역할.

  const { email } = req.body;
  User.findOne({
    email,
  }).exec((err, userInfo) => {
    if (err) return res.send({ success: false, err });
    if (!userInfo)
      return res.send({ success: false, msg: "유효하지 않은 사용자입니다." });

    const newPwPage =
      process.env.NODE_ENV === "production"
        ? `https://react-bbs-client.vercel.app/tmp/password/${userInfo._id}`
        : `http://localhost:3000/tmp/password/${userInfo._id}`;

    mailSender.sendGmail({
      toEmail: email,
      subject: "비밀번호 초기화를 요청하였습니다. 확인해주세요",
      html: `<a href="${newPwPage}">임시비밀번호 받기</a>`,
    });

    return res.send({
      success: true,
    });
  });
});

router.post("/set/tmpPassword", (req, res) => {
  const { id, password } = req.body;
  User.findOne({
    _id: id,
  }).exec((err, userInfo) => {
    if (err) return res.send({ success: false, err });
    if (!userInfo)
      return res.send({ success: false, msg: "유효하지 않은 사용자입니다." });

    User.generateEncryptedPassword(password, (err, encrypedPw) => {
      if (err) return res.send({ success: false, err });

      User.findOneAndUpdate(
        {
          _id: id,
        },
        {
          passwordReset: true,
          password: encrypedPw,
        }
      ).exec((err, user) => {
        if (err) return res.send({ success: false, err });
        if (!user)
          return res.send({
            success: false,
            msg: "유효하지 않은 사용자입니다.",
          });

        //임시비밀번호로 수정 성공.
        return res.send({ success: true });
      });
    });
  });
});

router.post("/update/password", auth, (req, res) => {
  const { password } = req.body;
  User.findOne({
    _id: req.user._id,
  }).exec((err, userInfo) => {
    if (err) return res.send({ success: false, err });
    if (!userInfo)
      return res.send({ success: false, msg: "유효하지 않은 사용자입니다." });

    User.generateEncryptedPassword(password, (err, encrypedPw) => {
      if (err) return res.send({ success: false, err });

      User.findOneAndUpdate(
        {
          _id: req.user._id,
        },
        {
          passwordReset: false,
          password: encrypedPw,
        }
      ).exec((err, user) => {
        if (err) return res.send({ success: false, err });
        if (!user)
          return res.send({
            success: false,
            msg: "유효하지 않은 사용자입니다.",
          });

        //새로운 비밀번호로 수정 성공.
        return res.send({ success: true });
      });
    });
  });
});

router.post("/profile/update", auth, (req, res) => {
  const data = {};
  for (let key in req.body) {
    if (key == "image") {
      if (req.body.image !== "") {
        data[key] = req.body[key];
      }
    } else {
      data[key] = req.body[key];
    }
  }

  User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    data
  ).exec((err, userInfo) => {
    if (err) return res.send({ success: false, err });
    return res.send({ success: true });
  });
});
module.exports = router;
