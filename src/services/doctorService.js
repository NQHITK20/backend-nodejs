import { raw } from "body-parser"
import db from "../models/index"
import _ from "lodash"


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
let checkRequiredField = (inputData) => {
    let arr = ['doctorId', 'description', 'contentMarkdown', 'action', 'selectPrice', 'selectPayment', 'selectProvince', 'nameClinic', 'addressClinic', 'note', 'specialtyId']
    let isValid = true
    let element = ''
    for (let i = 0; i < arr.length; i++) {
        if (!inputData[arr[i]]) {
            isValid = false
            element = arr[i]
            break
        }
    }
    return {
        isValid: isValid,
        element: element
    }
}

let saveDetailDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredField(inputData)
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `missing parameter :${checkObj.element}`
                })
            } else {

                //markdown tb
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

                //doctor info tb
                let doctorInfo = await db.doctor_info.findOne({
                    where: {
                        doctorId: inputData.doctorId
                    },
                    raw: false

                })
                if (doctorInfo) {
                    //update
                    doctorInfo.doctorId = inputData.doctorId
                    doctorInfo.priceId = inputData.selectPrice
                    doctorInfo.provinceId = inputData.selectProvince
                    doctorInfo.paymentId = inputData.selectPayment
                    doctorInfo.nameClinic = inputData.nameClinic
                    doctorInfo.addressClinic = inputData.addressClinic
                    doctorInfo.note = inputData.note
                    doctorInfo.specialtyId = inputData.specialtyId
                    doctorInfo.clinicId = inputData.clinicId
                    await doctorInfo.save()
                } else {
                    //create
                    await db.doctor_info.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectPrice,
                        provinceId: inputData.selectProvince,
                        paymentId: inputData.selectPayment,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId
                    })
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
                        {
                            model: db.doctor_info,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.allcodes, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.allcodes, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.allcodes, as: 'paymentData', attributes: ['valueEn', 'valueVi'] }
                            ]
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
            if (!data.arr || !data.doctorId || !data.Formatdate) {
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
                let existing = await db.schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.Formatdate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })
                // if (existing && existing.length > 0) {
                //     existing = existing.map(item => {
                //         item.date = new Date(item.date).getTime()
                //         return item
                //     })
                // }
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date
                })
                if (toCreate && toCreate.length > 0) {
                    await db.schedule.bulkCreate(toCreate)
                }
                resolve({
                    errCode: 0,
                    errMessage: "ngon zồi"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getScheduleDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing shit'
                })
            } else {
                let data = await db.schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.allcodes, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] }

                    ],
                    raw: true,
                    nest: true
                })
                if (!data) data = []
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
let getExtraInfoById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: -1,
                    errMessage: "missing shit"
                })
            }
            else {
                let data = await db.doctor_info.findOne({
                    where: { doctorId: doctorId },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.allcodes, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.allcodes, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.allcodes, as: 'paymentData', attributes: ['valueEn', 'valueVi'] }
                    ],
                    raw: false,
                    nest: true
                })
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
let getProfileById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: -1,
                    errMessage: "missing shit"
                })
            }
            else {
                let data = await db.User.findOne({
                    where: { id: doctorId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.markdown, attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {
                            model: db.doctor_info,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.allcodes, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.allcodes, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.allcodes, as: 'paymentData', attributes: ['valueEn', 'valueVi'] }
                            ]
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
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctor: getAllDoctor,
    saveDetailDoctor: saveDetailDoctor,
    getDetailDoctor: getDetailDoctor,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleDoctor: getScheduleDoctor,
    getExtraInfoById: getExtraInfoById,
    getProfileById: getProfileById,
    checkRequiredField: checkRequiredField
}