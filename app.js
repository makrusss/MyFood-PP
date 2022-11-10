const express = require('express');
const app = express();
const PORT = 3000;
const index = require('./routes/index')
const session = require('express-session')
app.use(express.urlencoded({ extended: false })); //req.body

app.set('view engine', 'ejs')

app.use(session({
    secret: 'Kamu kepo banget',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: true
    }
}))


app.use('/', index);

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});