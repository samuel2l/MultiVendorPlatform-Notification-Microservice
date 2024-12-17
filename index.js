const express = require("express");
const app = express();
const mongoose = require("mongoose");
const print = console.log;
const cors = require("cors");

const notificationRoutes = require("./api/notifications");
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + "/public"));

const { CreateChannel, SubscribeMessage } = require("./utils");

require("dotenv").config();
app.use(express.urlencoded({ extended: true }));

async function startApp() {
  try {
    await mongoose.connect(process.env.DB_URI);
    print("Connection sauce");

    const channel = await CreateChannel();

    

    await notificationRoutes(app, channel);
    app.listen(8004, () => {
      console.log("Notifications is Listening to Port 8004");
    });
  } catch (err) {
    console.log("Failed to start app:", err);
  }
}

startApp();
