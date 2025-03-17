document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("course");

    if (!courseId) {
        alert("ไม่มีข้อมูลรายวิชา กรุณาเลือกใหม่");
        window.location.href = "/courses";
        return;
    }

    const courseTitle = document.getElementById("courseTitle");
    const scheduleInfo = document.getElementById("scheduleInfo");
    const tableBody = document.getElementById("tableBody");

    try {
        // 📌 ดึงข้อมูลรายวิชา
        const courseResponse = await fetch(`/api/course-info/${courseId}`);
        const courseData = await courseResponse.json();
        
        if (courseData.length === 0) {
            alert("ไม่พบข้อมูลรายวิชา");
            window.location.href = "/courses";
            return;
        }

        // 📌 ดึงข้อมูลนักศึกษา
        const studentResponse = await fetch(`/api/students/${courseId}`);
        const students = await studentResponse.json();

        // 📌 ดึงข้อมูลการเข้าเรียน
        const attendanceResponse = await fetch(`/api/attendance/${courseId}`);
        const attendanceData = await attendanceResponse.json();

        // ✅ แสดงชื่อรายวิชา และผู้สอน
        const { course_name, instructor, day_of_week, start_time, location_room } = courseData[0];
        courseTitle.textContent = `${course_name} - ${instructor}`;
        scheduleInfo.textContent = `วันเรียน: ${day_of_week}, เวลา: ${start_time}, ห้องเรียน: ${location_room}`;

        // ✅ เคลียร์ข้อมูลตารางก่อนเติมข้อมูลใหม่
        tableBody.innerHTML = "";

        students.forEach(student => {
            const row = document.createElement("tr");

            const studentIdCell = document.createElement("td");
            studentIdCell.textContent = student.Student_id;
            row.appendChild(studentIdCell);

            const nameCell = document.createElement("td");
            nameCell.textContent = `${student.first_name} ${student.last_name}`;
            row.appendChild(nameCell);

            const statusCell = document.createElement("td");
            const attendance = attendanceData.find(a => a.Student_id === student.Student_id);
            statusCell.textContent = attendance ? attendance.status_student : "Absent";
            row.appendChild(statusCell);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading data:", error);
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    }
});
