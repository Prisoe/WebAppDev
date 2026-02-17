// src/pages/public/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../../lib/api.js";

function SectionTitle({ kicker, title, desc }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {kicker ? <div className="kicker">{kicker}</div> : null}
      <h2 className="h1" style={{ fontSize: 34, margin: 0 }}>
        {title}
      </h2>
      {desc ? (
        <p className="p" style={{ maxWidth: 950, margin: 0 }}>
          {desc}
        </p>
      ) : null}
    </div>
  );
}

function Card({ title, children, right }) {
  return (
    <div className="card" style={{ padding: 16, height: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ fontWeight: 900 }}>{title}</div>
        {right ? <div>{right}</div> : null}
      </div>
      <div className="p" style={{ marginTop: 10 }}>
        {children}
      </div>
    </div>
  );
}

function Metric({ value, label }) {
  return (
    <div className="card" style={{ padding: 14, display: "grid", gap: 6 }}>
      <div style={{ fontWeight: 950, fontSize: 18 }}>{value}</div>
      <div className="p" style={{ margin: 0 }}>
        {label}
      </div>
    </div>
  );
}

function clampText(text = "", max = 170) {
  const t = String(text).replace(/\s+/g, " ").trim();
  if (!t) return "";
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "…";
}

function Chip({ children }) {
  return (
    <span
      style={{
        fontSize: 12,
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid var(--border)",
        background: "rgba(255,255,255,0.03)",
        color: "var(--muted)",
      }}
    >
      {children}
    </span>
  );
}

