const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const user = require("../models/user.model");


const isLogin = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        console.log(authHeader);

        if(!authHeader){
            return res.json({
                result: false,
                msg : 'You need to login'
            })
        }
        let parts = authHeader.split(' ');
        if(parts.length !== 2 || parts[0] !== 'Bearer')  {
            return res.json({
                result: false,
                msg : 'Invalid token'
            })
        }
        let token = parts[1];
        let decode = jwt.verify(token, jwtConfig.secret);
        
        let row = await user.getByToken(token);

        if(row.length === 0){
            throw new Error('Invalid or Expired Token');
        }

        req.user = decode;
        next();

    }catch(error){
        return res.json({
            result: false,
            msg : 'Invalid token'
        })
    }
}
module.exports = {
    isLogin
}