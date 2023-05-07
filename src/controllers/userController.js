import userService from "../services/userService"
import bcrypt from 'bcryptjs'



let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input parameter!'
        })
    }
    let userData = await userService.handleUserLogin(email, password);
    console.log('userdata :', userData);
    //check email
    //compare password
    //return userinfo
    //acess token:JWT
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : { 'a': 'aaa' },
    })
}
module.exports = {
    handleLogin: handleLogin,
}