import specialtyService from "../services/specialtyService"

let createSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.createSpecialty(req.body)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'err from sever'
        })
    }
}
let getSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.getSpecialty()
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'err from sever'
        })
    }
}


module.exports = {
    createSpecialty, getSpecialty
}