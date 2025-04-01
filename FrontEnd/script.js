document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    if (path.includes("courses.html")) loadCourses();
    else if (path.includes("dashboard.html")) loadDashboard();
});

async function loadCourses() {
    try {
        const response = await fetch("/api/courses");
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

function selectCourse(event) {
    const courseId = event.target.getAttribute("data-course");
    window.location.href = `dashboard.html?course_id=${courseId}`;
}
