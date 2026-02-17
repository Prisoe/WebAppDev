// src/pages/admin/AdminProjects.jsx
import React, { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../../lib/api.js";

// ✅ Match your backend schema (models/projects.js):
// - techStack: [String]
// - imageUrl, sortOrder, isPublished
// - githubUrl + demoUrl are currently required in schema (but you can keep UI flexible)
const emptyForm = {
  title: "",
  // Optional: keep a short summary for homepage cards (we store it inside description if you want,
  // OR you can later add it to the schema as `shortDescription`)
  shortDescription: "",
  description: "",
  category: "General",

  techStack: "", // comma-separated input -> array

  githubUrl: "",
  demoUrl: "",

  imageUrl: "",
  sortOrder: 0,
  isPublished: true,
};

function toArray(csv) {
  return String(csv || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * If you DON'T want to modify your backend schema, but still want a "card summary",
 * we can embed a short summary at the top of description in a consistent way.
 *
 * Format:
 *   Summary: <shortDescription>
 *   ---
 *   <full description>
 *
 * Public UI can parse this later if you want. For now, it just keeps the content structured.
 */
function buildDescription(shortDescription, fullDescription) {
  const s = String(shortDescription || "").trim();
  const d = String(fullDescription || "").trim();

  if (!s) return d;
  if (!d) return `Summary: ${s}`;

  // Avoid duplicating if user already pasted a structured format
  const already = d.toLowerCase().startsWith("summary:");
  if (already) return d;

  return `Summary: ${s}\n---\n${d}`;
}

function splitDescriptionForEdit(description) {
  const raw = String(description || "");

  // If it matches our format: Summary: ... \n---\n ...
  const lines = raw.split("\n");
  if (!lines.length) return { shortDescription: "", description: "" };

  const first = lines[0] || "";
  const isSummary = first.trim().toLowerCase().startsWith("summary:");

  if (!isSummary) return { shortDescription: "", description: raw };

  const shortDescription = first.replace(/^summary:/i, "").trim();

  // remove optional separator line
  let rest = lines.slice(1);
  if (rest[0]?.trim() === "---") rest = rest.slice(1);

  return {
    shortDescription,
    description: rest.join("\n").trim(),
  };
}

function toApiPayload(form) {
  const techStackArr = toArray(form.techStack);

  const payload = {
    title: String(form.title || "").trim(),
    description: buildDescription(form.shortDescription, form.description),
    category: String(form.category || "General").trim() || "General",

    techStack: techStackArr,

    githubUrl: String(form.githubUrl || "").trim(),
    demoUrl: String(form.demoUrl || "").trim(),

    imageUrl: String(form.imageUrl || "").trim(),
    sortOrder: Number(form.sortOrder) || 0,
    isPublished: Boolean(form.isPublished),
  };

  return payload;
}

function clamp(text, n = 180) {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export default function AdminProjects() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [projects, setProjects] = useState([]);

  const [mode, setMode] = useState("create"); // create | edit
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await apiGet("/api/admin/projects");
      setProjects(Array.isArray(data?.projects) ? data.projects : []);
    } catch (e) {
      setErr(e?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return projects;

    return projects.filter((p) => {
      const blob = [
        p.title,
        p.category,
        p.description,
        ...(Array.isArray(p.techStack) ? p.techStack : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return blob.includes(term);
    });
  }, [projects, q]);

  function startCreate() {
    setMode("create");
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(p) {
    setMode("edit");
    setEditingId(p._id);

    const split = splitDescriptionForEdit(p.description);

    setForm({
      title: p.title || "",
      shortDescription: split.shortDescription || "",
      description: split.description || "",
      category: p.category || "General",

      techStack: Array.isArray(p.techStack) ? p.techStack.join(", ") : "",

      githubUrl: p.githubUrl || "",
      demoUrl: p.demoUrl || "",

      imageUrl: p.imageUrl || "",
      sortOrder: p.sortOrder ?? 0,
      isPublished: p.isPublished ?? true,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      const payload = toApiPayload(form);

      // Minimal validation
      if (!payload.title) throw new Error("title is required");
      if (!payload.description) throw new Error("description is required");

      // Your backend schema currently requires both githubUrl and demoUrl.
      // If you want demoUrl optional, update the backend schema accordingly.
      if (!payload.githubUrl) throw new Error("githubUrl is required");
      if (!payload.demoUrl) throw new Error("demoUrl is required");

      if (mode === "create") {
        await apiPost("/api/admin/projects", payload);
      } else {
        await apiPut(`/api/admin/projects/${editingId}`, payload);
      }

      startCreate();
      await load();
    } catch (e2) {
      setErr(e2?.message || "Failed to save project");
    }
  }

  async function onDelete(id) {
    const ok = window.confirm("Delete this project?");
    if (!ok) return;

    setErr("");
    try {
      await apiDelete(`/api/admin/projects/${id}`);
      await load();
    } catch (e) {
      setErr(e?.message || "Failed to delete project");
    }
  }

  return (
    <div className="container" style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <div className="kicker">Admin</div>
        <h1 className="h1">Projects</h1>
        <p className="p">
          Create, publish/unpublish, reorder, and edit your portfolio projects.
        </p>
      </div>

      {err ? (
        <div
          className="card"
          style={{ padding: 14, borderColor: "rgba(255,0,79,0.35)" }}
        >
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Error</div>
          <div className="p">{err}</div>
        </div>
      ) : null}

      {/* Form */}
      <div className="card" style={{ padding: 16 }}>
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: 900 }}>
            {mode === "create" ? "Add Project" : "Edit Project"}
          </div>
          {mode === "edit" ? (
            <button className="btn" type="button" onClick={startCreate}>
              Cancel Edit
            </button>
          ) : null}
        </div>

        <form
          onSubmit={onSubmit}
          style={{ display: "grid", gap: 12, marginTop: 12 }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <label className="p" style={{ fontWeight: 700 }}>
              Title
            </label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="e.g. Toronto KSI Accident Severity Model"
              style={inputStyle}
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label className="p" style={{ fontWeight: 700 }}>
              Card Summary (recommended)
            </label>
            <input
              value={form.shortDescription}
              onChange={(e) =>
                setForm((f) => ({ ...f, shortDescription: e.target.value }))
              }
              placeholder="1–2 sentences used for homepage/project cards."
              style={inputStyle}
            />
            <div className="p" style={{ margin: 0, opacity: 0.85 }}>
              Tip: Keep this under ~180 characters. Your homepage cards will look clean.
            </div>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label className="p" style={{ fontWeight: 700 }}>
              Full Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="What it does, impact, stack, outcomes..."
              rows={7}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.55 }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <label className="p" style={{ fontWeight: 700 }}>
                Category
              </label>
              <input
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                placeholder="e.g. Machine Learning"
                style={inputStyle}
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label className="p" style={{ fontWeight: 700 }}>
                Tech Stack (comma separated)
              </label>
              <input
                value={form.techStack}
                onChange={(e) =>
                  setForm((f) => ({ ...f, techStack: e.target.value }))
                }
                placeholder="AWS, GenAI, RAG, React"
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <label className="p" style={{ fontWeight: 700 }}>
                GitHub URL
              </label>
              <input
                value={form.githubUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, githubUrl: e.target.value }))
                }
                placeholder="https://github.com/..."
                style={inputStyle}
              />
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              <label className="p" style={{ fontWeight: 700 }}>
                Demo URL
              </label>
              <input
                value={form.demoUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, demoUrl: e.target.value }))
                }
                placeholder="https://your-demo-link..."
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 200px 200px",
              gap: 12,
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <label className="p" style={{ fontWeight: 700 }}>
                Image URL (optional)
              </label>
              <input
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                placeholder="https://..."
                style={inputStyle}
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label className="p" style={{ fontWeight: 700 }}>
                Sort Order
              </label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sortOrder: e.target.value }))
                }
                style={inputStyle}
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label className="p" style={{ fontWeight: 700 }}>
                Published
              </label>
              <select
                value={form.isPublished ? "yes" : "no"}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    isPublished: e.target.value === "yes",
                  }))
                }
                style={inputStyle}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn primary" type="submit">
              {mode === "create" ? "Create Project" : "Save Changes"}
            </button>
            <button className="btn" type="button" onClick={startCreate}>
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="card" style={{ padding: 16 }}>
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontWeight: 900 }}>All Projects ({projects.length})</div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, stack, description..."
            style={{ ...inputStyle, width: 320 }}
          />
        </div>

        {loading ? (
          <p className="p" style={{ marginTop: 12 }}>
            Loading…
          </p>
        ) : null}

        {!loading && filtered.length === 0 ? (
          <p className="p" style={{ marginTop: 12 }}>
            No projects found.
          </p>
        ) : null}

        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          {filtered.map((p) => {
            const split = splitDescriptionForEdit(p.description);
            const preview = split.shortDescription
              ? split.shortDescription
              : clamp(p.description, 220);

            return (
              <div
                key={p._id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: 14,
                  display: "grid",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ fontWeight: 900 }}>{p.title}</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <span className="pill">{p.category || "General"}</span>
                    <span className="pill">
                      {p.isPublished ? "Published" : "Hidden"}
                    </span>
                    <span className="pill">sort: {p.sortOrder ?? 0}</span>
                  </div>
                </div>

                <div className="p" style={{ opacity: 0.9, margin: 0 }}>
                  {preview}
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(p.techStack || []).slice(0, 10).map((t) => (
                    <span key={t} className="pill" style={{ opacity: 0.9 }}>
                      {t}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="btn" onClick={() => startEdit(p)}>
                    Edit
                  </button>
                  <button className="btn" onClick={() => onDelete(p._id)}>
                    Delete
                  </button>
                  {p.demoUrl ? (
                    <a
                      className="btn"
                      href={p.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Demo
                    </a>
                  ) : null}
                  {p.githubUrl ? (
                    <a
                      className="btn"
                      href={p.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "rgba(255,255,255,0.03)",
  color: "var(--text)",
  outline: "none",
};
