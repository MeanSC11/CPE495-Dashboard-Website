CREATE TABLE Students (        -- ข้อมูลนักเรียน
    Student_id INT PRIMARY KEY, -- รหัสนักเรียน
    first_name VARCHAR(50),   -- ชื่อนักเรียน
    last_name VARCHAR(50),    -- นามสกุล
    created_at DATETIME DEFAULT GETDATE(),       -- วันที่เพิ่มข้อมูล
    updated_at DATETIME DEFAULT GETDATE(),       -- วันที่เพิ่มข้อมูล
);

 DROP TABLE Students;
-- TRUNCATE TABLE Enrollments;
-- EXEC sp_columns Students;
INSERT INTO Students (student_id, first_name, last_name, updated_at)
VALUES  (65015916, 'Taradol', 'Mee-ammart', GETDATE()),
        (65012466, 'Marisa', 'Sumalee', GETDATE()),
        (65010808, 'Sujitra', 'Hunngam', GETDATE()),
        (65030464, 'Sarawut', 'pretprommart', GETDATE()),
        (65040153, 'Chayanont', 'Tuntanasuk', GETDATE()),
        (65043305, 'krittamet', 'Sanglao', GETDATE()),
        (65062264, 'Suttikran', 'Kawjun', GETDATE());

UPDATE Students
SET last_name = 'Kaewjun', updated_at = GETDATE()
WHERE Student_id = 65062264;

SELECT * FROM Students;


CREATE TABLE Courses (         -- ข้อมูลรายวิชา
    course_id INT PRIMARY KEY, -- รหัสรายวิชา
    course_name VARCHAR(100), -- ชื่อวิชา
    instructor VARCHAR(50),   -- ชื่อผู้สอน
    created_at DATETIME DEFAULT GETDATE(),       -- วันที่เพิ่มข้อมูล
    updated_at DATETIME DEFAULT GETDATE(),       -- วันที่เพิ่มข้อมูล
);

INSERT INTO Courses (course_id, course_name, instructor)
VALUES (4950101, 'CPE495-T-SEC001', 'Surachai Thongkaew'),
(4950102, 'CPE495-T-SEC002', 'Surachai Thongkaew'),
(4510101, 'CPE451-T-SEC001', 'Nimit Tuksavitayapong'),
(4510102, 'CPE451-T-SEC002', 'Nimit Tuksavitayapong'),
(4510201, 'CPE451-L-SEC001', 'Nimit Tuksavitayapong'),
(4510202, 'CPE451-L-SEC002', 'Nimit Tuksavitayapong'),
(4070101, 'CPE407-T-SEC001', 'Ekkalak Junchidfa'),
(4070102, 'CPE407-T-SEC002', 'Ekkalak Junchidfa'),
(4070201, 'CPE407-L-SEC001', 'Ekkalak Junchidfa'),
(4070202, 'CPE407-L-SEC002', 'Ekkalak Junchidfa');

--course_id = 495/01/01 495 รหัสวิชา/ 01 ทฤษฎี/ 01 sec001


SELECT * FROM Courses;

