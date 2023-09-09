import patientService from "../services/patientService"

let postAppointment = async (req, res) => {
    try {
        let patient = await patientService.postAppointment(req.body)
        return res.status(200).json(patient)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from sever...'
        })
    }
}
module.exports = {
    postAppointment
}