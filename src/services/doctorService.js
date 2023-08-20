import { raw } from "body-parser"
import db from "../models/index"
require('dotenv').config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.allcodes, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.allcodes, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error)
        }
    })
}
let getAllDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                },
            })
            resolve({
                errCode: 0,
                data: doctor
            })
        } catch (error) {
            reject(error)
        }
    })
}
let saveDetailDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.description || !inputData.contentMarkdown || !inputData.action) {
                resolve({
                    errCode: 1,
                    errMessage: "missing parameter"
                })
            } else {
                if (inputData.action === 'CREATE') {
                    await db.markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    })
                }
                if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown
                        doctorMarkdown.description = inputData.description
                        await doctorMarkdown.save()
                    }
                }

                resolve({
                    errCode: 0,
                    errMessage: "Lấy Dr ngon r"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailDoctor = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "missing id doctor"
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.markdown, attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        { model: db.allcodes, as: 'positionData', attributes: ['valueEn', 'valueVi'] }

                    ],
                    raw: true,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString()
                }
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arr) {
                resolve({
                    errCode: -2,
                    errMessage: "missing shit"
                })
            }
            else {
                let schedule = data.arr
                if (schedule) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item
                    })
                }
                console.log('check dataaaaa', schedule)
                resolve('')
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctor: getAllDoctor,
    saveDetailDoctor: saveDetailDoctor,
    getDetailDoctor: getDetailDoctor,
    bulkCreateSchedule: bulkCreateSchedule
}