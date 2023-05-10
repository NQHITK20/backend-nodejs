import db from "../models/index";
import bcrypt from 'bcryptjs'
let salt = bcrypt.genSaltSync(10);


let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}
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
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'sai password';
                        console.log('check userData', userData);
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User doesn't exist`;
                    console.log('check userData', userData);
                }
                resolve(userData)
            } else {
                //return err
                userData.errCode = 1;
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

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId }
                })
            }
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email is exist ?
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in used.FUCK U,plese try another one '
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phoneNumber,
                    gender: data.gender === '1' ? true : false,
                    image: data.image,
                    roleId: data.roleId
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: `The user doesn't exist `
                })
            }
            await db.User.destroy({
                where: { id: userId }
            });
            resolve({
                errCode: 0,
                errMessage: `Delete ngon r `
            })
        } catch (error) {
            reject(error)
        }

    })
}
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'missing input parameter'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName
                user.lastName = data.lastName
                user.address = data.address

                await user.save();
                resolve({
                    errCode: 0,
                    errMessage: ' Lưu ok r'
                });
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: ' Méo thấy người dùng'
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
}