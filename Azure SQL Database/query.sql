-- ตารางเก็บข้อมูลนักศึกษา
CREATE TABLE Students (
    student_id INT PRIMARY KEY,         -- รหัสนักศึกษา (Primary Key)
    student_name NVARCHAR(50) NOT NULL,   -- ชื่อจริง
    face_embedding VARBINARY(MAX)       -- ข้อมูลใบหน้าสำหรับแสกน
);

INSERT into Students(student_id, student_name) VALUES
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
('CPE4510202' ,  'CPE451-L-SEC002' , N'นิมิตร ทักษวิทยาพงศ์', N'วันศุกร์', '12:00:00' , '5-901'),
('CPE4510201' ,  'CPE451-L-SEC001' , N'นิมิตร ทักษวิทยาพงศ์', N'วันศุกร์', '9:00:00' , '5-901');

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
('CPE4510202' , 65012466, GETDATE(), 'Present'),
('CPE4510202', 65030464, GETDATE(), 'Late')

insert into Attendance(course_id , student_id , date_check) VALUES
('CPE4510202' , 65043305, GETDATE())


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

-----------------------------------
-- CPE495 

CREATE TABLE UserApp (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    user_name NVARCHAR(100),
    user_email NVARCHAR(100) UNIQUE,
    user_phone NVARCHAR(20),
    user_password NVARCHAR(255)   
);

SELECT * FROM UserApp