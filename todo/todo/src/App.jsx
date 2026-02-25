import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const USERS = [
  { id: "ceo", label: "CEO", role: "executive", x: 400, y: 80 },
  { id: "consultant1", label: "Consultant A", role: "consultant", x: 160, y: 220 },
  { id: "consultant2", label: "Consultant B", role: "consultant", x: 320, y: 300 },
  { id: "itadmin1", label: "IT Admin 1", role: "it_admin", x: 560, y: 220 },
  { id: "itadmin2", label: "IT Admin 2", role: "it_admin", x: 680, y: 320 },
  { id: "hr1", label: "HR Manager", role: "hr", x: 200, y: 400 },
];

const RESOURCES = [
  { id: "payroll", label: "Payroll Server", icon: "💰", x: 100, y: 540, sensitivity: "High" },
  { id: "hrdb", label: "HR Database", icon: "🗄️", x: 310, y: 580, sensitivity: "High" },
  { id: "aws", label: "AWS Cloud", icon: "☁️", x: 520, y: 540, sensitivity: "Medium" },
  { id: "crm", label: "CRM System", icon: "📊", x: 620, y: 600, sensitivity: "Medium" },
  { id: "codebase", label: "Codebase", icon: "💻", x: 740, y: 480, sensitivity: "Low" },
];

const SENSITIVITY_COLORS = {
  High: "#ef4444",   // Red
  Medium: "#f59e0b", // Orange
  Low: "#3b82f6",    // Blue
};

const SENSITIVITY_WEIGHTS = { High: 3, Medium: 2, Low: 1 };

const BAD_EDGES = [...USERS.flatMap(u => RESOURCES.map(r => ({ from: u.id, to: r.id })))];

const RBAC_EDGES = [
  { from: "ceo", to: "payroll" }, { from: "ceo", to: "hrdb" }, { from: "ceo", to: "aws" }, { from: "ceo", to: "crm" },
  { from: "consultant1", to: "crm" }, { from: "consultant2", to: "crm" },
  { from: "itadmin1", to: "aws" }, { from: "itadmin1", to: "codebase" },
  { from: "itadmin2", to: "aws" }, { from: "itadmin2", to: "codebase" },
  { from: "hr1", to: "hrdb" }, { from: "hr1", to: "payroll" },
];

const ROLE_COLORS = {
  executive: { bg: "#f59e0b", text: "#000", ring: "#fbbf24" },
  consultant: { bg: "#6366f1", text: "#fff", ring: "#818cf8" },
  it_admin: { bg: "#10b981", text: "#fff", ring: "#34d399" },
  hr: { bg: "#ec4899", text: "#fff", ring: "#f472b6" },
};

const ROLE_LABELS = {
  executive: "Executive", consultant: "Consultant", it_admin: "IT Admin", hr: "HR",
};

