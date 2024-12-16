const NotificationRepository = require("../database/repository/notification-repository");
const { FormatData } = require("../utils");
const nodeMailer = require("nodemailer");
const Notification = require("../database/models/Notification");
require("dotenv").config();
class NotificationService {
  // constructor() {
  //   this.repository = new NotificationRepository();
  // }

  async sendCheckoutEmail(recipientEmail, orderId, items, amount) {
    let itemsBought = "";

    try {
      const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "sama29571@gmail.com",
          pass: process.env.APP_PASSWORD,
        },
      });
      for (let i = 0; i < items.length; i++) {
        itemsBought += `${items[i].product.name}, `;
      }

      const mail = await transporter.sendMail({
        from: '"MultiVendorApplication" <sama29571@gmail.com>',
        to: recipientEmail,
        subject: "Checkout created",
        html:  `<h3>Chale, you have created a checkout foor ${amount} dollars. Your order id is ${orderId} for the items: ${itemsBought}. If this was not done by you contact our customer support</h3>`
        
      });

      console.log("Email sent successfully:", mail.messageId);
    } catch (err) {
      console.error("Error sending email:", err);
    }
    let emailContent=`<h3>Chale, you have created a checkout foor ${amount} dollars. Your order id is ${orderId} for the items: ${itemsBought}. If this was not done by you contact our customer support</h3>`

    const notification = new Notification({
      recepient: recipientEmail,
      content:  emailContent
    });
    const newNotification = await notification.save();
    console.log("SAVED NOTIFICATION", newNotification);
  }

  async SubscribeEvents(payload) {
    payload = JSON.parse(payload);
    console.log("PAYLOAD IN NOTIFICATION SERVICE");
    console.log(payload);
    const { event, data } = payload;
    const { userEmail, order } = data;
    
    console.log('ORDER ITEMS IN NOTIF SERVICE???????',order.items)
console.log(data)
    switch (event) {
      case "SEND_CHECKOUT_CONFIRMATION_MAIL":
        this.sendCheckoutEmail(
          userEmail,
          order.orderId,
          order.items,
          order.amount
        );
        break;
    }
  }
}

module.exports = NotificationService;

