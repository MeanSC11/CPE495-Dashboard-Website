document.addEventListener("DOMContentLoaded", async () => {
    const courseList = document.getElementById("courseList");

    try {
        const response = await fetch("/api/courses");
        const courses = await response.json();

        courses.forEach(course => {
            const btn = document.createElement("button");
            btn.textContent = course.course_name;
            btn.onclick = async () => {
                const sectionResponse = await fetch(`/api/sections/${course.course_id}`);
                const sections = await sectionResponse.json();

                if (sections.length > 0) {
                    const section = sections[0];  // เลือก Section แรก
                    window.location.href = `/dashboard?course=${course.course_id}`;
                } else {
                    alert("ไม่มี Section สำหรับรายวิชานี้");
                }
            };
            courseList.appendChild(btn);
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
    }
});
