const express = require('express');
const authControler = require('../controllers/auth.controller');
const { isLogin } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { 
    registerUserSchema, 
    loginUserSchema, 
    resendVerificationLinkSchema,
    verifyOtpSchema // 💡 ណែនាំឱ្យបង្កើត Schema ថ្មីមួយសម្រាប់ Validate OTP (បើមាន)
} = require('../validators/user');

const router = express.Router();

// 1. ចុះឈ្មោះ និង ឡូកអ៊ីន
router.post('/register', validate(registerUserSchema), authControler.register);
router.post('/login', validate(loginUserSchema), authControler.login);

// 2. ព័ត៌មានផ្ទាល់ខ្លួន និង ចាកចេញ (តម្រូវឱ្យមាន Middleware isLogin)
router.get('/me', isLogin, authControler.getMe);
router.delete('/logout', isLogin, authControler.logout);

// 3. 🔄 ផ្លាស់ប្តូរ៖ ផ្ទៀងផ្ទាត់ OTP (ប្តូរពី GET មកជា POST)
// ប្រសិនបើអ្នកមាន verifyOtpSchema សម្រាប់ឆែក req.body អាចដាក់ validate(verifyOtpSchema) ពីមុខបាន
router.post('/verify-email', authControler.verifyEmail);

// 4. 🔄 ផ្លាស់ប្តូរ៖ ផ្ញើកូដ OTP សារជាថ្មី (អាចរក្សាទុក URL ដដែល ឬប្តូរទៅ /resend-otp)
router.post('/resend-verificationLink', validate(resendVerificationLinkSchema), authControler.resendVerificationLink);

module.exports = router;