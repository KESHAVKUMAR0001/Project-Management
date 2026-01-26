//Generating E-Mail template for verification of user
//Then sending email by nodemailer

import Mailgen from "mailgen"           //For Generating email template
import nodemailer from "nodemailer"     //For sending E-mails

//Method for sending email: Just provide options and you can use this sendMail method anywhere
const sendEmail=async (options) => {  //Options are all attributes of email (to,subject,content)

    //1. Preparing email to send

    //Initialize Mailgen reference with default themes and brands
    const mailGenerator=new Mailgen({
        theme:"default",
        product:{
            name:"Project Management Platform",
            link:"https://projectmanagementplatform.com"
        }
    })

    //Textual content of mail
    const emailTextual=mailGenerator.generatePlaintext(options.mailgenContent)

    //Generate content that supports HTML
    const emailHtml=mailGenerator.generate(options.mailgenContent)

    //2. Actual sending of email: Create transport of nodemailer then send
    
    const transporter=nodemailer.createTransport({
        host:process.env.MAILTRAP_SMTP_HOST,
        port:process.env.MAILTRAP_SMTP_PORT,
        auth:{
            user:process.env.MAILTRAP_SMTP_USER,
            pass:process.env.MAILTRAP_SMTP_PASS
        }
    })

    const mail={
        from:"mail.projectmanagementplatform@example.com",
        to:options.email,
        subject:options.subject,
        text:emailTextual,
        html:emailHtml          //Browser will auto pick textual content or html content depending on support
    }

    //Since sending mails can fail, so use trycatch
    try {
        await transporter.sendMail(mail)            //Sending mail
    } catch (error) {
        console.error("Email Service failed. Make sure you have provided mailtrap credentials in .env file")
        console.error("Error: ",error)
    }
}
//Now just provide the options and you can use this send email function anywhere



//Content of verification email: Body(name, intro and action) and outro
const emailVerificationMailgenContent =(username,verificationUrl) => {
    return {
        body: {
            name:username,
            intro:"Welcome to our App! We're excited to have you on board",
            action:{
                instructions: "TO verify your email,please click on this following button",
                button: {
                    color: "#22BC66",
                text: "Verify your email",
                link: verificationUrl
                }
            },
            outro: "Need help or have any query, Just reply to this e-mail. We would love to help"
        }
    }
}

//Content of Forgot Password Email: Body(name, intro and action) and outro
const forgotPasswordMailgenContent =(username,passwordResetUrl) => {
    return {
        body: {
            name:username,
            intro:"We gpt a request to reset the password of your account",
            action:{
                instructions: "To reset your password, please click on this following button",
                button: {
                color: "#1a1a1a",
                text: "Reset Password",
                link: passwordResetUrl
                }
            },
            outro: "Need help or have any query, Just reply to this e-mail. We would love to help"
        }
    }
}

export {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail
}    
//Exporting so that anyone can use these templates for email verification and forgot password