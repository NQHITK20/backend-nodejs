import express from "express"
import homeController from "../controllers/homeController"
import userController from "../controllers/userController"
import doctorController from "../controllers/doctorController"
import patientController from "../controllers/patientController"
import specialtyController from "../controllers/specialtyController"
import clinicController from "../controllers/clinicController"

let Router = express.Router();

let initWebRoutes = (app) => {
    Router.get('/', homeController.getHomepage);
    Router.get('/about', homeController.getAboutpage);
    Router.get('/crud', homeController.getCRUD);
    Router.post('/post-crud', homeController.postCRUD);
    Router.get('/show-crud', homeController.showCRUD);
    Router.get('/edit-crud', homeController.getEditCRUD);
    Router.post('/put-crud', homeController.putCRUD);
    Router.get('/delete-crud', homeController.deleteCRUD);

    Router.post('/api/login', userController.handleLogin)
    Router.get('/api/get-all-users', userController.handleGetAllUsers);
    Router.post('/api/create-new-user', userController.handleCreateNewUser);
    Router.put('/api/edit-user', userController.handleEditUser);
    Router.delete('/api/delete-user', userController.handleDeleteUser);
    Router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    Router.get('/api/get-all-doctor', doctorController.getAllDoctor);
    Router.post('/api/save-info-doctor', doctorController.postInfoDoctor);
    Router.get('/api/get-detail-doctor', doctorController.getDetailDoctor);
    Router.get('/api/get-schedule-doctor', doctorController.getScheduleDoctor);
    Router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule)
    Router.get('/api/get-extra-info-by-id', doctorController.getExtraInfoById);
    Router.get('/api/get-profile-by-id', doctorController.getProfileById);
    Router.get('/api/get-list-patient', doctorController.getListPatient);


    Router.post('/api/patient-book-appointment', patientController.postAppointment)
    Router.post('/api/verify-book-appointment', patientController.postVerifyAppointment)

    Router.post('/api/create-new-specialty', specialtyController.createSpecialty)
    Router.get('/api/get-specialty', specialtyController.getSpecialty);
    Router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);

    Router.post('/api/create-new-clinic', clinicController.createClinic)
    Router.get('/api/get-clinic', clinicController.getAllClinic);
    Router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);



    Router.get('/api/allcode')

    return app.use("/", Router, userController.getAllcode);
}

module.exports = initWebRoutes;