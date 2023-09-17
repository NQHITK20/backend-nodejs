import clinicService from '../services/clinicService'

let createClinic = async (req, res) => {
    try {
        let doctor = await clinicService.createClinic(req.body)
        return res.status(200).json(doctor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from sever...'
        })
    }
}
module.exports = {
    createClinic
}