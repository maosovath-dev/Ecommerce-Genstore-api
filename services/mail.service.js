const transporter = require("../config/mailler");

/**
 * មុខងារផ្ញើកូដ OTP ទៅកាន់អ៊ីមែល (កែប្រែថ្មី)
 * @param {string} to - អ៊ីមែលអ្នកទទួល
 * @param {string} otpCode - លេខកូដ OTP ៦ ខ្ទង់
 */
const sendOTPEmail = async (to, otpCode) => {

    await transporter.sendMail({
        // ប្រើប្រាស់ EMAIL_USER ពី .env របស់អ្នកដើម្បីកុំឱ្យជាប់ Spam
        from: `"MyApp Support" <${process.env.EMAIL_USER}>`,
        to,
        subject: "កូដ OTP សម្រាប់ផ្ទៀងផ្ទាត់គណនីរបស់អ្នក",
        html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #e1e1e1;
          border-radius: 10px;
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .otp-container {
          text-align: center;
          margin: 30px 0;
        }
        .otp-code {
          background-color: #F3F4F6;
          color: #4F46E5;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 6px;
          padding: 14px 28px;
          border: 2px dashed #4F46E5;
          border-radius: 8px;
          display: inline-block;
        }
        .footer {
          font-size: 12px;
          color: #888;
          text-align: center;
          margin-top: 30px;
        }
        .warning-text {
          color: #666;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>សូមស្វាគមន៍មកកាន់ MyApp!</h2>
        </div>
        <p>សួស្តី,</p>
        <p>សូមអរគុណសម្រាប់ការចុះឈ្មោះចូលប្រើប្រាស់! ខាងក្រោមនេះជាលេខកូដ OTP របស់អ្នក ដើម្បីធ្វើការផ្ទៀងផ្ទាត់ និងបើកដំណើរការគណនី៖</p>
        
        <div class="otp-container">
          <div class="otp-code">${otpCode}</div>
        </div>
        
        <p class="warning-text">លេខកូដ OTP នេះមានសុពលភាព <strong>ត្រឹមតែ ៥ នាទីប៉ុណ្ណោះ</strong>។ ប្រសិនបើអ្នកមិនបានស្នើសុំកូដនេះទេ សូមកុំចែករំលែកវាទៅកាន់អ្នកដទៃឱ្យសោះ។</p>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} MyApp Inc. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `,
    });
};

// នាំចេញមុខងារថ្មីសម្រាប់យកទៅប្រើប្រាស់ក្នុង Controller
module.exports = { sendOTPEmail };