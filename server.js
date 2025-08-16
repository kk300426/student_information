// backend/server.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "crud"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL database");
});

// 📌 Get all students
app.get("/", (req, res) => {
    db.query("SELECT * FROM student", (err, data) => {
        if (err) return res.status(500).json("Error fetching students");
        return res.json(data);
    });
});

// 📌 Get a single student by ID
app.get("/student/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM student WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("Error fetching student:", err);
            return res.status(500).json({ message: "Error fetching student" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json(result[0]);
    });
});

// 📌 Create a new student
app.post("/create", (req, res) => {
    const sql = "INSERT INTO student (Name, Email) VALUES (?)";
    const values = [req.body.name, req.body.email];
    db.query(sql, [values], (err) => {
        if (err) {
            console.error("Error inserting student:", err);
            return res.status(500).json("Error inserting data");
        }
        return res.json({ message: "Student added successfully" });
    });
});

// 📌 Update a student by ID
app.put("/update/:id", (req, res) => {
    const sql = "UPDATE student SET `Name` = ?, `Email` = ? WHERE id = ?";
    const values = [req.body.name, req.body.email];
    const id = req.params.id;
    db.query(sql, [...values, id], (err) => {
        if (err) {
            console.error("Error updating student:", err);
            return res.status(500).json("Error updating student");
        }
        return res.json({ message: "Student updated successfully" });
    });
});

// 📌 Delete a student by ID
app.delete("/student/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM student WHERE id = ?", [id], (err) => {
        if (err) {
            console.error("Error deleting student:", err);
            return res.status(500).json({ message: "Error deleting student" });
        }
        return res.json({ message: `Student with ID ${id} deleted successfully` });
    });
});

app.listen(8081, () => {
    console.log("🚀 Server running on http://localhost:8081/");
});
