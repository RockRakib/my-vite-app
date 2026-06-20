import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { TabName } from "./types";
import type { ToastData } from "./types";
import { getSettings } from "./db";
import ThreeBackground from "./components/ThreeBackground";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import ToastContainer from "./components/Toast";
import Dashboard from "./screens/Dashboard";
import AddTrade from "./screens/AddTrade";
import Journal from "./screens/Journal";
import Analytics from "./screens/Analytics";
import Settings from "./screens/Settings";

export default function App() {
    const [activeTab, setActiveTab] = useState<TabName>("dashboard");
    const [toasts, setToasts] = useState<ToastData[]>([]);
    const [editingTrade, setEditingTrade] = useState<any | null>(null);

    const settings = getSettings();

    const showToast = useCallback(
        (message: string, type: ToastData["type"] = "info") => {
            const id =
                Date.now().toString() + Math.random().toString(36).slice(2);
            setToasts((prev) => [...prev, { id, message, type }]);
        },
        [],
    );

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const handleTabChange = (tab: TabName) => {
        setActiveTab(tab);
    };

    const handleNavigate = (tab: string) => {
        setActiveTab(tab as TabName);
    };

    const handleEditTrade = (trade: any) => {
        setEditingTrade(trade);
        setActiveTab("add-trade");
    };

    return (
        <div
            className="relative flex flex-col items-center w-full h-full overflow-hidden"
            style={{
                background: settings.showTorus ? "transparent" : "#0D0F11",
            }}
        >
            {/* 3D Background */}
            <ThreeBackground enabled={settings.showTorus} />

            {/* Content Container */}
            <div
                className="relative flex flex-col w-full h-full"
                style={{
                    maxWidth: 430,
                    zIndex: 1,
                    background: settings.showTorus
                        ? "rgba(13, 15, 17, 0.20)"
                        : "#0D0F11",
                }}
            >
                {/* Header */}
                <Header />

                {/* Main Content */}
                <main
                    className="flex-1 overflow-y-auto"
                    style={{
                        paddingTop: 52,
                        paddingBottom: 64,
                        overscrollBehavior: "contain",
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.25 }}
                        >
                            {activeTab === "dashboard" && (
                                <Dashboard
                                    onNavigate={handleNavigate}
                                    onShowToast={showToast}
                                    onEditTrade={handleEditTrade}
                                />
                            )}
                            {activeTab === "add-trade" && (
                                <AddTrade
                                    onShowToast={showToast}
                                    initialTrade={editingTrade}
                                    onSaved={() => setEditingTrade(null)}
                                />
                            )}
                            {activeTab === "journal" && (
                                <Journal
                                    onShowToast={showToast}
                                    onEditTrade={handleEditTrade}
                                />
                            )}
                            {activeTab === "dashboard" && (
                                <Dashboard
                                    onNavigate={handleNavigate}
                                    onShowToast={showToast}
                                    onEditTrade={handleEditTrade}
                                />
                            )}
                            {activeTab === "analytics" && <Analytics />}
                            {activeTab === "settings" && (
                                <Settings onShowToast={showToast} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* Bottom Navigation */}
                <BottomNav
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />

                {/* Toast Notifications */}
                <ToastContainer toasts={toasts} onDismiss={dismissToast} />
            </div>
        </div>
    );
}
