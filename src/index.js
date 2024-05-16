const express = require("express")
const app = express()
const port = 3000
const morgan = require('morgan')
const handlebars = require('express-handlebars')
const path = require('path')
const dotenv = require("dotenv").config();
var cookieParser = require('cookie-parser')

const route = require('./routes')
const db = require("./config/db")


const fs = require('fs');
//Htpp logger
app.use(morgan('combined'));

//connect db
db.connect();

//template engine
app.use(cookieParser())
app.use(express.static(path.join(__dirname,'public')))
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'resources/views'))

app.use(express.urlencoded({ extended: true })) 
app.use(express.json());
//Route init
route(app);



app.listen(port, ()=>console.log(`Example app listening at localhost:${port}`))
