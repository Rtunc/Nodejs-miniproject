const LiciensePlate = require('../models/LiciensePlates')
const SessionParticipant = require('../models/SessionParticipants')
const User = require('../models/User')
const jwt = require("jsonwebtoken");

class SharedController {
  // Get /news
  showRegister(req, res) {
    res.render('shared\\register')
  }
  showLogin(req, res) {
    res.render('shared\\login')
  }
  Main(req, res) {
    if (req.user && req.user.payload.isAdmin == true) {
      res.render("adminpage\\AdminMain")
    }
    else {
      res.render('shared\\main')
    }

  }
  Sell(req, res) {
    res.render('shared\\dang-ban')
  }
  async bid(req, res) {
    await LiciensePlate.find({ isVerify: true, is_end:false})
      .then((data) => {
        data = data.map(data => {
          data.toJSON()
          var liciense1 = data.liciense.slice(0, 3)
          var liciense2 = data.liciense.slice(3)

          data = Object.assign({}, data, { liciense1: liciense1, liciense2: liciense2 });
          return data



        })
        res.render('shared\\dau-gia', { data: data })

      })

  }
  async bid_item(req, res) {
    //Query những session có biển số xe là ...
    let allSession = await SessionParticipant.find({ liciense: req.params.slug })
    let liciense = await LiciensePlate.findOne({ liciense: req.params.slug })
    const seller = liciense.seller
    var liciense1 = liciense.liciense.slice(0, 3)
    var liciense2 = liciense.liciense.slice(3)
    if (allSession == false) {
      res.render("shared\\session", { seller: seller, liciense: liciense.liciense, province: liciense.province, loai_bien: liciense.loai_bien, date: liciense.date, liciense1: liciense1, liciense2: liciense2, pricestart: addCommas(liciense.pricestart), price: addCommas(liciense.pricestart), topbidder: "................" })
    }
    else {
      var index_max = 0
      for (var i = 0; i < allSession.length; i++) {
        if (allSession[i].price > allSession[index_max].price) {
          index_max = i
        }
      }
      const top_session = allSession[index_max]


      res.render("shared\\session", { seller: seller, liciense: liciense.liciense, province: liciense.province, loai_bien: liciense.loai_bien, date: liciense.date, liciense1: liciense1, liciense2: liciense2, pricestart: addCommas(liciense.pricestart), price: addCommas(top_session.price), topbidder: top_session.bidder })
    }
    // truyển data vào page => xử lí render ở page

  }
  profile(req, res) {
    res.render("shared\\account")
  }
  async manage_item(req, res) {
    var Liciense = await LiciensePlate.find({ isVerify: false })
      .then(data => {
        res.render('adminpage\\ManageItem', { data: data.map(data => data.toJSON()) })
      })
  }
  async listbid(req, res) {
    const token = req.cookies.user
    var username = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).payload.username
    await SessionParticipant.find({ bidder: username })
      .then(data => {
        res.render('shared\\listbid', { data: data.map(data => data.toJSON()) })
      })

  }
  async bid_info(req, res) {
    let liciense = await LiciensePlate.findOne({ liciense: req.params.slug })
    let allSession = await SessionParticipant.find({ liciense: req.params.slug })
    var index_max = 0
    for (var i = 0; i < allSession.length; i++) {
      if (allSession[i].price > allSession[index_max].price) {
        index_max = i
      }
    }
    const top_session = allSession[index_max]
    res.send({
      'bidder': top_session.bidder,
      'price':top_session.price,
      'liciense':top_session.liciense
    })
  }
}
function addCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
}
module.exports = new SharedController();
