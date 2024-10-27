// import mysql from 'mysql'

// // ⁡⁢⁣⁢​‌‌‍𝗖𝗿𝗲𝗮𝘁𝗲 𝗠𝘆𝗦𝗤𝗟 𝗰𝗼𝗻𝗻𝗲𝗰𝘁𝗶𝗼𝗻​⁡
// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "db",
//     port: 3307,
//   });
  
//   // ⁡⁢⁣⁢​‌‌‍𝗖𝗼𝗻𝗻𝗲𝗰𝘁 𝘁𝗼 𝗠𝘆𝗦𝗤𝗟​⁡
//   connection.connect((err) => {
//     if (err) {
//       console.error("Error connecting to MySQL:", err);
//       return;
//     }
//     console.log("Connected to MySQL");
//   });

//   export default connection;
  

// import mysql from 'mysql2'

// // ⁡⁢⁣⁢​‌‌‍𝗖𝗿𝗲𝗮𝘁𝗲 𝗠𝘆𝗦𝗤𝗟 𝗰𝗼𝗻𝗻𝗲𝗰𝘁𝗶𝗼𝗻​⁡
// const connection = mysql.createConnection({
//     host: "junction.proxy.rlwy.net:42172",
//     user: "root",
//     password: "sbszGKIpeuJYRmlbXwzIPSnBzKQGJrYJ",
//     database: "railway",
//     port: 3306,
//   });
  
//   // ⁡⁢⁣⁢​‌‌‍𝗖𝗼𝗻𝗻𝗲𝗰𝘁 𝘁𝗼 𝗠𝘆𝗦𝗤𝗟​⁡
//   connection.connect((err) => {
//     if (err) {
//       console.error("Error connecting to MySQL:", err);
//       return;
//     }
//     console.log("Connected to MySQL");
//   });

//   export default connection;

import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// ⁡⁢⁣⁢​‌‌‍𝗖𝗿𝗲𝗮𝘁𝗲 𝗠𝘆𝗦𝗤𝗟 𝗰𝗼𝗻𝗻𝗲𝗰𝘁𝗶𝗼𝗻​⁡
const connection = mysql.createConnection({
  host: "b3tdu39gdn4mtiksgid7-mysql.services.clever-cloud.com", // Your Railway host address
  user: "ubbpzmfhyjefvaif",                              // Username for the database (default: root)
  password: "M6dCo9nnMFTJR03ifNY0", // Your Railway password
  database: "b3tdu39gdn4mtiksgid7",                       // The database name (default: railway)
  port: 3306,                               // Use the correct port (from Railway, 42172 here)
});

// ⁡⁢⁣⁢​‌‌‍𝗖𝗼𝗻𝗻𝗲𝗰𝘁 𝘁𝗼 𝗠𝘆𝗦𝗤𝗟​⁡
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database successfully!");
});

export default connection;

  
