import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight,
    Flame,
} from "lucide-react";
import type { Trade } from "../types";
import {
    getWinRate,
    getCurrentStreak,
    getTotalTrades,
    getBestStrategy,
    getAverageWinner,
    getAverageLoser,
    getEquityCurve,
    getTodayTrades,
    deleteTrade,
} from "../db";
import TradeCard from "../components/TradeCard";
import TradeDetailSheet from "../components/TradeDetailSheet";

interface DashboardProps {
    onNavigate: (tab: string) => void;
    onShowToast?: (message: string, type: "success" | "error" | "info") => void;
    onEditTrade?: (trade: Trade) => void;
}

export default function Dashboard({
    onNavigate,
    onShowToast,
    onEditTrade,
}: DashboardProps) {
    const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
    const [timeRange, setTimeRange] = useState("1M");

    const winRate = getWinRate();
    const streak = getCurrentStreak();
    const todayTrades = getTodayTrades();
    const equityCurve = getEquityCurve();
    const bestStrategy = getBestStrategy();
    const avgWinner = getAverageWinner();
    const avgLoser = getAverageLoser();

    // Filter equity curve based on time range
    const filteredCurve = useMemo(() => {
        if (timeRange === "1W") return equityCurve.slice(-7);
        if (timeRange === "1M") return equityCurve.slice(-30);
        if (timeRange === "3M") return equityCurve.slice(-90);
        return equityCurve;
    }, [equityCurve, timeRange]);

    const [tooltipData, setTooltipData] = useState<{
        date: string;
        value: number;
        x: number;
        y: number;
    } | null>(null);

    // SVG chart calculations
    const chartWidth = 340;
    const chartHeight = 140;
    const padding = { top: 10, right: 10, bottom: 24, left: 10 };
    const innerWidth = chartWidth - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;

    const minVal = Math.min(...filteredCurve.map((d) => d.value), 0);
    const maxVal = Math.max(...filteredCurve.map((d) => d.value), 1);
    const valRange = maxVal - minVal || 1;

    const points = filteredCurve.map((d, i) => ({
        x: padding.left + (i / (filteredCurve.length - 1 || 1)) * innerWidth,
        y:
            padding.top +
            innerHeight -
            ((d.value - minVal) / valRange) * innerHeight,
        data: d,
    }));

    // Generate smooth path
    const pathD =
        points.length > 1
            ? points.reduce((path, p, i) => {
                  if (i === 0) return `M ${p.x} ${p.y}`;
                  const prev = points[i - 1];
                  const cpx1 = prev.x + (p.x - prev.x) / 3;
                  const cpx2 = prev.x + (2 * (p.x - prev.x)) / 3;
                  return `${path} C ${cpx1} ${prev.y}, ${cpx2} ${p.y}, ${p.x} ${p.y}`;
              }, "")
            : "";
    const areaD = pathD
        ? `${pathD} L ${points[points.length - 1]?.x} ${padding.top + innerHeight} L ${points[0]?.x} ${padding.top + innerHeight} Z`
        : "";

    return (
        <div className="flex flex-col" style={{ padding: "16px 16px 24px" }}>
            {/* Quick Metrics Row (denser) */}
            <div
                className="grid grid-cols-4 gap-2"
                style={{ marginBottom: 12 }}
            >
                {[
                    {
                        value: `${winRate}%`,
                        label: "WIN RATE",
                        color: "#F0F2F5",
                    },
                    {
                        value: `${streak.count}${streak.type}`,
                        label: "STREAK",
                        color: "#10B981",
                        icon: true,
                    },
                    { value: "1.0%", label: "RISK", color: "#F0F2F5" },
                    { value: "", label: "", color: "#F0F2F5" },
                ].map((m, i) => (
                    <motion.div
                        key={i}
                        className="flex flex-col items-center justify-center"
                        style={{
                            height: 64,
                            background: "rgba(20, 24, 28, 0.72)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                            borderRadius: 12,
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
                            padding: "10px 8px",
                        }}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.3 }}
                    >
                        <div
                            className="flex items-center gap-1"
                            style={{
                                fontWeight: 700,
                                fontSize: 16,
                                color: m.color,
                            }}
                        >
                            {m.value}
                            {m.icon && <Flame size={12} color="#F59E0B" />}
                        </div>
                        <div
                            style={{
                                fontWeight: 500,
                                fontSize: 9,
                                color: "#4A5568",
                                marginTop: 2,
                            }}
                        >
                            {m.label}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Equity Curve */}
            <motion.div
                style={{
                    background: "rgba(20, 24, 28, 0.72)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: 12,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
                    marginBottom: 16,
                    overflow: "hidden",
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.4 }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between"
                    style={{ padding: "12px 16px 0" }}
                >
                    <span
                        style={{
                            fontWeight: 600,
                            fontSize: 16,
                            color: "#F0F2F5",
                        }}
                    >
                        Equity Curve
                    </span>
                    <div className="flex gap-1">
                        {["1W", "1M", "3M", "ALL"].map((r) => (
                            <button
                                key={r}
                                style={{
                                    height: 28,
                                    padding: "0 12px",
                                    borderRadius: 6,
                                    fontSize: 12,
                                    fontWeight: timeRange === r ? 600 : 400,
                                    background:
                                        timeRange === r
                                            ? "rgba(45, 212, 168, 0.15)"
                                            : "transparent",
                                    color:
                                        timeRange === r ? "#2DD4A8" : "#4A5568",
                                    border:
                                        timeRange === r
                                            ? "1px solid rgba(45, 212, 168, 0.20)"
                                            : "1px solid rgba(255, 255, 255, 0.06)",
                                    transition: "all 0.2s ease",
                                }}
                                onClick={() => setTimeRange(r)}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chart */}
                <div style={{ padding: "8px 12px 12px", position: "relative" }}>
                    <svg
                        width="100%"
                        height={chartHeight}
                        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                        style={{ overflow: "visible" }}
                    >
                        {/* Grid lines */}
                        {[0, 1, 2, 3].map((i) => {
                            const y = padding.top + (i / 3) * innerHeight;
                            return (
                                <line
                                    key={i}
                                    x1={padding.left}
                                    y1={y}
                                    x2={chartWidth - padding.right}
                                    y2={y}
                                    stroke="rgba(255, 255, 255, 0.03)"
                                    strokeWidth={1}
                                />
                            );
                        })}

                        {/* Area fill */}
                        <defs>
                            <linearGradient
                                id="areaGrad"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="rgba(45, 212, 168, 0.30)"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="rgba(45, 212, 168, 0.00)"
                                />
                            </linearGradient>
                        </defs>
                        {areaD && <path d={areaD} fill="url(#areaGrad)" />}

                        {/* Line */}
                        {pathD && (
                            <path
                                d={pathD}
                                fill="none"
                                stroke="#2DD4A8"
                                strokeWidth={2}
                                strokeLinecap="round"
                            />
                        )}

                        {/* X labels */}
                        {filteredCurve.length > 1 &&
                            [
                                filteredCurve[0],
                                filteredCurve[
                                    Math.floor(filteredCurve.length / 2)
                                ],
                                filteredCurve[filteredCurve.length - 1],
                            ].map((d, i) => {
                                const pt =
                                    points[
                                        i === 1
                                            ? Math.floor(
                                                  filteredCurve.length / 2,
                                              )
                                            : i === 0
                                              ? 0
                                              : filteredCurve.length - 1
                                    ];
                                if (!pt) return null;
                                return (
                                    <text
                                        key={i}
                                        x={pt.x}
                                        y={chartHeight - 4}
                                        textAnchor="middle"
                                        style={{
                                            fontSize: 9,
                                            fill: "#4A5568",
                                            fontFamily: "Inter, sans-serif",
                                        }}
                                    >
                                        {d.date}
                                    </text>
                                );
                            })}

                        {/* Interactive overlay */}
                        {points.map((p, i) => (
                            <circle
                                key={i}
                                cx={p.x}
                                cy={p.y}
                                r={8}
                                fill="transparent"
                                onClick={(e) => {
                                    const rect = (
                                        e.target as SVGElement
                                    ).getBoundingClientRect();
                                    setTooltipData({
                                        date: p.data.date,
                                        value: p.data.value,
                                        x: rect.left,
                                        y: rect.top,
                                    });
                                }}
                                style={{ cursor: "pointer" }}
                            />
                        ))}
                    </svg>

                    {/* Tooltip */}
                    {tooltipData && (
                        <motion.div
                            className="absolute pointer-events-none"
                            style={{
                                background: "rgba(30, 36, 42, 0.95)",
                                borderRadius: 6,
                                padding: "6px 10px",
                                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
                                left: tooltipData.x - 40,
                                top: tooltipData.y - 50,
                                zIndex: 10,
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <div style={{ fontSize: 10, color: "#4A5568" }}>
                                {tooltipData.date}
                            </div>
                            <div
                                style={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "#F0F2F5",
                                }}
                            >
                                ${tooltipData.value.toLocaleString()}
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Today's Trades */}
            <div style={{ marginBottom: 16 }}>
                <div
                    className="flex items-center justify-between"
                    style={{ marginBottom: 10 }}
                >
                    <span
                        style={{
                            fontWeight: 600,
                            fontSize: 16,
                            color: "#F0F2F5",
                        }}
                    >
                        Today's Trades
                    </span>
                    <button
                        className="flex items-center gap-1"
                        style={{
                            fontWeight: 500,
                            fontSize: 13,
                            color: "#2DD4A8",
                        }}
                        onClick={() => onNavigate("journal")}
                    >
                        View All <ChevronRight size={14} />
                    </button>
                </div>

                {todayTrades.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {todayTrades.map((t) => (
                            <TradeCard
                                key={t.id}
                                trade={t}
                                onTap={setSelectedTrade}
                                compact
                            />
                        ))}
                    </div>
                ) : (
                    <div
                        className="flex flex-col items-center py-6"
                        style={{ color: "#4A5568" }}
                    >
                        <div style={{ fontSize: 14, marginBottom: 4 }}>
                            No trades today yet
                        </div>
                        <button
                            style={{ fontSize: 13, color: "#2DD4A8" }}
                            onClick={() => onNavigate("add-trade")}
                        >
                            Log a trade →
                        </button>
                    </div>
                )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-2">
                {[
                    {
                        icon: TrendingUp,
                        label: "Best Strategy",
                        value: bestStrategy.name,
                        sub: `+$${bestStrategy.pnl} total`,
                    },
                    {
                        icon: BarChart3,
                        label: "Total Trades",
                        value: String(getTotalTrades()),
                        sub: "This month",
                    },
                    {
                        icon: ArrowUpRight,
                        label: "Avg Winner",
                        value: `+$${avgWinner}`,
                        sub: "R:R 1.8",
                        color: "#10B981",
                    },
                    {
                        icon: ArrowDownRight,
                        label: "Avg Loser",
                        value: `-$${Math.abs(avgLoser)}`,
                        sub: "R:R 0.9",
                        color: "#EF4444",
                    },
                ].map((s, i) => (
                    <motion.div
                        key={s.label}
                        className="flex flex-col"
                        style={{
                            height: 110,
                            background: "rgba(20, 24, 28, 0.72)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                            borderRadius: 12,
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
                            padding: 14,
                        }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            delay: 0.4 + i * 0.1,
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                        }}
                    >
                        <s.icon size={20} color="#4A5568" />
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: 20,
                                color: s.color || "#F0F2F5",
                                marginTop: 8,
                            }}
                        >
                            {s.value}
                        </div>
                        <div
                            style={{
                                fontSize: 11,
                                color: "#4A5568",
                                marginTop: 2,
                            }}
                        >
                            {s.sub}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Trade Detail Sheet */}
            <TradeDetailSheet
                trade={selectedTrade}
                isOpen={!!selectedTrade}
                onClose={() => setSelectedTrade(null)}
                onDelete={(id) => {
                    deleteTrade(id);
                    setSelectedTrade(null);
                    onShowToast?.("Trade deleted", "info");
                }}
                onEdit={(trade) => {
                    setSelectedTrade(null);
                    onEditTrade?.(trade);
                }}
            />
        </div>
    );
}