CREATE TABLE Enrollments (          -- การลงทะเบียนเรียน
    enrollment_id BIGINT PRIMARY KEY,  -- รหัสการลงทะเบียน
    Student_id INT,                 -- อ้างอิงนักเรียน
    course_id INT,                  -- อ้างอิงรายวิชา
    enrolled_at DATETIME DEFAULT GETDATE(),       -- วันที่ลงทะเบียน
    -- กำหนด FK
    FOREIGN KEY (Student_id) REFERENCES Students(Student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

INSERT INTO Enrollments (enrollment_id, Student_id, course_id)
VALUES 
(650124660202502, '65012466', 4950102),
(650159160202502, '65015916', 4950102),
(650108080202502, '65010808', 4950101),
(650304640202502, '65030464', 4950101),
(650401530202502, '65040153', 4950101),
(650433050202502, '65043305', 4950101),
(650622640202502, '65062264', 4950101);

--enrollment_id = 65012466/02025/02 
-- 65012466 รหัสนักศึกษา/ 02025 ปีที่ลง / 02 เทอม 2
SELECT * FROM Enrollments;

CREATE TABLE Schedules (         -- ตารางเรียน
    course_id INT PRIMARY KEY,   -- อ้างอิงรายวิชา
    day_of_week VARCHAR(20),    -- วันที่เรียน
    start_time TIME,             -- เวลาเริ่มเรียน
    location_room VARCHAR(20),        -- สถานที่เรียน
    CONSTRAINT FK_Enrollments_Courses FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

INSERT INTO Schedules(course_id, day_of_week, start_time, location_room)
VALUES 
(4950102, 'Wednesday', '15:00:00', '5-0406'),
(4950101, 'Tuesday', '15:00:00', '5-0603'),
(4510202, 'Friday', '12:00:00', '5-0901'),
(4510201, 'Friday', '9:00:00', '5-0901'),
(4510101, 'Wednesday', '13:00:00', '5-0901'),
(4510102, 'Wednesday', '15:00:00', '5-0604'),
(4070101, 'Thursday', '9:00:00', '5-0702'),
(4070102, 'Thursday', '11:00:00', '5-0702'),
(4070201, 'Thursday', '12:40:00', '5-0909'),
(4070202, 'Thursday', '15:10:00', '5-0909');

SELECT * FROM Schedules;

CREATE TABLE Attendance (
    attendance_id INT IDENTITY(1,1) PRIMARY KEY,  -- รหัสการเช็คชื่อ (Auto Increment)
    enrollment_id BIGINT,               -- อ้างอิงนักศึกษาในวิชานั้น
    course_id INT,                 -- อ้างอิงตารางเรียน
    status_student VARCHAR(10) DEFAULT 'Absent',  -- สถานะการเข้าเรียน ('Present', 'Late', 'Absent')
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),

    -- Foreign Keys
    FOREIGN KEY (enrollment_id) REFERENCES Enrollments(enrollment_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

INSERT INTO Attendance (enrollment_id, course_id)
VALUES 
(650124660202502, 4950102),
(650159160202502, 4950102),
(650108080202502, 4950101),
(650304640202502, 4950101),
(650433050202502, 4950101),
(650622640202502, 4950101);
INSERT INTO Attendance (enrollment_id, course_id)
VALUES 
(650401530202502, 4950101);

TRUNCATE TABLE Attendance;


SELECT * FROM Attendance;

CREATE TABLE FaceEncodings (
    Student_id INT PRIMARY KEY,      -- ใช้ Student_id เป็น PRIMARY KEY
    face_encoding VARBINARY(MAX),    -- เวกเตอร์ใบหน้าที่เข้ารหัส
    created_at DATETIME DEFAULT GETDATE(),       -- วันที่เพิ่มข้อมูล
    updated_at DATETIME DEFAULT GETDATE(),        -- วันที่เพิ่มข้อมูล
    CONSTRAINT FK_FaceEncodings_Students FOREIGN KEY (Student_id) REFERENCES Students(Student_id)
);
-- เพิ่มข้อมูลเวกเตอร์ใบหน้าสำหรับนักศึกษา
INSERT INTO FaceEncodings (Student_id, face_encoding)
VALUES 
(65015916, null),
(65012466, null),
(65010808, null),
(65030464, null),
(65040153, null),
(65043305, null),
(65062264, null);

SELECT * FROM FaceEncodings;

SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS;

-------------------------------------------
-------------------------------------------

-- ตารางเก็บข้อมูลนักศึกษา
CREATE TABLE Students (
    student_id INT PRIMARY KEY,         -- รหัสนักศึกษา (Primary Key)
    student_name NVARCHAR(50) NOT NULL,   -- ชื่อจริง
    face_embedding VARBINARY(MAX)       -- ข้อมูลใบหน้าสำหรับแสกน
);

INSERT into Students(student_id, student_name) VALUES
(65009974, N'ณัฐวุฒิ สังขกุล'),
(65010219, N'ธนภัทรศิริเทพ'),
(65010808, N'สุจิตรา หุ่นงาม' ),
(65012466, N'มาริสา สุมาลี' ),
(65015916, N'ชวภณ มีอำมาตย์'),
(65030464, N'สราวุฒิ เพ็ชรพรหมมาสตร์'),
(65040153, N'ชญานน์ ตัณธนสุข'),
(65043305, N'กฤตเมธ สังข์ลาว'),
(65062264, N'สุทธิกานต์ แก้วจันทร์');

DELETE FROM Students
WHERE student_id = 65012466;

SELECT * FROM Students
--------------------------------------------------------------------
-- ตารางเก็บข้อมูลรายวิชา
CREATE TABLE Courses (
    course_id NVARCHAR(20) PRIMARY KEY, -- รหัสวิชา (Primary Key)
    course_name NVARCHAR(100) NOT NULL, -- ชื่อวิชา
    instructor NVARCHAR(100) NOT NULL,  -- อาจารย์ผู้สอน
    schedule NVARCHAR(50) NOT NULL,     -- วันและเวลาที่เรียน
    start_time TIME NOT NULL,           -- เวลาที่เริ่มเรียน
    location_room NVARCHAR(20) NOT NULL -- ห้องเรียน
);

insert into Courses(course_id , course_name , instructor , schedule , start_time , location_room) VALUES
('CPE4510202' ,  'CPE451-L-SEC002' , N'นิมิตร ทักษวิทยาพงศ์', N'ศุกร์', '12:00:00' , '5-901'),
('CPE4510201' ,  'CPE451-L-SEC001' , N'นิมิตร ทักษวิทยาพงศ์', N'ศุกร์', '9:00:00' , '5-901');

SELECT * FROM Courses

-- course_id CPE451/02/02 CPE451 รายวิชา / 02 ปฏิบัติ , 01 ทฤษฎี / 02 SEC002 , 01 SEC001 
-------------------------------------------------------------------
CREATE TABLE Enrollment (
    student_id INT NOT NULL,       -- รหัสนักศึกษา
    course_id NVARCHAR(20) NOT NULL, -- รหัสวิชา
    PRIMARY KEY (student_id, course_id), -- กำหนดให้ student_id + course_id เป็น Primary Key
    FOREIGN KEY (student_id) REFERENCES Students(student_id), 
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

INSERT INTO Enrollment (student_id, course_id) VALUES
(65009974, 'CPE4510202'),
(65010219, 'CPE4510202'),
(65010808, 'CPE4510202'),
(65012466, 'CPE4510202'),
(65015916, 'CPE4510202'),
(65030464, 'CPE4510202'),
(65040153, 'CPE4510202'),
(65043305, 'CPE4510202'),
(65062264, 'CPE4510202');

DELETE FROM Enrollment
WHERE student_id = 65012466;

SELECT * FROM Enrollment
-------------------------------------------------------------------
-- ตารางเก็บข้อมูลการเช็คชื่อ
CREATE TABLE Attendance (
    course_id NVARCHAR(20) NOT NULL,    -- รหัสวิชาที่เช็คชื่อ
    student_id INT NOT NULL,            -- รหัสนักศึกษา
    date_check DATE NOT NULL,           -- วันที่เช็คชื่อ
    status_student NVARCHAR(10) DEFAULT 'Absent', -- สถานะการเข้าเรียน 
    PRIMARY KEY (student_id, course_id, date_check), -- ใช้ student_id + course_id + date_check เป็น Primary Key
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

DELETE FROM Attendance
WHERE student_id = 65012466;

insert into Attendance(course_id , student_id , date_check, status_student) VALUES
('CPE4510201' , 65015916, GETDATE(), 'Present')

insert into Attendance(course_id , student_id , date_check) VALUES
('CPE4510201' , 65040153, GETDATE())


-- ตารางเก็บใบหน้าที่ไม่รู้จัก
CREATE TABLE Unknown_Attendance (
    unknown_id INT IDENTITY(1,1) PRIMARY KEY, -- รหัสสำหรับบันทึกคนที่ไม่รู้จัก
    face_embedding VARBINARY(MAX) NOT NULL,  -- ข้อมูลใบหน้าที่ไม่รู้จัก
    date_check DATE NOT NULL,                -- วันที่ตรวจพบ
    location NVARCHAR(20) NOT NULL           -- ตำแหน่งที่ตรวจพบ
);

------------------------------------------------------
SELECT 
    s.student_id, 
    s.student_name,
    e.course_id, 
    c.course_name, 
    c.instructor, 
    c.schedule,
    c.start_time
FROM Enrollment e
JOIN Students s ON e.student_id = s.student_id
JOIN Courses c ON e.course_id = c.course_id
ORDER BY s.student_id;

SELECT 
    a.date_check,
    s.student_name,
    c.course_name,
    a.status_student
FROM Attendance a
JOIN Students s ON a.student_id = s.student_id
JOIN Courses c ON a.course_id = c.course_id
ORDER BY a.date_check, a.student_id;


------------------------------------------------------
SELECT * FROM Students
SELECT * FROM Courses
SELECT * FROM Enrollment
SELECT * FROM Attendance
SELECT * FROM Unknown_Attendance


SELECT COUNT(face_embedding) 
FROM Students
WHERE student_id = 65015916;

DELETE FROM Students;


DROP TABLE Unknown_Attendance
DROP TABLE Attendance
DROP TABLE Enrollment
DROP TABLE Courses
DROP TABLE Students