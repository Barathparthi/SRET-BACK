import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import cors from 'cors';
import Jwt from "jsonwebtoken";

import cookieParser from "cookie-parser";
import { adminRouter } from "./Routes/AdminRoute.js";
import { Mentor } from './Routes/Mentor.js';
import { User } from './Routes/UserRoute.js';
import { Attendance } from './Routes/Attendance.js';
import { Feedback } from './Routes/FeedBack.js';

const app = express();
const port = 5000;

// ⁡⁢⁣⁢​‌‌‍𝗠𝗶𝗱𝗱𝗹𝗲𝘄𝗮𝗿𝗲 𝘁𝗼 𝗽𝗮𝗿𝘀𝗲 𝗿𝗲𝗾𝘂𝗲𝘀𝘁 𝗯𝗼𝗱𝘆​⁡
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors({
    origin: ["https://sretportal.netlify.app"],
    methods: ['GET', 'POST', 'PUT', "DELETE"],
    credentials: true
}));
app.use('/auth', adminRouter)
app.use('/auth1', User)
app.use('/auth2', Attendance)
app.use('/auth3', Feedback)

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
      if (err) return res.status(401).json({ Status: false, Error: "Wrong Token" });
      req.id = decoded.id;
      req.role = decoded.role;
      next();
    });
  } else {
    return res.status(401).json({ Status: false, Error: "Not authenticated" });
  }
};

// ⁡⁢⁣⁢​‌‌‍𝗥𝗼𝘂𝘁𝗲 𝘁𝗼 𝘃𝗲𝗿𝗶𝗳𝘆 𝘂𝘀𝗲𝗿 𝗮𝘂𝘁𝗵𝗲𝗻𝘁𝗶𝗰𝗮𝘁𝗶𝗼𝗻​⁡
app.get('/verify', verifyUser, (req, res) => {
  return res.json({ Status: true, role: req.role, id: req.id });
});

// ⁡⁢⁣⁢​‌‌‍𝗦𝘁𝗮𝗿𝘁 𝘁𝗵𝗲 𝘀𝗲𝗿𝘃𝗲𝗿​⁡
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
