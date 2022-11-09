const express = require('express');
const app = express();
const PORT = 3000;
const index = require('./routes/index')
 
app.use(express.urlencoded({extended:false})); //req.body

app.set('view engine', 'ejs')
   
app.use('/', index );
 
app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});