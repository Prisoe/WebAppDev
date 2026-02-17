// src/pages/public/About.jsx
import React, { useMemo, useState } from "react";

function TabButton({ active, onClick, children }) {
  return (
    <button
      className={"btn" + (active ? " primary" : "")}
      onClick={onClick}
      type="button"
      style={{ justifyContent: "center" }}
    >
      {children}
    </button>
  );
}

function List({ items }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 10 }}>
      {items.map((it) => (
        <li key={it.title}>
          <div style={{ fontWeight: 900, marginBottom: 4 }}>{it.title}</div>
          <div className="p" style={{ lineHeight: 1.7 }}>
            {it.detail}
          </div>
        </li>
      ))}
    </ul>
  );
}

function BulletList({ items }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
      {items.map((t, idx) => (
        <li key={`${t}-${idx}`} className="p" style={{ lineHeight: 1.7 }}>
          {t}
        </li>
      ))}
    </ul>
  );
}

export default function About() {
  const [tab, setTab] = useState("skills");

  const data = useMemo(() => {
    return {
      skills: [
        {
          title: "Machine Learning / GenAI",
          detail:
            "Supervised learning, evaluation, explainability (SHAP), embeddings, and RAG patterns for real-world systems.",
        },
        {
          title: "Full-Stack Engineering",
          detail:
            "React, Node/Express, REST APIs, auth + RBAC, admin tooling, and MongoDB-backed applications.",
        },
        {
          title: "Cloud / DevOps",
          detail:
            "CI/CD pipelines, containerization (Docker), environment management, deployment automation, AWS + Azure workflows.",
        },
      ],
      experience: [
        {
          title: "AI Automation + Support Engineering",
          detail:
            "Built internal tooling and AI-driven workflows to improve speed, consistency, and resolution quality.",
        },
        {
          title: "Fullstack Development + DevOps Work",
          detail:
            "API development, debugging, CI/CD workflows, multi-environment deployments, and cloud migration support.",
        },
      ],
      education: [
        {
          title: "Software Engineering (Bachelors) - (AI Focus)",
          detail:
            "Engineering Program track with practical labs in ML, deep learning, mobile development, and cloud engineering.",
        },
        {
          title: "Software Engineering Technology",
          detail:
            "Diploma from Harvard University Continuous School",
        },
        {
          title: "Mechanical Engineering Design",
          detail:
            "Advanced Diploma track in Mechanical Engineering Design using AutoCAD, SolidWorks, MasterCAM, etc.",
        },
        {
          title: "Continuous self-learning",
          detail:
            "I build end-to-end systems publicly and iterate quickly, with projects spanning ML APIs, RAG apps, and automation tooling.",
        },
      ],
    };
  }, []);

  const aboutBullets = useMemo(
    () => [
      "Developing ML classification systems with cross-validation, feature engineering, and explainability (SHAP).",
      "Designing GenAI applications using RAG, embeddings, and vector search (FAISS).",
      "Shipping ML APIs with Flask + Streamlit and integrating them into full-stack apps.",
      "Building automation tools and internal AI agents that improve workflow efficiency and service consistency.",
      "Deploying and operating systems with CI/CD pipelines, Docker, and cloud-native infrastructure (AWS/Azure).",
    ],
    []
  );

  const roles = useMemo(
    () => [
      "Machine Learning Engineer",
      "AI Engineer / GenAI Engineer",
      "Applied AI Developer",
      "ML Systems Engineer",
      "AI Platform Engineer",
      "Full-Stack AI Developer",
    ],
    []
  );

  return (
    <div className="container">
      <div style={{ display: "grid", gap: 16 }}>
        {/* Header */}
        <div>
          <div className="kicker">About</div>
          <h1 className="h1" style={{ marginTop: 8 }}>
            About Me
          </h1>

          <p className="p" style={{ maxWidth: 980, lineHeight: 1.8 }}>
            I’m an AI-focused Software Engineer specializing in machine learning
            systems, generative AI applications, and full-stack cloud
            architecture. My work sits at the intersection of data science,
            Fullstack application development, and AI system deployment.
            <br />
            <br />
            With hands-on experience in supervised learning, NLP, Time-series and forecasting models, ensemble modeling,
            deep learning, and Retrieval-Augmented Generation (RAG), I design and
            implement end-to-end pipelines that transform raw data into
            production-ready intelligence. I treat AI as a systems problem — not
            just a modeling problem — focusing on reliability, scalability,
            interpretability, and deployment readiness.
          </p>

          <div className="card" style={{ padding: 16, marginTop: 14, maxWidth: 980 }}>
            <div style={{ fontWeight: 950, marginBottom: 10 }}>Highlights</div>
            <BulletList items={aboutBullets} />
          </div>
        </div>

        {/* Tabs: skills/experience/education */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <TabButton active={tab === "skills"} onClick={() => setTab("skills")}>
              Skills
            </TabButton>
            <TabButton active={tab === "experience"} onClick={() => setTab("experience")}>
              Experience
            </TabButton>
            <TabButton active={tab === "education"} onClick={() => setTab("education")}>
              Education
            </TabButton>
          </div>

          <div style={{ marginTop: 14 }}>
            {tab === "skills" ? <List items={data.skills} /> : null}
            {tab === "experience" ? <List items={data.experience} /> : null}
            {tab === "education" ? <List items={data.education} /> : null}
          </div>
        </div>

        {/* Roles */}
        <div className="card" style={{ padding: 16 }}>
          <div className="kicker">Career</div>
          <div style={{ fontWeight: 950, fontSize: 18, marginTop: 6 }}>
            Roles I’m Targeting
          </div>
          <p className="p" style={{ marginTop: 8, lineHeight: 1.8, maxWidth: 980 }}>
            I’m focused on building and deploying intelligent systems that move
            from experimentation to production — especially in domains like
            automation, decision intelligence, education analytics, and AI SaaS.
          </p>

          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 10 }}>
            {roles.map((r) => (
              <span
                key={r}
                style={{
                  fontSize: 13,
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: "1px solid var(--border)",
                  background: "rgba(255,255,255,0.03)",
                  color: "var(--text)",
                  fontWeight: 700,
                }}
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* Resume */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontWeight: 950, marginBottom: 8 }}>Resume</div>
          <div className="p" style={{ lineHeight: 1.8 }}>
            View or download my latest resume (PDF).
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {/* IMPORTANT: must be /resume.pdf if file lives in frontend/public/resume.pdf */}
            <a className="btn primary" href="/resume.pdf" target="_blank" rel="noreferrer">
              Open Resume (PDF)
            </a>
            <a className="btn" href="/resume.pdf" download>
              Download
            </a>
          </div>

          <div className="p" style={{ marginTop: 12, opacity: 0.85 }}>
            
          </div>
        </div>
      </div>
    </div>
  );
}
