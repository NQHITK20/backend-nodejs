require('dotenv').config()
import nodemailer from 'nodemailer'

let sendAEmail = async (data) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Hỏi dân Chym to" <normanlovehislife@gmail.com>', // sender address
        to: data.receiverEmail, // list of receivers
        subject: "Thông tin đặt gay pỏn 2.0", // Subject line
        html: getBodyHTML(data)
        // html body
    });

}

let getBodyHTML = (data) => {
    let result = ''
    if (data.language === 'vi') {
        result = `<h3>Xin chào ${data.patientName}!</h3>
<p>Bạn nhận được email này thì test ngon r</p>
<p>Thông tin blah blah blah r</p>
<p><div>Thời gian :${data.time}</div></p>
<p><div>Bác sĩ :${data.doctorName}</div></p>

<p>test click link xác nhận</p>


<div><a href=${data.link} target="_blank">Bấm zô đây</a></div>

`
    }
    if (data.language === 'en') {
        result = `<h3>Dear ${data.patientName}!</h3>
        <p>Hope u got this shit</p>
        <p>intro blah blah blah r</p>
        <p><div>Fucktime :${data.time}</div></p>
        <p><div>Mrs :${data.doctorName}</div></p>
        
        <p>test click link <3></p>
        
        
        <div><a href=${data.link} target="_blank">SUCK HERE</a></div>
        
        `
    }
    return result
}


module.exports = {
    sendAEmail, getBodyHTML
}