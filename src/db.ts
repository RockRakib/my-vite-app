import type { Trade, CustomField, UserSettings } from "./types";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEYS = {
    trades: "tradevault_trades",
    customFields: "tradevault_customFields",
    settings: "tradevault_settings",
};

// Demo trades data
const DEMO_TRADES: Trade[] = [
    {
        id: uuidv4(),
        timestamp: new Date("2026-06-02T09:30:00").getTime(),
        pair: "EURUSD",
        direction: "buy",
        entryPrice: 1.0725,
        exitPrice: 1.0748,
        stopLoss: 1.071,
        takeProfit: 1.0755,
        pips: 23,
        profitLoss: 115,
        commission: 3,
        strategy: "Breakout",
        timeframe: "H1",
        session: "London",
        setupQuality: 4,
        emotions: ["Confident", "Patient"],
        mistakes: [],
        tags: ["trend"],
        screenshots: [],
        notes: "Clean breakout above resistance. Good entry.",
        exitType: "tp",
    },
    {
        id: uuidv4(),
        timestamp: new Date("2026-06-02T14:15:00").getTime(),
        pair: "GBPUSD",
        direction: "sell",
        entryPrice: 1.255,
        exitPrice: 1.2532,
        stopLoss: 1.2565,
        takeProfit: 1.2515,
        pips: 18,
        profitLoss: 54,
        commission: 2,
        strategy: "Support Bounce",
        timeframe: "M15",
        session: "New York",
        setupQuality: 3,
        emotions: ["Focused"],
        mistakes: [],
        tags: ["scalp"],
        screenshots: [],
        notes: "Quick scalp off support. Exited early.",
        exitType: "manual",
    },
    {
        id: uuidv4(),
        timestamp: new Date("2026-06-03T08:45:00").getTime(),
        pair: "USDJPY",
        direction: "buy",
        entryPrice: 156.8,
        exitPrice: 156.55,
        stopLoss: 156.4,
        takeProfit: 157.2,
        pips: -25,
        profitLoss: -100,
        commission: 3,
        strategy: "Trend Follow",
        timeframe: "H4",
        session: "Asian",
        setupQuality: 2,
        emotions: ["Hesitant"],
        mistakes: ["Chased Entry"],
        tags: ["trend"],
        screenshots: [],
        notes: "Entered too late. Should have waited.",
        exitType: "sl",
    },
    {
        id: uuidv4(),
        timestamp: new Date("2026-06-04T10:00:00").getTime(),
        pair: "XAUUSD",
        direction: "buy",
        entryPrice: 2345.2,
        exitPrice: 2351.8,
        stopLoss: 2338.5,
        takeProfit: 2355.0,
        pips: 66,
        profitLoss: 132,
        commission: 2,
        strategy: "Breakout",
        timeframe: "H1",
        session: "London",
        setupQuality: 5,
        emotions: ["Confident", "Patient"],
        mistakes: [],
        tags: ["gold", "trend"],
        screenshots: [],
        notes: "Perfect setup. Gold breaking ATH.",
        exitType: "manual",
    },
    {
        id: uuidv4(),
        timestamp: new Date("2026-06-05T11:30:00").getTime(),
        pair: "EURUSD",
        direction: "sell",
        entryPrice: 1.08,
        exitPrice: 1.0785,
        stopLoss: 1.0815,
        takeProfit: 1.076,
        pips: 15,
        profitLoss: 75,
        commission: 3,
        strategy: "Retracement",
        timeframe: "M30",
        session: "Overlap",
        setupQuality: 4,
        emotions: ["Calm"],
        mistakes: [],
        tags: ["retrace"],
        screenshots: [],
        notes: "Nice retracement entry after impulse.",
        exitType: "manual",
    },
    {
        id: uuidv4(),
        timestamp: new Date("2026-06-06T09:15:00").getTime(),
        pair: "GBPJPY",
        direction: "buy",
        entryPrice: 197.5,
        exitPrice: 197.2,
        stopLoss: 197.0,
        takeProfit: 198.1,
        pips: -30,
        profitLoss: -90,
        commission: 2,
        strategy: "Trend Follow",
        timeframe: "H1",
        session: "London",
        setupQuality: 3,
        emotions: ["FOMO"],
        mistakes: ["Overtraded"],
        tags: ["trend"],
        screenshots: [],
        notes: "FOMO trade. Should not have taken this.",
        exitType: "sl",
    },
    {
        id: uuidv4(),
        timestamp: new Date("2026-06-09T14:00:00").getTime(),
        pair: "AUDUSD",
        direction: "buy",
        entryPrice: 0.665,
        exitPrice: 0.6675,
        stopLoss: 0.6635,
        takeProfit: 0.669,
        pips: 25,
        profitLoss: 100,
        commission: 2,
        strategy: "Support Bounce",
        timeframe: "H4",
        session: "New York",
        setupQuality: 4,
        emotions: ["Patient"],
        mistakes: [],
        tags: ["bounce"],
        screenshots: [],
        notes: "Clean bounce off daily support.",
        exitType: "manual",
    },
    {
        id: uuidv4(),
        timestamp: new Date("2026-06-10T08:30:00").getTime(),
        pair: "USDCAD",
        direction: "sell",
        entryPrice: 1.365,
        exitPrice: 1.368,
        stopLoss: 1.363,
        takeProfit: 1.37,
        pips: -30,
        profitLoss: -90,
        commission: 2,
        strategy: "Breakout",
        timeframe: "M15",
        session: "London",
        setupQuality: 2,
        emotions: ["Impatient"],
        mistakes: ["Wrong Direction"],
        tags: ["breakout"],
        screenshots: [],
        notes: "False breakout. Should have waited for confirmation.",
        exitType: "sl",
    },
    {
        id: uuidv4(),
        timestamp: new Date("2026-06-11T10:45:00").getTime(),
        pair: "EURGBP",
        direction: "buy",
        entryPrice: 0.855,
        exitPrice: 0.8568,
        stopLoss: 0.8535,
        takeProfit: 0.858,
        pips: 18,
        profitLoss: 90,
        commission: 3,
        strategy: "Range Play",
        timeframe: "H1",
        session: "London",
        setupQuality: 3,
        emotions: ["Focused"],
        mistakes: [],
        tags: ["range"],
        screenshots: [],
        notes: "Range bound market. Took the bounce.",
        exitType: "tp",
    },
    {
        id: uuidv4(),
        timestamp: new Date("2026-06-12T13:20:00").getTime(),
        pair: "NZDUSD",
        direction: "sell",
        entryPrice: 0.612,
        exitPrice: 0.6105,
        stopLoss: 0.6135,
        takeProfit: 0.608,
        pips: 15,
        profitLoss: 60,
        commission: 2,
        strategy: "Retracement",
        timeframe: "M30",
        session: "New York",
        setupQuality: 4,
        emotions: ["Confident"],
        mistakes: [],
        tags: ["retrace"],
        screenshots: [],
        notes: "Good retracement play.",
        exitType: "manual",
    },
    {
        id: uuidv4(),
        timestamp: new Date("2026-06-13T09:00:00").getTime(),
        pair: "XAUUSD",
        direction: "sell",
        entryPrice: 2320.0,
        exitPrice: 2325.5,
        stopLoss: 2315.0,
        takeProfit: 2310.0,
        pips: -55,
        profitLoss: -110,
        commission: 2,
        strategy: "Reversal",
        timeframe: "H4",
        session: "London",
        setupQuality: 2,
        emotions: ["Revenge"],
        mistakes: ["Revenge Trade"],
        tags: ["gold"],
        screenshots: [],
        notes: "Revenge trade after loss. Terrible decision.",
        exitType: "sl",
    },
    {
        id: uuidv4(),
        timestamp: new Date("2026-06-16T11:00:00").getTime(),
        pair: "EURUSD",
        direction: "buy",
        entryPrice: 1.068,
        exitPrice: 1.0705,
        stopLoss: 1.0665,
        takeProfit: 1.072,
        pips: 25,
        profitLoss: 125,
        commission: 3,
        strategy: "Breakout",
        timeframe: "H1",
        session: "Overlap",
        setupQuality: 5,
        emotions: ["Patient", "Confident"],
        mistakes: [],
        tags: ["trend"],
        screenshots: [],
        notes: "Beautiful breakout. A+ setup.",
        exitType: "manual",
    },
    {
        id: uuidv4(),
        timestamp: new Date("2026-06-17T14:30:00").getTime(),
        pair: "GBPUSD",
        direction: "buy",
        entryPrice: 1.26,
        exitPrice: 1.2585,
        stopLoss: 1.2615,
        takeProfit: 1.264,
        pips: -15,
        profitLoss: -45,
        commission: 2,
        strategy: "Trend Follow",
        timeframe: "M30",
        session: "New York",
        setupQuality: 3,
        emotions: ["Hesitant"],
        mistakes: [],
        tags: ["trend"],
        screenshots: [],
        notes: "Weak follow-through. Small loss.",
        exitType: "sl",
    },
    {
        id: uuidv4(),
        timestamp: new Date("2026-06-18T08:15:00").getTime(),
        pair: "USDJPY",
        direction: "sell",
        entryPrice: 157.3,
        exitPrice: 156.9,
        stopLoss: 157.6,
        takeProfit: 156.5,
        pips: 40,
        profitLoss: 160,
        commission: 2,
        strategy: "Reversal",
        timeframe: "H4",
        session: "Asian",
        setupQuality: 4,
        emotions: ["Confident"],
        mistakes: [],
        tags: ["reversal"],
        screenshots: [],
        notes: "Caught the reversal perfectly.",
        exitType: "manual",
    },
    {
        id: uuidv4(),
        timestamp: new Date("2026-06-19T10:30:00").getTime(),
        pair: "XAUUSD",
        direction: "buy",
        entryPrice: 2330.5,
        exitPrice: 2338.0,
        stopLoss: 2325.0,
        takeProfit: 2342.0,
        pips: 75,
        profitLoss: 225,
        commission: 2,
        strategy: "Breakout",
        timeframe: "H1",
        session: "London",
        setupQuality: 5,
        emotions: ["Confident", "Patient"],
        mistakes: [],
        tags: ["gold", "breakout"],
        screenshots: [],
        notes: "Massive breakout. Best trade of the month!",
        exitType: "tp",
    },
];

