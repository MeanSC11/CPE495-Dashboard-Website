document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    if (path.includes("courses.html")) {
        loadCourses();
    } else if (path.includes("dashboard.html")) {
        loadDashboard();
    }
});

async function loadCourses() {
    try {
        const response = await fetch("http://localhost:5000/courses");
        const courses = await response.json();

        let listHtml = '<h2>เลือกรายวิชา</h2><ul>';
        courses.forEach(course => {
            listHtml += `<li><button class="course" data-course="${course.course_id}">${course.course_name}</button></li>`;
        });
        listHtml += '</ul>';

        document.getElementById("courseList").innerHTML = listHtml;

        document.querySelectorAll(".course").forEach(button => {
            button.addEventListener("click", selectCourse);
        });
    } catch (error) {
        console.error("Error loading courses:", error);
    }
}

async function selectCourse(event) {
    const courseId = event.target.getAttribute("data-course");

    try {
        const response = await fetch(`http://localhost:5000/schedules/${courseId}`);
        const sections = await response.json();

        let listHtml = '<h2>เลือก Section</h2><ul>';
        sections.forEach(sec => {
            listHtml += `<li><button class="section" data-course="${courseId}" data-schedule="${sec.schedule_id}">SEC${sec.schedule_id}</button></li>`;
        });
        listHtml += '</ul>';

        document.getElementById("sectionList").innerHTML = listHtml;
        document.getElementById("sectionList").style.display = "block";

        document.querySelectorAll(".section").forEach(button => {
            button.addEventListener("click", selectSection);
        });
    } catch (error) {
        console.error("Error loading sections:", error);
    }
}

function selectSection(event) {
    const courseId = event.target.getAttribute("data-course");
    const scheduleId = event.target.getAttribute("data-schedule");

    window.location.href = `dashboard.html?course=${courseId}&schedule=${scheduleId}`;
}

async function loadDashboard() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("course");
    const scheduleId = urlParams.get("schedule");

    if (courseId && scheduleId) {
        await loadCourseInfo(courseId);
        await loadAttendance(scheduleId);
    } else {
        document.getElementById("courseTitle").innerText = "Invalid Course or Section";
    }
}

async function loadCourseInfo(courseId) {
    try {
        const response = await fetch(`http://localhost:5000/course/${courseId}`);
        const course = await response.json();

        document.getElementById("courseTitle").innerText = `${course.course_name} SEC${course.course_id}`;
        document.getElementById("instructorName").innerText = `อาจารย์ผู้สอน: ${course.instructor}`;
    } catch (error) {
        console.error("Error loading course info:", error);
    }
}

async function loadAttendance(scheduleId) {
    try {
        const response = await fetch(`http://localhost:5000/attendance/${scheduleId}`);
        const students = await response.json();

        let tableHtml = "";
        students.forEach(student => {
            tableHtml += `<tr>
                <td>${student.Student_id}</td>
                <td>${student.first_name} ${student.last_name}</td>
                <td>${student.checkin_status}</td>
            </tr>`;
        });
        document.getElementById("tableBody").innerHTML = tableHtml;
    } catch (error) {
        console.error("Error loading attendance:", error);
    }
}