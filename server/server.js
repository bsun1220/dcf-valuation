const express = require("express");

const app = express();

const port = 2001;


app.listen(port, ()=>{
    console.log(`server is listening on port ${port}`);
})

app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })