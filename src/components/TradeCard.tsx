import { motion } from "framer-motion";
import type { Trade } from "../types";
import { haptic } from "../db";

interface Props {
    trade: Trade;
    onTap: (trade: Trade) => void;
    compact?: boolean;
}

export default function TradeCard({ trade, onTap, compact = false }: Props) {
    const isWin = trade.profitLoss > 0;
    const time = new Date(trade.timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    if (compact) {
        // Compact style for dashboard
        return (
            <motion.div
                className="flex items-center gap-3"
                style={{
                    height: 68,
                    background: "rgba(20, 24, 28, 0.72)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: 12,
                    padding: "0 12px",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                onTapStart={() => haptic()}
                onClick={() => onTap(trade)}
            >
                {/* Direction Badge */}
                <div
                    className="flex items-center justify-center"
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: isWin
                            ? "rgba(16, 185, 129, 0.12)"
                            : "rgba(239, 68, 68, 0.12)",
                        border: `1px solid ${isWin ? "rgba(16, 185, 129, 0.20)" : "rgba(239, 68, 68, 0.20)"}`,
                    }}
                >
                    <span
                        className="font-mono"
                        style={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: isWin ? "#10B981" : "#EF4444",
                        }}
                    >
                        {trade.direction === "buy" ? "B" : "S"}
                    </span>
                </div>

                {/* Center */}
                <div className="flex-1 min-w-0">
                    <div
                        style={{
                            fontWeight: 600,
                            fontSize: 14,
                            color: "#F0F2F5",
                        }}
                    >
                        {trade.pair}
                    </div>
                    <div
                        className="inline-block"
                        style={{
                            marginTop: 4,
                            fontSize: 11,
                            color: "#8B95A5",
                            background: "rgba(255, 255, 255, 0.04)",
                            padding: "2px 8px",
                            borderRadius: 4,
                        }}
                    >
                        {trade.strategy}
                    </div>
                </div>

                {/* Right */}
                <div className="text-right">
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: 15,
                            color: isWin ? "#10B981" : "#EF4444",
                        }}
                    >
                        {isWin ? "WIN" : "LOSE"}
                    </div>
                    <div
                        style={{ fontSize: 10, color: "#4A5568", marginTop: 2 }}
                    >
                        {time}
                    </div>
                </div>
            </motion.div>
        );
    }

    // Full style for journal
    return (
        <motion.div
            className="flex items-center gap-3"
            style={{
                height: 76,
                background: "rgba(20, 24, 28, 0.72)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: 12,
                padding: "0 12px",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onTapStart={() => haptic()}
            onClick={() => onTap(trade)}
        >
            {/* Direction bar */}
            <div
                style={{
                    width: 4,
                    height: 40,
                    borderRadius: 2,
                    background:
                        trade.direction === "buy" ? "#10B981" : "#EF4444",
                    flexShrink: 0,
                }}
            />

            {/* Direction badge */}
            <div
                className="flex items-center justify-center"
                style={{
                    width: 48,
                    height: 32,
                    borderRadius: 8,
                    background:
                        trade.direction === "buy"
                            ? "rgba(16, 185, 129, 0.10)"
                            : "rgba(239, 68, 68, 0.10)",
                    flexShrink: 0,
                }}
            >
                <span
                    className="font-mono"
                    style={{
                        fontWeight: 600,
                        fontSize: 10,
                        letterSpacing: "0.04em",
                        color:
                            trade.direction === "buy" ? "#10B981" : "#EF4444",
                    }}
                >
                    {trade.direction.toUpperCase()}
                </span>
            </div>

            {/* Center */}
            <div className="flex-1 min-w-0">
                <div
                    style={{ fontWeight: 600, fontSize: 15, color: "#F0F2F5" }}
                >
                    {trade.pair}
                </div>
                <div style={{ fontSize: 11, color: "#4A5568", marginTop: 2 }}>
                    {trade.strategy} · {trade.timeframe}
                </div>
            </div>

            {/* Right - Screenshot */}
            {trade.screenshots && trade.screenshots.length > 0 ? (
                <div
                    style={{
                        width: 60,
                        height: 48,
                        borderRadius: 8,
                        overflow: "hidden",
                        flexShrink: 0,
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                >
                    <img
                        src={trade.screenshots[0]}
                        alt="chart"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                </div>
            ) : (
                <div
                    style={{
                        width: 60,
                        height: 48,
                        borderRadius: 8,
                        background: "rgba(255, 255, 255, 0.04)",
                        flexShrink: 0,
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                />
            )}
        </motion.div>
    );
}
