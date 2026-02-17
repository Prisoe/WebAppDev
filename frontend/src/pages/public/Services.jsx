// src/pages/public/Services.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";

function SectionTitle({ kicker, title, desc }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {kicker ? <div className="kicker">{kicker}</div> : null}
      <h1 className="h1" style={{ margin: 0 }}>
        {title}
      </h1>
      {desc ? (
        <p className="p" style={{ maxWidth: 980, margin: 0, lineHeight: 1.8 }}>
          {desc}
        </p>
      ) : null}
    </div>
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

function Pill({ children }) {
  return (
    <span
      style={{
        fontSize: 12,
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid var(--border)",
        background: "rgba(255,255,255,0.03)",
        color: "var(--muted)",
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

function ServiceCard({ icon, title, summary, bullets, deliverables, stack, idealFor }) {
  return (
    <div className="card" style={{ padding: 16, display: "grid", gap: 12, height: "100%" }}>
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ fontWeight: 950, fontSize: 18 }}>
          <span style={{ marginRight: 8 }}>{icon}</span>
          {title}
        </div>
        {summary ? (
          <div className="p" style={{ margin: 0, lineHeight: 1.75, opacity: 0.95 }}>
            {summary}
          </div>
        ) : null}
      </div>

      {bullets?.length ? (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontWeight: 900 }}>What I do</div>
          <BulletList items={bullets} />
        </div>
      ) : null}

      {deliverables?.length ? (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontWeight: 900 }}>Deliverables</div>
          <BulletList items={deliverables} />
        </div>
      ) : null}

      {stack?.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 2 }}>
          {stack.map((s) => (
            <Pill key={s}>{s}</Pill>
          ))}
        </div>
      ) : null}

      {idealFor ? (
        <div
          style={{
            marginTop: 4,
            paddingTop: 10,
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ fontWeight: 900, marginBottom: 6 }}>Ideal for</div>
          <div className="p" style={{ margin: 0, lineHeight: 1.75 }}>
            {idealFor}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StepCard({ n, title, desc }) {
  return (
    <div className="card" style={{ padding: 16, display: "grid", gap: 6 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 10,
            display: "grid",
            placeItems: "center",
            border: "1px solid var(--border)",
            background: "rgba(255,255,255,0.03)",
            fontWeight: 900,
          }}
        >
          {n}
        </div>
        <div style={{ fontWeight: 950 }}>{title}</div>
      </div>
      <div className="p" style={{ margin: 0, lineHeight: 1.7 }}>
        {desc}
      </div>
    </div>
  );
}

export default function Services() {
  const services = useMemo(
    () => [
      {
        icon: "🧠",
        title: "Machine Learning Engineering",
        summary:
          "I build deployable supervised-learning systems end-to-end — from data prep and feature engineering to evaluation, explainability, and inference APIs.",
        bullets: [
          "Classification/regression pipelines (train/validate/test)",
          "Leakage checks, cross-validation, metrics + thresholding",
          "Explainability with SHAP and feature importance reporting",
          "Packaging inference into API endpoints for real use",
        ],
        deliverables: [
          "Reproducible training pipeline + model artifact",
          "Evaluation report (metrics + confusion matrix + insights)",
          "Inference API (REST) + clear request/response contract",
          "Basic monitoring hooks/logging for production readiness",
        ],
        stack: ["Python", "scikit-learn", "XGBoost", "SHAP", "Pandas", "REST APIs"],
        idealFor:
          "Teams that need a working predictive model that can be used inside an application or workflow (risk scoring, forecasting, classification).",
      },
      {
        icon: "🧩",
        title: "GenAI / RAG Systems",
        summary:
          "I design grounded LLM apps that retrieve the right context before generation — reducing hallucinations and improving reliability for real workflows.",
        bullets: [
          "Embeddings + vector search + retrieval pipeline design",
          "Prompting + grounding strategies for consistent outputs",
          "Guardrails patterns: input validation, redaction, logging",
          "End-to-end integration into a UI + backend service",
        ],
        deliverables: [
          "RAG pipeline (chunking + embeddings + retrieval)",
          "Evaluation checklist (retrieval quality + answer quality)",
          "Guardrail layer (policies, logging, safe defaults)",
          "Deployed demo (UI + API) ready to share with recruiters/clients",
        ],
        stack: ["OpenAI / Bedrock", "Embeddings", "Vector Search (FAISS)", "Node/Express", "React"],
        idealFor:
          "Internal copilots, support automation, knowledge bases, and any product that needs accurate answers from private documents/data.",
      },
      {
        icon: "🕸️",
        title: "Full-Stack Web Apps (with Admin)",
        summary:
          "I build modern web apps with clean routing, secure auth, and admin tooling so you can manage content without touching code.",
        bullets: [
          "React UI + responsive layouts and clean navigation",
          "Node/Express REST API design with validation",
          "MongoDB schemas for real CRUD (projects, contacts, messages)",
          "Auth + RBAC (admin-only access) with session cookies",
        ],
        deliverables: [
          "Production-ready UI + backend with clean structure",
          "Admin dashboard (create/edit/delete content)",
          "Secure auth and protected routes",
          "Deployment-ready configuration (env, CORS, cookies)",
        ],
        stack: ["React", "Vite", "Node.js", "Express", "MongoDB", "Passport", "RBAC"],
        idealFor:
          "Portfolio sites, internal tools, dashboards, and MVPs that need a real backend + admin panel (not just static pages).",
      },
      {
        icon: "⚙️",
        title: "Cloud / DevOps & Deployment Hardening",
        summary:
          "I take apps from “runs locally” to “reliable in production” with CI/CD, secure configs, and sane deployment defaults.",
        bullets: [
          "CI/CD pipelines and automated deployments",
          "Docker containerization and environment parity",
          "Secrets management and least-privilege mindset",
          "Operational basics: logs, health checks, safe releases",
        ],
        deliverables: [
          "Deployment plan + environment setup (dev/staging/prod)",
          "CI pipeline steps (build/test/deploy)",
          "Runtime config + secrets setup guide",
          "Stability/observability additions (logs + health endpoints)",
        ],
        stack: ["Docker", "CI/CD", "AWS", "Azure", "Logging/Monitoring"],
        idealFor:
          "Teams that need shipping discipline: consistent deployments, fewer runtime surprises, and a clean path to production.",
      },
    ],
    []
  );

  const steps = useMemo(
    () => [
      {
        n: "1",
        title: "Scope + success criteria",
        desc:
          "We define the goal, constraints, what “done” looks like, and how we’ll measure success (metrics, performance, reliability).",
      },
      {
        n: "2",
        title: "Build the system end-to-end",
        desc:
          "I implement the core pipeline/app with clean structure: data/model → API → UI/admin → deployment configuration.",
      },
      {
        n: "3",
        title: "Harden + ship",
        desc:
          "We add the production basics: validation, RBAC, logging, and a deploy plan so you can run it reliably and iterate.",
      },
    ],
    []
  );

  return (
    <div className="container" style={{ display: "grid", gap: 18 }}>
      <SectionTitle
        kicker="Services"
        title="What I Build"
        desc="Delivery-focused engineering: end-to-end ML/GenAI systems and full-stack apps that ship with clean architecture, practical security, and deploy-ready structure."
      />

      {/* Service grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {services.map((s) => (
          <ServiceCard
            key={s.title}
            icon={s.icon}
            title={s.title}
            summary={s.summary}
            bullets={s.bullets}
            deliverables={s.deliverables}
            stack={s.stack}
            idealFor={s.idealFor}
          />
        ))}
      </div>

      {/* Process */}
      <div style={{ display: "grid", gap: 14, marginTop: 6 }}>
        <SectionTitle
          kicker="How I Work"
          title="Simple Process"
          desc="Fast feedback loops, clear deliverables, and production-minded defaults."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {steps.map((st) => (
            <StepCard key={st.n} n={st.n} title={st.title} desc={st.desc} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="card"
        style={{
          padding: 16,
          display: "flex",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginTop: 6,
        }}
      >
        <div style={{ display: "grid", gap: 4, maxWidth: 820 }}>
          <div style={{ fontWeight: 950, fontSize: 16 }}>Want to build something?</div>
          <div className="p" style={{ margin: 0, lineHeight: 1.7 }}>
            If you’re hiring for AI/ML Engineer, GenAI Engineer, or Full-Stack roles — or you want an end-to-end demo built
            for a product/portfolio — reach out.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="btn primary" to="/contact">
            Contact
          </Link>
          <Link className="btn" to="/projects">
            View Projects
          </Link>
          <a className="btn" href="/resume.pdf" target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>
      </div>
    </div>
  );
}