const DEFAULT_SETTINGS: UserSettings = {
    accountCurrency: "USD",
    riskPerTrade: 1.0,
    showTorus: true,
    hapticEnabled: true,
    defaultDirection: "buy",
    currencyPairs: [
        "EURUSD",
        "GBPUSD",
        "USDJPY",
        "XAUUSD",
        "AUDUSD",
        "USDCAD",
        "NZDUSD",
        "EURGBP",
        "GBPJPY",
    ],
    strategies: [
        "BREAKOUT CC",
        "GAP-D.BO",
        "GAP-GAP.CC",
        "CLASSIC-CLASSIC.CC",
        "CLASSIC-GAP.CC",
        "CLASSIC-GAP",
        "POC",
        "JOKER",
    ],
    timeframes: ["M1", "M5", "M15", "M30", "H1", "H2", "H4", "D1"],
    sessions: ["London", "New York", "Asian", "Overlap"],
    emotionTags: [
        "Confident",
        "Patient",
        "FOMO",
        "Hesitant",
        "Impatient",
        "Revenge",
    ],
    mistakeTags: [
        "Moved SL",
        "Overtraded",
        "Chased Entry",
        "Missed Entry",
        "Wrong Direction",
        "Revenge Trade",
        "Too Early",
    ],
};

const DEFAULT_CUSTOM_FIELDS: CustomField[] = [
    {
        id: uuidv4(),
        name: "Exit Type",
        key: "exitType",
        type: "select",
        options: ["TP", "SL", "BE", "Manual"],
        required: false,
        order: 0,
        enabled: true,
    },
    {
        id: uuidv4(),
        name: "Setup Quality",
        key: "setupQuality",
        type: "select",
        options: ["1", "2", "3", "4", "5"],
        required: false,
        order: 1,
        enabled: true,
    },
    {
        id: uuidv4(),
        name: "Session",
        key: "session",
        type: "select",
        options: ["London", "New York", "Asian", "Overlap"],
        required: false,
        order: 2,
        enabled: true,
    },
];

