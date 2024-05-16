const sharedController = require('../app/controllers/SharedController')
const authControllers = require('../app/controllers/auth.controllers')
const AuthController = require('../app/controllers/auth.controllers')
const ItemController = require('../app/controllers/item.controller')


function route(app) {
   
    app.get('/register', sharedController.showRegister )
    app.get('/login', sharedController.showLogin )
    
    app.post('/login', AuthController.login )
    // AuthController.isLoggedIn
    // sharedController.Main
    app.get("/main",AuthController.isLoggedIn,sharedController.Main )
    app.get("/dang-ban",AuthController.isLoggedIn,sharedController.Sell )
    app.get("/dau-gia",AuthController.isLoggedIn,sharedController.bid )
    app.get("/dau-gia/:slug",AuthController.isLoggedIn, sharedController.bid_item)

    app.get("/logout", AuthController.isLoggedIn, authControllers.logout)
    app.post('/registeduser', AuthController.register )
    app.post('/sell', ItemController.sell )
    app.get("/account", AuthController.isLoggedIn,sharedController.profile )
    
    //thực hiện đấu giá
    app.post('/addsession', AuthController.isLoggedIn, ItemController.addSession)
    app.get("/manage-item", AuthController.isLoggedIn,sharedController.manage_item )
    app.post('/accept-liciense', AuthController.isLoggedIn, ItemController.acceptLiciense)
    app.post('/reject-liciense', AuthController.isLoggedIn, ItemController.rejectLiciense)
    app.get('/list-bid', AuthController.isLoggedIn, sharedController.listbid)

    app.get('/bid-info/:slug', AuthController.isLoggedIn, sharedController.bid_info)

}

module.exports = route;