import { reject } from "lodash"
import db from "../models/index"

let createClinic = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.address || !data.descriptionHtml || !data.descriptionMarkdown) {
                resolve({
                    errCode: -1,
                    errMessage: "missing lot of shit"
                })
            } else {
                await db.clinics.create({
                    name: data.name,
                    image: data.imageBase64,
                    address: data.address,
                    descriptionMarkdown: data.descriptionMarkdown,
                    descriptionHtml: data.descriptionHtml,
                })
                resolve({
                    errCode: 0,
                    errMessage: "OKK cmnr"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllClinic = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.clinics.findAll()
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item
                })
            }
            resolve({
                errCode: 0,
                errMessage: "OKK",
                data: data
            })
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailClinicById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: -1,
                    errMessage: "missing id"
                })
            } else {
                let data = {}
                data = await db.clinics.findOne({
                    where: { id: id },
                    attributes: ['name', 'address', 'descriptionHtml', 'descriptionMarkdown']
                })
                if (data) {
                    //
                    let doctorClinic = await db.doctor_info.findAll({
                        where: { clinicId: id },
                        attributes: ['doctorId', 'provinceId']
                    })
                    data.doctorClinic = doctorClinic
                } else data = {}
                resolve({
                    errCode: 0,
                    errMessage: "OKK",
                    data
                })
            }
        } catch (error) {
            reject(error)
        }
    })

}

module.exports = {
    createClinic, getAllClinic, getDetailClinicById
}