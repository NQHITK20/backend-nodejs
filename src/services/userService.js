import db from "../models/index";
import bcrypt from 'bcryptjs'


let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            if (isExist) {
                //exist that email
                //compare password
                let user = await db.User.findOne({
                    where: { email: email }
                });
                if (user) {

                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Check ngon r',
                            userData.user = user;
                    }
                    else {
                        userData.errCode = 3;
                        userData.errMessage = 'sai password';
                    }
                }
                else {
                    userData.errCode = 2;
                    userData.errMessage = `User doesn't exist`;
                }
            } else {
                //return err
                userData.errCode = 1;
                userData.errMessage = `your email doesn't exist in out system.pls try again`
                resolve(userData)
            }
        } catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userr = await db.User.findOne({
                where: { email: userEmail }
            })
            if (userr) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
}