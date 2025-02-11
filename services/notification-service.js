const NotificationRepository = require("../database/repository/notification-repository");
const { FormatData } = require("../utils");
const nodeMailer = require("nodemailer");
const Notification = require("../database/models/Notification");
require("dotenv").config();
let print = console.log;
class NotificationService {

  async sendCheckoutEmail(recipientEmail, order) {
    let orderInfo = "";
    let itemsBought = "";
    let amount = 0;

    try {
      const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: process.env.APP_PASSWORD,
        },
      });
      let len=0
      let items=[];
      for (let i = 0; i < order.length; i++) {
        orderInfo += `Your order id is ${order[i].orderId} for a total amount of \$${order[i].amount} `;

        items=order[i].items
        print("NEW ITEMSSSS",items)

        len= order[i].items.length
        amount+=order[i].amount


        for (let j = 0; j < len; j++) {
          print("IN SECOND LOOP",(order[i].items[j]).product)
          print("IN SECOND LOOP",)
          let amnt=items[j].amount
          let name=items[j].product.name
          print("GOTTEN VARAS????????",amnt,name)
          print("niot really sure of the order item", items[j]);
          itemsBought += ` ${amnt} ${name}(s)`;
        }
      }


      const mail = await transporter.sendMail({
        from: `"MultiVendorApplication" <${process.env.EMAIL_ADDRESS}>`,
        to: recipientEmail,
        subject: "Checkout created",
        html: `<h3>You have created a checkout for ${amount} dollars. ${orderInfo}. Details include: ${itemsBought}. If this was not done by you contact our customer support at <some email> or call +233 50 754 8196</h3>`,
      });

      console.log("Email sent successfully:", mail.messageId);
    } catch (err) {
      console.error("Error sending email:", err);
    }
    let emailContent = `You have created a checkout for ${amount} dollars. ${orderInfo}. Details include: ${itemsBought}. If this was not done by you contact our customer support at <some email> or call +233 50 754 8196`;

    const notification = new Notification({
      recepient: recipientEmail,
      content: emailContent,
    });
    const newNotification = await notification.save();
    console.log("SAVED NOTIFICATION", newNotification);
  }

  async sendWelcomeMail(email) {
    try {
      const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: process.env.APP_PASSWORD,
        },
      });

      const mail = await transporter.sendMail({
        from: `"MultiVendorApplication" <${process.env.EMAIL_ADDRESS}>`,
        to: email,
        subject: "Welcome ",
        html: `<h3>You have created an account on CyberMart where your shopping dreams are realised.Check out our high quality products`,
      });

      console.log("Email sent successfully:", mail.messageId);
    } catch (err) {
      console.error("Error sending email:", err);
    }
    let emailContent = `<h3>You have created an account on CyberMart where your shopping dreams are realised.Check out our high quality products`;

    const notification = new Notification({
      recepient: email,
      content: emailContent,
    });
    const newNotification = await notification.save();
    console.log("SAVED NOTIFICATION", newNotification);
  }

  async sendUpdateProductMail(userEmails, product) {
    let colors = "";
    let sizes = "";
    print("colors????", product.colors);
    // print(product.colors)
    if (product.colors) {
      for (var color of product.colors) {
        colors += `${color} `;
      }
    }
    if (product.sizes) {
      for (var size of product.sizes) {
        sizes += `${size} `;
      }
    }

    for (var email of userEmails) {
      print("CURR EMAIL???", email);
      try {
        const transporter = nodeMailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: `${process.env.EMAIL_ADDRESS}`,
            pass: process.env.APP_PASSWORD,
          },
        });

        const mail = await transporter.sendMail({
          from: `"MultiVendorApplication" <${process.env.EMAIL_ADDRESS}>`,
          to: email,
          subject: "Product Updated",
          html: `<h3> ${product.name} in your cart/wishlist has been updated. its new details are: $${product.price}. As you had it down in your wishlist or cart we have infomred you about the new status of this product and you can check in the application to verify </h3>`,
        });

        console.log("Email sent successfully:", mail.messageId);
      } catch (err) {
        console.error("Error sending email:", err);
      }
      let emailContent = `<h3> ${product.name} in your cart/wishlist has been updated. its new details are: $${product.price} with sizes ${sizes} and colors ${colors} available </h3>`;

      const notification = new Notification({
        recepient: email,
        content: emailContent,
      });
      const newNotification = await notification.save();
      console.log("SAVED NOTIFICATION", newNotification);
    }
  }

  async sendOrderChangeMail(email,status){
    let currStatus=''
    if (status==="delivered"){
      currStatus='Your order has been successfully delivered. Do shop at cyber mart again. Good day'

    }else if(status==="on the way"){
      currStatus='Your order is currently on its way.Contact +233 50 754 8196 for more details'

    }else{
      return
    }
    try {
      const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: process.env.APP_PASSWORD,
        },
      });

      const mail = await transporter.sendMail({
        from: `"MultiVendorApplication" <${process.env.EMAIL_ADDRESS}>`,
        to: email,
        subject: "Order Change ",
        html: `<h3>${currStatus}<h3>`,
      });

      console.log("Email sent successfully:", mail.messageId);
    } catch (err) {
      console.error("Error sending email:", err);
    }
    let emailContent = currStatus

    const notification = new Notification({
      recepient: email,
      content: emailContent,
    });
    const newNotification = await notification.save();
    console.log("SAVED NOTIFICATION", newNotification);

  }

  async SubscribeEvents(payload) {
    console.log("NOTIFIFIFIFIF", payload);

    payload = JSON.parse(payload);
    console.log("PAYLOAD IN NOTIFICATION SERVICE");
    console.log(payload);
    const { event, data } = payload;

    // console.log('ORDER ITEMS IN NOTIF SERVICE?',event,data)

    // print("DATA",data)
    // print("error?",data.email)
    switch (event) {
      case "SEND_WELCOME_MAIL":
        this.sendWelcomeMail(data.email);

        break;

      case "SEND_CHECKOUT_CONFIRMATION_MAIL":
        print("checkout conf data", data);
        print("checkout confirmation?>>>?????/", data.order);
        this.sendCheckoutEmail(data.userEmail, data.order);
        break;

      case "SEND_PRODUCT_UPDATE_MAIL":
        print("IN SEND UPDATE", data);

        this.sendUpdateProductMail(data.emails, data.product);
        break

        case "SEND_ORDER_STATUS_CHANGE_EMAIL":
          this.sendOrderChangeMail(data.email,data.status)
    }
  }
}
module.exports = NotificationService;
