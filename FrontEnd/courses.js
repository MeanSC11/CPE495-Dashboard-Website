document.addEventListener("DOMContentLoaded", async () => {
    const courseList = document.getElementById("courseList");
    const sectionList = document.getElementById("sectionList");

    try {
        // 📌 ดึงข้อมูลรายวิชา
        const response = await fetch("/api/courses");
        const courses = await response.json();

        courses.forEach(course => {
            const btn = document.createElement("button");
            btn.textContent = course.course_name;
            btn.onclick = async () => {
                sectionList.innerHTML = "";  // ล้างข้อมูลเก่า
                const sectionResponse = await fetch(`/api/schedules/${course.course_id}`);
                const sections = await sectionResponse.json();

                if (sections.length > 0) {
                    sectionList.style.display = "flex";
                    sections.forEach(section => {
                        const secBtn = document.createElement("button");
                        secBtn.textContent = `SEC ${section.schedule_id}`;
                        secBtn.onclick = () => {
                            // ➡️ เปลี่ยนหน้าไปที่ Dashboard พร้อมแนบค่า course_id และ schedule_id
                            window.location.href = `dashboard.html?course=${course.course_id}&schedule=${section.schedule_id}`;
                        };
                        sectionList.appendChild(secBtn);
                    });
                } else {
                    alert("ไม่มี Section สำหรับรายวิชานี้");
                    sectionList.style.display = "none";
                }
            };
            courseList.appendChild(btn);
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
    }
});
