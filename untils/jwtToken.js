const sendToken = (user, statusCode, res) => {
    let id = user._id;
    const token = user.getJwtToken(id);
    

    res.status(statusCode).cookie("token", token).json({
        success: true,
        user,
        token,
        refreshToken: user.refreshToken
    });
}

module.exports = sendToken;