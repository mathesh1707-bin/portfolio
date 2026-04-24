function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    const icon = document.getElementById("toast-icon");
    const msg = document.getElementById("toast-msg");

    icon.textContent = type === "success" ? "✔" : "✖";
    msg.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
const projects = [
    {
        title: "URL Shortener",
        description: "Built a full-stack URL shortener that generates unique short links and handles redirection efficiently.",
        tech: "Spring-Boot, MySQL",
        github: "https://github.com/mathesh1707-bin/sageurl-shortener"
    },
    {
        title: "MS Driving School Website",
        description: "Developed a responsive website for a driving school with service details, contact features, and user-friendly design.",
        tech: "HTML, CSS, JavaScript",
        github: "https://github.com/mathesh1707-bin/Driving_School_Website"
    }
];

const projectList = document.getElementById("project-list");

projects.forEach(p => {
    const div = document.createElement("div");
    div.className = "project-card";
    div.innerHTML = `
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <small>${p.tech}</small><br>
        <a href="${p.github}" target="_blank">View Code</a>
    `;
    projectList.appendChild(div);
});

// Scroll animation — skip .hero (already visible)
const sections = document.querySelectorAll("section:not(.hero)");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.15 });

sections.forEach(sec => observer.observe(sec));

// Active nav highlight
const navLinks = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {
    let current = "";
    document.querySelectorAll("section").forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 100) {
            current = sec.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});

// Smooth scroll on nav click
document.querySelectorAll("nav ul li a").forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").slice(1);
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contact-form");

    console.log("Form:", form); // should NOT be null

    form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");

    const formData = {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value
    };

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
        const res = await fetch("http://localhost:5000/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (data.success) {
            showToast("Message sent! I'll get back to you soon.", "success");
            form.reset();
        } else {
            showToast("Something went wrong. Please try again.", "error");
        }

    } catch (err) {
        console.log(err);
        showToast("Couldn't reach the server. Please try again.", "error");
    } finally {
        submitBtn.textContent = "Send";
        submitBtn.disabled = false;
    }
});
});