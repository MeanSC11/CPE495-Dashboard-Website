document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/api/courses");
        const courses = await response.json();
        const courseList = document.getElementById("courseList");

        courses.forEach(course => {
            const btn = document.createElement("button");
            btn.textContent = course.course_name;
            btn.onclick = () => {
                window.location.href = `dashboard.html?course_id=${course.course_id}`;
            };
            courseList.appendChild(btn);
        });
    } catch (error) {
        console.error("Error loading courses:", error);
    }
});
