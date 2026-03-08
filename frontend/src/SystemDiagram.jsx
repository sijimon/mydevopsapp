import { useState } from "react";

const data = {
  sections: [
    {
      id: "local",
      label: "LOCAL ENVIRONMENT",
      subtitle: "Ubuntu 22.04 LTS — gamebox",
      color: "#0f2027",
      accent: "#00d4ff",
      icon: "🖥️",
      layers: [
        {
          id: "dev",
          label: "Developer Workstation",
          color: "#0a1628",
          border: "#1e3a5f",
          items: [
            { icon: "⌨️", name: "VS Code / Nano", desc: "Code editing" },
            { icon: "🐍", name: "Python 3.11 + venv", desc: "Backend dev" },
            { icon: "⚛️", name: "Node.js 20 LTS", desc: "Frontend dev" },
            { icon: "🔧", name: "Git 2.x", desc: "Version control" },
          ],
        },
        {
          id: "docker",
          label: "Docker Engine 29.3 — docker-compose v5",
          color: "#0a1628",
          border: "#00d4ff",
          sublayers: [
            {
              name: "infrastructure_appnetwork (bridge)",
              color: "#091520",
              containers: [
                {
                  name: "infrastructure-frontend-1",
                  tech: "React 18 + Vite → Nginx Alpine",
                  port: ":80",
                  color: "#003d4d",
                  accent: "#00d4ff",
                  icon: "⚛️",
                  details: ["Vite build → /dist", "Nginx serves static", "Port 80:80"],
                },
                {
                  name: "infrastructure-backend-1",
                  tech: "Django 5 + DRF + Gunicorn",
                  port: ":8000",
                  color: "#1a3300",
                  accent: "#7fff00",
                  icon: "🐍",
                  details: ["python-decouple .env", "Gunicorn workers", "Port 8000:8000"],
                },
                {
                  name: "infrastructure-db-1",
                  tech: "PostgreSQL 16 Alpine",
                  port: ":5432",
                  color: "#1a0033",
                  accent: "#a855f7",
                  icon: "🗄️",
                  details: ["Volume: postgres_data", "devdb / devuser", "Health check: pg_isready"],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "github",
      label: "GITHUB",
      subtitle: "Remote Repository + CI/CD",
      color: "#0d1117",
      accent: "#f0883e",
      icon: "🐙",
    },
    {
      id: "ci",
      label: "GITHUB ACTIONS",
      subtitle: "Automated CI Pipeline",
      color: "#0d1117",
      accent: "#3fb950",
      icon: "⚙️",
      workflows: [
        {
          name: "backend-ci.yml",
          trigger: "push/PR → backend/**",
          accent: "#7fff00",
          steps: ["Checkout code", "Setup Python 3.11", "pip install requirements", "pg_isready service", "manage.py migrate", "manage.py test"],
        },
        {
          name: "frontend-ci.yml",
          trigger: "push/PR → frontend/**",
          accent: "#00d4ff",
          steps: ["Checkout code", "Setup Node.js 20", "npm ci", "npm run build"],
        },
      ],
    },
  ],
  flows: [
    { from: "Developer", to: "Git Push", label: "git push origin main" },
    { from: "GitHub", to: "Actions", label: "webhook trigger" },
    { from: "Actions", to: "Result", label: "✅ green / ❌ fail" },
  ],
};

const FlowArrow = ({ label, color = "#00d4ff", vertical = false }) => (
  <div style={{
    display: "flex",
    flexDirection: vertical ? "column" : "row",
    alignItems: "center",
    gap: 4,
    padding: vertical ? "4px 0" : "0 4px",
  }}>
    {!vertical && <div style={{ height: 1, width: 40, background: `linear-gradient(90deg, transparent, ${color})` }} />}
    {vertical && <div style={{ width: 1, height: 20, background: `linear-gradient(180deg, transparent, ${color})`, margin: "0 auto" }} />}
    <span style={{ fontSize: 9, color, fontFamily: "monospace", whiteSpace: "nowrap", opacity: 0.8 }}>{label}</span>
    {!vertical && <div style={{ color, fontSize: 12 }}>→</div>}
    {vertical && <div style={{ color, fontSize: 12, textAlign: "center" }}>↓</div>}
  </div>
);

const Container = ({ c, active, onClick }) => (
  <div onClick={() => onClick(c.name)}
    style={{
      background: c.color,
      border: `1px solid ${active ? c.accent : c.accent + "44"}`,
      borderRadius: 8,
      padding: "10px 12px",
      cursor: "pointer",
      transition: "all 0.2s",
      boxShadow: active ? `0 0 16px ${c.accent}44` : "none",
      flex: 1,
      minWidth: 160,
    }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
      <span style={{ fontSize: 16 }}>{c.icon}</span>
      <div>
        <div style={{ color: c.accent, fontSize: 10, fontFamily: "monospace", fontWeight: 700 }}>{c.port}</div>
        <div style={{ color: "#fff", fontSize: 10, fontWeight: 600 }}>{c.name}</div>
      </div>
    </div>
    <div style={{ color: "#aaa", fontSize: 9, fontFamily: "monospace", marginBottom: 6 }}>{c.tech}</div>
    {active && (
      <div style={{ borderTop: `1px solid ${c.accent}33`, paddingTop: 6, marginTop: 4 }}>
        {c.details.map((d, i) => (
          <div key={i} style={{ color: c.accent, fontSize: 9, fontFamily: "monospace", marginBottom: 2 }}>▸ {d}</div>
        ))}
      </div>
    )}
  </div>
);

const WorkflowCard = ({ w }) => (
  <div style={{
    background: "#0a1628",
    border: `1px solid ${w.accent}44`,
    borderRadius: 8,
    padding: "10px 12px",
    flex: 1,
  }}>
    <div style={{ color: w.accent, fontSize: 11, fontFamily: "monospace", fontWeight: 700, marginBottom: 2 }}>{w.name}</div>
    <div style={{ color: "#888", fontSize: 9, fontFamily: "monospace", marginBottom: 8 }}>{w.trigger}</div>
    {w.steps.map((s, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <div style={{
          width: 16, height: 16, borderRadius: "50%",
          background: `${w.accent}22`, border: `1px solid ${w.accent}66`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: w.accent, fontSize: 8, fontWeight: 700, flexShrink: 0,
        }}>{i + 1}</div>
        <div style={{ color: "#ccc", fontSize: 9, fontFamily: "monospace" }}>{s}</div>
        {i < w.steps.length - 1 && (
          <div style={{ width: 1, height: 8, background: `${w.accent}33`, marginLeft: "auto", marginRight: "auto" }} />
        )}
      </div>
    ))}
  </div>
);

export default function App() {
  const [active, setActive] = useState(null);
  const [tab, setTab] = useState("diagram");

  const toggle = (name) => setActive(a => a === name ? null : name);

  const explanations = [
    {
      title: "1. Developer writes code",
      icon: "⌨️",
      accent: "#00d4ff",
      body: "Code is written on Ubuntu using VS Code or nano. The backend uses Python 3.11 inside a .venv virtual environment. The frontend uses Node.js 20. Git tracks all changes in a monorepo.",
    },
    {
      title: "2. Docker runs everything locally",
      icon: "🐳",
      accent: "#0db7ed",
      body: "Docker Compose spins up 3 containers on a shared bridge network called appnetwork. The db container (PostgreSQL) must pass a health check before backend starts. The frontend is served by Nginx after Vite builds the React app.",
    },
    {
      title: "3. Services talk over Docker network",
      icon: "🔗",
      accent: "#a855f7",
      body: "Inside Docker, containers find each other by service name: backend connects to 'db:5432'. Outside Docker, your browser hits localhost:80 (React) and localhost:8000 (Django API). The .env file tells Django to use DB_HOST=db.",
    },
    {
      title: "4. Code is pushed to GitHub",
      icon: "🐙",
      accent: "#f0883e",
      body: "When you run git push, code goes to the remote GitHub repository. GitHub stores the full history, branches, and pull requests. The .gitignore ensures secrets (.env), node_modules, and __pycache__ are never committed.",
    },
    {
      title: "5. GitHub Actions triggers CI",
      icon: "⚙️",
      accent: "#3fb950",
      body: "A push to backend/** triggers backend-ci.yml. A push to frontend/** triggers frontend-ci.yml. GitHub spins up a fresh Ubuntu runner, installs dependencies, and runs all tests automatically — no manual steps needed.",
    },
    {
      title: "6. CI validates your code",
      icon: "✅",
      accent: "#7fff00",
      body: "Backend CI spins up a real PostgreSQL service container, runs Django migrations, and executes manage.py test. Frontend CI runs npm ci and npm run build. If any step fails the pipeline goes red and you're notified before bad code reaches main.",
    },
  ];

  return (
    <div style={{
      background: "#060d14",
      minHeight: "100vh",
      fontFamily: "'Courier New', monospace",
      color: "#e0e0e0",
      padding: 0,
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0a1628 0%, #060d14 100%)",
        borderBottom: "1px solid #1e3a5f",
        padding: "20px 24px 16px",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#00d4ff", letterSpacing: -1 }}>DevOps</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>System Architecture</span>
          <span style={{
            background: "#00d4ff22", border: "1px solid #00d4ff44",
            color: "#00d4ff", fontSize: 9, padding: "2px 8px", borderRadius: 20,
          }}>LIVE — gamebox Ubuntu 22.04</span>
        </div>
        <div style={{ color: "#666", fontSize: 10 }}>Django 5  •  React 18  •  PostgreSQL 16  •  Docker 29.3  •  GitHub Actions</div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {["diagram", "how it works"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? "#00d4ff" : "transparent",
              border: `1px solid ${tab === t ? "#00d4ff" : "#1e3a5f"}`,
              color: tab === t ? "#000" : "#888",
              padding: "4px 14px", borderRadius: 20, fontSize: 10,
              cursor: "pointer", fontFamily: "monospace", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: 1,
            }}>{t}</button>
          ))}
        </div>
      </div>

      {tab === "diagram" && (
        <div style={{ padding: "20px 24px" }}>

          {/* Top: Developer → GitHub → Actions row */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 24, overflowX: "auto" }}>

            {/* Developer box */}
            <div style={{
              background: "#0a1628", border: "1px solid #1e3a5f",
              borderRadius: 8, padding: "10px 14px", minWidth: 140,
            }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>👨‍💻</div>
              <div style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>Developer</div>
              <div style={{ color: "#666", fontSize: 9 }}>Ubuntu 22.04</div>
              <div style={{ color: "#666", fontSize: 9 }}>gamebox</div>
              <div style={{ marginTop: 6 }}>
                {["Python 3.11", "Node 20", "Git", "Docker CLI"].map(t => (
                  <div key={t} style={{ color: "#00d4ff", fontSize: 8, marginBottom: 1 }}>▸ {t}</div>
                ))}
              </div>
            </div>

            <FlowArrow label="git push origin main" color="#f0883e" />

            {/* GitHub box */}
            <div style={{
              background: "#0d1117", border: "1px solid #f0883e44",
              borderRadius: 8, padding: "10px 14px", minWidth: 140,
            }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>🐙</div>
              <div style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>GitHub</div>
              <div style={{ color: "#666", fontSize: 9 }}>Remote Repository</div>
              <div style={{ marginTop: 6 }}>
                {["main branch", "Pull Requests", "Actions tab", "Secrets store"].map(t => (
                  <div key={t} style={{ color: "#f0883e", fontSize: 8, marginBottom: 1 }}>▸ {t}</div>
                ))}
              </div>
            </div>

            <FlowArrow label="webhook trigger" color="#3fb950" />

            {/* Actions box */}
            <div style={{
              background: "#0d1117", border: "1px solid #3fb95044",
              borderRadius: 8, padding: "10px 14px", minWidth: 260, flex: 1,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>⚙️</span>
                <div>
                  <div style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>GitHub Actions CI</div>
                  <div style={{ color: "#666", fontSize: 9 }}>ubuntu-latest runner</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {data.sections.find(s => s.id === "ci").workflows.map(w => (
                  <WorkflowCard key={w.name} w={w} />
                ))}
              </div>
            </div>

            <FlowArrow label="✅ pass / ❌ fail" color="#3fb950" />

            {/* Result */}
            <div style={{
              background: "#0a1628", border: "1px solid #3fb95044",
              borderRadius: 8, padding: "10px 14px", minWidth: 110,
            }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>📊</div>
              <div style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>Result</div>
              <div style={{ marginTop: 6 }}>
                <div style={{ color: "#3fb950", fontSize: 9 }}>✅ Tests pass</div>
                <div style={{ color: "#f85149", fontSize: 9 }}>❌ PR blocked</div>
                <div style={{ color: "#f0883e", fontSize: 9 }}>🔔 Notified</div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px dashed #1e3a5f", marginBottom: 20, position: "relative" }}>
            <span style={{
              position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)",
              background: "#060d14", color: "#1e3a5f", fontSize: 9, padding: "0 12px",
              fontFamily: "monospace",
            }}>LOCAL DOCKER ENVIRONMENT</span>
          </div>

          {/* Bottom: Docker Stack */}
          <div style={{
            background: "#0a1628",
            border: "1px solid #00d4ff33",
            borderRadius: 10,
            padding: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 14 }}>🐳</span>
              <span style={{ color: "#00d4ff", fontSize: 10, fontWeight: 700 }}>Docker Engine 29.3.0  —  Compose v5.1.0</span>
            </div>
            <div style={{ color: "#666", fontSize: 9, marginBottom: 14 }}>infrastructure_appnetwork (bridge driver) — containers resolve each other by service name</div>

            {/* Browser flow */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 14 }}>
              <div style={{
                background: "#1a1a2e", border: "1px solid #333",
                borderRadius: 6, padding: "6px 10px",
                color: "#aaa", fontSize: 9,
              }}>🌐 Browser<br /><span style={{ color: "#00d4ff" }}>localhost</span></div>
              <FlowArrow label=":80" color="#00d4ff" />
              <div style={{
                background: "#003d4d33", border: "1px solid #00d4ff44",
                borderRadius: 6, padding: "6px 10px",
                color: "#00d4ff", fontSize: 9,
              }}>React app<br />via Nginx</div>
              <FlowArrow label="/api/* proxy" color="#7fff00" />
              <div style={{
                background: "#1a330033", border: "1px solid #7fff0044",
                borderRadius: 6, padding: "6px 10px",
                color: "#7fff00", fontSize: 9,
              }}>Django API<br />:8000</div>
              <FlowArrow label="SQL queries" color="#a855f7" />
              <div style={{
                background: "#1a003333", border: "1px solid #a855f744",
                borderRadius: 6, padding: "6px 10px",
                color: "#a855f7", fontSize: 9,
              }}>PostgreSQL<br />devdb :5432</div>
            </div>

            {/* Container cards */}
            <div style={{ color: "#666", fontSize: 9, marginBottom: 8 }}>
              Click a container to see details:
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {data.sections[0].layers[1].sublayers[0].containers.map(c => (
                <Container key={c.name} c={c} active={active === c.name} onClick={toggle} />
              ))}
            </div>

            {/* Volume */}
            <div style={{
              marginTop: 12, display: "flex", alignItems: "center", gap: 8,
              background: "#1a003344", border: "1px solid #a855f722",
              borderRadius: 6, padding: "6px 12px",
            }}>
              <span style={{ color: "#a855f7", fontSize: 10 }}>💾</span>
              <span style={{ color: "#a855f7", fontSize: 9, fontFamily: "monospace" }}>Volume: infrastructure_postgres_data</span>
              <span style={{ color: "#666", fontSize: 9 }}>— persists database across container restarts</span>
            </div>
          </div>

          <div style={{ marginTop: 10, color: "#333", fontSize: 8, textAlign: "center" }}>
            Click containers above to inspect their configuration details
          </div>
        </div>
      )}

      {tab === "how it works" && (
        <div style={{ padding: "20px 24px" }}>
          <div style={{ color: "#666", fontSize: 10, marginBottom: 16 }}>
            End-to-end walkthrough of your DevOps pipeline — from writing code to CI validation
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {explanations.map((e, i) => (
              <div key={i} style={{
                background: "#0a1628",
                border: `1px solid ${e.accent}33`,
                borderLeft: `3px solid ${e.accent}`,
                borderRadius: 8,
                padding: "12px 16px",
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: `${e.accent}22`, border: `1px solid ${e.accent}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0,
                }}>{e.icon}</div>
                <div>
                  <div style={{ color: e.accent, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{e.title}</div>
                  <div style={{ color: "#aaa", fontSize: 10, lineHeight: 1.6 }}>{e.body}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Environment summary table */}
          <div style={{
            marginTop: 20, background: "#0a1628",
            border: "1px solid #1e3a5f", borderRadius: 8, overflow: "hidden",
          }}>
            <div style={{
              background: "#0d2137", padding: "8px 14px",
              color: "#00d4ff", fontSize: 10, fontWeight: 700,
            }}>📋 Full Environment Reference</div>
            {[
              ["OS", "Ubuntu 22.04 LTS", "gamebox", "#00d4ff"],
              ["Backend", "Django 5 + DRF + Gunicorn 25.1", "Python 3.11 .venv", "#7fff00"],
              ["Frontend", "React 18 + Vite → Nginx Alpine", "Node.js 20 LTS", "#00d4ff"],
              ["Database", "PostgreSQL 16 Alpine", "devdb / devuser", "#a855f7"],
              ["Containers", "Docker 29.3 + Compose v5.1", "infrastructure_appnetwork", "#0db7ed"],
              ["CI/CD", "GitHub Actions", "ubuntu-latest runner", "#3fb950"],
              ["Secrets", ".env (local) / GitHub Secrets (CI)", "python-decouple", "#f0883e"],
              ["Ports", ":80 React  :8000 Django  :5432 PG", "all on localhost", "#888"],
            ].map(([label, value, detail, accent], i) => (
              <div key={i} style={{
                display: "flex", gap: 12, padding: "7px 14px",
                borderTop: i > 0 ? "1px solid #0d2137" : "none",
                background: i % 2 === 0 ? "transparent" : "#060d1422",
              }}>
                <div style={{ color: accent, fontSize: 9, fontWeight: 700, minWidth: 80 }}>{label}</div>
                <div style={{ color: "#ddd", fontSize: 9, flex: 1 }}>{value}</div>
                <div style={{ color: "#555", fontSize: 9 }}>{detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