function ProjectPreviewCard({ p }) {
  const title = p?.title || "Project";

  // Prefer shortDescription if you add it later in Mongo; otherwise use description
  const summary = clampText(
    p?.shortDescription || p?.summary || p?.description || "",
    170
  );

  // Schema uses techStack, but support tags too
  const stack = Array.isArray(p?.techStack)
    ? p.techStack
    : Array.isArray(p?.tags)
    ? p.tags
    : [];

  const chips = [
    ...(p?.category ? [p.category] : []),
    ...stack.slice(0, 4),
  ].filter(Boolean);

  return (
    <div className="card" style={{ padding: 16, display: "grid", gap: 12 }}>
      <div
        style={{
          height: 120,
          borderRadius: 14,
          border: "1px solid var(--border)",
          background:
            "radial-gradient(700px 260px at 15% 10%, rgba(255,0,79,0.22), transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {p?.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>{title}</div>
        <p
          className="p"
          style={{
            margin: 0,
            color: "var(--muted)",
            lineHeight: 1.55,
          }}
        >
          {summary || "Short summary coming soon."}
        </p>
      </div>

      {chips.length ? (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {chips.map((c) => (
            <Chip key={`${title}-${c}`}>{c}</Chip>
          ))}
        </div>
      ) : null}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link className="btn primary" to="/projects">
          Details
        </Link>

        {p?.githubUrl ? (
          <a className="btn" href={p.githubUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
        ) : null}

        {p?.demoUrl ? (
          <a className="btn" href={p.demoUrl} target="_blank" rel="noreferrer">
            Demo
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [projectsErr, setProjectsErr] = useState("");

  // Pull published projects (if backend is running). If it fails, fall back to local featured.
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setProjectsErr("");
        const data = await apiGet("/api/projects");
        const list = Array.isArray(data?.projects) ? data.projects : [];
        if (mounted && list.length) setFeatured(list.slice(0, 3));
      } catch (e) {
        if (mounted) setProjectsErr(e?.message || "Failed to load projects");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const fallbackFeatured = useMemo(
    () => [
      {
        title: "Student Success Prediction App",
        shortDescription:
          "Predicts at-risk students early using supervised ML, explainability, and a deployed web interface for real-time scoring.",
        category: "ML",
        techStack: ["Python", "scikit-learn", "SHAP", "Streamlit"],
        githubUrl: "https://github.com/Prisoe",
        demoUrl: "",
        imageUrl: "",
      },
      {
        title: "Toronto KSI Accident Severity Model",
        shortDescription:
          "Collision severity classification with feature engineering, robust validation, and interpretable outputs for decision support.",
        category: "ML",
        techStack: ["Pandas", "XGBoost", "Random Forest", "SHAP"],
        githubUrl: "https://github.com/Prisoe",
        demoUrl: "",
        imageUrl: "",
      },
      {
        title: "Voice Journaling RAG App",
        shortDescription:
          "Audio → transcription → embeddings + retrieval so users can query personal journals like a chatbot.",
        category: "GenAI",
        techStack: ["AWS", "OpenAI", "FAISS", "DynamoDB"],
        githubUrl: "https://github.com/Prisoe",
        demoUrl: "",
        imageUrl: "",
      },
    ],
    []
  );

  const featuredToShow = featured.length ? featured : fallbackFeatured;

  return (
    <div className="container" style={{ display: "grid", gap: 18 }}>
      {/* HERO */}
      <div
        className="card"
        style={{
          padding: 22,
          borderRadius: 18,
          background:
            "radial-gradient(740px 340px at 20% 10%, rgba(255,0,79,0.22), transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
        }}
      >
        <div style={{ display: "grid", gap: 10 }}>
          <div className="kicker">Portfolio</div>

          <div
            style={{
              display: "flex",
              gap: 14,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Logo in public/logo.png */}
            <img
              src="/logo.png"
              alt="Prosper Alabi Logo"
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                border: "1px solid var(--border)",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            <h1 className="h1" style={{ margin: 0 }}>
              Prosper Alabi
            </h1>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 900, fontSize: 18, lineHeight: 1.35 }}>
              Certified AWS ML Associate - AI Engineer Building Production-Ready Machine Learning & GenAI
              Systems
            </div>
            <p className="p" style={{ margin: 0, maxWidth: 880 }}>
              From model development to cloud deployment — I design scalable ML
              systems, RAG applications, and automation platforms that move from
              experimentation to production.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
            <Link className="btn primary" to="/projects">
              View Projects
            </Link>
            <Link className="btn" to="/contact">
              Work With Me
            </Link>
            <a className="btn" href="/resume.pdf" target="_blank" rel="noreferrer">
              Resume
            </a>
            <a
              className="btn"
              href="https://www.linkedin.com/in/prosperalabi/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a className="btn" href="https://github.com/Prisoe" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* WHAT I BUILD */}
      <div style={{ display: "grid", gap: 16 }}>
        <SectionTitle
          kicker="Focus"
          title="What I Build"
          desc="I approach AI as a systems problem — building reliable pipelines, deployable services, and user-facing products with real-world constraints."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          <Card title="Production ML Systems">
            End-to-end supervised learning pipelines: data prep, feature engineering, model selection,
            evaluation, explainability (e.g., SHAP), and deployment as APIs.
          </Card>

          <Card title="GenAI & RAG Applications">
            Embeddings + vector search + retrieval-augmented generation, prompt/agent design, and guardrails
            for safe, consistent outputs.
          </Card>

          <Card title="Cloud-Native AI Architecture">
            AWS/Azure deployments, CI/CD, containerization, environment management, and observability to keep
            AI systems stable in production.
          </Card>

          <Card title="Intelligent Automation">
            Internal tools and AI assistants that reduce repetitive work, improve response quality, and speed
            up operational workflows.
          </Card>
        </div>
      </div>

      {/* IMPACT METRICS */}
      <div style={{ display: "grid", gap: 16 }}>
        <SectionTitle
          kicker="Impact"
          title="Results I Care About"
          desc="I prioritize measurable outcomes — speed, quality, reliability, and decision support."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          <Metric value="75%+" label="Improved resolution via AI support agents (internal tooling)" />
          <Metric value="30 min" label="Reduced average handling time per ticket with automation" />
          <Metric value="200%+" label="Efficiency gain through workflow tooling + LLM triage prototype" />
          <Metric value="E2E" label="Built full-stack ML systems: data → model → API → UI → deployment" />
        </div>
      </div>

      {/* FEATURED PROJECTS */}
      <div style={{ display: "grid", gap: 16 }}>
        <SectionTitle
          kicker="Portfolio"
          title="Featured Projects"
          desc="A few representative builds — ML systems, GenAI apps, and production-oriented tooling."
        />

        {projectsErr ? (
          <div className="card" style={{ padding: 14, borderColor: "rgba(255,0,79,0.35)" }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Projects preview not connected</div>
            <div className="p" style={{ margin: 0 }}>
              {projectsErr}. Showing fallback featured cards.
            </div>
          </div>
        ) : null}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {featuredToShow.map((p) => (
            <ProjectPreviewCard key={p._id || p.title} p={p} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="btn primary" to="/projects">
            Browse All Projects
          </Link>
          <Link className="btn" to="/services">
            See Services
          </Link>
        </div>
      </div>

      {/* CURRENT FOCUS + QUICK LINKS */}
      <div style={{ display: "grid", gap: 16 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Currently Focused On</div>
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
              <li>
                <div style={{ fontWeight: 800 }}>ML Engineering</div>
                <div className="p" style={{ margin: 0 }}>
                  Production pipelines, evaluation, and interpretable decision support.
                </div>
              </li>
              <li>
                <div style={{ fontWeight: 800 }}>GenAI Systems</div>
                <div className="p" style={{ margin: 0 }}>
                  RAG + agent workflows with strong reliability and safety constraints.
                </div>
              </li>
              <li>
                <div style={{ fontWeight: 800 }}>Cloud Deployment</div>
                <div className="p" style={{ margin: 0 }}>
                  AWS/Azure infrastructure, CI/CD, and operational hardening for real usage.
                </div>
              </li>
            </ul>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
              <Link className="btn primary" to="/contact">
                Work With Me
              </Link>
              <Link className="btn" to="/about">
                About Me
              </Link>
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Quick Links</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="btn" to="/about">
                About
              </Link>
              <Link className="btn" to="/services">
                Services
              </Link>
              <Link className="btn" to="/projects">
                Projects
              </Link>
              <Link className="btn" to="/testimonials">
                Recommendations
              </Link>
              <a className="btn" href="/resume.pdf" target="_blank" rel="noreferrer">
                Resume
              </a>
            </div>

            <div className="p" style={{ marginTop: 12 }}>
              If you’re hiring for <b>AI/ML Engineer / Full-Stack Engineer / Data Scientist / Researcher</b>{" "}
              roles, I’m especially interested in work that automates repetitive tasks with the use of AI systems and allows a human in the loop interaction for validation purposes. Basically using AI systems to replace repetitve tasks for faster efficieny. My knowledge of FullStack application development and building AI systems workflow allows me to be able to build such systems from Implementation phase to Production and Deployment.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
