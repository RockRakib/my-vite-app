import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import type { Trade } from "../types";
import { getTrades, haptic, deleteTrade } from "../db";
interface JournalProps {
    onShowToast?: (message: string, type: "success" | "error" | "info") => void;
    onEditTrade?: (trade: Trade) => void;
}
import TradeCard from "../components/TradeCard";
import TradeDetailSheet from "../components/TradeDetailSheet";

export default function Journal({ onShowToast, onEditTrade }: JournalProps) {
    const allTrades = getTrades();
    const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [showSearch, setShowSearch] = useState(false);

    const filters = [
        "This Week",
        "This Month",
        "Wins",
        "Losses",
        "Buy",
        "Sell",
    ];

    const filteredTrades = useMemo(() => {
        let trades = [...allTrades];

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            trades = trades.filter(
                (t) =>
                    t.pair.toLowerCase().includes(q) ||
                    t.strategy.toLowerCase().includes(q) ||
                    t.notes.toLowerCase().includes(q),
            );
        }

        // Filters
        if (activeFilters.includes("Wins")) {
            trades = trades.filter((t) => t.profitLoss > 0);
        }
        if (activeFilters.includes("Losses")) {
            trades = trades.filter((t) => t.profitLoss < 0);
        }
        if (activeFilters.includes("Buy")) {
            trades = trades.filter((t) => t.direction === "buy");
        }
        if (activeFilters.includes("Sell")) {
            trades = trades.filter((t) => t.direction === "sell");
        }
        if (activeFilters.includes("This Week")) {
            const now = new Date();
            const startOfWeek = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() - now.getDay(),
            ).getTime();
            trades = trades.filter((t) => t.timestamp >= startOfWeek);
        }
        if (activeFilters.includes("This Month")) {
            const now = new Date();
            const startOfMonth = new Date(
                now.getFullYear(),
                now.getMonth(),
                1,
            ).getTime();
            trades = trades.filter((t) => t.timestamp >= startOfMonth);
        }

        return trades.sort((a, b) => b.timestamp - a.timestamp);
    }, [allTrades, searchQuery, activeFilters]);

    // Group trades by date
    const groupedTrades = useMemo(() => {
        const groups: Record<string, Trade[]> = {};
        filteredTrades.forEach((t) => {
            const date = new Date(t.timestamp).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
            });
            if (!groups[date]) groups[date] = [];
            groups[date].push(t);
        });
        return groups;
    }, [filteredTrades]);

    const toggleFilter = (filter: string) => {
        haptic();
        setActiveFilters((prev) => {
            // Mutually exclusive date filters
            if (filter === "This Week" && prev.includes("This Month")) {
                return prev.filter((f) => f !== "This Month").includes(filter)
                    ? prev.filter((f) => f !== filter)
                    : [...prev.filter((f) => f !== "This Month"), filter];
            }
            if (filter === "This Month" && prev.includes("This Week")) {
                return prev.filter((f) => f !== "This Week").includes(filter)
                    ? prev.filter((f) => f !== filter)
                    : [...prev.filter((f) => f !== "This Week"), filter];
            }
            // Mutually exclusive direction filters
            if (filter === "Buy" && prev.includes("Sell")) {
                return [...prev.filter((f) => f !== "Sell"), filter];
            }
            if (filter === "Sell" && prev.includes("Buy")) {
                return [...prev.filter((f) => f !== "Buy"), filter];
            }
            return prev.includes(filter)
                ? prev.filter((f) => f !== filter)
                : [...prev, filter];
        });
    };

    return (
        <div className="flex flex-col" style={{ padding: "0 0 24px" }}>
            {/* Filter Bar */}
            <div
                className="sticky top-0 z-40"
                style={{
                    background: "rgba(13, 15, 17, 0.90)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
                }}
            >
                <div style={{ padding: "10px 16px" }}>
                    {showSearch ? (
                        <motion.div
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Search size={16} color="#4A5568" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search pairs, strategies..."
                                autoFocus
                                style={{
                                    flex: 1,
                                    background: "transparent",
                                    border: "none",
                                    color: "#F0F2F5",
                                    fontSize: 14,
                                    outline: "none",
                                }}
                            />
                            <button
                                style={{ color: "#4A5568", fontSize: 13 }}
                                onClick={() => {
                                    setShowSearch(false);
                                    setSearchQuery("");
                                }}
                            >
                                Cancel
                            </button>
                        </motion.div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                style={{ color: "#4A5568", padding: 4 }}
                                onClick={() => setShowSearch(true)}
                            >
                                <Search size={18} />
                            </button>
                            <div className="flex gap-1.5 overflow-x-auto flex-1">
                                {filters.map((f) => (
                                    <button
                                        key={f}
                                        style={{
                                            height: 32,
                                            padding: "0 14px",
                                            borderRadius: 16,
                                            fontSize: 12,
                                            fontWeight: 500,
                                            whiteSpace: "nowrap",
                                            flexShrink: 0,
                                            background: activeFilters.includes(
                                                f,
                                            )
                                                ? "rgba(45, 212, 168, 0.10)"
                                                : "rgba(255, 255, 255, 0.04)",
                                            color: activeFilters.includes(f)
                                                ? "#2DD4A8"
                                                : "#8B95A5",
                                            border: activeFilters.includes(f)
                                                ? "1px solid rgba(45, 212, 168, 0.20)"
                                                : "1px solid transparent",
                                            transition: "all 0.2s ease",
                                        }}
                                        onClick={() => toggleFilter(f)}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Trade List */}
            <div className="flex flex-col" style={{ padding: "0 16px" }}>
                {Object.keys(groupedTrades).length > 0 ? (
                    Object.entries(groupedTrades).map(([date, trades]) => (
                        <div key={date}>
                            {/* Date Header */}
                            <div
                                style={{
                                    padding: "16px 0 8px",
                                    borderBottom:
                                        "1px solid rgba(255, 255, 255, 0.03)",
                                    marginBottom: 8,
                                }}
                            >
                                <span
                                    style={{
                                        fontWeight: 600,
                                        fontSize: 13,
                                        color: "#4A5568",
                                    }}
                                >
                                    {date}
                                </span>
                                <span
                                    style={{
                                        fontSize: 11,
                                        color: "#4A5568",
                                        marginLeft: 8,
                                    }}
                                >
                                    {trades.length} trade
                                    {trades.length > 1 ? "s" : ""}
                                </span>
                            </div>
                            {/* Trades */}
                            <div
                                className="flex flex-col gap-1.5"
                                style={{ marginBottom: 8 }}
                            >
                                {trades.map((t) => (
                                    <TradeCard
                                        key={t.id}
                                        trade={t}
                                        onTap={setSelectedTrade}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div
                        className="flex flex-col items-center justify-center"
                        style={{ padding: "60px 20px" }}
                    >
                        <svg
                            width="80"
                            height="80"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="rgba(255,255,255,0.15)"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M3 3v18h18" />
                            <path d="m19 9-5 5-4-4-3 3" />
                        </svg>
                        <div
                            style={{
                                fontWeight: 600,
                                fontSize: 18,
                                color: "#8B95A5",
                                marginTop: 16,
                            }}
                        >
                            No trades found
                        </div>
                        <div
                            style={{
                                fontSize: 13,
                                color: "#4A5568",
                                marginTop: 4,
                                textAlign: "center",
                                maxWidth: 240,
                            }}
                        >
                            {searchQuery || activeFilters.length > 0
                                ? "Try adjusting your search or filters"
                                : "Log your first trade to start journaling"}
                        </div>
                    </div>
                )}
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
