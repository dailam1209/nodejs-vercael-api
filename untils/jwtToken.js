const sendToken = (user, statusCode, res) => {
    let id = user._id;
    const token = user.getJwtToken(user._id);

    res.status(statusCode).cookie("token", token).json({
        success: true,
        user,
        token
    });
}

module.exports = sendToken;