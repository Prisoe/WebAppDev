// src/pages/public/Projects.jsx
import React, { useEffect, useMemo, useState } from "react";
import { apiGet } from "../../lib/api.js";

function Tag({ children }) {
  return <span className="tag">{children}</span>;
}

function Pill({ children }) {
  return <span className="pill">{children}</span>;
}

/**
 * Turn a long free-text description into a scannable set of bullets.
 * Supports:
 *  - lines starting with "-" or "•"
 *  - "Impact:" section
 *  - "Architecture:" / "Stack:" / "Technical Implementation:" etc.
 *
 * We keep it resilient even if description is plain paragraphs.
 */
function parseDescription(description = "") {
  const text = String(description || "").trim();
  if (!text) {
    return {
      summary: "",
      bullets: [],
      impact: "",
    };
  }

  // normalize newlines
  const lines = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // If there are bullet lines, pull them
  const bulletLines = lines
    .filter((l) => l.startsWith("•") || l.startsWith("-"))
    .map((l) => l.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);

  // Detect an Impact: section (simple heuristic)
  const joined = lines.join("\n");
  const impactMatch = joined.match(/Impact:\s*([\s\S]*)/i);
  const impact = impactMatch ? impactMatch[1].trim() : "";

  // Summary:
  // - If first line is not a bullet, use it as summary.
  // - Else fallback to first 160 chars.
  let summary = "";
  if (lines.length) {
    const first = lines[0];
    if (!first.startsWith("•") && !first.startsWith("-") && !/^(Impact:)/i.test(first)) {
      summary = first;
    }
  }
  if (!summary) {
    summary = text.length > 180 ? `${text.slice(0, 180)}…` : text;
  }

  // Bullets:
  // Prefer explicit bullets; otherwise create bullets from sentences (lightly)
  let bullets = bulletLines.slice(0, 4);

  if (bullets.length === 0) {
    // split into sentences and take top 3-4
    const sentenceBullets = text
      .replace(/\s+/g, " ")
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 4);

    bullets = sentenceBullets;
  }

  // If we found impact content, we don’t want it to dominate the card.
  // Keep impact short.
  const impactShort = impact
    ? impact.replace(/\s+/g, " ").slice(0, 220) + (impact.length > 220 ? "…" : "")
    : "";

  return { summary, bullets, impact: impactShort };
}

function ProjectCard({ p }) {
  const tags = Array.isArray(p.techStack) && p.techStack.length
    ? p.techStack
    : (Array.isArray(p.tags) ? p.tags : []);

  const { summary, bullets, impact } = useMemo(
    () => parseDescription(p.description),
    [p.description]
  );

  return (
    <article className="projectCard">
      {/* Image header */}
      <div className="projectMedia">
        <div className="projectMediaGlow" />
        {p.imageUrl ? (
          <img className="projectMediaImg" src={p.imageUrl} alt={p.title} />
        ) : (
          <div className="projectMediaEmpty" />
        )}
      </div>

      {/* Content */}
      <div className="projectBody">
        <div className="projectMetaRow">
          {p.category ? <Tag>{p.category}</Tag> : null}
          {(tags || []).slice(0, 6).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        <header className="projectHeader">
          <h3 className="projectTitle">{p.title}</h3>
          {summary ? <p className="projectSummary">{summary}</p> : null}
        </header>

        {/* Highlights */}
        <div className="projectHighlights">
          <div className="projectHighlightsTitle">Highlights</div>
          <ul className="projectHighlightsList">
            {bullets.slice(0, 4).map((b, i) => (
              <li key={`${p._id || p.title}-b-${i}`}>{b}</li>
            ))}
          </ul>
        </div>

        {/* Optional Impact */}
        {impact ? (
          <div className="projectImpact">
            <div className="projectImpactLabel">Impact</div>
            <div className="projectImpactText">{impact}</div>
          </div>
        ) : null}

        {/* Actions */}
        <div className="projectActions">
          {p.demoUrl ? (
            <a className="btn primary" href={p.demoUrl} target="_blank" rel="noreferrer">
              Demo
            </a>
          ) : null}
          {p.githubUrl ? (
            <a className="btn" href={p.githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          ) : null}
          <div className="projectSpacer" />
          {p.isPublished === false ? <Pill>Hidden</Pill> : null}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [projects, setProjects] = useState([]);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await apiGet("/api/projects");
        const list = Array.isArray(data?.projects) ? data.projects : [];
        if (mounted) setProjects(list);
      } catch (e) {
        if (mounted) setErr(e?.message || "Failed to load projects");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return projects.filter((p) => {
      const matchCat = cat === "All" ? true : p.category === cat;
      const tags = Array.isArray(p.techStack)
        ? p.techStack
        : (Array.isArray(p.tags) ? p.tags : []);
      const blob = `${p.title || ""} ${p.description || ""} ${p.category || ""} ${tags.join(" ")}`.toLowerCase();
      const matchQ = term ? blob.includes(term) : true;
      return matchCat && matchQ;
    });
  }, [projects, q, cat]);

  return (
    <div className="container">
      {/* Header */}
      <div className="projectsHeader">
        <div className="kicker">Portfolio</div>
        <h1 className="h1">Projects</h1>
        <p className="p projectsSub">
          A curated set of ML/GenAI and full-stack systems — built end-to-end with production-minded engineering.
        </p>

        {/* Search / Filter */}
        <div className="projectsToolbar card">
          <div className="projectsToolbarLeft">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title, stack, keywords…"
              className="projectsInput"
            />
          </div>

          <div className="projectsToolbarRight">
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="projectsSelect">
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* States */}
      {loading ? <p className="p">Loading projects…</p> : null}

      {err ? (
        <div className="card" style={{ padding: 14, borderColor: "rgba(255,0,79,0.35)" }}>
          <div style={{ fontWeight: 900, marginBottom: 6 }}>Couldn’t load projects</div>
          <div className="p">{err}</div>
        </div>
      ) : null}

      {!loading && !err && filtered.length === 0 ? (
        <p className="p">No projects match your filters.</p>
      ) : null}

      {/* Grid */}
      <div className="projectsGrid">
        {filtered.map((p) => (
          <ProjectCard key={p._id || `${p.title}-${p.githubUrl}`} p={p} />
        ))}
      </div>
    </div>
  );
}
