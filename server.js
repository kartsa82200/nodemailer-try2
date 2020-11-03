

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
//const path = require('path');
//let nodemailer = require('nodemailer');
//const router = express.Router();
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const app = express();

const smtpTransport = require('nodemailer-smtp-transport');


const PORT = process.env.PORT || 8080;


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors({ origin: "*" }));

app.use("client/public", express.static(process.cwd() + "client/public")); //make public static
// Static folder
//app.use('/public', express.static(path.join(__dirname, 'public')));


console.log(process.env.REACT_APP_CLIENT_ID);


console.log(process.env.REACT_APP_CLIENT_EMAIL);

Client_Id = process.env.REACT_APP_CLIENT_ID;

Client_Secret = process.env.REACT_APP_CLIENT_SECRET;

Refresh_Token = process.env.REACT_APP_REFRESH_TOKEN;

Client_Email = process.env.REACT_APP_CLIENT_EMAIL;

const oauth2Client = new OAuth2(
     Client_Id, // ClientID
     Client_Secret, // Client Secret
     "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
     refresh_token: Refresh_Token
   });


const accessToken = oauth2Client.getAccessToken();


app.use(express.json());


const transporter = nodemailer.createTransport({


  //service: 'smtp.gmail.com',

  service:'gmail',
  port: 8080,

    auth: {
    type: "OAuth2", // default
    user: Client_Email,
    clientId: Client_Id,
    clientSecret:  Client_Secret,
  //  redirectUrl: "https://developers.google.com/oauthplayground",


    refreshToken: Refresh_Token,
    accessToken:  accessToken
  }
});


// verifying the connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages!");
  }
});


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

tls: {
  rejectUnauthorized: false
}


app.post('/access', (req, res, next) => {
  var email = req.body.email
  var message = req.body.message
  var content = `email: ${email} \n message: ${message} `

  var mail = {
    //from: name,

    to: Client_Email,
    subject: 'Thanks for your message tv Kari',
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: 'fail'
      })
    } else {
      res.json({
       status: 'successfulll kari'
      })
    }
  })
})

//Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/client/public/index.html");
});


//const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.info(`server has started on ${PORT}`))
