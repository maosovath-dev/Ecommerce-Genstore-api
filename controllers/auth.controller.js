const { resume } = require("../config/db");
const userServices = require("../services/auth.service");
const { sendResponse } = require("../utils/responseHelper");

const register = async (req, res) => {
    try {
        const result = await userServices.register(req.validate);
        
        return sendResponse(res, 201, true, "User Register Successfully", result);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 400, false, error.message);
    }
};

const login = async (req, res) => {
    try {
        let result = await userServices.login(req.validate);

        return sendResponse(res, 200, true, "User Login Successfully", result);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 400, false, error.message);
    }
};

const getMe = async (req, res) => {
    try {
        const row = await userServices.getMe(req.user.id);

        return sendResponse(res, 200, true, "Get own profile successfully", row);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

const logout = async (req, res) => {
    try {
        await userServices.logout(req.user.id);

        return sendResponse(res, 200, true, "Logout successfully");
    } catch (error) {
        console.log(error);
        return sendResponse(res, 400, false, error.message);
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { otpCode, email } = req.body; 
        const result = await userServices.verifyEmail(otpCode, email);

        return sendResponse(res, 200, true, result.message);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 400, false, error.message);
    }
};

const resendVerificationLink = async (req, res) => {
    try {
        const { email } = req.body;
        let result = await userServices.resendVerificationLink(email);

        return sendResponse(res, 200, true, result.message);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 400, false, error.message);
    }
};

module.exports = {
    register,
    login,
    getMe,
    logout,
    verifyEmail,
    resendVerificationLink
};