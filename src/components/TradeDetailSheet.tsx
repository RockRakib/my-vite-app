import React, { useState, useRef } from "react";
import type { Trade } from "../types";
import BottomSheet from "./BottomSheet";
import { Star, Pencil, Trash2 } from "lucide-react";

interface TradeDetailSheetProps {
    trade: Trade | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (trade: Trade) => void;
    onDelete?: (id: string) => void;
}

export default function TradeDetailSheet({
    trade,
    isOpen,
    onClose,
    onEdit,
    onDelete,
}: TradeDetailSheetProps) {
    if (!trade) return null;

    const [fullscreenSrc, setFullscreenSrc] = useState<string | null>(null);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const startPanRef = useRef({ x: 0, y: 0 });
    const startOffsetRef = useRef({ x: 0, y: 0 });

    const dateStr = new Date(trade.timestamp).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    const timeStr = new Date(trade.timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const fields = [
        { label: "Entry Price", value: trade.entryPrice.toFixed(5) },
        { label: "Exit Price", value: trade.exitPrice.toFixed(5) },
        { label: "Stop Loss", value: trade.stopLoss.toFixed(5) },
        { label: "Take Profit", value: trade.takeProfit.toFixed(5) },
        { label: "Pips", value: `${trade.pips > 0 ? "+" : ""}${trade.pips}` },
        { label: "Commission", value: `$${trade.commission}` },
        { label: "Strategy", value: trade.strategy },
        { label: "Timeframe", value: trade.timeframe },
        { label: "Session", value: trade.session },
        { label: "Exit Type", value: trade.exitType.toUpperCase() },
    ];

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title={`${trade.pair} ${trade.direction.toUpperCase()}`}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between py-4"
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}
            >
                <div>
                    <div style={{ fontSize: 11, color: "#4A5568" }}>
                        {dateStr} · {timeStr}
                    </div>
                </div>
                <div
                    className="flex items-center justify-center"
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background:
                            trade.direction === "buy"
                                ? "rgba(16, 185, 129, 0.12)"
                                : "rgba(239, 68, 68, 0.12)",
                        border: `1px solid ${trade.direction === "buy" ? "rgba(16, 185, 129, 0.20)" : "rgba(239, 68, 68, 0.20)"}`,
                    }}
                >
                    <span
                        className="font-mono"
                        style={{
                            fontWeight: 700,
                            fontSize: 14,
                            color:
                                trade.direction === "buy"
                                    ? "#10B981"
                                    : "#EF4444",
                        }}
                    >
                        {trade.direction === "buy" ? "B" : "S"}
                    </span>
                </div>
            </div>

            {/* Info Grid */}
            <div
                className="grid grid-cols-2 gap-3 py-4"
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}
            >
                {fields.map((f) => (
                    <div key={f.label}>
                        <div
                            style={{
                                fontSize: 11,
                                color: "#4A5568",
                                marginBottom: 2,
                            }}
                        >
                            {f.label}
                        </div>
                        <div
                            className="font-mono"
                            style={{
                                fontSize: 14,
                                color: "#F0F2F5",
                                fontWeight: 500,
                            }}
                        >
                            {f.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Setup Quality */}
            <div
                className="py-4"
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}
            >
                <div
                    style={{ fontSize: 11, color: "#4A5568", marginBottom: 8 }}
                >
                    Setup Quality
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={20}
                            fill={
                                star <= trade.setupQuality
                                    ? "#F59E0B"
                                    : "transparent"
                            }
                            stroke={
                                star <= trade.setupQuality
                                    ? "#F59E0B"
                                    : "rgba(255, 255, 255, 0.10)"
                            }
                            strokeWidth={1.5}
                        />
                    ))}
                </div>
            </div>

            {/* Emotions */}
            {trade.emotions.length > 0 && (
                <div
                    className="py-4"
                    style={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                >
                    <div
                        style={{
                            fontSize: 11,
                            color: "#4A5568",
                            marginBottom: 8,
                        }}
                    >
                        Emotions
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {trade.emotions.map((e) => (
                            <span
                                key={e}
                                style={{
                                    fontSize: 12,
                                    padding: "4px 10px",
                                    borderRadius: 12,
                                    background: "rgba(45, 212, 168, 0.12)",
                                    color: "#2DD4A8",
                                    border: "1px solid rgba(45, 212, 168, 0.20)",
                                }}
                            >
                                {e}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Mistakes */}
            {trade.mistakes.length > 0 && (
                <div
                    className="py-4"
                    style={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                >
                    <div
                        style={{
                            fontSize: 11,
                            color: "#4A5568",
                            marginBottom: 8,
                        }}
                    >
                        Mistakes
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {trade.mistakes.map((m) => (
                            <span
                                key={m}
                                style={{
                                    fontSize: 12,
                                    padding: "4px 10px",
                                    borderRadius: 12,
                                    background: "rgba(245, 158, 11, 0.10)",
                                    color: "#F59E0B",
                                    border: "1px solid rgba(245, 158, 11, 0.20)",
                                }}
                            >
                                {m}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Tags */}
            {trade.tags.length > 0 && (
                <div
                    className="py-4"
                    style={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                >
                    <div
                        style={{
                            fontSize: 11,
                            color: "#4A5568",
                            marginBottom: 8,
                        }}
                    >
                        Tags
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {trade.tags.map((t) => (
                            <span
                                key={t}
                                style={{
                                    fontSize: 12,
                                    padding: "4px 10px",
                                    borderRadius: 12,
                                    background: "rgba(255, 255, 255, 0.04)",
                                    color: "#8B95A5",
                                    border: "1px solid rgba(255, 255, 255, 0.06)",
                                }}
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Screenshots */}
            {trade.screenshots.length > 0 && (
                <div
                    className="py-4"
                    style={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                >
                    <div
                        style={{
                            fontSize: 11,
                            color: "#4A5568",
                            marginBottom: 8,
                        }}
                    >
                        Screenshots ({trade.screenshots.length})
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {trade.screenshots.map((s, i) => (
                            <img
                                key={i}
                                src={s}
                                alt={`Screenshot ${i + 1}`}
                                style={{
                                    width: 200,
                                    height: 120,
                                    objectFit: "cover",
                                    borderRadius: 10,
                                    flexShrink: 0,
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    setFullscreenSrc(s);
                                    setScale(1);
                                    setOffset({ x: 0, y: 0 });
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Fullscreen viewer with smooth draggable zoom */}
            {fullscreenSrc && (
                <div
                    onClick={() => {
                        // if zoomed (scale>1) reset zoom first, else close
                        if (scale > 1) {
                            setScale(1);
                            setOffset({ x: 0, y: 0 });
                        } else {
                            setFullscreenSrc(null);
                            setScale(1);
                            setOffset({ x: 0, y: 0 });
                        }
                    }}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                    }}
                >
                    <img
                        src={fullscreenSrc}
                        alt="fullscreen"
                        onClick={(e) => {
                            e.stopPropagation(); /* prevent outer close */
                        }}
                        onWheel={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const delta = -e.deltaY;
                            const Z = delta > 0 ? 1.12 : 0.88;
                            setScale((s) => {
                                const next = Math.max(
                                    1,
                                    Math.min(4, +(s * Z).toFixed(3)),
                                );
                                // if resetting to 1 also reset offset
                                if (next === 1) setOffset({ x: 0, y: 0 });
                                return next;
                            });
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            const p = e as React.PointerEvent<HTMLImageElement>;
                            (p.target as Element).setPointerCapture(
                                p.pointerId,
                            );
                            setIsPanning(true);
                            startPanRef.current = {
                                x: p.clientX,
                                y: p.clientY,
                            };
                            startOffsetRef.current = { ...offset };
                        }}
                        onPointerMove={(e) => {
                            const p = e as React.PointerEvent<HTMLImageElement>;
                            if (!isPanning) return;
                            const dx = p.clientX - startPanRef.current.x;
                            const dy = p.clientY - startPanRef.current.y;
                            setOffset({
                                x: startOffsetRef.current.x + dx,
                                y: startOffsetRef.current.y + dy,
                            });
                        }}
                        onPointerUp={(e) => {
                            const p = e as React.PointerEvent<HTMLImageElement>;
                            try {
                                (p.target as Element).releasePointerCapture(
                                    p.pointerId,
                                );
                            } catch {}
                            setIsPanning(false);
                        }}
                        onPointerCancel={() => setIsPanning(false)}
                        style={{
                            width: "auto",
                            height: "auto",
                            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                            transition: isPanning
                                ? "none"
                                : "transform 0.18s ease",
                            cursor: isPanning
                                ? "grabbing"
                                : scale > 1
                                  ? "grab"
                                  : "zoom-in",
                            userSelect: "none",
                            touchAction: "none",
                            borderRadius: 8,
                            boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
                            maxWidth: "95%",
                            maxHeight: "95%",
                        }}
                    />
                </div>
            )}

            {/* Notes */}
            {trade.notes && (
                <div
                    className="py-4"
                    style={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                >
                    <div
                        style={{
                            fontSize: 11,
                            color: "#4A5568",
                            marginBottom: 8,
                        }}
                    >
                        Notes
                    </div>
                    <div
                        style={{
                            background: "rgba(255, 255, 255, 0.02)",
                            padding: 16,
                            borderRadius: 10,
                            fontSize: 14,
                            color: "#8B95A5",
                            lineHeight: 1.6,
                        }}
                    >
                        {trade.notes}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
                <button
                    className="flex-1 flex items-center justify-center gap-2"
                    style={{
                        height: 48,
                        borderRadius: 12,
                        border: "1px solid rgba(45, 212, 168, 0.30)",
                        color: "#2DD4A8",
                        fontSize: 14,
                        fontWeight: 600,
                        background: "rgba(45, 212, 168, 0.08)",
                    }}
                    onClick={() => onEdit?.(trade)}
                >
                    <Pencil size={16} />
                    Edit
                </button>
                <button
                    className="flex-1 flex items-center justify-center gap-2"
                    style={{
                        height: 48,
                        borderRadius: 12,
                        border: "1px solid rgba(239, 68, 68, 0.30)",
                        color: "#EF4444",
                        fontSize: 14,
                        fontWeight: 600,
                        background: "rgba(239, 68, 68, 0.08)",
                    }}
                    onClick={() => onDelete?.(trade.id)}
                >
                    <Trash2 size={16} />
                    Delete
                </button>
            </div>
        </BottomSheet>
    );
}
