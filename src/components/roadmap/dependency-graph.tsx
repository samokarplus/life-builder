"use client";

import { useMemo } from "react";
import { Background, Controls, ReactFlow, type Edge, type Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { courses } from "@/data/sample";
import { prereqIssues, sortSemesters } from "@/lib/schedule";
import { usePlanner } from "@/store/planner";

export function DependencyGraph() {
  const { semesters, profile } = usePlanner();
  const { nodes, edges } = useMemo(() => {
    const byId = new Map(courses.map((c) => [c.id, c]));
    const conflict = new Set(prereqIssues(semesters, courses, profile.completed).map((i) => i.courseId));
    const ns: Node[] = [];
    const planned = new Set<string>();
    const sorted = sortSemesters(semesters);
    sorted.forEach((s, col) => s.courses.forEach((p, row) => {
      const c = byId.get(p.courseId)!;
      planned.add(c.id);
      ns.push({
        id: c.id, position: { x: col * 240, y: row * 90 }, draggable: false,
        data: { label: `${c.code} · ${c.title}` },
        style: { width: 200, fontSize: 12, borderRadius: 12, border: `1px solid ${conflict.has(c.id) ? "#d97706" : "var(--border)"}`, background: p.status === "completed" ? "var(--soft)" : "var(--surface)", color: "var(--foreground)" },
      });
    }));
    const es: Edge[] = [];
    let extra = 0;
    for (const id of planned) for (const pre of byId.get(id)!.prerequisiteIds) {
      if (!planned.has(pre)) {
        const c = byId.get(pre);
        ns.push({ id: pre, position: { x: -240, y: extra++ * 90 }, draggable: false, data: { label: `${c?.code ?? pre} · not in plan` }, style: { width: 200, fontSize: 12, borderRadius: 12, border: "1px dashed var(--muted)", background: "transparent", color: "var(--muted)" } });
      }
      es.push({ id: `${pre}->${id}`, source: pre, target: id, animated: conflict.has(id), style: { stroke: conflict.has(id) ? "#d97706" : "var(--primary)" } });
    }
    return { nodes: ns, edges: es };
  }, [semesters, profile.completed]);

  return (
    <div>
      <div className="h-[480px] rounded-[14px] border border-border bg-surface" role="img" aria-label="Prerequisite graph. Columns are semesters, left to right.">
        <ReactFlow nodes={nodes} edges={edges} fitView nodesConnectable={false} proOptions={{ hideAttribution: true }}>
          <Background /><Controls showInteractive={false} />
        </ReactFlow>
      </div>
      <p className="mt-2 text-xs text-muted">Columns run chronologically. Arrows point from prerequisite to course; amber means the prerequisite isn&apos;t finished earlier. {edges.length === 0 && "No prerequisites among your planned courses."}</p>
    </div>
  );
}
