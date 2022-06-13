import express from "express";
import cors from "cors";
import yahooRoutes from "./routes/yahoo.js";
import path from "path";
import {fileURLToPath} from 'url';

const app = express();

const port = process.env.PORT || 9010;

app.use(cors());
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/',(req, res) => {
    res.send("hi");
});

app.use(yahooRoutes);

app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
})

/*

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../client/public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/public/index.html'))
  })*/