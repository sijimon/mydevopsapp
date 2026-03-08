import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#07090f",
  panel: "#0d1117",
  card: "#111827",
  border: "#1f2937",
  cyan: "#22d3ee",
  green: "#4ade80",
  yellow: "#fbbf24",
  orange: "#f97316",
  red: "#f87171",
  purple: "#c084fc",
  blue: "#60a5fa",
  pink: "#f472b6",
  text: "#e2e8f0",
  muted: "#64748b",
  dim: "#1e293b",
};

const style = {
  fontFamily: "'Courier New', 'Lucida Console', monospace",
};

function Tag({ color = C.cyan, children, small }) {
  return (
    <span style={{
      background: color + "18", border: `1px solid ${color}44`,
      color, borderRadius: 4, padding: small ? "1px 6px" : "2px 8px",
      fontSize: small ? 8 : 9, fontWeight: 700, letterSpacing: 1,
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function Pulse({ color = C.green, size = 8 }) {
  const [on, setOn] = useState(true);
  useEffect(() => { const t = setInterval(() => setOn(x => !x), 1200); return () => clearInterval(t); }, []);
  return <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", background: on ? color : color + "44", boxShadow: on ? `0 0 6px ${color}` : "none", transition: "all 0.4s", flexShrink: 0 }} />;
}

function Arrow({ label, color = C.cyan, dir = "right" }) {
  const isDown = dir === "down";
  return (
    <div style={{ display: "flex", flexDirection: isDown ? "column" : "row", alignItems: "center", gap: 3, padding: isDown ? "2px 0" : "0 2px", flexShrink: 0 }}>
      {!isDown && <div style={{ width: 30, height: 1, background: `linear-gradient(90deg, transparent, ${color}88)` }} />}
      {isDown && <div style={{ width: 1, height: 14, background: `linear-gradient(180deg, transparent, ${color}88)`, margin: "0 auto" }} />}
      <span style={{ fontSize: 8, color, fontFamily: "monospace", whiteSpace: "nowrap", opacity: 0.85 }}>{label}</span>
      {!isDown && <span style={{ color, fontSize: 11 }}>▶</span>}
      {isDown && <span style={{ color, fontSize: 10, textAlign: "center", display: "block" }}>▼</span>}
    </div>
  );
}

function SectionLabel({ children, color = C.cyan }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${color}44, transparent)` }} />
      <span style={{ color, fontSize: 9, fontWeight: 700, letterSpacing: 2 }}>{children}</span>
      <div style={{ height: 1, flex: 1, background: `linear-gradient(270deg, ${color}44, transparent)` }} />
    </div>
  );
}

// ─── TAB: OVERVIEW ─────────────────────────────────────────────────────────
function OverviewTab() {
  const [hover, setHover] = useState(null);
  const nodes = [
    { id: "dev", icon: "👨‍💻", label: "Developer", sub: "Ubuntu 22.04 · gamebox", color: C.blue, x: 0, items: ["VS Code / nano", "Python 3.11", "Node.js 20", "Git 2.x"] },
    { id: "git", icon: "🐙", label: "GitHub", sub: "Remote Repository", color: C.orange, x: 1, items: ["main branch", "feature branches", "Pull Requests", "Webhooks"] },
    { id: "jenkins", icon: "🔧", label: "Jenkins", sub: "Docker · :8080", color: C.yellow, x: 2, items: ["Pipeline stages", "Manual triggers", "Auto on push", "Approvals"] },
    { id: "dev_env", icon: "🛠️", label: "Dev", sub: ":80 · :8000 · :5432", color: C.green, x: 3, items: ["DEBUG=True", "devdb", "1 worker", "Hot reload"] },
    { id: "qa_env", icon: "🧪", label: "QA", sub: ":81 · :8001 · :5433", color: C.cyan, x: 4, items: ["DEBUG=False", "qadb", "1 worker", "Test data"] },
    { id: "prod_env", icon: "🚀", label: "Prod", sub: ":82 · :8002 · :5434", color: C.purple, x: 5, items: ["DEBUG=False", "proddb", "3 workers", "always restart"] },
  ];
  const arrows = [
    { from: "dev", to: "git", label: "git push", color: C.orange },
    { from: "git", to: "jenkins", label: "webhook", color: C.yellow },
    { from: "jenkins", to: "dev_env", label: "auto deploy", color: C.green },
    { from: "jenkins", to: "qa_env", label: "⏸ approval", color: C.cyan },
    { from: "jenkins", to: "prod_env", label: "⏸ approval", color: C.purple },
  ];
  return (
    <div>
      <SectionLabel color={C.cyan}>FULL SYSTEM OVERVIEW — gamebox Ubuntu 22.04 LTS</SectionLabel>
      {/* Node row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 6, overflowX: "auto", paddingBottom: 8 }}>
        {nodes.map((n, i) => (
          <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}
              style={{
                background: hover === n.id ? n.color + "18" : C.card,
                border: `1px solid ${hover === n.id ? n.color : n.color + "44"}`,
                borderRadius: 8, padding: "10px 12px", minWidth: 120,
                transition: "all 0.2s", cursor: "default",
                boxShadow: hover === n.id ? `0 0 20px ${n.color}22` : "none",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <Pulse color={n.color} size={6} />
                <span style={{ fontSize: 16 }}>{n.icon}</span>
              </div>
              <div style={{ color: n.color, fontSize: 11, fontWeight: 700 }}>{n.label}</div>
              <div style={{ color: C.muted, fontSize: 8, marginBottom: hover === n.id ? 8 : 0 }}>{n.sub}</div>
              {hover === n.id && n.items.map((item, j) => (
                <div key={j} style={{ color: n.color, fontSize: 8, marginTop: 2 }}>▸ {item}</div>
              ))}
            </div>
            {i < nodes.length - 1 && i !== 2 && (
              <Arrow label={arrows[i]?.label || ""} color={arrows[i]?.color || C.muted} />
            )}
            {i === 2 && <div style={{ width: 6 }} />}
          </div>
        ))}
      </div>

      {/* Jenkins → Environments breakdown */}
      <div style={{ marginTop: 16 }}>
        <SectionLabel color={C.yellow}>JENKINS PIPELINE FLOW</SectionLabel>
        <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
          {[
            { n: "1", label: "Checkout", icon: "📥", color: C.blue, auto: true },
            { n: "2", label: "Django Tests", icon: "🧪", color: C.green, auto: true },
            { n: "3", label: "React Build", icon: "⚛️", color: C.cyan, auto: true },
            { n: "4", label: "Deploy Dev", icon: "🛠️", color: C.green, auto: true },
            { n: "5", label: "Deploy QA", icon: "🧪", color: C.yellow, auto: false },
            { n: "6", label: "Deploy Prod", icon: "🚀", color: C.purple, auto: false },
            { n: "7", label: "Notify", icon: "🔔", color: C.orange, auto: true },
          ].map((s, i, arr) => (
            <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{
                background: s.color + "15", border: `1px solid ${s.color}55`,
                borderRadius: 6, padding: "6px 10px", textAlign: "center", minWidth: 72,
              }}>
                <div style={{ fontSize: 14, marginBottom: 2 }}>{s.icon}</div>
                <div style={{ color: s.color, fontSize: 9, fontWeight: 700 }}>{s.label}</div>
                <Tag color={s.auto ? C.green : C.yellow} small>{s.auto ? "AUTO" : "APPROVAL"}</Tag>
              </div>
              {i < arr.length - 1 && <span style={{ color: C.muted, fontSize: 10 }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Env summary */}
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          { label: "DEV", color: C.green, port_fe: 80, port_be: 8000, port_db: 5432, db: "devdb", debug: "True", workers: 1, restart: "on-failure" },
          { label: "QA", color: C.cyan, port_fe: 81, port_be: 8001, port_db: 5433, db: "qadb", debug: "False", workers: 1, restart: "on-failure" },
          { label: "PROD", color: C.purple, port_fe: 82, port_be: 8002, port_db: 5434, db: "proddb", debug: "False", workers: 3, restart: "always" },
        ].map(e => (
          <div key={e.label} style={{ background: C.card, border: `1px solid ${e.color}33`, borderRadius: 8, padding: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <Pulse color={e.color} />
              <span style={{ color: e.color, fontSize: 11, fontWeight: 700 }}>{e.label} Environment</span>
            </div>
            {[
              ["Frontend", `:${e.port_fe}`],
              ["Backend", `:${e.port_be}`],
              ["PostgreSQL", `:${e.port_db}`],
              ["Database", e.db],
              ["DEBUG", e.debug],
              ["Workers", e.workers],
              ["Restart", e.restart],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ color: C.muted, fontSize: 8 }}>{k}</span>
                <span style={{ color: e.color, fontSize: 8, fontFamily: "monospace" }}>{v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TAB: DOCKER STACK ──────────────────────────────────────────────────────
function DockerTab() {
  const [active, setActive] = useState(null);
  const envs = [
    {
      label: "DEV", color: C.green, network: "infrastructure_appnetwork",
      containers: [
        { name: "frontend-1", image: "infrastructure-frontend", tech: "React 18 → Nginx Alpine", port: "80:80", color: C.cyan, icon: "⚛️", details: ["Vite build → /dist", "Nginx static serve", "API proxy → :8000"] },
        { name: "backend-1", image: "infrastructure-backend", tech: "Django 5 + Gunicorn", port: "8000:8000", color: C.green, icon: "🐍", details: ["python-decouple .env", "1 Gunicorn worker", "manage.py migrate"] },
        { name: "db-1", image: "postgres:16-alpine", tech: "PostgreSQL 16", port: "5432:5432", color: C.purple, icon: "🗄️", details: ["Volume: postgres_data", "devdb / devuser", "pg_isready healthcheck"] },
      ]
    },
    {
      label: "QA", color: C.cyan, network: "qa_network",
      containers: [
        { name: "qa-frontend-1", image: "infrastructure-frontend", tech: "React 18 → Nginx Alpine", port: "81:80", color: C.cyan, icon: "⚛️", details: ["Same build as Dev", "Port 81 (host)", "QA test data"] },
        { name: "qa-backend-1", image: "infrastructure-backend", tech: "Django 5 + Gunicorn", port: "8001:8000", color: C.green, icon: "🐍", details: ["DEBUG=False", "1 Gunicorn worker", "qadb database"] },
        { name: "qa-db-1", image: "postgres:16-alpine", tech: "PostgreSQL 16", port: "5433:5432", color: C.purple, icon: "🗄️", details: ["Volume: qa_postgres_data", "qadb / qauser", "Isolated from dev"] },
      ]
    },
    {
      label: "PROD", color: C.purple, network: "prod_network",
      containers: [
        { name: "prod-frontend-1", image: "infrastructure-frontend", tech: "React 18 → Nginx Alpine", port: "82:80", color: C.cyan, icon: "⚛️", details: ["Production build", "Port 82 (host)", "Live users"] },
        { name: "prod-backend-1", image: "infrastructure-backend", tech: "Django 5 + Gunicorn", port: "8002:8000", color: C.green, icon: "🐍", details: ["DEBUG=False", "3 Gunicorn workers", "restart: always"] },
        { name: "prod-db-1", image: "postgres:16-alpine", tech: "PostgreSQL 16", port: "5434:5432", color: C.purple, icon: "🗄️", details: ["Volume: prod_postgres_data", "proddb / produser", "Production data"] },
      ]
    },
    {
      label: "JENKINS", color: C.yellow, network: "jenkins_default",
      containers: [
        { name: "jenkins", image: "jenkins-jenkins:lts", tech: "Jenkins LTS + Docker CLI", port: "8080:8080", color: C.yellow, icon: "🔧", details: ["jenkins_home volume", "docker.sock mounted", "All plugins installed", "Port 50000: agents"] },
      ]
    },
  ];
  return (
    <div>
      <SectionLabel color={C.blue}>DOCKER ENGINE 29.3.0 — COMPOSE v5.1.0</SectionLabel>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, background: C.dim, borderRadius: 6, padding: "6px 12px" }}>
        <span style={{ fontSize: 18 }}>🐳</span>
        <div>
          <span style={{ color: C.blue, fontSize: 10, fontWeight: 700 }}>4 Active Networks</span>
          <span style={{ color: C.muted, fontSize: 9, marginLeft: 12 }}>infrastructure_appnetwork · qa_network · prod_network · jenkins_default</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <Tag color={C.green}>10 containers</Tag>
          <Tag color={C.blue}>4 volumes</Tag>
        </div>
      </div>

      {envs.map(env => (
        <div key={env.label} style={{ marginBottom: 14, background: C.card, border: `1px solid ${env.color}33`, borderRadius: 10, padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Pulse color={env.color} />
            <span style={{ color: env.color, fontSize: 11, fontWeight: 700 }}>{env.label} ENVIRONMENT</span>
            <Tag color={env.color} small>{env.network}</Tag>
            <span style={{ color: C.muted, fontSize: 8, marginLeft: "auto" }}>bridge driver — DNS by service name</span>
          </div>

          {/* Request flow */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10, background: C.bg, borderRadius: 6, padding: "6px 10px", overflowX: "auto" }}>
            <span style={{ color: C.muted, fontSize: 8 }}>🌐 Browser</span>
            <Arrow label={`localhost:${env.containers[0]?.port.split(":")[0]}`} color={env.color} />
            <span style={{ color: env.color, fontSize: 8 }}>Nginx</span>
            <Arrow label="/api/* →" color={C.green} />
            <span style={{ color: C.green, fontSize: 8 }}>Django</span>
            <Arrow label="SQL" color={C.purple} />
            <span style={{ color: C.purple, fontSize: 8 }}>PostgreSQL</span>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {env.containers.map(c => (
              <div key={c.name} onClick={() => setActive(active === c.name ? null : c.name)}
                style={{
                  flex: 1, minWidth: 160, background: C.bg,
                  border: `1px solid ${active === c.name ? c.color : c.color + "33"}`,
                  borderRadius: 8, padding: "8px 10px", cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: active === c.name ? `0 0 12px ${c.color}22` : "none",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 14 }}>{c.icon}</span>
                  <div>
                    <div style={{ color: c.color, fontSize: 9, fontFamily: "monospace" }}>{c.name}</div>
                    <div style={{ color: C.muted, fontSize: 8 }}>{c.tech}</div>
                  </div>
                  <Tag color={c.color} small>{c.port}</Tag>
                </div>
                {active === c.name && (
                  <div style={{ borderTop: `1px solid ${c.color}22`, paddingTop: 6, marginTop: 4 }}>
                    {c.details.map((d, i) => <div key={i} style={{ color: c.color, fontSize: 8, marginBottom: 2 }}>▸ {d}</div>)}
                    <div style={{ color: C.muted, fontSize: 7, marginTop: 4 }}>image: {c.image}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── TAB: JENKINS PIPELINE ──────────────────────────────────────────────────
function JenkinsTab() {
  const [running, setRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState(-1);
  const [stageStatus, setStageStatus] = useState({});
  const [waitingApproval, setWaitingApproval] = useState(null);
  const timerRef = useRef(null);

  const stages = [
    { id: "checkout", label: "Checkout", icon: "📥", color: C.blue, auto: true, duration: 800, desc: "git ls-remote · clone repo · workspace clean" },
    { id: "django", label: "Django Tests", icon: "🧪", color: C.green, auto: true, duration: 1500, desc: "venv · pip install · manage.py test" },
    { id: "react", label: "React Build", icon: "⚛️", color: C.cyan, auto: true, duration: 1200, desc: "npm ci · vite build · dist/ output" },
    { id: "dev", label: "Deploy Dev", icon: "🛠️", color: C.green, auto: true, duration: 1000, desc: "docker compose -f dev/docker-compose.yml up -d --build" },
    { id: "qa", label: "Deploy QA", icon: "🧪", color: C.yellow, auto: false, duration: 1000, desc: "docker compose -f qa/docker-compose.yml up -d --build" },
    { id: "prod", label: "Deploy Prod", icon: "🚀", color: C.purple, auto: false, duration: 1000, desc: "docker compose -f prod/docker-compose.yml up -d --build" },
    { id: "notify", label: "Notify", icon: "🔔", color: C.orange, auto: true, duration: 400, desc: "email · build result · stage summary" },
  ];

  const runNext = (idx, statuses) => {
    if (idx >= stages.length) { setRunning(false); setCurrentStage(-1); return; }
    const s = stages[idx];
    setCurrentStage(idx);
    if (!s.auto) { setWaitingApproval(idx); return; }
    timerRef.current = setTimeout(() => {
      const newStatus = { ...statuses, [s.id]: "success" };
      setStageStatus(newStatus);
      runNext(idx + 1, newStatus);
    }, s.duration);
  };

  const startBuild = () => {
    clearTimeout(timerRef.current);
    setRunning(true); setCurrentStage(0); setStageStatus({}); setWaitingApproval(null);
    timerRef.current = setTimeout(() => {
      const newStatus = { checkout: "success" };
      setStageStatus(newStatus);
      runNext(1, newStatus);
    }, stages[0].duration);
  };

  const approve = () => {
    if (waitingApproval === null) return;
    const idx = waitingApproval;
    setWaitingApproval(null);
    timerRef.current = setTimeout(() => {
      const newStatus = { ...stageStatus, [stages[idx].id]: "success" };
      setStageStatus(newStatus);
      runNext(idx + 1, newStatus);
    }, stages[idx].duration);
  };

  const reset = () => { clearTimeout(timerRef.current); setRunning(false); setCurrentStage(-1); setStageStatus({}); setWaitingApproval(null); };

  const getStageColor = (s, i) => {
    if (stageStatus[s.id] === "success") return C.green;
    if (currentStage === i && waitingApproval === i) return C.yellow;
    if (currentStage === i) return s.color;
    return C.muted;
  };

  return (
    <div>
      <SectionLabel color={C.yellow}>JENKINS PIPELINE SIMULATOR — mydevopsapp</SectionLabel>

      {/* Jenkins info */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <div style={{ background: C.card, border: `1px solid ${C.yellow}33`, borderRadius: 8, padding: "8px 12px", flex: 1 }}>
          <div style={{ color: C.yellow, fontSize: 10, fontWeight: 700, marginBottom: 6 }}>🔧 Jenkins Container</div>
          {[["Image", "jenkins-jenkins:lts"], ["Port", "8080:8080 · 50000:50000"], ["Volume", "jenkins_home"], ["Docker Socket", "/var/run/docker.sock"], ["Trigger", "Webhook + Manual"], ["URL", "http://localhost:8080"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={{ color: C.muted, fontSize: 8 }}>{k}</span>
              <span style={{ color: C.yellow, fontSize: 8 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.orange}33`, borderRadius: 8, padding: "8px 12px", flex: 1 }}>
          <div style={{ color: C.orange, fontSize: 10, fontWeight: 700, marginBottom: 6 }}>📋 Jenkinsfile Config</div>
          {[["SCM", "Git (local file:// path)"], ["Branch", "*/main"], ["Script", "Jenkinsfile"], ["Poll SCM", "H/5 * * * *"], ["QA Gate", "Manual approval"], ["Prod Gate", "Manual approval"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={{ color: C.muted, fontSize: 8 }}>{k}</span>
              <span style={{ color: C.orange, fontSize: 8 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.pink}33`, borderRadius: 8, padding: "8px 12px", flex: 1 }}>
          <div style={{ color: C.pink, fontSize: 10, fontWeight: 700, marginBottom: 6 }}>🔔 Notifications</div>
          {[["On Start", "Pipeline started"], ["Stage Fail", "Email alert"], ["Test Fail", "Block pipeline"], ["Deploy OK", "Success email"], ["Approval", "Waiting notification"], ["Complete", "Full summary"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={{ color: C.muted, fontSize: 8 }}>{k}</span>
              <span style={{ color: C.pink, fontSize: 8 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline visualizer */}
      <div style={{ background: C.card, border: `1px solid ${C.yellow}33`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ color: C.yellow, fontSize: 10, fontWeight: 700 }}>
            {running && waitingApproval !== null ? `⏸ Waiting for approval: ${stages[waitingApproval]?.label}` :
              running ? `⚙️ Running: ${stages[currentStage]?.label || ""}` :
                Object.keys(stageStatus).length > 0 ? "✅ Build Complete" : "⬤ Ready to Build"}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {waitingApproval !== null && (
              <button onClick={approve} style={{
                background: C.green + "22", border: `1px solid ${C.green}`,
                color: C.green, padding: "4px 12px", borderRadius: 6, fontSize: 9,
                cursor: "pointer", fontFamily: "monospace", fontWeight: 700,
              }}>✅ APPROVE {stages[waitingApproval]?.label.toUpperCase()}</button>
            )}
            <button onClick={running ? reset : startBuild} style={{
              background: running ? C.red + "22" : C.yellow + "22",
              border: `1px solid ${running ? C.red : C.yellow}`,
              color: running ? C.red : C.yellow,
              padding: "4px 14px", borderRadius: 6, fontSize: 9,
              cursor: "pointer", fontFamily: "monospace", fontWeight: 700,
            }}>{running ? "⛔ ABORT" : "▶ BUILD NOW"}</button>
          </div>
        </div>

        {/* Stage pipeline */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 4, overflowX: "auto" }}>
          {stages.map((s, i) => {
            const col = getStageColor(s, i);
            const isActive = currentStage === i;
            const isDone = stageStatus[s.id] === "success";
            const isWaiting = waitingApproval === i;
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{
                  background: isDone ? col + "22" : isActive ? col + "15" : C.bg,
                  border: `1px solid ${isDone || isActive ? col : col + "44"}`,
                  borderRadius: 8, padding: "8px 10px", minWidth: 90, textAlign: "center",
                  transition: "all 0.3s",
                  boxShadow: isActive && !isDone ? `0 0 14px ${col}33` : "none",
                }}>
                  <div style={{ fontSize: 16, marginBottom: 3 }}>{isDone ? "✅" : isWaiting ? "⏸️" : s.icon}</div>
                  <div style={{ color: col, fontSize: 9, fontWeight: 700 }}>{s.label}</div>
                  <div style={{ marginTop: 3 }}>
                    <Tag color={s.auto ? C.blue : C.yellow} small>{s.auto ? "AUTO" : "GATE"}</Tag>
                  </div>
                  {(isActive || isDone) && (
                    <div style={{ color: col, fontSize: 7, marginTop: 4, opacity: 0.8 }}>
                      {isDone ? "PASSED" : isWaiting ? "WAITING..." : "RUNNING..."}
                    </div>
                  )}
                </div>
                {i < stages.length - 1 && (
                  <span style={{ color: isDone ? C.green : C.muted, fontSize: 10 }}>→</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Stage detail */}
        {currentStage >= 0 && (
          <div style={{ marginTop: 10, background: C.bg, borderRadius: 6, padding: "6px 10px", borderLeft: `2px solid ${stages[currentStage]?.color}` }}>
            <span style={{ color: stages[currentStage]?.color, fontSize: 8 }}>
              sh: {stages[currentStage]?.desc}
            </span>
          </div>
        )}
      </div>

      {/* Jenkinsfile snippet */}
      <div style={{ background: "#0a0f1a", border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
        <div style={{ color: C.muted, fontSize: 8, marginBottom: 6 }}>📄 Jenkinsfile (excerpt)</div>
        {[
          ["keyword", "pipeline {"],
          ["keyword", "  agent any"],
          ["comment", "  // Auto trigger on push + manual"],
          ["keyword", "  stages {"],
          ["stage", "    stage('Django Tests') {"],
          ["code", "      steps { sh 'python manage.py test' }"],
          ["stage", "    stage('Deploy QA') {"],
          ["code", "      steps {"],
          ["gate", "        input message: 'Approve QA deploy?'"],
          ["code", "        sh 'docker compose -f qa/docker-compose.yml up -d'"],
          ["stage", "    stage('Deploy Prod') {"],
          ["gate", "        input message: 'Approve PROD deploy?'"],
          ["code", "        sh 'docker compose -f prod/docker-compose.yml up -d'"],
          ["keyword", "  post { failure { mail ... } }"],
          ["keyword", "}"],
        ].map(([type, line], i) => (
          <div key={i} style={{
            color: type === "keyword" ? C.blue : type === "stage" ? C.cyan : type === "gate" ? C.yellow : type === "comment" ? C.green : C.text,
            fontSize: 9, fontFamily: "monospace", lineHeight: 1.7,
          }}>{line}</div>
        ))}
      </div>
    </div>
  );
}

// ─── TAB: ENVIRONMENTS ──────────────────────────────────────────────────────
function EnvsTab() {
  const [sel, setSel] = useState("dev");
  const envs = {
    dev: {
      label: "DEV", color: C.green, purpose: "Active development — code changes tested here first",
      ports: { frontend: 80, backend: 8000, db: 5432 },
      vars: { SECRET_KEY: "dev-secret-key", DEBUG: "True", DB_NAME: "devdb", DB_USER: "devuser", DB_HOST: "db", WORKERS: "1" },
      network: "infrastructure_appnetwork",
      compose: "infrastructure/dev/docker-compose.yml",
      trigger: "Automatic on every Jenkins build",
      access: ["http://localhost", "http://localhost:8000/api/health/", "http://localhost:8000/admin"],
      notes: ["Hot reload possible via volume mounts", "DEBUG=True shows stack traces", "Single Gunicorn worker sufficient"],
    },
    qa: {
      label: "QA", color: C.cyan, purpose: "Testing — validates features before production release",
      ports: { frontend: 81, backend: 8001, db: 5433 },
      vars: { SECRET_KEY: "qa-secret-key", DEBUG: "False", DB_NAME: "qadb", DB_USER: "qauser", DB_HOST: "db", WORKERS: "1" },
      network: "qa_network",
      compose: "infrastructure/qa/docker-compose.yml",
      trigger: "Manual approval required in Jenkins",
      access: ["http://localhost:81", "http://localhost:8001/api/health/", "http://localhost:8001/admin"],
      notes: ["DEBUG=False mimics production", "Separate qadb isolates test data", "QA team validates before prod push"],
    },
    prod: {
      label: "PROD", color: C.purple, purpose: "Production — live environment for end users",
      ports: { frontend: 82, backend: 8002, db: 5434 },
      vars: { SECRET_KEY: "strong-prod-key!!!", DEBUG: "False", DB_NAME: "proddb", DB_USER: "produser", DB_HOST: "db", WORKERS: "3" },
      network: "prod_network",
      compose: "infrastructure/prod/docker-compose.yml",
      trigger: "Manual approval required + QA must pass first",
      access: ["http://localhost:82", "http://localhost:8002/api/health/", "http://localhost:8002/admin"],
      notes: ["3 Gunicorn workers for concurrency", "restart: always — auto recovers from crashes", "proddb is live user data — never wipe!"],
    },
  };
  const e = envs[sel];
  return (
    <div>
      <SectionLabel color={C.cyan}>THREE ISOLATED ENVIRONMENTS — SINGLE UBUNTU MACHINE</SectionLabel>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {Object.entries(envs).map(([key, env]) => (
          <button key={key} onClick={() => setSel(key)} style={{
            flex: 1, background: sel === key ? env.color + "22" : C.card,
            border: `1px solid ${sel === key ? env.color : env.color + "44"}`,
            borderRadius: 8, padding: "8px 12px", cursor: "pointer",
            transition: "all 0.2s",
          }}>
            <Pulse color={env.color} />
            <div style={{ color: env.color, fontSize: 11, fontWeight: 700, marginTop: 4 }}>{env.label}</div>
            <div style={{ color: C.muted, fontSize: 8 }}>:{env.ports.frontend}</div>
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: C.card, border: `1px solid ${e.color}33`, borderRadius: 8, padding: 12 }}>
          <div style={{ color: e.color, fontSize: 10, fontWeight: 700, marginBottom: 8 }}>⚙️ Configuration</div>
          <div style={{ color: C.muted, fontSize: 8, marginBottom: 8 }}>{e.purpose}</div>
          {Object.entries(e.vars).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, background: C.bg, borderRadius: 4, padding: "3px 8px" }}>
              <span style={{ color: C.muted, fontSize: 8 }}>{k}</span>
              <span style={{ color: e.color, fontSize: 8, fontFamily: "monospace" }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: C.card, border: `1px solid ${e.color}33`, borderRadius: 8, padding: 12 }}>
            <div style={{ color: e.color, fontSize: 10, fontWeight: 700, marginBottom: 8 }}>🌐 Access URLs</div>
            {e.access.map((url, i) => (
              <div key={i} style={{ color: e.color, fontSize: 8, fontFamily: "monospace", marginBottom: 3 }}>▸ {url}</div>
            ))}
            <div style={{ marginTop: 8 }}>
              <div style={{ color: C.muted, fontSize: 8 }}>Network: <span style={{ color: e.color }}>{e.network}</span></div>
              <div style={{ color: C.muted, fontSize: 8 }}>Compose: <span style={{ color: e.color }}>{e.compose}</span></div>
            </div>
          </div>

          <div style={{ background: C.card, border: `1px solid ${e.color}33`, borderRadius: 8, padding: 12 }}>
            <div style={{ color: e.color, fontSize: 10, fontWeight: 700, marginBottom: 8 }}>🚀 Deploy Trigger</div>
            <div style={{ color: e.color, fontSize: 8, marginBottom: 8 }}>▸ {e.trigger}</div>
            <div style={{ color: C.muted, fontSize: 8, fontWeight: 700, marginBottom: 4 }}>Notes:</div>
            {e.notes.map((n, i) => <div key={i} style={{ color: C.muted, fontSize: 8, marginBottom: 2 }}>• {n}</div>)}
          </div>
        </div>
      </div>

      {/* Port map */}
      <div style={{ marginTop: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ background: C.dim, padding: "6px 12px", color: C.text, fontSize: 9, fontWeight: 700 }}>Port Map — All Environments on One Machine</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 0 }}>
          {["Service", "DEV", "QA", "PROD"].map((h, i) => (
            <div key={h} style={{ padding: "5px 12px", background: C.dim, color: i === 0 ? C.muted : [C.green, C.cyan, C.purple][i - 1], fontSize: 9, fontWeight: 700 }}>{h}</div>
          ))}
          {[
            ["Frontend (Nginx)", "80", "81", "82"],
            ["Backend (Django)", "8000", "8001", "8002"],
            ["Database (PostgreSQL)", "5432", "5433", "5434"],
            ["Jenkins", "8080", "—", "—"],
          ].map((row, ri) => row.map((cell, ci) => (
            <div key={`${ri}-${ci}`} style={{
              padding: "4px 12px", fontSize: 8,
              color: ci === 0 ? C.muted : [C.green, C.cyan, C.purple][ci - 1],
              fontFamily: ci > 0 ? "monospace" : "inherit",
              background: ri % 2 === 0 ? "transparent" : C.bg + "88",
              borderTop: `1px solid ${C.border}44`,
            }}>{cell}</div>
          )))}
        </div>
      </div>
    </div>
  );
}

// ─── TAB: HOW IT WORKS ──────────────────────────────────────────────────────
function HowItWorksTab() {
  const [open, setOpen] = useState(0);
  const steps = [
    { icon: "⌨️", title: "1. Developer writes code", color: C.blue,
      body: "Code is written on Ubuntu 22.04 (gamebox) using VS Code or nano. The Django backend uses Python 3.11 inside a .venv virtual environment so packages are isolated per project. The React frontend uses Node.js 20 LTS. Git tracks all changes.",
      commands: ["cd ~/projects/mydevopsapp/backend", "source .venv/bin/activate", "python manage.py runserver", "cd ~/projects/mydevopsapp/frontend", "npm run dev"] },
    { icon: "🐙", title: "2. Code is committed and pushed to GitHub", color: C.orange,
      body: "When the developer runs git push, code goes to the remote GitHub repository. GitHub stores history, branches, and pull requests. The .gitignore ensures .env files, node_modules, and __pycache__ are never committed. GitHub then fires a webhook to Jenkins.",
      commands: ["git add .", 'git commit -m "feat: new feature"', "git push origin main"] },
    { icon: "🔧", title: "3. Jenkins receives the webhook and starts the pipeline", color: C.yellow,
      body: "Jenkins is running inside its own Docker container on port 8080. It has docker.sock mounted so it can control other containers. When GitHub sends a webhook, Jenkins starts the Jenkinsfile pipeline automatically. You can also trigger it manually via the Jenkins dashboard.",
      commands: ["docker exec jenkins docker ps", "# Jenkins reads Jenkinsfile from repo", "# Polls SCM every 5 minutes as backup"] },
    { icon: "🧪", title: "4. Pipeline runs Django tests and React build", color: C.green,
      body: "Stage 1 checks out the code. Stage 2 creates a Python venv inside Jenkins, installs requirements, and runs manage.py test. If any test fails the pipeline stops and sends a failure email. Stage 3 runs npm ci and npm run build for the React app.",
      commands: ["python manage.py test", "npm ci && npm run build", "# Failure → email notification → pipeline stops"] },
    { icon: "🛠️", title: "5. Auto-deploy to Dev environment", color: C.green,
      body: "If all tests pass, Jenkins automatically deploys to the Dev environment using docker compose. Dev runs on ports :80 (frontend), :8000 (backend), :5432 (PostgreSQL). DEBUG=True and a single Gunicorn worker. This happens without any human approval.",
      commands: ["docker compose -f infrastructure/dev/docker-compose.yml down", "docker compose -f infrastructure/dev/docker-compose.yml up -d --build"] },
    { icon: "⏸️", title: "6. Manual approval gate for QA", color: C.yellow,
      body: "Before deploying to QA, Jenkins pauses and waits for a human to click Approve in the Jenkins dashboard. This gives the team a chance to review Dev before it goes to QA. QA runs on ports :81 (frontend), :8001 (backend), :5433 (PostgreSQL) with DEBUG=False.",
      commands: ["# Jenkins pauses at input step", "# Go to: http://localhost:8080", '# Click "Approve QA deploy?"', "# Jenkins then runs docker compose up for QA"] },
    { icon: "🚀", title: "7. Manual approval gate for Production", color: C.purple,
      body: "Same approval pattern for Production. A second human click is required before prod is touched. Production has 3 Gunicorn workers for concurrency, restart: always so it auto-recovers from crashes, and uses proddb which contains live user data.",
      commands: ["# Jenkins pauses again for prod approval", '# Click "Approve PROD deploy?"', "# docker compose -f prod/docker-compose.yml up -d --build", "# 3 Gunicorn workers start"] },
    { icon: "🔔", title: "8. Notifications at every step", color: C.orange,
      body: "Jenkins sends email notifications at key points: when a build starts, when a stage fails, when awaiting approval, and when the full pipeline completes. The post{} block in the Jenkinsfile handles success and failure emails automatically.",
      commands: ["# post { success { mail to: 'you@email.com' } }", "# post { failure { mail to: 'you@email.com' } }", "# Subject: Build #N passed/failed", "# Body: contains BUILD_URL link"] },
  ];

  return (
    <div>
      <SectionLabel color={C.green}>END-TO-END PIPELINE WALKTHROUGH</SectionLabel>
      {steps.map((s, i) => (
        <div key={i} onClick={() => setOpen(open === i ? -1 : i)}
          style={{
            background: open === i ? s.color + "0f" : C.card,
            border: `1px solid ${open === i ? s.color + "55" : C.border}`,
            borderLeft: `3px solid ${open === i ? s.color : s.color + "44"}`,
            borderRadius: 8, padding: "10px 14px", marginBottom: 6,
            cursor: "pointer", transition: "all 0.2s",
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>{s.icon}</span>
            <span style={{ color: s.color, fontSize: 11, fontWeight: 700, flex: 1 }}>{s.title}</span>
            <span style={{ color: C.muted, fontSize: 10 }}>{open === i ? "▲" : "▼"}</span>
          </div>
          {open === i && (
            <div style={{ marginTop: 10 }}>
              <p style={{ color: C.text, fontSize: 9, lineHeight: 1.7, margin: "0 0 10px" }}>{s.body}</p>
              <div style={{ background: "#0a0f1a", borderRadius: 6, padding: "8px 12px" }}>
                {s.commands.map((cmd, j) => (
                  <div key={j} style={{
                    color: cmd.startsWith("#") ? C.green : C.cyan,
                    fontSize: 9, fontFamily: "monospace", lineHeight: 1.8,
                  }}>{cmd.startsWith("#") ? cmd : `$ ${cmd}`}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── TAB: ENV REFERENCE ─────────────────────────────────────────────────────
function ReferenceTab() {
  const rows = [
    ["OS", "Ubuntu 22.04 LTS", "gamebox", C.blue],
    ["Python", "3.11.x", ".venv per project", C.green],
    ["Node.js", "20 LTS", "npm 10.x", C.cyan],
    ["Django", "5.x + DRF", "Gunicorn 25.1", C.green],
    ["React", "18 + Vite", "Nginx Alpine (Docker)", C.cyan],
    ["PostgreSQL", "16 Alpine", "3 isolated databases", C.purple],
    ["Docker Engine", "29.3.0", "docker group: sijimon", C.blue],
    ["Docker Compose", "v5.1.0", "4 compose files", C.blue],
    ["Jenkins", "LTS (Docker)", "localhost:8080", C.yellow],
    ["Git", "2.x", "SSH key → GitHub", C.orange],
    ["CI Trigger", "Webhook + Manual", "Poll: H/5 * * * *", C.yellow],
    ["Dev Frontend", "http://localhost", "port 80", C.green],
    ["Dev Backend", "http://localhost:8000", "Gunicorn :8000", C.green],
    ["QA Frontend", "http://localhost:81", "port 81", C.cyan],
    ["QA Backend", "http://localhost:8001", "Gunicorn :8001", C.cyan],
    ["Prod Frontend", "http://localhost:82", "port 82", C.purple],
    ["Prod Backend", "http://localhost:8002", "Gunicorn :8002", C.purple],
    ["Jenkins UI", "http://localhost:8080", "admin credentials", C.yellow],
  ];

  const commands = [
    ["Start all environments", "docker compose -f infrastructure/dev/docker-compose.yml up -d\ndocker compose -f infrastructure/qa/docker-compose.yml up -d\ndocker compose -f infrastructure/prod/docker-compose.yml up -d"],
    ["Check all containers", "docker ps"],
    ["View Jenkins logs", "docker logs jenkins"],
    ["Run Django tests", "cd backend && python manage.py test"],
    ["Create superuser (Dev)", "docker exec -it infrastructure-backend-1 python manage.py createsuperuser"],
    ["Access Dev DB", "docker exec -it infrastructure-db-1 psql -U devuser -d devdb"],
    ["Trigger Jenkins build", "http://localhost:8080 → mydevopsapp → Build Now"],
    ["Fix Docker permissions", "newgrp docker  (or logout/login permanently)"],
  ];

  return (
    <div>
      <SectionLabel color={C.muted}>FULL ENVIRONMENT REFERENCE</SectionLabel>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: C.dim }}>
          {["Component", "Value / Version", "Notes"].map(h => (
            <div key={h} style={{ padding: "6px 12px", color: C.muted, fontSize: 9, fontWeight: 700 }}>{h}</div>
          ))}
        </div>
        {rows.map(([label, value, note, color], i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: i % 2 === 0 ? "transparent" : C.bg + "66", borderTop: `1px solid ${C.border}44` }}>
            <div style={{ padding: "4px 12px", color: C.muted, fontSize: 8 }}>{label}</div>
            <div style={{ padding: "4px 12px", color, fontSize: 8, fontFamily: "monospace" }}>{value}</div>
            <div style={{ padding: "4px 12px", color: C.muted, fontSize: 8 }}>{note}</div>
          </div>
        ))}
      </div>

      <SectionLabel color={C.muted}>QUICK COMMAND REFERENCE</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {commands.map(([label, cmd], i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10 }}>
            <div style={{ color: C.cyan, fontSize: 9, fontWeight: 700, marginBottom: 6 }}>{label}</div>
            {cmd.split("\n").map((line, j) => (
              <div key={j} style={{ color: C.text, fontSize: 8, fontFamily: "monospace", lineHeight: 1.7 }}>
                {line.startsWith("http") ? <span style={{ color: C.blue }}>{line}</span> : `$ ${line}`}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Overview", icon: "🗺️" },
    { id: "docker", label: "Docker Stack", icon: "🐳" },
    { id: "jenkins", label: "Jenkins Pipeline", icon: "🔧" },
    { id: "envs", label: "Environments", icon: "🌍" },
    { id: "howitworks", label: "How It Works", icon: "📖" },
    { id: "reference", label: "Reference", icon: "📋" },
  ];

  return (
    <div style={{ ...style, background: C.bg, minHeight: "100vh", color: C.text }}>
      {/* Header */}
      <div style={{ background: C.panel, borderBottom: `1px solid ${C.border}`, padding: "14px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 3, height: 28, background: C.cyan, borderRadius: 2 }} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: C.cyan, letterSpacing: -0.5 }}>DevOps</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: C.text }}>Architecture</span>
              <Tag color={C.green}>LIVE</Tag>
              <Tag color={C.yellow}>Jenkins</Tag>
              <Tag color={C.purple}>3 Environments</Tag>
            </div>
            <div style={{ color: C.muted, fontSize: 9, marginTop: 2 }}>
              Django 5 · React 18 · PostgreSQL 16 · Docker 29.3 · Jenkins LTS · Ubuntu 22.04 — gamebox
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <Pulse color={C.green} /><span style={{ color: C.green, fontSize: 8 }}>Dev :80</span>
            <Pulse color={C.cyan} /><span style={{ color: C.cyan, fontSize: 8 }}>QA :81</span>
            <Pulse color={C.purple} /><span style={{ color: C.purple, fontSize: 8 }}>Prod :82</span>
            <Pulse color={C.yellow} /><span style={{ color: C.yellow, fontSize: 8 }}>Jenkins :8080</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 10, flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab === t.id ? C.cyan + "22" : "transparent",
              border: `1px solid ${tab === t.id ? C.cyan : C.border}`,
              color: tab === t.id ? C.cyan : C.muted,
              padding: "5px 12px", borderRadius: 20, fontSize: 9,
              cursor: "pointer", fontFamily: "monospace", fontWeight: 700,
              letterSpacing: 0.5, transition: "all 0.15s",
            }}>{t.icon} {t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 20px", maxWidth: 1100, margin: "0 auto" }}>
        {tab === "overview" && <OverviewTab />}
        {tab === "docker" && <DockerTab />}
        {tab === "jenkins" && <JenkinsTab />}
        {tab === "envs" && <EnvsTab />}
        {tab === "howitworks" && <HowItWorksTab />}
        {tab === "reference" && <ReferenceTab />}
      </div>
    </div>
  );
}