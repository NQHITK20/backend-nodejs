import express from "express"
import homeController from "../controllers/homeController"
import userController from "../controllers/userController"
import doctorController from "../controllers/doctorController"


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

    Router.get('/api/allcode')

    return app.use("/", Router, userController.getAllcode);
}

module.exports = initWebRoutes;