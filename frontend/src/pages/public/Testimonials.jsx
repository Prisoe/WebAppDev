import React, { useMemo, useState } from "react";

function initials(name = "") {
  const parts = name.split("-")[0].trim().split(" ").filter(Boolean);
  const a = parts[0]?.[0] || "P";
  const b = parts[1]?.[0] || "A";
  return (a + b).toUpperCase();
}

function TestimonialCard({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="t-card">
      <header className="t-head">
        <div className="t-avatar" aria-hidden="true">
          {initials(item.name)}
        </div>

        <div className="t-meta">
          <div className="t-name">{item.name}</div>
          <div className="t-role">{item.role}</div>
        </div>

        {item.link ? (
          <a className="t-source" href={item.link} target="_blank" rel="noreferrer">
            Source
          </a>
        ) : null}
      </header>

      <div className={`t-body ${open ? "open" : ""}`}>
        <p className="t-text">“{item.text}”</p>
      </div>

      <footer className="t-foot">
        <button className="t-toggle" type="button" onClick={() => setOpen((v) => !v)}>
          {open ? "Show less" : "Read more"}
        </button>
      </footer>
    </article>
  );
}

export default function Testimonials() {
  const items = useMemo(
    () => [
      {
        name: "Ali Umar - Senior Software Engineer",
        role: "FullStack / Platform",
        text:
          "I had the privilege of managing Prosper Alabi during his time as a DevOps Technician and Junior Application Programmer at the Ministry of Children, Community and Social Services (MCCSS). Prosper’s exceptional ability to quickly learn, adapt, and deliver impactful solutions made him an invaluable member of the team. In his DevOps role, Prosper played a critical part in implementing and maintaining deployment scripts across multiple environments. Notably, prosper was able to utilize docker to containerize a web application and a Java Springboot backend. What truly set Prosper apart was his proactive approach and ability to contribute beyond his core responsibilities. He actively participated in team meetings, contributing innovative ideas that improved workflows and streamlined operations. His clear and effective communication skills ensured alignment across teams and helped resolve technical challenges swiftly. Prosper’s quick learning and analytical thinking were evident in how he rapidly adapted to new tools and processes. Whether it was configuring CI/CD pipelines with Jenkins or containerizing our applications.. Prosper consistently delivered high quality results with some supervision. His proactive mindset extended to problem-solving and collaboration, where he frequently anticipated potential roadblocks and proposed actionable solutions. Prosper's ability to think strategically while executing tactically made him a trusted resource within the team. I highly recommend Prosper Alabi for any role that values technical excellence, quick learning, and a proactive approach. His strong intuition, communication skills, and commitment to delivering results would make him a tremendous asset to any organization.",
        link: "https://www.linkedin.com/in/prosperalabi/",
      },
      {
        name: "Miguel Savard - Team Lead",
        role: "Engineering / Ops",
        text:
          "I had the pleasure of working closely with Prosper Alabi during his time as a Support Specialist at Shopify, where I directly supported and sponsored his growth and initiatives. From the beginning, Prosper distinguished himself not only through strong technical aptitude and merchant empathy, but through an exceptional level of ownership and passion for improving how we work. In his core role, Prosper supported merchants across a wide range of technical and operational issues, consistently delivering clear, thoughtful, and efficient resolutions. What truly set him apart, however, was his initiative beyond assigned responsibilities. Prosper independently began developing internal automation tools and AI-powered international support agents designed to streamline workflows, reduce repetitive tasks, and significantly improve response efficiency during live chats. These tools had a measurable impact: they reduced time spent per interaction, increased agent productivity, and improved overall service consistency. He was deeply invested in creating meaningful improvements for both merchants and support teams. As his Manager, I was able to witness firsthand his ability to take an idea from concept to real-world impact. Prosper was receptive to feedback, highly collaborative, and demonstrated sound judgment in balancing innovation with operational responsibility. His work ethic, curiosity, and drive made him a standout contributor within the team. Prosper brings together technical skill, business awareness, and genuine care for user experience. He would be an asset to any organization looking for someone who not only executes well, but actively looks for ways to improve systems at scale. I strongly recommend him and would gladly work with him again.",
        link: "https://www.linkedin.com/in/prosperalabi/",
      },
      {
        name: "Steven Rong - Backend/DevOps",
        role: "Operations",
        text:
          "It was a pleasure working with Prosper Alabi during his time at the Ministry of Children, Community and Social Services (MCCSS). As a co-op student, Prosper demonstrated a keen passion for software development and a strong aptitude for learning. He contributed to backend development using Java and Spring Boot, assisted with API testing using tools like Postman, and explored QA automation with frameworks such as Cypress and Selenium. Prosper also gained hands-on experience with CI/CD pipelines using Jenkins and containerization with Docker, showcasing a proactive approach to adopting DevOps practices. Beyond his technical contributions, Prosper brought enthusiasm, curiosity, and a collaborative spirit to the team, making a positive impact on both the projects and workplace culture.",
        link: "https://www.linkedin.com/in/prosperalabi/",
      },
      {
        name: "Morris Anthony - Software Developer",
        role: "Operations",
        text:
          "Prosper was amazing to work with and his contributions were pivotal for our teams success. He has a passionate problem solving mindset and is a fast learner, not afraid to find his own way across complicated work streams and product. He would be an asset to any team he joins.",
        link: "https://www.linkedin.com/in/prosperalabi/",
      },
    ],
    []
  );

  return (
    <div className="container">
      <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
        <div className="kicker">Recommendations</div>
        <h1 className="h1">Testimonials</h1>
        <p className="p">
          When you collect LinkedIn recommendations, paste them here (and optionally link them).
        </p>
      </div>

      <div className="t-grid">
        {items.map((it) => (
          <TestimonialCard key={it.name} item={it} />
        ))}
      </div>
    </div>
  );
}
