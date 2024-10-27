import express from "express";
import connection from "../utils/db.js";

const app = express()


// Route to fetch roles
app.get('/roles', (req, res) => {
    connection.query('SELECT id, name FROM role', (err, results) => {
      if (err) {
        console.error('Error fetching roles:', err);
        res.status(500).json({ error: 'Failed to fetch roles' });
      } else {
        res.json(results);
      }
    });
  });
  
  // Route to fetch sub_menus for a specific role
  app.get('/menus/:roleId', (req, res) => {
    const { roleId } = req.params;
    connection.query(
      `SELECT sm.id, sm.menuname, mm.enable
       FROM sub_menu sm
       LEFT JOIN menu_mapping mm ON sm.id = mm.submenu_id AND mm.role_id = ?
       ORDER BY sm.menuname`,
      [roleId],
      (err, results) => {
        if (err) {
          console.error('Error fetching menu items:', err);
          res.status(500).json({ error: 'Failed to fetch menu items' });
        } else {
          res.json(results);
        }
      }
    );
  });
  
  // // Route to update enable field in menumapping table
  // app.post('/update-enable', (req, res) => {
  //   const { submenu_id, role_id, enable } = req.body;
  //   connection.query(
  //     `INSERT INTO menu_mapping (submenu_id, role_id, enable) VALUES (?, ?, ?)
  //      ON DUPLICATE KEY UPDATE enable = ?`,
  //     [submenu_id, role_id, enable, enable],
  //     (err) => {
  //       if (err) {
  //         console.error('Error updating enable field:', err);
  //         res.status(500).json({ error: 'Failed to update enable field' });
  //       } else {
  //         res.json({ message: 'Enable field updated successfully' });
  //       }
  //     }
  //   );
  // })

  app.post('/update-enable', (req, res) => {
    const { submenu_id, role_id, enable } = req.body;
  
    // Check if the combination of submenu_id and role_id already exists
    connection.query(
      'SELECT * FROM menu_mapping WHERE submenu_id = ? AND role_id = ?',
      [submenu_id, role_id],
      (err, results) => {
        if (err) {
          console.error('Error checking for existing entry:', err);
          return res.status(500).json({ error: 'Failed to check existing entry' });
        }
  
        if (results.length > 0) {
          // Entry exists, so we update the enable field
          connection.query(
            'UPDATE menu_mapping SET enable = ? WHERE submenu_id = ? AND role_id = ?',
            [enable, submenu_id, role_id],
            (err) => {
              if (err) {
                console.error('Error updating enable field:', err);
                return res.status(500).json({ error: 'Failed to update enable field' });
              }
              res.json({ message: 'Enable field updated successfully' });
            }
          );
        } else {
          // Entry does not exist, so we insert a new row
          connection.query(
            'INSERT INTO menu_mapping (submenu_id, role_id, enable) VALUES (?, ?, ?)',
            [submenu_id, role_id, enable],
            (err) => {
              if (err) {
                console.error('Error inserting new entry:', err);
                return res.status(500).json({ error: 'Failed to insert new entry' });
              }
              res.json({ message: 'New entry inserted successfully' });
            }
          );
        }
      }
    );
  });


  app.post('/getMenu', (req, res) => {
    const { roleId } = req.body;
  
    // If role_id is 7, fetch all menu items
    let query = `
      SELECT sub_menu.url, sub_menu.smenu 
      FROM sub_menu
    `;
  
    // Otherwise, fetch only enabled menu items for the specific role
    if (roleId !== 7) {
      query = `
        SELECT sub_menu.url, sub_menu.smenu 
        FROM menu_mapping
        JOIN sub_menu ON menu_mapping.submenu_id = sub_menu.id
        WHERE menu_mapping.role_id = ? AND menu_mapping.enable = 1
      `;
    }
  
    // Execute the query
    connection.query(query, [roleId !== 7 ? roleId : null], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Database query error' });
      }
      res.json(results);
    });
  });
  
  

  // app.post('/update-enable', (req, res) => {
  //   const { submenu_id, role_id, enable } = req.body;
  
  //   // Query to insert or update based on unique constraint
  //   connection.query(
  //     `INSERT INTO menu_mapping (submenu_id, role_id, enable) 
  //      VALUES (?, ?, ?)
  //      ON DUPLICATE KEY UPDATE enable = ?`,
  //     [submenu_id, role_id, enable, enable],
  //     (err, results) => {
  //       if (err) {
  //         console.error('Error updating enable field:', err);
  //         res.status(500).json({ error: 'Failed to update enable field' });
  //       } else {
  //         res.json({
  //           message: 'Enable field updated successfully',
  //           affectedRows: results.affectedRows,
  //         });
  //       }
  //     }
  //   );
  // });
  



export { app as Attendance };