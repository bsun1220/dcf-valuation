import express from "express";
import {calculateMetrics} from "../scripts/financial-calc.js"

const yahooRoutes = express.Router();

const getYahoo = async(req, res, next) => {
    const time = await calculateMetrics(req.params.ticker)
    res.send(time);
    next();
}

yahooRoutes.route("/yahoo/:ticker").get(getYahoo);

export default yahooRoutes;
