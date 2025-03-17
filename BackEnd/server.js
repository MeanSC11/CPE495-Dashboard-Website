require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sql, poolPromise } = require('./db');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../FrontEnd')));

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await poolPromise;
        console.log("Database Pool is ready");
    } catch (error) {
        console.error("Failed to initialize database pool:", error.message);
    }
})();

// ✅ เสิร์ฟหน้าเว็บ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../FrontEnd/index.html'));
});

app.get('/courses', (req, res) => {
    res.sendFile(path.join(__dirname, '../FrontEnd/courses.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../FrontEnd/dashboard.html'));
});

// ✅ API: ดึงรายวิชา
app.get('/api/courses', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT course_id, course_name FROM Courses");
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ API: ดึง Section ตามรายวิชา
app.get('/api/sections/:course_id', async (req, res) => {
    try {
        const { course_id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('course_id', sql.Int, course_id)
            .query(`
                SELECT course_id, day_of_week, start_time, location_room 
                FROM Schedules 
                WHERE course_id = @course_id
            `);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ API: ดึงรายชื่อนักเรียนที่ลงทะเบียนในรายวิชา
app.get('/api/students/:course_id', async (req, res) => {
    try {
        const { course_id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('course_id', sql.Int, course_id)
            .query(`
                SELECT S.Student_id, S.first_name, S.last_name
                FROM Students S
                JOIN Enrollments E ON S.Student_id = E.Student_id
                WHERE E.course_id = @course_id
            `);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ API: ดึงข้อมูลการเข้าเรียนของนักศึกษา
app.get('/api/attendance/:course_id', async (req, res) => {
    try {
        const { course_id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('course_id', sql.Int, course_id)
            .query(`
                SELECT S.Student_id, S.first_name, S.last_name, A.status_student
                FROM Students S
                JOIN Enrollments E ON S.Student_id = E.Student_id
                JOIN Attendance A ON E.enrollment_id = A.enrollment_id
                WHERE A.course_id = @course_id
            `);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ API: ดึงข้อมูลรายวิชา + ตารางเรียน
app.get('/api/course-info/:course_id', async (req, res) => {
    try {
        const { course_id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('course_id', sql.Int, course_id)
            .query(`
                SELECT C.course_name, 
                C.instructor, 
                S.day_of_week, 
                S.start_time, 
                S.location_room
                FROM Courses C
                JOIN Schedules S ON C.course_id = S.course_id
                WHERE C.course_id = @course_id
            `);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