// ─── WEIGHTED RISK SCORE ─────────────────────────────────────────────────────
function computeRiskScore(edges) {
  const maxPossibleRisk = USERS.length * RESOURCES.reduce((acc, r) => acc + SENSITIVITY_WEIGHTS[r.sensitivity], 0);
  const actualRisk = edges.reduce((acc, e) => {
    const res = RESOURCES.find(r => r.id === e.to);
    return acc + (res ? SENSITIVITY_WEIGHTS[res.sensitivity] : 0);
  }, 0);
  return Math.round((actualRisk / maxPossibleRisk) * 100);
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function App() {
  const [isRBAC, setIsRBAC] = useState(false);
  const [compromised, setCompromised] = useState(null); // { id, type: 'user' | 'resource' }
  const [hoveredNode, setHoveredNode] = useState(null);
  const [animating, setAnimating] = useState(false);

  const edges = isRBAC ? RBAC_EDGES : BAD_EDGES;
  const riskScore = computeRiskScore(edges);

  // Determine blast radius based on what is compromised
  const blastResources = compromised?.type === 'user' 
    ? edges.filter(e => e.from === compromised.id).map(e => e.to) : [];
  const blastUsers = compromised?.type === 'resource' 
    ? edges.filter(e => e.to === compromised.id).map(e => e.from) : [];

  const handleToggle = () => {
    setAnimating(true);
    setCompromised(null);
    setTimeout(() => { setIsRBAC(v => !v); setAnimating(false); }, 300);
  };

  const handleNodeClick = (id, type) => {
    setCompromised(prev => (prev?.id === id ? null : { id, type }));
  };

  const svgW = 820, svgH = 680;

  return (
    <div style={{
      minHeight: "100vh", background: "#1d1a78", color: "#e2e8f0",
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace", display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <header style={{
        padding: "20px 32px", borderBottom: "1px solid #1e293b", display: "flex",
        alignItems: "center", justifyContent: "space-between", background: "#0c0a45", backdropFilter: "blur(8px)",
      }}>
        <div>
          <div style={{ fontSize: 11, color: "#d8d8e3", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
            Security Visualization Tool
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#f1f5f9", letterSpacing: -0.5 }}>
            BLAST RADIUS<span style={{ color: "#ef4444" }}>_</span>ANALYZER
          </h1>
        </div>

        {/* Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 12, color: isRBAC ? "#475569" : "#ef4444", fontWeight: 600, transition: "color 0.3s" }}>
            BAD MODEL
          </span>
          <div onClick={handleToggle} style={{
            width: 52, height: 28, background: isRBAC ? "#10b981" : "#ef4444",
            borderRadius: 14, cursor: "pointer", position: "relative",
            transition: "background 0.35s", border: "1px solid rgba(255,255,255,0.1)",
          }}>
            <div style={{
              position: "absolute", top: 3, left: isRBAC ? 26 : 3, width: 20, height: 20,
              borderRadius: "50%", background: "#fff", transition: "left 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
            }} />
          </div>
          <span style={{ fontSize: 12, color: isRBAC ? "#10b981" : "#475569", fontWeight: 600, transition: "color 0.3s" }}>
            RBAC
          </span>
        </div>

        {/* Risk Score */}
        <div style={{
          textAlign: "center", background: "rgba(255,255,255,0.04)",
          border: `1px solid ${riskScore > 60 ? "#ef444440" : riskScore > 30 ? "#f59e0b40" : "#10b98140"}`,
          borderRadius: 12, padding: "10px 20px", minWidth: 110, transition: "border-color 0.4s",
        }}>
          <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 2, textTransform: "uppercase" }}>Weighted Risk</div>
          <div style={{
            fontSize: 32, fontWeight: 800, color: riskScore > 60 ? "#ef4444" : riskScore > 30 ? "#f59e0b" : "#10b981",
            transition: "color 0.4s", lineHeight: 1.1,
          }}>
            {riskScore}%
          </div>
        </div>
      </header>

      {/* Info bar */}
      <div style={{
        padding: "10px 32px",
        background: compromised ? "linear-gradient(90deg, rgba(239,68,68,0.15), transparent)" : "rgba(15,15,25,0.5)",
        borderBottom: "1px solid #1e293b", fontSize: 12, display: "flex", alignItems: "center", gap: 12, minHeight: 40,
      }}>
        {compromised ? (
          <>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#ef4444", animation: "pulse 1s infinite" }} />
            <span style={{ color: "#ef4444", fontWeight: 700 }}>
              {compromised.type === 'user' ? "ACCOUNT COMPROMISED:" : "RESOURCE BREACHED:"}
            </span>
            <span style={{ color: "#fca5a5" }}>
              {compromised.type === 'user' ? USERS.find(u => u.id === compromised.id)?.label : RESOURCES.find(r => r.id === compromised.id)?.label}
            </span>
            <span style={{ color: "#64748b", marginLeft: 8 }}>
              {compromised.type === 'user' 
                ? `→ ${blastResources.length} resource(s) exposed` 
                : `→ ${blastUsers.length} user(s) potentially affected`}
            </span>
            <button onClick={() => setCompromised(null)} style={{
              marginLeft: "auto", fontSize: 11, color: "#64748b", background: "none",
              border: "1px solid #334155", borderRadius: 6, padding: "3px 10px", cursor: "pointer",
            }}>CLEAR ✕</button>
          </>
        ) : (
          <span style={{ color: "#d8d8e3" }}>
            Click any <span style={{ color: "#6366f1", fontWeight: 'bold' }}>User</span> or <span style={{ color: "#f59e0b", fontWeight: 'bold' }}>Resource</span> to trace access paths and simulate blast radius. Hover to isolate edges.
          </span>
        )}
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Graph */}
        <div style={{ flex: 1, padding: 16, position: "relative" }}>
          <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{ opacity: animating ? 0 : 1, transition: "opacity 0.3s", display: "block" }}>
            <defs>
              <filter id="glow-red"><feGaussianBlur stdDeviation="4" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter>
              <marker id="arr-normal" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#334155" /></marker>
              <marker id="arr-blast" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ef4444" /></marker>
              <marker id="arr-safe" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#10b981" /></marker>
            </defs>

            <text x="12" y="30" fill="#a7a6bd" fontSize="11" fontFamily="monospace" fontWeight="700" letterSpacing="3">USERS</text>
            <line x1="12" y1="35" x2={svgW - 12} y2="35" stroke="#d8d8e3" strokeOpacity="0.2" strokeWidth="1" />
            <text x="12" y={svgH - 12} fill="#a7a6bd" fontSize="11" fontFamily="monospace" fontWeight="700" letterSpacing="3">RESOURCES</text>

            {/* Edges */}
            {edges.map((edge, i) => {
              const from = USERS.find(u => u.id === edge.from);
              const to = RESOURCES.find(r => r.id === edge.to);
              if (!from || !to) return null;

              const isBlast = (compromised?.type === 'user' && compromised.id === edge.from) || 
                              (compromised?.type === 'resource' && compromised.id === edge.to);
              
              const isHoveredEdge = hoveredNode && (edge.from === hoveredNode || edge.to === hoveredNode);
              const isDimmed = (hoveredNode && !isHoveredEdge) || (compromised && !isBlast);

              let stroke = "#334155";
              let opacity = isDimmed ? 0.05 : 0.4;
              let strokeW = isHoveredEdge ? 2 : 1;
              let marker = "url(#arr-normal)";

              if (isBlast) { stroke = "#ef4444"; opacity = 1; strokeW = 2; marker = "url(#arr-blast)"; }
              else if (isRBAC && !isDimmed) { stroke = "#10b981"; opacity = isHoveredEdge ? 0.8 : 0.3; marker = "url(#arr-safe)"; }
              else if (isHoveredEdge) { stroke = "#94a3b8"; opacity = 0.8; }

              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2;

              return (
                <path
                  key={`${edge.from}-${edge.to}-${i}`}
                  d={`M${from.x},${from.y} Q${mx + 20},${my} ${to.x},${to.y}`}
                  stroke={stroke} strokeWidth={strokeW} strokeOpacity={opacity} fill="none"
                  markerEnd={marker} style={{ transition: "all 0.3s ease" }}
                />
              );
            })}

            {/* Resources */}
            {RESOURCES.map(res => {
              const isComp = compromised?.id === res.id;
              const isHit = blastResources.includes(res.id);
              const isHovered = hoveredNode === res.id;
              const sensColor = SENSITIVITY_COLORS[res.sensitivity];

              return (
                <g key={res.id} transform={`translate(${res.x},${res.y})`} 
                   onClick={() => handleNodeClick(res.id, 'resource')}
                   onMouseEnter={() => setHoveredNode(res.id)} onMouseLeave={() => setHoveredNode(null)}
                   style={{ cursor: "pointer" }}>
                  
                  {(isHit || isComp) && (
                    <circle r="34" fill="rgba(239,68,68,0.12)" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.5">
                      <animate attributeName="r" values="32;38;32" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {isHovered && !isComp && !isHit && (
                    <rect x="-52" y="-26" width="104" height="52" rx="10" fill="none" stroke="#94a3b8" strokeWidth="1" strokeOpacity="0.5" />
                  )}

                  <rect x="-48" y="-22" width="96" height="44" rx="8"
                    fill={(isHit || isComp) ? "rgba(239,68,68,0.2)" : "rgba(15,20,40,0.9)"}
                    stroke={(isHit || isComp) ? "#ef4444" : isRBAC ? "#10b981" : "#334155"}
                    strokeWidth={(isHit || isComp) ? 2 : 1}
                    filter={(isHit || isComp) ? "url(#glow-red)" : "none"}
                    style={{ transition: "all 0.3s" }}
                  />
                  
                  {/* Sensitivity Indicator Dot */}
                  <circle cx="-38" cy="-12" r="3" fill={sensColor} />
                  
                  <text x="0" y="-4" textAnchor="middle" fontSize="16">{res.icon}</text>
                  <text x="0" y="12" textAnchor="middle" fontSize="9" fill={(isHit || isComp) ? "#fca5a5" : "#64748b"} fontFamily="monospace" fontWeight={(isHit || isComp) ? "700" : "400"}>
                    {res.label.toUpperCase()}
                  </text>
                </g>
              );
            })}

            {/* Users */}
            {USERS.map(user => {
              const isComp = compromised?.id === user.id;
              const isHit = blastUsers.includes(user.id);
              const cols = ROLE_COLORS[user.role];
              const isHovered = hoveredNode === user.id;

              return (
                <g key={user.id} transform={`translate(${user.x},${user.y})`}
                  onClick={() => handleNodeClick(user.id, 'user')}
                  onMouseEnter={() => setHoveredNode(user.id)} onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: "pointer" }}>
                  
                  {(isComp || isHit) && (
                    <circle r="32" fill="rgba(239,68,68,0.1)" stroke="#ef4444" strokeWidth="2">
                      <animate attributeName="r" values="28;40;28" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {isHovered && !isComp && !isHit && (
                    <circle r="28" fill="none" stroke={cols.ring} strokeWidth="1.5" strokeOpacity="0.5" />
                  )}
                  
                  <circle r="22"
                    fill={(isComp || isHit) ? "#ef4444" : cols.bg}
                    stroke={(isComp || isHit) ? "#fca5a5" : "rgba(255,255,255,0.15)"}
                    strokeWidth={(isComp || isHit) ? 2 : 1}
                    filter={(isComp || isHit) ? "url(#glow-red)" : "none"}
                    style={{ transition: "all 0.25s" }}
                  />
                  <text x="0" y="5" textAnchor="middle" fontSize="14">
                    {isComp ? "💀" : isHit ? "⚠️" : user.role === "executive" ? "👔" : user.role === "consultant" ? "🧑‍💼" : user.role === "it_admin" ? "🛠️" : "👩‍💼"}
                  </text>
                  <text x="0" y="34" textAnchor="middle" fontSize="9" fill={(isComp || isHit) ? "#ef4444" : "#94a3b8"} fontFamily="monospace" fontWeight={(isComp || isHit) ? "700" : "500"}>
                    {user.label.toUpperCase()}
                  </text>
                  <text x="0" y="44" textAnchor="middle" fontSize="8" fill="#475569" fontFamily="monospace">
                    [{ROLE_LABELS[user.role]}]
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Sidebar */}
        <div style={{ width: 240, borderLeft: "1px solid #1e293b", padding: 16, display: "flex", flexDirection: "column", gap: 16, background: "rgba(10,10,20,0.7)", overflowY: "auto" }}>
          
          {/* Model info */}
          <div style={{ padding: 12, borderRadius: 8, background: isRBAC ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${isRBAC ? "#10b98130" : "#ef444430"}`, transition: "all 0.4s" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: isRBAC ? "#10b981" : "#ef4444", marginBottom: 6 }}>
              {isRBAC ? "✓ L.P. / RBAC MODEL" : "⚠ FLAT PERMISSIONS"}
            </div>
            <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.6 }}>
              {isRBAC ? "Access is restricted by role. Risk of lateral movement is minimized." : "Zero segmentation. One compromised user exposes the entire network."}
            </div>
          </div>

          {/* Blast summary */}
          {compromised && (
            <div style={{ padding: 12, borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid #ef444430" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", marginBottom: 8 }}>
                💀 INCIDENT REPORT
              </div>
              <div style={{ fontSize: 10, color: "#64748b", marginBottom: 6 }}>
                Origin: <span style={{ color: "#fca5a5", fontWeight: "bold" }}>
                  {compromised.type === 'user' ? USERS.find(u => u.id === compromised.id)?.label : RESOURCES.find(r => r.id === compromised.id)?.label}
                </span>
              </div>
              
              <div style={{ fontSize: 10, color: "#64748b", marginBottom: 8 }}>
                {compromised.type === 'user' ? "Compromised Resources:" : "Users with potential access:"}
              </div>
              
              {compromised.type === 'user' ? (
                blastResources.map(rid => {
                  const res = RESOURCES.find(r => r.id === rid);
                  return res ? (
                    <div key={rid} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: "#fca5a5", marginBottom: 4 }}>
                      <span>{res.icon} {res.label}</span>
                      <span style={{ fontSize: 8, padding: "2px 4px", borderRadius: 4, background: SENSITIVITY_COLORS[res.sensitivity], color: "#fff" }}>{res.sensitivity}</span>
                    </div>
                  ) : null;
                })
              ) : (
                blastUsers.map(uid => {
                  const user = USERS.find(u => u.id === uid);
                  return user ? (
                    <div key={uid} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#fca5a5", marginBottom: 4 }}>
                      <span>⚠️</span> {user.label}
                    </div>
                  ) : null;
                })
              )}
              
              {(blastResources.length === 0 && blastUsers.length === 0) && (
                <div style={{ fontSize: 10, color: "#10b981" }}>Isolated. No lateral movement possible.</div>
              )}
            </div>
          )}

          {/* Asset Sensitivity Legend */}
          <div>
            <div style={{ fontSize: 9, color: "#475569", letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Asset Sensitivity</div>
            {["High", "Medium", "Low"].map(level => (
              <div key={level} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: SENSITIVITY_COLORS[level] }} />
                <span style={{ fontSize: 10, color: "#94a3b8" }}>{level} Value Data</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
      `}</style>
    </div>
  );
}