import express from "express";
import bodyParser from "body-parser";
import ViewEngine from "./config/viewEngine";
import initWebRoute from "./route/web";
import connect from "./config/connectDB";
import connectDB from "./config/connectDB";

require('dotenv').config();

let app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

ViewEngine(app);
initWebRoute(app);

connectDB();
let port = process.env.PORT;
app.listen(port, () => {
    // callback
    console.log("Backend nodejs is running on port", +port);
})

