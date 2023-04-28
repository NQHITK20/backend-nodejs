let handleLogin = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input parameter!'
        })
    }
    //check email
    //compare password
    //return userinfo
    //acess token:JWT
    return res.status(200).json({
        errCode: 0,
        message: 'vú vú',
        yourEmail: email
    })
}

module.exports = {
    handleLogin: handleLogin,
}