import nodemailer from 'nodemailer'

export const sendVerificationCode = async (email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const code = Math.floor(100000 + Math.random() * 900000);
      await transporter.sendMail({
          from: "E-Commerce App",
          to: `${email}`,
          subject: "E-Commerce App Verification Code",
          text: `Your Verification Code is ${code}`,
      });

      return code;
}