// Storage helpers
function getItem<T>(key: string, defaultValue: T): T {
    try {
        const item = localStorage.getItem(key);
        if (item) return JSON.parse(item);
        return defaultValue;
    } catch {
        return defaultValue;
    }
}

function setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
}

// Initialize with demo data if empty
function initDemoData() {
    if (!localStorage.getItem(STORAGE_KEYS.trades)) {
        setItem(STORAGE_KEYS.trades, DEMO_TRADES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.settings)) {
        setItem(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.customFields)) {
        setItem(STORAGE_KEYS.customFields, DEFAULT_CUSTOM_FIELDS);
    }
}

// Trade operations
export function getTrades(): Trade[] {
    initDemoData();
    return getItem<Trade[]>(STORAGE_KEYS.trades, []);
}

export function addTrade(trade: Trade): void {
    const trades = getTrades();
    trades.unshift(trade);
    setItem(STORAGE_KEYS.trades, trades);
}

export function updateTrade(trade: Trade): void {
    const trades = getTrades();
    const index = trades.findIndex((t) => t.id === trade.id);
    if (index !== -1) {
        trades[index] = trade;
        setItem(STORAGE_KEYS.trades, trades);
    }
}

export function deleteTrade(id: string): void {
    const trades = getTrades();
    setItem(
        STORAGE_KEYS.trades,
        trades.filter((t) => t.id !== id),
    );
}

