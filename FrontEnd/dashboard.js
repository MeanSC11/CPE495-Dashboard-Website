document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("course_id");
    if (courseId) {
        await loadCourseInfo(courseId);
        await loadAttendance(courseId);
    } else {
        document.getElementById("courseTitle").innerText = "ไม่พบข้อมูลรายวิชา";
    }
});

async function loadCourseInfo(courseId) {
    try {
        const response = await fetch(`/api/course-info/${courseId}`);
        const courseData = await response.json();
        if (courseData.length === 0) {
            document.getElementById("courseTitle").innerText = "ไม่พบข้อมูลรายวิชา";
            return;
        }
        const { course_name, instructor, schedule, start_time, location_room } = courseData[0];
        document.getElementById("courseTitle").innerText = `${course_name} - อาจารย์ ${instructor}`;
        document.getElementById("scheduleInfo").innerText = `วันเรียน: ${schedule}, เวลา: ${start_time}, ห้อง: ${location_room}`;
    } catch (error) {
        console.error("Error loading course info:", error);
    }
}

async function loadAttendance(courseId) {
    try {
        const response = await fetch(`/api/attendance/${courseId}`);
        const students = await response.json();
        let tableHtml = "";
        students.forEach(student => {
            tableHtml += `<tr>
                <td>${student.student_id}</td>
                <td>${student.student_name}</td>
                <td>${student.status_student || "Absent"}</td>
            </tr>`;
        });
        document.getElementById("tableBody").innerHTML = tableHtml;
    } catch (error) {
        console.error("Error loading attendance:", error);
    }
}
