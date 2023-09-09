import { raw } from "body-parser"
import db from "../models/index"
require('dotenv').config()
import emailService from './emailService'


let postAppointment = (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date
                || !data.fullName
            ) {
                resolve({
                    errCode: -1,
                    errMessage: "missing lot of shit"
                })

            } else {
                await emailService.sendAEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    link: 'https://www.facebook.com/',
                })
                //upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    }
                })
                //create a booking record
                if (user && user[0]) {
                    await db.bookings.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType
                        },
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: "Đặt chỗ Đ* ngon r"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    postAppointment
}