import express from "express";
import connection from "../utils/db.js";

const app = express()
let currentUserID = 1;

// ⁡⁢⁣⁢​‌‌‍𝗦𝗠 𝗠𝗮𝗽𝗽𝗶𝗻𝗴 𝗣𝗮𝗿𝘁 𝗦𝘁𝗮𝗿𝘁:​⁡
// Route to handle saving mentorship data
app.post('/smmapping/save', (req, res) => {
    const { selectedStudents, selectedStaff, selectedBatch, fromDate, toDate } = req.body;
    // Check if any of the selectedStudents already exist in the mentortable
    const existingStudentsQuery = `SELECT Student_id FROM mentortable WHERE Batch_id = ? AND Student_id IN (?)`;
    connection.query(existingStudentsQuery, [selectedBatch, selectedStudents], (err, existingStudents) => {
      if (err) {
        console.error('Error checking for existing mentorship data:', err);
        res.status(500).json({ error: 'An error occurred while checking for existing mentorship data' });
        return;
      }
      
      const existingStudentIds = existingStudents.map(student => student.Student_id);
      const newStudents = selectedStudents.filter(studentId => !existingStudentIds.includes(studentId));
  
      if (newStudents.length === 0) {
        // All selected students already exist, send back a conflict response
        res.status(409).json({ error: 'All selected students already exist in the mentorship data' });
        return;
      }
      // Insert only the new students into the database
      const sql = `INSERT INTO mentortable (Student_id, Staff_id, Batch_id, FromDt, ToDt, CreatedBy, ModifiedBy) VALUES ?`;
      const values = newStudents.map(studentId => [
        studentId,
        selectedStaff.id,
        selectedBatch,
        fromDate,
        '1990-01-01',
        currentUserID,
        currentUserID
      ]);
      connection.query(sql, [values], (err, result) => {
        if (err) {
          console.error('Error inserting mentorship data:', err);
          res.status(500).json({ error: 'An error occurred while saving mentorship data' });
          return;
        }
        console.log('Mentorship data saved successfully');
        res.status(200).json({ message: 'Mentorship data saved successfully' });
      });
    });
  });
  
  
  // app.get('/mentors', (req, res) => {
  //   // SQL query to fetch StaffCode and FirstName using a JOIN between mentortable and staff table
  //   const sql = `
  //     SELECT m.Student_id, s.StaffCode, s.FirstName
  //     FROM mentortable m
  //     INNER JOIN staff s ON m.Staff_id = s.id
  //   `;
  //   connection.query(sql, (err, results) => {
  //     if (err) {
  //       console.error('Error fetching default mentors:', err);
  //       res.status(500).json({ error: 'An error occurred while fetching default mentors' });
  //       return;
  //     }
  //     // Map the results to an array of objects containing studentId, StaffCode, and FirstName
  //     const mentors = results.map((row) => ({
  //       studentId: row.Student_id,
  //       staffCode: row.StaffCode,
  //       firstName: row.FirstName
  //     }));
  //     res.status(200).json(mentors);
  //   });
  // });
  
  app.put('/update', (req, res) => {
    const { selectedStudents, selectedStaff, selectedStaff1, selectedBatch, fromDate, toDate } = req.body;
    // Check if selectedStudents is defined and is an array
    if (!Array.isArray(selectedStudents)) {
      res.status(400).json({ error: 'Selected students should be an array' });
      return;
    }
    // Construct and execute separate update queries for each student
    selectedStudents.forEach(studentId => {
      // Update existing mentorship data
      const updateSql = `
        UPDATE mentortable 
        SET ToDt = ?, ModifiedBy = ? 
        WHERE Student_id = ? AND Batch_id = ? AND Staff_id = ?
      `;
  
      const fromDateForInsert = new Date(new Date(toDate).getTime() - (24 * 60 * 60 * 1000)); // One day before toDate
      const updateValues = [fromDateForInsert.toISOString().split('T')[0], 
                            currentUserID, 
                            studentId, 
                            selectedBatch, 
                            selectedStaff.id];
  
      connection.query(updateSql, updateValues, (updateErr, updateResult) => {
        if (updateErr) {
          console.error(`Error updating mentorship data for student ${studentId}:`, updateErr);
          return res.status(500).json({ error: `Error updating mentorship data for student ${studentId}` });
        }
        console.log(`Mentorship data updated successfully for student ${studentId}`);
      });
    });
    // Insert only the new students into the database
    const insertSql = `INSERT INTO mentortable (Student_id, Staff_id, Batch_id, FromDt, ToDt, CreatedBy, ModifiedBy) VALUES ?`;
    const insertValues = selectedStudents.map(studentId => {
      const fromDateForInsert = new Date(new Date(toDate).getTime() - (24 * 60 * 60 * 1000)); // One day before toDate
      return [
        studentId,
        selectedStaff1.id,
        selectedBatch,
        fromDate,
        // fromDateForInsert.toISOString().split('T')[0], // Format date as 'YYYY-MM-DD'
        '1990-01-01', // Default ToDt
        currentUserID,
        currentUserID
      ];
    });
  
    connection.query(insertSql, [insertValues], (insertErr, insertResult) => {
      if (insertErr) {
        console.error('Error inserting mentorship data:', insertErr);
        return res.status(500).json({ error: 'An error occurred while saving mentorship data' });
      }
      console.log('Mentorship data saved successfully');
      res.status(200).json({ message: 'Mentorship data saved successfully' });
    });
  });
  
  
  // Endpoint to fetch students based on batch ID and staff ID
  app.get('/students/:batchId/staff/:staffId', (req, res) => {
    const { batchId, staffId } = req.params; // Corrected variable names to match the route parameters
    // Prepare the SQL query
    const sql = `
      SELECT s.uid, s.FirstName 
      FROM student s 
      INNER JOIN mentortable m ON s.id = m.Student_id 
      WHERE m.Staff_id = ? AND m.Batch_id = ?
    `;
    // Execute the query with correct parameter order and removing unnecessary s.id = ? part
    connection.query(sql, [staffId, batchId], (err, results) => { // Correctly ordered placeholders to match query
      if (err) {
        console.error('Error fetching students:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(results); // This will return the fetched students
    });
  });
  // ⁡⁢⁣⁢​‌‌‍𝗦𝗠 𝗠𝗮𝗽𝗽𝗶𝗻𝗴 𝗣𝗮𝗿𝘁 𝗘𝗡𝗗....​⁡


export { app as Mentor };