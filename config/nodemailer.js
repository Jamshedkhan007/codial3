const nodemailer = require("nodemailer");
const ejs=require('ejs');
const path=require('path');
const env=require('./environment');



// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(env.smtp);


  let renderTemplate=(data,receivePath)=>{
    let mainHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',receivePath),
        data,
        function(err,template){
            if(err){console.log('error in rendering template',err);return;}

            mainHTML=template;
        }
    )

    return mainHTML;
  }


  module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate
  }