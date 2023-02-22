const fs=require('fs');
const rfs=require('rotating-file-stream');
const path=require('path');

const logDirectory=path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream=rfs.createStream('access.log',{
    interval:'1d',
    path:logDirectory
})


const development={
    name:'development',
    asset_path:'/assests',
    session_cookie_key:'jamshed khan',
    db:'Development',
    smtp:{
        service:'gmail', 
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
           user: 'jk5446052@gmail.com',
            pass: 'fteetiomplxxingn'
        },
      },
      google_client_id: "687952106833-9r8airigfcsr5km1o04fvopcs8bkh4h5.apps.googleusercontent.com",
      google_client_secrect: "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",
      google_callback_url: "http://localhost:8000/user/auth/google/callback",
      jwt_secrect_key:'codial3',
      morgan:{
        mode:'dev',
        Options:{stream:accessLogStream}
      }
}

const prodution={
    name:'prodution',
    asset_path:process.env.ASSET_PATH,
    session_cookie_key:process.env.SESSION_COOKIE_KEY,
    db:process.env.DB,
    smtp:{
        service:'gmail', 
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
           user: process.env.GMIAL_USERNAME,
            pass: process.env.GMIAL_PASSWORD
        },
      },
      google_client_id: process.env.GOOGLE_CLIENT_ID,
      google_client_secrect: process.env.GOOGLE_CLIENT_SECRECT,
      google_callback_url: process.env.GOOGLE_CALLBACK_URL,
      jwt_secrect_key:process.env.JWT_SECRECT,
      morgan:{
        mode:'combined',
        Options:{stream:accessLogStream}
      }
}

module.exports=eval(process.env.ENVIROMENT) == undefined ? development : eval(process.env.ENVIROMENT);