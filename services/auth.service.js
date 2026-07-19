const user = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const crypto = require("crypto");
const mailService = require('../services/mail.service');

/**
 * មុខងារជំនួយសម្រាប់បង្កើតលេខ OTP ៦ ខ្ទង់
 */
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const register = async (body) => {
    const checkEmail = await user.findByEmail(body.email);

    if (checkEmail.length > 0) {
        throw new Error("Email Duplicate");
    }

    const hashPassword = await bcrypt.hash(body.password, 10);
    
    // ផ្លាស់ប្តូរ៖ បង្កើត OTP ៦ ខ្ទង់ និងកំណត់ Expire ត្រឹម ៥ នាទី
    const otpCode = generateOTP();
    const verificationExpires = new Date(Date.now() + 5 * 60 * 1000); // ៥ នាទី

    console.log("កូដ OTP ដែលបានបង្កើត៖", otpCode);

    const result = await user.create({
        name: body.name,
        email: body.email,
        password: hashPassword,
        verificationToken: otpCode, // រក្សាទុក OTP ចូល Column នេះដដែល
        verificationExpires
    });
    
    // ផ្លាស់ប្តូរ៖ ហៅមុខងារផ្ញើ OTP (ដែលយើងបានកែក្នុង mailService មុននេះ)
    await mailService.sendOTPEmail(body.email, otpCode);

    const row = await user.findById(result);
    return row[0];
};

const login = async (body) => {
    const userInfo = await user.findByEmail(body.email);

    if (userInfo.length == 0) {
        throw new Error("Email and Password invalid");
    }

    let isMatch = await bcrypt.compare(body.password, userInfo[0].password_hash);

    if (!isMatch) {
        throw new Error("Email and Password invalid");
    }
    
    // ឆែកមើលថាតើបានផ្ទៀងផ្ទាត់ OTP រួចរាល់ហើយឬនៅ
    if (!userInfo[0].is_verified) {
        throw new Error("You need to verify your account with OTP first");
    }

    // === បង្កើត token ===
    const token = jwt.sign(
        { id: userInfo[0].id, email: userInfo[0].email },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn },
    );
    await user.addToken(token, userInfo[0].id);
    let row = await user.findById(userInfo[0].id);

    return row;
};

const getMe = async (id) => {
    const row = await user.findById(id);
    return row[0];
};

const logout = async (id) => {
    await user.deleteToken(id);
};

/**
 * ផ្លាស់ប្តូរ៖ មុខងារផ្ទៀងផ្ទាត់ OTP ពី Frontend
 */
const verifyEmail = async (otpCode, email) => {
    if (!otpCode || !email) {
        throw new Error("OTP code and Email are required");
    }

    // ស្វែងរក User តាមរយៈ Email
    let userInfo = await user.findByEmail(email);
    if (userInfo.length == 0) {
        throw new Error("Email is Not Found");
    }

    if (userInfo[0].is_verified) {
        throw new Error("Account already verified");
    }

    // ✅ កែសម្រួល៖ បំប្លែងតម្លៃទាំងសងខាងទៅជា String មុននឹងធៀប (Strict Comparison !==)
    if (String(userInfo[0].verification_token) !== String(otpCode)) {
        throw new Error("កូដ OTP មិនត្រឹមត្រូវទេ");
    }

    // ឆែកមើលថាតើហួស ៥ នាទីហើយឬនៅ
    if (!userInfo[0].verification_expires || new Date(userInfo[0].verification_expires) < new Date()) {
        throw new Error("កូដ OTP បានហួសសុពលភាពហើយ (Expired)");
    }
    
    // បើត្រឹមត្រូវទាំងអស់ ធ្វើការ Update ទៅជា Verified
    await user.verifiedEmail(userInfo[0].id);

    return { message: 'Account Verified Successfully' };
};

/**
 * ផ្លាស់ប្តូរ៖ មុខងារផ្ញើកូដ OTP សារជាថ្មី (Resend OTP)
 */
const resendVerificationLink = async (email) => {
    const userInfo = await user.findByEmail(email);
    
    if (userInfo.length == 0) {
        throw new Error("Email is Not Found 🥲");
    }

    if (userInfo[0].is_verified) {
        throw new Error("Account already Verified");
    }

    // បង្កើត OTP ថ្មី និងពេលវេលាផុតកំណត់ថ្មី (៥ នាទី)
    const otpCode = generateOTP();
    const verification_expires = new Date(Date.now() + 5 * 60 * 1000);

    // រក្សាទុកកូដថ្មីចូល Database
    await user.resendVerificationLink({
        id: userInfo[0].id,
        verification_token: otpCode,
        verification_expires
    });

    // ផ្ញើកូដ OTP ថ្មីទៅកាន់អ៊ីមែល
    await mailService.sendOTPEmail(email, otpCode);
    
    return { message: 'Resend OTP Successfully' };
};

module.exports = {
    register,
    login,
    getMe,
    logout,
    verifyEmail,
    resendVerificationLink
};