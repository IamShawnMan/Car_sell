const vars = process.env;
export const bookedMail = (data) => {
  const mail = {
    from: vars.SMTP_USER,
    to: data.email,
    subject: "Parking booked succesfully",
    text: `Dear ${data.name}, we announce you that you have succesfully booked parking 
    for your ${data.model} : ${data.plateNumber}. Your parking's slot number is ${data.slotNumber}
     \n Thank you for choosing us`,
  };
  return mail;
};

export const otpMail = (data) => {
  const mail = {
    from: vars.SMTP_USER,
    to: data.email,
    subject: "Confirmaiton password!",
    text: `Do not share this code with anyone. Your password for confirm you account is ${data.otp}`,
  };
  return mail;
};
