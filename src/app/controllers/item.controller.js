const LiciensePlate = require("../models/LiciensePlates");
const jwt = require("jsonwebtoken");
const SessionParticipant = require("../models/SessionParticipants");
const schedule = require('node-schedule');
const cron = require('node-cron');
const { parse } = require("dotenv");


class ItemController {
  // Get /news
  async sell(req, res) {
    const liciense = await LiciensePlate.findOne({ liciense: req.body.liciense });
    const token = req.cookies.user
    var username = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).payload.username
    if (liciense) res.status(409).send("Biển số xe đã được đăng bán.");

    else {
      LiciensePlate.create({
        seller: username,
        liciense: req.body.liciense,
        pricestart: req.body.pricestart,
        province: req.body.province,
        loai_bien: req.body.loai_bien,
        date: req.body.date
      });
      var date_cheduleded = req.body.date
      let month = date_cheduleded.slice(0, 2);  // Lấy 2 ký tự đầu tiên
      let day = parseInt(date_cheduleded.slice(3, 5))-1;  // Lấy 2 ký tự từ vị trí thứ 3 đến 5
      let year = date_cheduleded.slice(6);     // Lấy tất cả ký tự từ vị trí thứ 6 đến hết chuỗi
      
      
      cron.schedule(`0 0 0 ${day} ${month} *`, async function() {
        console.log(`Running a job at 00:00 on ${day} ${month}`);
        await LiciensePlate.findOneAndUpdate({ liciense: req.body.liciense }, { is_end: true })
      }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh"
      });
      
      return res.status(200).redirect("/dang-ban");
    }
  }
  addSession(req, res) {
    const token = req.cookies.user
    var username = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).payload.username
    SessionParticipant.create({
      bidder: username,
      liciense: req.body.liciense,
      price: req.body.price_bid,
      time_bid: Date.now(),
    });


  }
  async acceptLiciense(req, res) {
    console.log(req.body)
    await LiciensePlate.findOneAndUpdate({ liciense: req.body.liciense }, { isVerify: true })
  }
  async rejectLiciense(req, res) {
    await LiciensePlate.deleteOne({ liciense: req.body.liciense });
  }


}

module.exports = new ItemController();


//   async register(req, res) {
//     const user = await User.findOne({ username: req.body.username });

//     if (user) res.status(409).send("Tên tài khoản đã tồn tại.");
//     else {
//       const hashPassword = bcrypt.hashSync(req.body.password, salt);
//       User.create({
//         username: req.body.username,
//         email: req.body.email,
//         password: req.body.password,
//         refreshToken: "",
//       });
//       res.send(req.body);
//     }
//   }