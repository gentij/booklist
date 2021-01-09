const jwt = require('jsonwebtoken')

module.exports = (req) => {
    const authHeader = req.headers.authorization
    let authError;
    let user;
    if(authHeader) {
        const token = authHeader.split('Bearer ')[1]
        if(token) {
            try {
                user = jwt.verify(token, process.env.TOKEN_SECRET);
            } catch (error) {
                authError = error;
            }
        }
    } else {
        authError = { name: "JsonWebTokenError", message: 'Authentication header must be provided'}
    }
    return {
        user, 
        authError
    }
}