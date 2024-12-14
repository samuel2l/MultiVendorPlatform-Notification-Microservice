const NotificationRepository = require("../database/repository/notification-repository");
const { FormatData } = require("../utils");
const nodeMailer = require("nodemailer");
const Notification = require("../database/models/Notification");
require("dotenv").config();
class ShoppingService {
  // constructor() {
  //   this.repository = new NotificationRepository();
  // }

  async sendCheckoutEmail(recipientEmail, orderId, items, amount) {
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
      let itemsBought = "";
      for (let i = 0; i < items.length; i++) {
        itemsBought += `${i.product.name}, `;
      }
      let emailContent = `<h3>Chale, you have created a checkout foor ${amount} dollars. Your order id is ${orderId} for the items: ${itemsBought}. If this was not done by you contact our customer support</h3>`;

      const mail = await transporter.sendMail({
        from: '"MultiVendorApplication" <sama29571@gmail.com>',
        to: recipientEmail,
        subject: "Checkout created",
        html: emailContent,
      });

      console.log("Email sent successfully:", mail.messageId);
    } catch (err) {
      console.error("Error sending email:", err);
    }

    const notification = new Notification({
      recepient: recipientEmail,
      content: emailContent,
    });
    notification = await notification.save();
    console.log("SAVED NOTIFICATION", notification);
  }

  async SubscribeEvents(payload) {
    payload = JSON.parse(payload);
    console.log("PAYLOAD IN NOTIFICATION SERVICE");
    console.log(payload);
    const { event, data } = payload;
    const { userEmail, order } = data;

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

module.exports = ShoppingService;

// async function sendEmail(recipientEmail) {
//   try {
//     const transporter = nodeMailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 465,
//       secure: true,
//       auth: {
//         user: 'sama29571@gmail.com',
//         pass: 'cecx fxrb ulle kzax',  // App-specific password for the sender's email
//       },
//     });

//     const mail = await transporter.sendMail({
//       from: '"Your App" <sama29571@gmail.com>', // Sender details
//       to: recipientEmail,                      // Dynamic recipient email
//       subject: 'Checkout created',            // Subject of the email
//       html: '<h3>Chale, you have created a checkout</h3>', // Email body in HTML
//     });

//     console.log('Email sent successfully:', mail.messageId);
//   } catch (err) {
//     console.log('Error sending email:', err);
//   }
// }

// sendEmail('adamssamuel9955@gmail.com')
