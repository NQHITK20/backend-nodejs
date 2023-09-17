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

module.exports = {
    createClinic
}