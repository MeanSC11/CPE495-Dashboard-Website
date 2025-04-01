document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("course");
    const scheduleId = urlParams.get("schedule");

    if (courseId && scheduleId) {
        loadDashboard(courseId, scheduleId);
    } else {
        document.getElementById("courseTitle").innerText = "ข้อมูลไม่ถูกต้อง";
    }
});

async function loadDashboard(courseId, scheduleId) {
    try {
        const courseResponse = await fetch(`/api/course-info/${courseId}`);
        const courseData = await courseResponse.json();
        
        const scheduleResponse = await fetch(`/api/schedules/${scheduleId}`);
        const scheduleData = await scheduleResponse.json();

        const courseTitle = document.getElementById("courseTitle");
        const scheduleInfo = document.getElementById("scheduleInfo");
        const tableBody = document.getElementById("tableBody");

        courseTitle.textContent = `รายวิชา: ${courseData.course_name}`;
        scheduleInfo.textContent = `วันเรียน: ${scheduleData.day_of_week}, เวลาเรียน: ${scheduleData.start_time}, ห้องเรียน: ${scheduleData.location_room}`;
        
        // ดึงข้อมูลการเข้าเรียนและแสดงในตาราง
        const attendanceResponse = await fetch(`/api/attendance/${scheduleId}`);
        const attendanceData = await attendanceResponse.json();

        attendanceData.forEach(student => {
            const row = document.createElement("tr");

            const studentIdCell = document.createElement("td");
            studentIdCell.textContent = student.Student_id;
            row.appendChild(studentIdCell);

            const nameCell = document.createElement("td");
            nameCell.textContent = `${student.first_name} ${student.last_name}`;
            row.appendChild(nameCell);

            const statusCell = document.createElement("td");
            statusCell.textContent = student.status_student || "Absent";
            row.appendChild(statusCell);

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading dashboard data:", error);
    }
}
