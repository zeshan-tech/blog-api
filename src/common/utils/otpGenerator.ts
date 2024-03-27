export const onGenerateOTP = (length: number): string => {
  const digits = '0123456789'; // Characters to use for OTP
  let otp = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }

  return otp;
};
