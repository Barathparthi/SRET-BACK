
// Routes
// User Login
// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     if (!username || !password) {
//         return res.status(400).json({ message: 'Username and password are required.' });
//     }

//     const sql = 'SELECT * FROM users WHERE username = ?';
//     connection.query(sql, [username], async (error, results) => {
//         if (error) return res.status(500).json({ error });

//         if (results.length > 0) {
//             const comparison = await bcrypt.compare(password, results[0].password);
//             if (comparison) {
//                 const token = jwt.sign({ id: results[0].id }, 'your_jwt_secret', { expiresIn: '1h' });
//                 return res.json({ Status: true, token });
//             } else {
//                 return res.status(401).json({ Status: false, message: 'Incorrect password' });
//             }
//         } else {
//             return res.status(404).json({ Status: false, message: 'User not found' });
//         }
//     });
// });


import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connection from '../utils/db.js';

const app = express();

// Routes
// User Login
// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     if (!username || !password) {
//         return res.status(400).json({ message: 'Username and password are required.' });
//     }

//     const sql = 'SELECT * FROM login WHERE username = ?';
//     connection.query(sql, [username], async (error, results) => {
//         if (error) return res.status(500).json({ error });

//         if (results.length > 0) {
//             const hashedPassword = results[0].password;

//             // Compare the provided password with the hashed password stored in the database
//             bcrypt.compare(password, hashedPassword, async (err, comparison) => {
//                 if (err) {
//                     console.error('Error comparing passwords:', err);
//                     return res.status(500).json({ error: 'Internal Server Error' });
//                 }

//                 console.log('Comparison result:', comparison);

//                 if (comparison) {
//                     const token = jwt.sign({ id: results[0].id }, 'your_jwt_secret', { expiresIn: '1h' });
//                     return res.json({ Status: true, token });
//                 } else {
//                     return res.status(401).json({ Status: false, message: 'Incorrect password' });
//                 }
//             });
//         } else {
//             return res.status(404).json({ Status: false, message: 'User not found' });
//         }
//     });
// });


app.post("/login", (req, res) => {
    const sql = "SELECT * from login Where username = ? and password = ?";
    connection.query(sql, [req.body.username, req.body.password], (err, result) => {
      if (err) return res.json({ loginStatus: false, Error: "Query error" });
      if (result.length > 0) {
        const username = result[0].username;
        const token = jwt.sign(
          { role: "admin", username: username, id: result[0].id },
          "jwt_secret_key",
          { expiresIn: "1d" }
        );
        res.cookie('token', token)
        console.log(token);
        return res.json({ loginStatus: true });
      } else {
          return res.json({ loginStatus: false, Error:"wrong username or password" });
      }
    });
  });

// User Logout
app.get('/logout', (req, res) => {
    // Simulate logout success; you might want to actually blacklist the token or manage session state differently in production.
    res.json({ Status: true, message: 'Logged out successfully' });
});

// Profile Endpoint
app.get('/profile', (req, res) => {
    // Assuming you verify JWT token to fetch profile
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Failed to authenticate token.' });

        const sql = 'SELECT * FROM login WHERE id = ?';
        connection.query(sql, [decoded.id], (error, results) => {
            if (error) return res.status(500).json({ error });
            if (results.length > 0) {
                res.json({ user: results[0] });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        });
    });
});


app.post('/add_employee', (req, res) => {
    const sql = `INSERT INTO login (username,password) VALUES (?, ?)`;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        const values = [
            req.body.username,
            hash
        ]
        connection.query(sql, [values], (err, result) => {
            if(err) return res.json({Status: false, Error: err})
            return res.json({Status: true})
        })
    })
})

export { app as User };