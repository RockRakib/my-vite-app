import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Camera, Star, ChevronDown } from "lucide-react";
import type { Trade } from "../types";
import { addTrade, getSettings, haptic, updateTrade } from "../db";
import { v4 as uuidv4 } from "uuid";

interface AddTradeProps {
    onShowToast: (message: string, type: "success" | "error" | "info") => void;
    initialTrade?: Trade | null;
    onSaved?: (trade: Trade) => void;
    onNavigate?: (tab: string) => void;
}

export default function AddTrade({
    onShowToast,
    initialTrade = null,
    onSaved,
    onNavigate,
}: AddTradeProps) {
    const settings = getSettings();
    const STRATEGY_OPTIONS = [
        "BREAKOUT CC",
        "GAP-D.BO",
        "GAP-GAP.CC",
        "CLASSIC-CLASSIC.CC",
        "CLASSIC-GAP.CC",
        "CLASSIC-GAP",
        "POC",
        "JOKER",
    ];
    const CONFIRMATION_OPTIONS = ["CX", "M1", "TCP", "MINOR"];
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [pair, setPair] = useState(initialTrade?.pair ?? "");
    const [direction, setDirection] = useState<"buy" | "sell">(
        initialTrade?.direction ?? settings.defaultDirection,
    );
    const [entryPrice, setEntryPrice] = useState(
        initialTrade?.entryPrice ? String(initialTrade.entryPrice) : "",
    );
    const [exitPrice, setExitPrice] = useState(
        initialTrade?.exitPrice ? String(initialTrade.exitPrice) : "",
    );
    const [stopLoss, setStopLoss] = useState(
        initialTrade?.stopLoss ? String(initialTrade.stopLoss) : "",
    );
    const [takeProfit, setTakeProfit] = useState(
        initialTrade?.takeProfit ? String(initialTrade.takeProfit) : "",
    );
    const [strategy, setStrategy] = useState(initialTrade?.strategy ?? "");
    const [confirmation, setConfirmation] = useState(
        initialTrade?.confirmation ?? "",
    );
    const [timeframe, setTimeframe] = useState(initialTrade?.timeframe ?? "H1");
    const [session, setSession] = useState(initialTrade?.session ?? "London");
    const [setupQuality, setSetupQuality] = useState<1 | 2 | 3 | 4 | 5>(
        (initialTrade?.setupQuality as 1 | 2 | 3 | 4 | 5) ?? 3,
    );
    const [emotions, setEmotions] = useState<string[]>(
        initialTrade?.emotions ?? [],
    );
    const [mistakes, setMistakes] = useState<string[]>(
        initialTrade?.mistakes ?? [],
    );
    const [screenshots, setScreenshots] = useState<string[]>(
        initialTrade?.screenshots ?? [],
    );
    const [notes, setNotes] = useState(initialTrade?.notes ?? "");
    const [exitType, setExitType] = useState<"tp" | "sl" | "be" | "manual">(
        (initialTrade?.exitType as "tp" | "sl" | "be" | "manual") ?? "manual",
    );
    const [showStrategyDropdown, setShowStrategyDropdown] = useState(false);
    const [showConfirmationDropdown, setShowConfirmationDropdown] =
        useState(false);
    const [showSessionDropdown, setShowSessionDropdown] = useState(false);
    const [showExitTypeDropdown, setShowExitTypeDropdown] = useState(false);

    const estimatedPnL = useCallback(() => {
        if (!entryPrice || !exitPrice) return null;
        const entry = parseFloat(entryPrice);
        const exit = parseFloat(exitPrice);
        if (isNaN(entry) || isNaN(exit)) return null;
        const diff = direction === "buy" ? exit - entry : entry - exit;
        return Math.round(diff * 100000 * 10);
    }, [entryPrice, exitPrice, direction]);

    const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files)
            .slice(0, 5 - screenshots.length)
            .forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        setScreenshots((prev) => [
                            ...prev,
                            reader.result as string,
                        ]);
                    }
                };
                reader.readAsDataURL(file);
            });
    };

    const removeScreenshot = (index: number) => {
        setScreenshots((prev) => prev.filter((_, i) => i !== index));
    };

    const toggleTag = (
        tag: string,
        list: string[],
        setList: (val: string[]) => void,
    ) => {
        haptic();
        if (list.includes(tag)) {
            setList(list.filter((t) => t !== tag));
        } else {
            setList([...list, tag]);
        }
    };

    const handleSave = () => {
        haptic();
        if (!pair || !entryPrice || !exitPrice) {
            onShowToast("Please fill in pair, entry, and exit prices", "error");
            return;
        }

        const pnl = estimatedPnL() || 0;
        const entry = parseFloat(entryPrice);
        const exit = parseFloat(exitPrice);
        const pips = Math.round(Math.abs(exit - entry) * 10000);

        const trade: Trade = {
            id: initialTrade?.id ?? uuidv4(),
            timestamp: initialTrade?.timestamp ?? Date.now(),
            pair: pair.toUpperCase(),
            direction,
            entryPrice: entry,
            exitPrice: exit,
            stopLoss: parseFloat(stopLoss) || 0,
            takeProfit: parseFloat(takeProfit) || 0,
            pips:
                direction === "buy"
                    ? exit > entry
                        ? pips
                        : -pips
                    : exit < entry
                      ? pips
                      : -pips,
            profitLoss: pnl,
            commission: 2,
            strategy: strategy || "Manual",
            confirmation: confirmation || "",
            timeframe,
            session,
            setupQuality,
            emotions,
            mistakes,
            tags: [],
            screenshots,
            notes,
            exitType,
        };

        if (initialTrade) {
            updateTrade(trade);
            onShowToast(
                `Trade updated: ${trade.pair} ${trade.direction.toUpperCase()} ${pnl >= 0 ? "+" : ""}$${pnl}`,
                "success",
            );
        } else {
            addTrade(trade);
            onShowToast(
                `Trade logged: ${trade.pair} ${trade.direction.toUpperCase()} ${pnl >= 0 ? "+" : ""}$${pnl}`,
                "success",
            );
        }

        onSaved?.(trade);
        onNavigate?.("journal");

        // Reset form
        setPair("");
        setEntryPrice("");
        setExitPrice("");
        setStopLoss("");
        setTakeProfit("");
        setStrategy("");
        setConfirmation("");
        setSetupQuality(3);
        setEmotions([]);
        setMistakes([]);
        setScreenshots([]);
        setNotes("");
        // If editing, reset initial fields handled by parent via onSaved
    };

    // No effect needed: state is initialized from `initialTrade` above.

    const inputStyle: React.CSSProperties = {
        background: "var(--bg-input)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 10,
        height: 48,
        padding: "0 14px",
        color: "#F0F2F5",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 15,
        width: "100%",
        outline: "none",
    };

    const labelStyle: React.CSSProperties = {
        fontWeight: 500,
        fontSize: 13,
        color: "#8B95A5",
        marginBottom: 4,
        display: "block",
    };

    return (
        <div className="flex flex-col" style={{ padding: "16px 16px 32px" }}>
            {/* Pair */}
            <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Pair / Instrument</label>
                <input
                    type="text"
                    value={pair}
                    onChange={(e) => setPair(e.target.value.toUpperCase())}
                    placeholder="e.g. EURUSD"
                    style={inputStyle}
                />
                <div
                    className="flex flex-wrap gap-1.5"
                    style={{ marginTop: 8 }}
                >
                    {settings.currencyPairs.slice(0, 6).map((p) => (
                        <button
                            key={p}
                            style={{
                                height: 32,
                                padding: "0 12px",
                                borderRadius: 6,
                                fontSize: 12,
                                fontFamily: "'JetBrains Mono', monospace",
                                background:
                                    pair === p
                                        ? "rgba(45, 212, 168, 0.12)"
                                        : "rgba(255, 255, 255, 0.04)",
                                color: pair === p ? "#2DD4A8" : "#8B95A5",
                                border:
                                    pair === p
                                        ? "1px solid rgba(45, 212, 168, 0.25)"
                                        : "1px solid transparent",
                                transition: "all 0.2s ease",
                            }}
                            onClick={() => {
                                haptic();
                                setPair(p);
                            }}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Direction */}
            <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Direction</label>
                <div className="flex">
                    <button
                        className="flex items-center justify-center flex-1 gap-2"
                        style={{
                            height: 48,
                            borderRadius: "10px 0 0 10px",
                            background:
                                direction === "buy"
                                    ? "rgba(16, 185, 129, 0.15)"
                                    : "var(--bg-input)",
                            color: direction === "buy" ? "#10B981" : "#4A5568",
                            border:
                                direction === "buy"
                                    ? "1px solid rgba(16, 185, 129, 0.30)"
                                    : "1px solid var(--border-subtle)",
                            fontWeight: 600,
                            fontSize: 15,
                            transition: "all 0.2s ease",
                        }}
                        onClick={() => {
                            haptic();
                            setDirection("buy");
                        }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        >
                            <polyline points="7 17 17 7" />
                            <polyline points="7 7 17 7 17 17" />
                        </svg>
                        BUY
                    </button>
                    <button
                        className="flex items-center justify-center flex-1 gap-2"
                        style={{
                            height: 48,
                            borderRadius: "0 10px 10px 0",
                            background:
                                direction === "sell"
                                    ? "rgba(239, 68, 68, 0.15)"
                                    : "var(--bg-input)",
                            color: direction === "sell" ? "#EF4444" : "#4A5568",
                            border:
                                direction === "sell"
                                    ? "1px solid rgba(239, 68, 68, 0.30)"
                                    : "1px solid var(--border-subtle)",
                            fontWeight: 600,
                            fontSize: 15,
                            transition: "all 0.2s ease",
                        }}
                        onClick={() => {
                            haptic();
                            setDirection("sell");
                        }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        >
                            <polyline points="7 7 17 17" />
                            <polyline points="17 7 17 17 7 17" />
                        </svg>
                        SELL
                    </button>
                </div>
            </div>

            {/* Entry & Exit */}
            <div
                className="grid grid-cols-2 gap-3"
                style={{ marginBottom: 16 }}
            >
                <div>
                    <label style={labelStyle}>Entry Price</label>
                    <input
                        type="number"
                        step="0.00001"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(e.target.value)}
                        placeholder="1.07250"
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Exit Price</label>
                    <input
                        type="number"
                        step="0.00001"
                        value={exitPrice}
                        onChange={(e) => setExitPrice(e.target.value)}
                        placeholder="1.07480"
                        style={inputStyle}
                    />
                </div>
            </div>

            {/* SL & TP */}
            <div
                className="grid grid-cols-2 gap-3"
                style={{ marginBottom: 16 }}
            >
                <div>
                    <label style={labelStyle}>Stop Loss</label>
                    <input
                        type="number"
                        step="0.00001"
                        value={stopLoss}
                        onChange={(e) => setStopLoss(e.target.value)}
                        placeholder="1.07100"
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Take Profit</label>
                    <input
                        type="number"
                        step="0.00001"
                        value={takeProfit}
                        onChange={(e) => setTakeProfit(e.target.value)}
                        placeholder="1.07550"
                        style={inputStyle}
                    />
                </div>
            </div>

            {/* Strategy */}
            <div style={{ marginBottom: 16, position: "relative" }}>
                <label style={labelStyle}>Strategy</label>
                <button
                    className="flex items-center justify-between"
                    style={{ ...inputStyle, textAlign: "left" }}
                    onClick={() =>
                        setShowStrategyDropdown(!showStrategyDropdown)
                    }
                >
                    <span style={{ color: strategy ? "#F0F2F5" : "#4A5568" }}>
                        {strategy || "Select strategy..."}
                    </span>
                    <ChevronDown size={16} color="#4A5568" />
                </button>
                {showStrategyDropdown && (
                    <div
                        className="absolute left-0 right-0 z-10"
                        style={{
                            top: "calc(100% + 4px)",
                            background: "rgba(30, 36, 42, 0.95)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                            borderRadius: 10,
                            maxHeight: 200,
                            overflow: "auto",
                        }}
                    >
                        {STRATEGY_OPTIONS.map((s) => (
                            <button
                                key={s}
                                className="w-full text-left"
                                style={{
                                    padding: "12px 14px",
                                    fontSize: 14,
                                    color:
                                        strategy === s ? "#2DD4A8" : "#F0F2F5",
                                    background:
                                        strategy === s
                                            ? "rgba(45, 212, 168, 0.08)"
                                            : "transparent",
                                    borderBottom:
                                        "1px solid rgba(255, 255, 255, 0.03)",
                                }}
                                onClick={() => {
                                    haptic();
                                    setStrategy(s);
                                    setShowStrategyDropdown(false);
                                }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Confirmation */}
            <div style={{ marginBottom: 16, position: "relative" }}>
                <label style={labelStyle}>Confirmation</label>
                <button
                    className="flex items-center justify-between"
                    style={{ ...inputStyle, textAlign: "left" }}
                    onClick={() =>
                        setShowConfirmationDropdown(!showConfirmationDropdown)
                    }
                >
                    <span
                        style={{
                            color: confirmation ? "#F0F2F5" : "#4A5568",
                        }}
                    >
                        {confirmation || "Select confirmation..."}
                    </span>
                    <ChevronDown size={16} color="#4A5568" />
                </button>
                {showConfirmationDropdown && (
                    <div
                        className="absolute left-0 right-0 z-10"
                        style={{
                            top: "calc(100% + 4px)",
                            background: "rgba(30, 36, 42, 0.95)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                            borderRadius: 10,
                            maxHeight: 200,
                            overflow: "auto",
                        }}
                    >
                        {CONFIRMATION_OPTIONS.map((option) => (
                            <button
                                key={option}
                                className="w-full text-left"
                                style={{
                                    padding: "12px 14px",
                                    fontSize: 14,
                                    color:
                                        confirmation === option
                                            ? "#2DD4A8"
                                            : "#F0F2F5",
                                    background:
                                        confirmation === option
                                            ? "rgba(45, 212, 168, 0.08)"
                                            : "transparent",
                                    borderBottom:
                                        "1px solid rgba(255, 255, 255, 0.03)",
                                }}
                                onClick={() => {
                                    haptic();
                                    setConfirmation(option);
                                    setShowConfirmationDropdown(false);
                                }}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Timeframe */}
            <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Timeframe</label>
                <div className="flex flex-wrap gap-1.5">
                    {settings.timeframes.map((tf) => (
                        <button
                            key={tf}
                            style={{
                                height: 36,
                                padding: "0 14px",
                                borderRadius: 8,
                                fontSize: 13,
                                fontFamily: "'JetBrains Mono', monospace",
                                background:
                                    timeframe === tf
                                        ? "rgba(45, 212, 168, 0.12)"
                                        : "rgba(255, 255, 255, 0.04)",
                                color: timeframe === tf ? "#2DD4A8" : "#8B95A5",
                                border:
                                    timeframe === tf
                                        ? "1px solid rgba(45, 212, 168, 0.25)"
                                        : "1px solid transparent",
                                transition: "all 0.2s ease",
                            }}
                            onClick={() => {
                                haptic();
                                setTimeframe(tf);
                            }}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {/* Session */}
            <div style={{ marginBottom: 16, position: "relative" }}>
                <label style={labelStyle}>Session</label>
                <button
                    className="flex items-center justify-between"
                    style={{ ...inputStyle, textAlign: "left" }}
                    onClick={() => setShowSessionDropdown(!showSessionDropdown)}
                >
                    <span style={{ color: "#F0F2F5" }}>{session}</span>
                    <ChevronDown size={16} color="#4A5568" />
                </button>
                {showSessionDropdown && (
                    <div
                        className="absolute left-0 right-0 z-10"
                        style={{
                            top: "calc(100% + 4px)",
                            background: "rgba(30, 36, 42, 0.95)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                            borderRadius: 10,
                        }}
                    >
                        {settings.sessions.map((s) => (
                            <button
                                key={s}
                                className="w-full text-left"
                                style={{
                                    padding: "12px 14px",
                                    fontSize: 14,
                                    color:
                                        session === s ? "#2DD4A8" : "#F0F2F5",
                                    background:
                                        session === s
                                            ? "rgba(45, 212, 168, 0.08)"
                                            : "transparent",
                                    borderBottom:
                                        "1px solid rgba(255, 255, 255, 0.03)",
                                }}
                                onClick={() => {
                                    haptic();
                                    setSession(s);
                                    setShowSessionDropdown(false);
                                }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Setup Quality */}
            <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Setup Quality</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => {
                                haptic();
                                setSetupQuality(star as 1 | 2 | 3 | 4 | 5);
                            }}
                        >
                            <Star
                                size={24}
                                fill={
                                    star <= setupQuality
                                        ? "#F59E0B"
                                        : "transparent"
                                }
                                stroke={
                                    star <= setupQuality
                                        ? "#F59E0B"
                                        : "rgba(255, 255, 255, 0.10)"
                                }
                                strokeWidth={1.5}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Emotions */}
            <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Emotions</label>
                <div className="flex flex-wrap gap-2">
                    {settings.emotionTags.map((tag) => {
                        const selected = emotions.includes(tag);
                        return (
                            <button
                                key={tag}
                                style={{
                                    height: 32,
                                    padding: "0 12px",
                                    borderRadius: 16,
                                    fontSize: 12,
                                    background: selected
                                        ? "rgba(45, 212, 168, 0.12)"
                                        : "rgba(255, 255, 255, 0.04)",
                                    color: selected ? "#2DD4A8" : "#8B95A5",
                                    border: selected
                                        ? "1px solid rgba(45, 212, 168, 0.25)"
                                        : "1px solid transparent",
                                    transition: "all 0.2s ease",
                                }}
                                onClick={() =>
                                    toggleTag(tag, emotions, setEmotions)
                                }
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Mistakes */}
            <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Mistakes (if any)</label>
                <div className="flex flex-wrap gap-2">
                    {settings.mistakeTags.map((tag) => {
                        const selected = mistakes.includes(tag);
                        return (
                            <button
                                key={tag}
                                style={{
                                    height: 32,
                                    padding: "0 12px",
                                    borderRadius: 16,
                                    fontSize: 12,
                                    background: selected
                                        ? "rgba(245, 158, 11, 0.10)"
                                        : "rgba(255, 255, 255, 0.04)",
                                    color: selected ? "#F59E0B" : "#8B95A5",
                                    border: selected
                                        ? "1px solid rgba(245, 158, 11, 0.25)"
                                        : "1px solid transparent",
                                    transition: "all 0.2s ease",
                                }}
                                onClick={() =>
                                    toggleTag(tag, mistakes, setMistakes)
                                }
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Exit Type */}
            <div style={{ marginBottom: 16, position: "relative" }}>
                <label style={labelStyle}>Exit Type</label>
                <button
                    className="flex items-center justify-between"
                    style={{ ...inputStyle, textAlign: "left" }}
                    onClick={() =>
                        setShowExitTypeDropdown(!showExitTypeDropdown)
                    }
                >
                    <span
                        style={{ color: "#F0F2F5", textTransform: "uppercase" }}
                    >
                        {exitType}
                    </span>
                    <ChevronDown size={16} color="#4A5568" />
                </button>
                {showExitTypeDropdown && (
                    <div
                        className="absolute left-0 right-0 z-10"
                        style={{
                            top: "calc(100% + 4px)",
                            background: "rgba(30, 36, 42, 0.95)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                            borderRadius: 10,
                        }}
                    >
                        {(["tp", "sl", "be", "manual"] as const).map((et) => (
                            <button
                                key={et}
                                className="w-full text-left"
                                style={{
                                    padding: "12px 14px",
                                    fontSize: 14,
                                    color:
                                        exitType === et ? "#2DD4A8" : "#F0F2F5",
                                    background:
                                        exitType === et
                                            ? "rgba(45, 212, 168, 0.08)"
                                            : "transparent",
                                    borderBottom:
                                        "1px solid rgba(255, 255, 255, 0.03)",
                                }}
                                onClick={() => {
                                    haptic();
                                    setExitType(et);
                                    setShowExitTypeDropdown(false);
                                }}
                            >
                                {et.toUpperCase()}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Screenshots */}
            <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>
                    Screenshots ({screenshots.length}/5)
                </label>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleScreenshotUpload}
                />
                {screenshots.length === 0 ? (
                    <button
                        className="flex flex-col items-center justify-center w-full gap-2"
                        style={{
                            height: 120,
                            border: "2px dashed rgba(255, 255, 255, 0.10)",
                            borderRadius: 12,
                            color: "#4A5568",
                        }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Camera size={32} />
                        <span style={{ fontSize: 13 }}>
                            Tap to add screenshots
                        </span>
                    </button>
                ) : (
                    <div className="flex gap-2 pb-2 overflow-x-auto">
                        {screenshots.map((s, i) => (
                            <div key={i} className="relative flex-shrink-0">
                                <img
                                    src={s}
                                    alt={`Screenshot ${i + 1}`}
                                    style={{
                                        width: 64,
                                        height: 64,
                                        objectFit: "cover",
                                        borderRadius: 8,
                                    }}
                                />
                                <button
                                    className="absolute flex items-center justify-center -top-1 -right-1"
                                    style={{
                                        width: 18,
                                        height: 18,
                                        borderRadius: "50%",
                                        background: "#EF4444",
                                        color: "#fff",
                                        fontSize: 10,
                                    }}
                                    onClick={() => removeScreenshot(i)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        {screenshots.length < 5 && (
                            <button
                                className="flex items-center justify-center flex-shrink-0"
                                style={{
                                    width: 64,
                                    height: 64,
                                    border: "2px dashed rgba(255, 255, 255, 0.10)",
                                    borderRadius: 8,
                                    color: "#4A5568",
                                }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Camera size={20} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Notes</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Journal your thoughts about this trade..."
                    style={{
                        ...inputStyle,
                        height: 100,
                        minHeight: 100,
                        padding: "12px 14px",
                        resize: "vertical",
                        fontFamily: "Inter, sans-serif",
                        lineHeight: 1.5,
                    }}
                />
            </div>

            {/* Save Button */}
            <motion.button
                className="w-full"
                style={{
                    height: 52,
                    borderRadius: 12,
                    background: "#2DD4A8",
                    color: "#0D0F11",
                    fontWeight: 600,
                    fontSize: 16,
                    boxShadow: "0 4px 20px rgba(45, 212, 168, 0.25)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
            >
                Save Trade
            </motion.button>
        </div>
    );
}
