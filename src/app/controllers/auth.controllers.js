const User = require("../models/User");
const bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const { ConnectionStates } = require("mongoose");
const promisify = require("util").promisify;
const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);
const randToken = require("rand-token");

generateToken = async (payload, secretSignature, tokenLife) => {
  try {
    return await sign(
      {
        payload,
      },
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      }
    );
  } catch (error) {
    console.log(`Error in generate access token:  + ${error}`);
    return null;
  }
};

class AuthController {
  // Get /news

  async register(req, res) {
    const user = await User.findOne({ username: req.body.username });

    if (user) res.status(409).send("Tên tài khoản đã tồn tại.");
    else {
      const hashPassword = bcrypt.hashSync(req.body.password, salt);
      User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        refreshToken: "",
      });
      res.send(req.body);
    }
  }
  async login(req, res) {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;

    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).send("Tên đăng nhập không tồn tại.");

    }
    
    const isPasswordValid =  bcrypt.compare(user.password, password);
    console.log(password,user.password )
    console.log(isPasswordValid)
    if (!isPasswordValid) {
      return res.status(401).send("Mật khẩu không đúng");
    }
    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const dataForAccessToken = {
      username: user.username,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller
    };

    const accessToken = await generateToken(
      dataForAccessToken,
      accessTokenSecret,
      accessTokenLife
    );
    if (!accessToken) {
      return res.send(accessTokenSecret);
    }

    
    const cookieOptions = {
      httpOnly: true,
    };
    
    res.cookie("user", accessToken, cookieOptions);
    return res.status(200).redirect("/main");
  }

  isLoggedIn = async (req, res, next) => {
    const token = req.cookies.user
    try {
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      req.user = user;
      next();
    }
    catch(err){
      console.log(err)
      return next();
    }
  };

  logout = (req, res) => {
    res.cookie('user', 'logout', {
        httpOnly: true
    });
    res.status(200).redirect("/login");
    
}
}

module.exports = new AuthController();
