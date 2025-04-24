import jwt from "jsonwebtoken";
const accessJwtSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshJwtSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTime = process.env.ACESS_TOKEN_EXPIRES;
const refreshTime = process.env.REFRESH_TOKEN_EXPIRES;

export const generateAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      accessJwtSecret,
      {
        expiresIn: accessTime,
        algorithm: "HS512",
      },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

export const generateRefreshToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      refreshJwtSecret,
      {
        algorithm: "HS512",
        expiresIn: refreshTime,
      },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};
