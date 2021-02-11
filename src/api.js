const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const google = require('googleapis');

const app = express();

const router = express.Router();

const CLIENT_ID = '584201658311-felvvb1nnlnlikee9mvcr2ncghjcf244.apps.googleusercontent.com';
const CLEINT_SECRET = '5UNmNsjDQXIh3I7XKRhrPUmt';
const REDIRECT_URI ='https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//040KzGD_YO7oRCgYIARAAGAQSNwF-L9IrSM0UtkO1GuR8st8glVsjQmHhAO_mt2hi05F3h1ji3XBD79Z4nrI2oqsoQbhy1TQkHVA';
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
  );

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
let accessToken = oAuth2Client.getAccessToken();

//body parser middleware
app.use(
  bodyParser.raw({
    type: "image/png",
    limit: "10mb",
  })
);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/' ,(req,res)=>{
    res.json({
        'hello':"hi!"
    });
});

//sends to admin
router.post("/send" ,(req, res) => {
  console.log(req.body)
  const output = `<p>you have a new post</p>
  <ul>
    <li>product:             ${req.body.productname}</li>
    <li>description:         ${req.body.productdescription}</li>
    <li>features:            ${req.body.productfeatures}</li>
    <li>short description:   ${req.body.productshortdescription}</li>
    <li>color:               ${req.body.color}</li>
    <li>size:                ${req.body.size}</li>
    <li>brand:               ${req.body.brand}</li>
    <li>sell price:          ${req.body.sellprice}</li>
    <li>sell quantity:       ${req.body.sellquantity}</li>
    <li>regular price        ${req.body.regularprice}</li>
    <li>category             ${req.body.category}</li>

    
    <li>productdescription:       <img src=${req.body.productdescriptionimageURL} /></li>
    <li>productfeatures:          <img src=${req.body.productfeaturesimageURL} /></li>
    <li>productfeatures:          <img src=${req.body.productshortdescimageURL} /></li>
    <li>product main:             <img src=${req.body.productimageURL} /></li>
    <li>gallery:                  <img src=${req.body.galleryimageURL} /></li>

  </ul>`;

  let transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
      type: 'OAuth2',
      user:"thakurisinghprashant@gmail.com",
      clientId: CLIENT_ID,
      clientSecret: CLEINT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken 
    }
  })
  
  let mailOptions = {
    from: "thakurisinghprashant@gmail.com", // sender address
    to: "leolion565185@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "u have a product", // plain text body
    html: output, // html body
  };

  // send mail with defined transport object
  transport.sendMail(mailOptions, 
    // attachments,
    (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("message sent :%s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
  
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);