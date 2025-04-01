require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sql, poolPromise } = require('./db');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../FrontEnd')));

const PORT = process.env.PORT || 5001;

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

// ✅ API: ดึงรายชื่อและข้อมูลของนักศึกษาที่ลงทะเบียนในรายวิชา
app.get('/api/students/:course_id', async (req, res) => {
    try {
        const { course_id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('course_id', sql.NVarChar, course_id) // แก้ไขชนิดข้อมูลเป็น NVarChar เพื่อให้ตรงกับ course_id
            .query(`
                SELECT S.student_id, S.student_name
                FROM Students S
                JOIN Enrollment E ON S.student_id = E.student_id
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
            .input('course_id', sql.NVarChar, course_id) // ใช้ NVarChar สำหรับ course_id
            .query(`
                SELECT S.student_id, S.student_name, A.date_check, A.status_student
                FROM Attendance A
                JOIN Students S ON A.student_id = S.student_id
                WHERE A.course_id = @course_id
                ORDER BY A.date_check
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
            .input('course_id', sql.NVarChar, course_id) // ใช้ NVarChar สำหรับ course_id
            .query(`
                SELECT C.course_name, C.instructor, C.schedule, C.start_time, C.location_room
                FROM Courses C
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