// Settings operations
export function getSettings(): UserSettings {
    initDemoData();
    const settings = getItem<UserSettings>(
        STORAGE_KEYS.settings,
        DEFAULT_SETTINGS,
    );
    // Ensure new timeframe H2 is present for users with existing stored settings
    try {
        if (!settings.timeframes.includes("H2")) {
            const idx = settings.timeframes.indexOf("H1");
            if (idx !== -1) settings.timeframes.splice(idx + 1, 0, "H2");
            else settings.timeframes.push("H2");
            setItem(STORAGE_KEYS.settings, settings);
        }
    } catch {
        // ignore and return settings as-is
    }
    return settings;
}

export function saveSettings(settings: UserSettings): void {
    setItem(STORAGE_KEYS.settings, settings);
}

// Custom fields operations
export function getCustomFields(): CustomField[] {
    initDemoData();
    return getItem<CustomField[]>(STORAGE_KEYS.customFields, []);
}

export function saveCustomFields(fields: CustomField[]): void {
    setItem(STORAGE_KEYS.customFields, fields);
}

// Export/Import
export function exportData(): object {
    return {
        trades: getTrades(),
        settings: getSettings(),
        customFields: getCustomFields(),
        exportDate: new Date().toISOString(),
        version: "1.0",
    };
}

export function importData(data: {
    trades?: Trade[];
    settings?: UserSettings;
    customFields?: CustomField[];
}): boolean {
    try {
        if (data.trades) setItem(STORAGE_KEYS.trades, data.trades);
        if (data.settings) setItem(STORAGE_KEYS.settings, data.settings);
        if (data.customFields)
            setItem(STORAGE_KEYS.customFields, data.customFields);
        return true;
    } catch {
        return false;
    }
}

export function resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.trades);
    localStorage.removeItem(STORAGE_KEYS.settings);
    localStorage.removeItem(STORAGE_KEYS.customFields);
    initDemoData();
}

// Computed stats
export function getTodayTrades(): Trade[] {
    const trades = getTrades();
    const now = new Date();
    const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
    ).getTime();
    return trades.filter((t) => t.timestamp >= startOfDay);
}

export function getTodayPnL(): number {
    return getTodayTrades().reduce((sum, t) => sum + t.profitLoss, 0);
}

export function getWinRate(): number {
    const trades = getTrades();
    if (trades.length === 0) return 0;
    const wins = trades.filter((t) => t.profitLoss > 0).length;
    return Math.round((wins / trades.length) * 100);
}

export function getCurrentStreak(): { type: "W" | "L"; count: number } {
    const trades = getTrades();
    if (trades.length === 0) return { type: "W", count: 0 };
    const sorted = [...trades].sort((a, b) => b.timestamp - a.timestamp);
    const firstType = sorted[0].profitLoss > 0 ? "W" : "L";
    let count = 0;
    for (const t of sorted) {
        const isWin = t.profitLoss > 0;
        if ((firstType === "W" && isWin) || (firstType === "L" && !isWin)) {
            count++;
        } else {
            break;
        }
    }
    return { type: firstType, count };
}

export function getTotalTrades(): number {
    return getTrades().length;
}

export function getTotalPnL(): number {
    return getTrades().reduce((sum, t) => sum + t.profitLoss, 0);
}

export function getAverageWinner(): number {
    const wins = getTrades().filter((t) => t.profitLoss > 0);
    if (wins.length === 0) return 0;
    return Math.round(wins.reduce((s, t) => s + t.profitLoss, 0) / wins.length);
}

export function getAverageLoser(): number {
    const losses = getTrades().filter((t) => t.profitLoss < 0);
    if (losses.length === 0) return 0;
    return Math.round(
        losses.reduce((s, t) => s + t.profitLoss, 0) / losses.length,
    );
}

