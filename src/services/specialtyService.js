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

module.exports = {
    createSpecialty, getSpecialty
}