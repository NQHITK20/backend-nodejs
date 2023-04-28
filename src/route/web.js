import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";

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

    return app.use("/", Router);
}

module.exports = initWebRoutes;