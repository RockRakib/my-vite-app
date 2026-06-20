export interface Trade {
    id: string;
    timestamp: number;
    pair: string;
    direction: "buy" | "sell";
    entryPrice: number;
    exitPrice: number;
    stopLoss: number;
    takeProfit: number;
    pips: number;
    profitLoss: number;
    commission: number;
    strategy: string;
    confirmation?: string;
    timeframe: string;
    session: string;
    setupQuality: 1 | 2 | 3 | 4 | 5;
    emotions: string[];
    mistakes: string[];
    tags: string[];
    screenshots: string[];
    notes: string;
    exitType: "tp" | "sl" | "be" | "manual";
    customValues?: Record<string, string | number | boolean | string[]>;
}

export interface CustomField {
    id: string;
    name: string;
    key: string;
    type: "text" | "number" | "select" | "multiselect" | "date" | "checkbox";
    options?: string[];
    required: boolean;
    order: number;
    enabled: boolean;
}

export interface UserSettings {
    accountCurrency: string;
    riskPerTrade: number;
    showTorus: boolean;
    hapticEnabled: boolean;
    defaultDirection: "buy" | "sell";
    currencyPairs: string[];
    strategies: string[];
    timeframes: string[];
    sessions: string[];
    emotionTags: string[];
    mistakeTags: string[];
}

export type TabName =
    | "dashboard"
    | "add-trade"
    | "journal"
    | "analytics"
    | "settings";

export interface ToastData {
    id: string;
    message: string;
    type: "success" | "error" | "info";
}
