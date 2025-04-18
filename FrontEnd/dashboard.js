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
        // แยกวันที่ออก เหลือแค่เวลา
        const timeOnly = start_time.split("T")[1].substring(0, 5);
        document.getElementById("courseTitle").innerText = `${course_name} - อาจารย์ ${instructor}`;
        document.getElementById("scheduleInfo").innerText = `วันเรียน: ${schedule}, เวลา: ${timeOnly} น., ห้อง: ${location_room}`;

    } catch (error) {
        console.error("Error loading course info:", error);
    }
}

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

async function loadAttendance(courseId) {
    try {
        const response = await fetch(`/api/attendance-history/${courseId}`);
        const students = await response.json();
        let tableHtml = "";

        students.forEach(student => {
            let rowHtml = `<tr>
                <td>${student.student_id}</td>
                <td>${student.student_name}</td>`;

            // ✅ แสดงข้อมูลการเข้าเรียน 15 ครั้ง
            for (let i = 1; i <= 15; i++) {
                let status = student[`attendance_${i}`] || "N/A";
                let statusClass = getStatusClass(status);
                rowHtml += `<td class="${statusClass}">${status}</td>`;
            }

            // ✅ เพิ่มเปอร์เซ็นต์การเข้าเรียน
            const percentage = student.attendance_percentage !== null 
                ? student.attendance_percentage.toFixed(2) + "%" 
                : "0.00%";
            rowHtml += `<td>${percentage}</td></tr>`;

            tableHtml += rowHtml;
        });

        document.getElementById("tableBody").innerHTML = tableHtml;
    } catch (error) {
        console.error("Error loading attendance history:", error);
    }
}

// ✅ ฟังก์ชันกำหนดสีตามสถานะเข้าเรียน
function getStatusClass(status) {
    switch (status) {
        case "Present": return "present";
        case "Late": return "late";
        case "Absent": return "absent";
        default: return "";
    }
}



