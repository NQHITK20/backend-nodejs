import db from '../models/index'
import CRUDService from '../services/CRUDService'

let getHomepage = async (req, res) => {

    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (error) {
        console.log(error);
    }

}

let getAboutpage = (req, res) => {
    return res.render('about.ejs')
}
let getCRUD = (req, res) => {
    return res.render('crud.ejs')
}
let postCRUD = async (req, res) => {
    let mesage = await CRUDService.createNewUser(req.body);
    console.log(mesage)
    return res.send('ko có user');
}

let showCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    return res.render('showCRUD.ejs', {
        dataTable: data
    })
}
let getEditCRUD = async (req, res) => {
    let userID = req.query.id;
    if (userID) {
        let userdata = await CRUDService.getUserInfoById(userID);
        return res.render('editCRUD.ejs', {
            editData: userdata
        });
    } else {
        return res.send('ko có user');
    }

}
let putCRUD = async (req, res) => {
    let id = req.query.id;
    let Allusers = await CRUDService.updateUserData(data);
    return res.render('showCRUD.ejs', {
        dataTable: Allusers
    });
}
let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.deleteUserById(id);
        return res.send('delete ngon');
    } else {
        return res.send('delete ko ngon');
    }
}

module.exports = {
    getHomepage: getHomepage,
    getAboutpage: getAboutpage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    showCRUD: showCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}