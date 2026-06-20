import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie,
} from "recharts";
import {
    getWinRate,
    getProfitFactor,
    getEquityCurve,
    getStrategyPerformance,
    getConsecutiveStreaks,
    getSessionPerformance,
    getPairPerformance,
    getMonthlyPnL,
} from "../db";

export default function Analytics() {
    const [breakdownType, setBreakdownType] = useState<"strategy" | "pair">(
        "strategy",
    );
    const winRate = getWinRate();
    const profitFactor = getProfitFactor();
    const equityCurve = getEquityCurve();
    const strategyPerf = getStrategyPerformance();
    const pairPerf = getPairPerformance();
    const streaks = getConsecutiveStreaks();
    const sessionPerf = getSessionPerformance();
    const monthlyPnL = getMonthlyPnL();

    const breakdownData = useMemo(() => {
        if (breakdownType === "strategy") {
            return strategyPerf.map((s) => ({
                name: s.strategy,
                wins: s.wins,
                losses: s.losses,
                pnl: s.pnl,
            }));
        }
        return pairPerf.map((p) => ({
            name: p.pair,
            wins: p.wins,
            losses: p.losses,
            pnl: p.pnl,
        }));
    }, [breakdownType, strategyPerf, pairPerf]);

    const winLossData = useMemo(() => {
        const totalWins = breakdownData.reduce((s, d) => s + d.wins, 0);
        const totalLosses = breakdownData.reduce((s, d) => s + d.losses, 0);
        return [
            { name: "Wins", value: totalWins, color: "#10B981" },
            { name: "Losses", value: totalLosses, color: "#EF4444" },
        ];
    }, [breakdownData]);

    const CustomTooltip = ({
        active,
        payload,
        label,
    }: {
        active?: boolean;
        payload?: Array<{ value: number }>;
        label?: string;
    }) => {
        if (!active || !payload?.length) return null;
        return (
            <div
                style={{
                    background: "rgba(30, 36, 42, 0.95)",
                    borderRadius: 6,
                    padding: "8px 12px",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
            >
                <div style={{ fontSize: 11, color: "#4A5568" }}>{label}</div>
                <div
                    style={{ fontSize: 14, fontWeight: 600, color: "#F0F2F5" }}
                >
                    ${payload[0].value.toLocaleString()}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col" style={{ padding: "16px 16px 24px" }}>
            {/* Summary Cards Row */}
            <div
                className="flex gap-2"
                style={{ marginBottom: 16, overflowX: "auto" }}
            >
                {[
                    {
                        label: "Win Rate",
                        value: `${winRate}%`,
                        color: "#F0F2F5",
                    },
                    {
                        label: "Profit Factor",
                        value: profitFactor.toFixed(2),
                        color: "#F0F2F5",
                    },
                ].map((card, i) => (
                    <motion.div
                        key={card.label}
                        className="flex flex-col justify-center flex-shrink-0"
                        style={{
                            width: 140,
                            height: 100,
                            background: "rgba(20, 24, 28, 0.72)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                            borderRadius: 12,
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
                            padding: 14,
                        }}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.4 }}
                    >
                        <div
                            style={{
                                fontSize: 11,
                                color: "#4A5568",
                                marginBottom: 4,
                            }}
                        >
                            {card.label}
                        </div>
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: 22,
                                color: card.color,
                            }}
                        >
                            {card.value}
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
                    padding: 16,
                    marginBottom: 16,
                    height: 220,
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.4 }}
            >
                <div
                    style={{
                        fontWeight: 600,
                        fontSize: 16,
                        color: "#F0F2F5",
                        marginBottom: 12,
                    }}
                >
                    Equity Curve
                </div>
                <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={equityCurve}>
                        <defs>
                            <linearGradient
                                id="eqGrad"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#2DD4A8"
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#2DD4A8"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 9, fill: "#4A5568" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#2DD4A8"
                            strokeWidth={2}
                            fill="url(#eqGrad)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Monthly P&L */}
            <motion.div
                style={{
                    background: "rgba(20, 24, 28, 0.72)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: 12,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
                    padding: 16,
                    marginBottom: 16,
                    height: 220,
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.4 }}
            >
                <div
                    style={{
                        fontWeight: 600,
                        fontSize: 16,
                        color: "#F0F2F5",
                        marginBottom: 12,
                    }}
                >
                    Monthly Performance
                </div>
                <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={monthlyPnL}>
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 9, fill: "#4A5568" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="pnl"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={28}
                        >
                            {monthlyPnL.map((entry, i) => (
                                <Cell
                                    key={i}
                                    fill={
                                        entry.pnl >= 0 ? "#10B981" : "#EF4444"
                                    }
                                    fillOpacity={0.8}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Strategy/Pair Breakdown */}
            <motion.div
                style={{
                    background: "rgba(20, 24, 28, 0.72)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: 12,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
                    padding: 16,
                    marginBottom: 16,
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
            >
                {/* Toggle */}
                <div
                    className="flex items-center justify-between"
                    style={{ marginBottom: 12 }}
                >
                    <span
                        style={{
                            fontWeight: 600,
                            fontSize: 16,
                            color: "#F0F2F5",
                        }}
                    >
                        By {breakdownType === "strategy" ? "Strategy" : "Pair"}
                    </span>
                    <div
                        className="flex"
                        style={{
                            borderRadius: 8,
                            overflow: "hidden",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                        }}
                    >
                        <button
                            style={{
                                padding: "6px 14px",
                                fontSize: 12,
                                fontWeight: 600,
                                background:
                                    breakdownType === "strategy"
                                        ? "rgba(45, 212, 168, 0.15)"
                                        : "transparent",
                                color:
                                    breakdownType === "strategy"
                                        ? "#2DD4A8"
                                        : "#4A5568",
                            }}
                            onClick={() => setBreakdownType("strategy")}
                        >
                            Strategy
                        </button>
                        <button
                            style={{
                                padding: "6px 14px",
                                fontSize: 12,
                                fontWeight: 600,
                                background:
                                    breakdownType === "pair"
                                        ? "rgba(45, 212, 168, 0.15)"
                                        : "transparent",
                                color:
                                    breakdownType === "pair"
                                        ? "#2DD4A8"
                                        : "#4A5568",
                            }}
                            onClick={() => setBreakdownType("pair")}
                        >
                            Pair
                        </button>
                    </div>
                </div>

                {/* List */}
                {breakdownData.map((item) => {
                    const total = item.wins + item.losses;
                    const winPct =
                        total > 0 ? Math.round((item.wins / total) * 100) : 0;
                    const winColor = winPct >= 50 ? "#10B981" : "#EF4444";
                    return (
                        <div
                            key={item.name}
                            className="flex items-center gap-3"
                            style={{
                                height: 48,
                                borderBottom:
                                    "1px solid rgba(255, 255, 255, 0.03)",
                            }}
                        >
                            <div className="flex-1 min-w-0">
                                <div
                                    style={{
                                        fontWeight: 500,
                                        fontSize: 14,
                                        color: "#F0F2F5",
                                    }}
                                >
                                    {item.name}
                                </div>
                                {/* Mini bar */}
                                <div
                                    className="flex"
                                    style={{
                                        height: 4,
                                        borderRadius: 2,
                                        marginTop: 4,
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: `${winPct}%`,
                                            background: "#10B981",
                                            borderRadius: "2px 0 0 2px",
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: `${100 - winPct}%`,
                                            background: "#EF4444",
                                            borderRadius: "0 2px 2px 0",
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <div style={{ fontSize: 12, color: "#4A5568" }}>
                                    <span style={{ color: "#10B981" }}>
                                        {item.wins}W
                                    </span>{" "}
                                    <span style={{ color: "#EF4444" }}>
                                        {item.losses}L
                                    </span>
                                </div>
                                <div
                                    style={{
                                        fontWeight: 600,
                                        fontSize: 13,
                                        color: winColor,
                                    }}
                                >
                                    {winPct}%
                                </div>
                            </div>
                        </div>
                    );
                })}
            </motion.div>

            {/* Win/Loss Distribution */}
            <div
                className="grid grid-cols-2 gap-2"
                style={{ marginBottom: 16 }}
            >
                <motion.div
                    style={{
                        background: "rgba(20, 24, 28, 0.72)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: 12,
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
                        padding: 16,
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.48, duration: 0.4 }}
                >
                    <div
                        style={{
                            fontSize: 11,
                            color: "#4A5568",
                            marginBottom: 4,
                        }}
                    >
                        Best Win Streak
                    </div>
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: 28,
                            color: "#10B981",
                        }}
                    >
                        {streaks.bestWin}
                    </div>
                    <div
                        style={{ fontSize: 11, color: "#4A5568", marginTop: 2 }}
                    >
                        Consecutive wins
                    </div>
                </motion.div>
                <motion.div
                    style={{
                        background: "rgba(20, 24, 28, 0.72)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: 12,
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
                        padding: 16,
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.56, duration: 0.4 }}
                >
                    <div
                        style={{
                            fontSize: 11,
                            color: "#4A5568",
                            marginBottom: 4,
                        }}
                    >
                        Worst Loss Streak
                    </div>
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: 28,
                            color: "#EF4444",
                        }}
                    >
                        {streaks.worstLoss}
                    </div>
                    <div
                        style={{ fontSize: 11, color: "#4A5568", marginTop: 2 }}
                    >
                        Consecutive losses
                    </div>
                </motion.div>
            </div>

            {/* Win/Loss Pie Chart */}
            <motion.div
                style={{
                    background: "rgba(20, 24, 28, 0.72)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: 12,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
                    padding: 16,
                    marginBottom: 16,
                    height: 180,
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
            >
                <div
                    style={{
                        fontWeight: 600,
                        fontSize: 16,
                        color: "#F0F2F5",
                        marginBottom: 8,
                    }}
                >
                    Win / Loss Distribution
                </div>
                <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                        <Pie
                            data={winLossData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            dataKey="value"
                            stroke="none"
                            paddingAngle={2}
                        >
                            {winLossData.map((entry, i) => (
                                <Cell
                                    key={i}
                                    fill={entry.color}
                                    fillOpacity={0.8}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div
                    className="flex justify-center gap-4"
                    style={{ marginTop: -10 }}
                >
                    {winLossData.map((d) => (
                        <div key={d.name} className="flex items-center gap-1.5">
                            <div
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 2,
                                    background: d.color,
                                }}
                            />
                            <span style={{ fontSize: 11, color: "#8B95A5" }}>
                                {d.name}: {d.value}
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Session Performance */}
            <motion.div
                style={{
                    background: "rgba(20, 24, 28, 0.72)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: 12,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
                    padding: 16,
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.64, duration: 0.4 }}
            >
                <div
                    style={{
                        fontWeight: 600,
                        fontSize: 16,
                        color: "#F0F2F5",
                        marginBottom: 12,
                    }}
                >
                    By Session
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {sessionPerf.map((s) => (
                        <div
                            key={s.session}
                            style={{
                                background: "rgba(255, 255, 255, 0.02)",
                                borderRadius: 10,
                                padding: 12,
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: 600,
                                    fontSize: 14,
                                    color: "#F0F2F5",
                                }}
                            >
                                {s.session}
                            </div>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: "#4A5568",
                                    marginTop: 2,
                                }}
                            >
                                {s.trades} trades
                            </div>
                            <div
                                style={{
                                    fontWeight: 600,
                                    fontSize: 14,
                                    color:
                                        s.trades > 0 && s.wins / s.trades >= 0.5
                                            ? "#10B981"
                                            : "#EF4444",
                                    marginTop: 4,
                                }}
                            >
                                {s.trades > 0
                                    ? `${Math.round((s.wins / s.trades) * 100)}%`
                                    : "0%"}
                            </div>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: "#4A5568",
                                    marginTop: 2,
                                }}
                            >
                                <span style={{ color: "#10B981" }}>
                                    {s.wins}W
                                </span>{" "}
                                <span style={{ color: "#EF4444" }}>
                                    {s.losses}L
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