export function getBestStrategy(): { name: string; pnl: number } {
    const trades = getTrades();
    const byStrategy: Record<string, number> = {};
    trades.forEach((t) => {
        byStrategy[t.strategy] = (byStrategy[t.strategy] || 0) + t.profitLoss;
    });
    let best = { name: "-", pnl: 0 };
    Object.entries(byStrategy).forEach(([name, pnl]) => {
        if (pnl > best.pnl) best = { name, pnl };
    });
    return best;
}

export function getProfitFactor(): number {
    const trades = getTrades();
    const grossProfit = trades
        .filter((t) => t.profitLoss > 0)
        .reduce((s, t) => s + t.profitLoss, 0);
    const grossLoss = Math.abs(
        trades
            .filter((t) => t.profitLoss < 0)
            .reduce((s, t) => s + t.profitLoss, 0),
    );
    if (grossLoss === 0) return grossProfit > 0 ? 999 : 0;
    return Math.round((grossProfit / grossLoss) * 100) / 100;
}

export function getEquityCurve(): { date: string; value: number }[] {
    const trades = [...getTrades()].sort((a, b) => a.timestamp - b.timestamp);
    let equity = 0;
    return trades.map((t) => {
        equity += t.profitLoss;
        return {
            date: new Date(t.timestamp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            value: equity,
        };
    });
}

export function getMonthlyPnL(): { month: string; pnl: number }[] {
    const trades = getTrades();
    const byMonth: Record<string, number> = {};
    trades.forEach((t) => {
        const key = new Date(t.timestamp).toLocaleDateString("en-US", {
            month: "short",
        });
        byMonth[key] = (byMonth[key] || 0) + t.profitLoss;
    });
    return Object.entries(byMonth).map(([month, pnl]) => ({ month, pnl }));
}

export function getStrategyPerformance(): {
    strategy: string;
    wins: number;
    losses: number;
    pnl: number;
}[] {
    const trades = getTrades();
    const byStrategy: Record<
        string,
        { wins: number; losses: number; pnl: number }
    > = {};
    trades.forEach((t) => {
        if (!byStrategy[t.strategy])
            byStrategy[t.strategy] = { wins: 0, losses: 0, pnl: 0 };
        if (t.profitLoss > 0) byStrategy[t.strategy].wins++;
        else byStrategy[t.strategy].losses++;
        byStrategy[t.strategy].pnl += t.profitLoss;
    });
    return Object.entries(byStrategy).map(([strategy, data]) => ({
        strategy,
        ...data,
    }));
}

export function getConsecutiveStreaks(): {
    bestWin: number;
    worstLoss: number;
} {
    const trades = [...getTrades()].sort((a, b) => a.timestamp - b.timestamp);
    let bestWin = 0,
        worstLoss = 0;
    let currentWin = 0,
        currentLoss = 0;
    trades.forEach((t) => {
        if (t.profitLoss > 0) {
            currentWin++;
            currentLoss = 0;
            bestWin = Math.max(bestWin, currentWin);
        } else {
            currentLoss++;
            currentWin = 0;
            worstLoss = Math.max(worstLoss, currentLoss);
        }
    });
    return { bestWin, worstLoss };
}

export function getSessionPerformance(): {
    session: string;
    trades: number;
    pnl: number;
}[] {
    const trades = getTrades();
    const bySession: Record<string, { trades: number; pnl: number }> = {};
    trades.forEach((t) => {
        if (!bySession[t.session]) bySession[t.session] = { trades: 0, pnl: 0 };
        bySession[t.session].trades++;
        bySession[t.session].pnl += t.profitLoss;
    });
    return Object.entries(bySession).map(([session, data]) => ({
        session,
        ...data,
    }));
}

export function getPairPerformance(): {
    pair: string;
    wins: number;
    losses: number;
    pnl: number;
}[] {
    const trades = getTrades();
    const byPair: Record<
        string,
        { wins: number; losses: number; pnl: number }
    > = {};
    trades.forEach((t) => {
        if (!byPair[t.pair]) byPair[t.pair] = { wins: 0, losses: 0, pnl: 0 };
        if (t.profitLoss > 0) byPair[t.pair].wins++;
        else byPair[t.pair].losses++;
        byPair[t.pair].pnl += t.profitLoss;
    });
    return Object.entries(byPair).map(([pair, data]) => ({ pair, ...data }));
}

export function haptic() {
    const settings = getSettings();
    if (settings.hapticEnabled && navigator.vibrate) {
        navigator.vibrate(12);
    }
}
