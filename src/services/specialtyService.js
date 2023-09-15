const db = require("../models")


let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHtml || !data.descriptionMarkdown) {
                resolve({
                    errCode: -1,
                    errMessage: "missing lot of shit"
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionMarkdown: data.descriptionMarkdown,
                    descriptionHtml: data.descriptionHtml,
                })
                resolve({
                    errCode: 0,
                    errMessage: "OKK"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll()
            if (data) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString()
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
let getDetailSpecialtyById = (id, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !location) {
                resolve({
                    errCode: -1,
                    errMessage: "missing id"
                })
            } else {
                let data = {}
                data = await db.Specialty.findOne({
                    where: { id: id },
                    attributes: ['descriptionHtml', 'descriptionMarkdown']
                })
                if (data) {
                    //
                    let doctorSpecialty = []
                    if (location === 'ALL') {
                        doctorSpecialty = await db.doctor_info.findAll({
                            where: { SpecialtyId: id },
                            attributes: ['doctorId', 'provinceId']
                        })
                    } else {
                        doctorSpecialty = await db.doctor_info.findAll({
                            where: { SpecialtyId: id, provinceId: location },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }
                    data.doctorSpecialty = doctorSpecialty
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
    createSpecialty, getSpecialty, getDetailSpecialtyById
}