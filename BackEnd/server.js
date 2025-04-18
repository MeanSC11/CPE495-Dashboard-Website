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
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../FrontEnd/index.html')));
app.get('/courses', (req, res) => res.sendFile(path.join(__dirname, '../FrontEnd/courses.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, '../FrontEnd/dashboard.html')));

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

// ✅ API: ดึงรายชื่อนักศึกษาที่ลงทะเบียนในรายวิชา
app.get('/api/students/:course_id', async (req, res) => {
    try {
        const { course_id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('course_id', sql.NVarChar, course_id)
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

// ✅ API: ดึงข้อมูลการเข้าเรียน
app.get('/api/attendance/:course_id', async (req, res) => {
    try {
        const { course_id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('course_id', sql.NVarChar, course_id)
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
            .input('course_id', sql.NVarChar, course_id)
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

// ✅ API: ดึงข้อมูลการเข้าเรียน 15 ครั้งล่าสุดจาก Attendance
app.get('/api/attendance-history/:course_id', async (req, res) => {
    try {
        const { course_id } = req.params;
        const pool = await poolPromise;

        const query = `
            WITH RankedAttendance AS (
                SELECT 
                    A.student_id, 
                    S.student_name,
                    A.status_student,
                    ROW_NUMBER() OVER (PARTITION BY A.student_id ORDER BY A.date_check DESC) AS session_number
                FROM Attendance A
                JOIN Students S ON A.student_id = S.student_id
                WHERE A.course_id = @course_id
            )
            SELECT 
                S.student_id, S.student_name,
                MAX(CASE WHEN session_number = 1 THEN status_student END) AS attendance_1,
                MAX(CASE WHEN session_number = 2 THEN status_student END) AS attendance_2,
                MAX(CASE WHEN session_number = 3 THEN status_student END) AS attendance_3,
                MAX(CASE WHEN session_number = 4 THEN status_student END) AS attendance_4,
                MAX(CASE WHEN session_number = 5 THEN status_student END) AS attendance_5,
                MAX(CASE WHEN session_number = 6 THEN status_student END) AS attendance_6,
                MAX(CASE WHEN session_number = 7 THEN status_student END) AS attendance_7,
                MAX(CASE WHEN session_number = 8 THEN status_student END) AS attendance_8,
                MAX(CASE WHEN session_number = 9 THEN status_student END) AS attendance_9,
                MAX(CASE WHEN session_number = 10 THEN status_student END) AS attendance_10,
                MAX(CASE WHEN session_number = 11 THEN status_student END) AS attendance_11,
                MAX(CASE WHEN session_number = 12 THEN status_student END) AS attendance_12,
                MAX(CASE WHEN session_number = 13 THEN status_student END) AS attendance_13,
                MAX(CASE WHEN session_number = 14 THEN status_student END) AS attendance_14,
                MAX(CASE WHEN session_number = 15 THEN status_student END) AS attendance_15,
                100 - ((SUM(CASE WHEN status_student = 'Absent' THEN 1 ELSE 0 END) + 
                        FLOOR(SUM(CASE WHEN status_student = 'Late' THEN 1 ELSE 0 END) /3)) * 100.0 / 15) 
                AS attendance_percentage
            FROM RankedAttendance R
            JOIN Students S ON R.student_id = S.student_id
            GROUP BY S.student_id, S.student_name
            ORDER BY S.student_id;
        `;

        const result = await pool.request()
            .input('course_id', sql.NVarChar, course_id)
            .query(query);

        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ✅ Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

