const vars = process.env;
export const bookedMail = (data) => {
  const mail = {
    from: vars.SMTP_USER,
    to: data.email,
    subject: "Parking booked succesfully",
    text: `Dear ${data.name}, we announce you that you have succesfully booked parking 
    Slot number: ${data.slotNumber} for car
    Plate number: ${data.plateNumber} \n Thank you for choosing us`,
  };
  return mail;
};
