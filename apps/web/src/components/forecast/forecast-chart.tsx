"use client";

import { useState } from "react";
import { formatDate } from "@/lib/format-date";
import { formatMoney } from "@/lib/format-money";

type Point = { date: Date; balance: number }; // millimes

const W = 720;
const H = 260;
const PAD = { left: 72, right: 16, top: 16, bottom: 28 };
const COLORS = { base: "#14a38b", simulated: "#6366f1" }; // palette validée (daltonisme, contraste)
const compact = new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 });

type Props = { base: Point[]; simulated: Point[] | null };

/** Solde prévu jour par jour. Une seule échelle, la ligne zéro marque le manque de liquidités. */
export function ForecastChart({ base, simulated }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  const values = [...base, ...(simulated ?? [])].map((p) => p.balance);
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const x = (i: number) => PAD.left + (i / (base.length - 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) => PAD.top + (1 - (v - min) / (max - min || 1)) * (H - PAD.top - PAD.bottom);
  const path = (points: Point[]) => points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.balance)}`).join(" ");

  function onMove(event: React.MouseEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const svgX = ((event.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((svgX - PAD.left) / (W - PAD.left - PAD.right)) * (base.length - 1));
    setHover(Math.max(0, Math.min(base.length - 1, i)));
  }

  const hovered = hover === null ? null : { base: base[hover], simulated: simulated?.[hover] };

  return (
    <div className="relative">
      {simulated && (
        <div className="mb-3 flex gap-4 text-xs text-slate-600">
          <Legend color={COLORS.base} label="Prévision" />
          <Legend color={COLORS.simulated} label="Simulation" />
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" onMouseMove={onMove} onMouseLeave={() => setHover(null)}
        role="img" aria-label="Évolution du solde prévu sur 90 jours">
        {/* Repères : max, 0 et min, sauf s'ils chevauchent la ligne zéro. */}
        {[max, 0, min].filter((v) => v === 0 || Math.abs(y(v) - y(0)) > 16).map((v) => (
          <g key={v}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)}
              stroke={v === 0 ? "#94a3b8" : "#e2e8f0"} strokeDasharray={v === 0 ? "4 4" : undefined} />
            <text x={PAD.left - 8} y={y(v) + 4} textAnchor="end" className="fill-slate-500 text-[11px]">
              {compact.format(v / 1000)} DT
            </text>
          </g>
        ))}
        {[0, 30, 60, 90].filter((d) => d < base.length).map((d) => (
          <text key={d} x={x(d)} y={H - 8} textAnchor="middle" className="fill-slate-500 text-[11px]">
            {d === 0 ? "Aujourd'hui" : `J+${d}`}
          </text>
        ))}
        <path d={path(base)} fill="none" stroke={COLORS.base} strokeWidth={2} />
        {simulated && <path d={path(simulated)} fill="none" stroke={COLORS.simulated} strokeWidth={2} />}
        {hover !== null && (
          <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={H - PAD.bottom} stroke="#94a3b8" />
        )}
      </svg>
      {hovered?.base && (
        <div className="pointer-events-none absolute top-8 right-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
          <p className="font-medium">{formatDate(hovered.base.date)}</p>
          <p>Prévision : {formatMoney(hovered.base.balance)}</p>
          {hovered.simulated && <p>Simulation : {formatMoney(hovered.simulated.balance)}</p>}
        </div>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-0.5 w-4 rounded" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
