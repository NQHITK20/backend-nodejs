import db from "../models/index";
import bcrypt from 'bcryptjs'


let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            console.log('check email:', isExist);
            if (isExist) {
                //exist that email
                //compare password
                let user = await db.User.findOne({
                    where: { email: email },
                    raw: true
                });
                console.log('check user:', user);
                if (user) {
                    let check = bcrypt.compareSync(password, user.password);
                    console.log('check password:', check);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Check ngon r';

                        delete user.password;
                        userData.user = user;
                        console.log('check userData', userData);
                        resolve(userData)
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'sai password';
                        console.log('check userData', userData);
                        resolve(userData)
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User doesn't exist`;
                    console.log('check userData', userData);
                    resolve(userData)
                }
            } else {
                //return err
                userData.errCodeEmail = 1;
                userData.errMessage = `your email doesn't exist in out system.pls try again`
                console.log('check userData', userData);
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