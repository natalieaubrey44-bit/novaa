import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  useAuth,
  BankAccount,
  Transaction,
  CardState,
} from "../context/AuthContext";
import {
  Landmark,
  Bell,
  Search,
  LogOut,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  ShieldAlert,
  BadgePercent,
  TrendingUp,
  Compass,
  Newspaper,
  PiggyBank,
  ArrowRightLeft,
  FileText,
  LifeBuoy,
  Settings,
  Check,
  CheckCircle2,
  X,
  AlertTriangle,
  Play,
  HelpCircle,
  Send,
  PlusCircle,
  SearchCode,
  Lock,
  Unlock,
  Calendar,
  RotateCcw,
  MessageSquare,
  Info,
  ShieldCheck,
  Eye,
  EyeOff,
  Menu
} from "lucide-react";
import NovaaLogo from '../components/NovaaLogo';

// Monthly interactive points for the adjustable chart
interface ChartDataPoint {
  day: number;
  dateStr: string;
  balance: number;
  expenditure: number;
  event: string;
  eventCategory: string;
}

const JUNE_CHART_DATA: ChartDataPoint[] = [
  {
    day: 1,
    dateStr: "June 01",
    balance: 44120500.0,
    expenditure: 125000.0,
    event: "NYC HQ Office Expansion Security Deposit",
    eventCategory: "Capital Expenditure",
  },
  {
    day: 3,
    dateStr: "June 03",
    balance: 43995500.0,
    expenditure: 450000.0,
    event: "Enterprise-Wide SaaS Software Licensing (annual premium)",
    eventCategory: "SaaS Software",
  },
  {
    day: 5,
    dateStr: "June 05",
    balance: 47495500.0,
    expenditure: 0,
    event: "Consolidated Merchant Receivables Escrow Settlement",
    eventCategory: "Revenue Operations",
  },
  {
    day: 7,
    dateStr: "June 07",
    balance: 47310500.0,
    expenditure: 185000.0,
    event: "AWS Cloud Server Clustered Infrastructure Billing",
    eventCategory: "IT Operations",
  },
  {
    day: 10,
    dateStr: "June 10",
    balance: 47215500.0,
    expenditure: 95000.0,
    event: "PwC Auditing Review Retainer Fee Payment",
    eventCategory: "Professional Fees",
  },
  {
    day: 12,
    dateStr: "June 12",
    balance: 47130500.0,
    expenditure: 85000.0,
    event: "Secure Hardware Firewall Infrastructure Upgrade - Paris Route",
    eventCategory: "Security Hardware",
  },
  {
    day: 15,
    dateStr: "June 15",
    balance: 45850500.0,
    expenditure: 1280000.0,
    event: "Global Boardroom & Multi-Office Bi-Monthly Executive Payroll",
    eventCategory: "Human Capital",
  },
  {
    day: 18,
    dateStr: "June 18",
    balance: 45480500.0,
    expenditure: 370000.0,
    event: "Consolidated Global Marketing Program Ads campaign (Google/Meta)",
    eventCategory: "Marketing Campaigns",
  },
  {
    day: 21,
    dateStr: "June 21",
    balance: 45395500.0,
    expenditure: 85000.0,
    event: "Strategic Advisory Council Leadership Boardroom Dining",
    eventCategory: "Executive Operations",
  },
  {
    day: 24,
    dateStr: "June 24",
    balance: 45295500.0,
    expenditure: 100000.0,
    event: "Risk & General Liability Corporate Insurance Policy Renewal",
    eventCategory: "Risk Mitigation",
  },
  {
    day: 26,
    dateStr: "June 26",
    balance: 44446500.0,
    expenditure: 849000.0,
    event: "Hardware Upgrade Cycle Procurement (Macbooks/Secure Servers)",
    eventCategory: "Enterprise IT",
  },
  {
    day: 28,
    dateStr: "June 28",
    balance: 44304320.0,
    expenditure: 142180.0,
    event: "Office Logistics and Commercial Breakroom Replenishments",
    eventCategory: "Corporate Facilities",
  },
  {
    day: 30,
    dateStr: "June 30",
    balance: 44084320.0,
    expenditure: 220000.0,
    event: "Corporate Real Estate Core SF Headquarters office rental",
    eventCategory: "Real Estate",
  },
];

const getSavingsProgressWidthClass = (current: number, target: number) => {
  const percentage = Math.min(100, Math.round((current / target) * 100));
  if (percentage <= 0) return "w-0";
  if (percentage <= 5) return "w-[5%]";
  if (percentage <= 10) return "w-[10%]";
  if (percentage <= 15) return "w-[15%]";
  if (percentage <= 20) return "w-[20%]";
  if (percentage <= 25) return "w-[25%]";
  if (percentage <= 30) return "w-[30%]";
  if (percentage <= 35) return "w-[35%]";
  if (percentage <= 40) return "w-[40%]";
  if (percentage <= 45) return "w-[45%]";
  if (percentage <= 50) return "w-[50%]";
  if (percentage <= 55) return "w-[55%]";
  if (percentage <= 60) return "w-[60%]";
  if (percentage <= 65) return "w-[65%]";
  if (percentage <= 70) return "w-[70%]";
  if (percentage <= 75) return "w-[75%]";
  if (percentage <= 80) return "w-[80%]";
  if (percentage <= 85) return "w-[85%]";
  if (percentage <= 90) return "w-[90%]";
  if (percentage <= 95) return "w-[95%]";
  return "w-[100%]";
};

export default function Dashboard() {
  const {
    user,
    accounts,
    transactions,
    cards,
    notifications,
    creditScore,
    savingsGoal,
    logout,
    transferFunds,
    payBill,
    toggleCardFreeze,
    updateCardLimit,
    markNotificationAsRead,
    clearNotification,
    addFunds,
  } = useAuth();

  const navigate = useNavigate();

  // Sidebar section hook
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "accounts"
    | "transfers"
    | "cards"
    | "investments"
    | "history"
    | "support"
  >("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const NAV_ITEMS = useMemo(
    () => [
      { id: "dashboard", label: "Dashboard", icon: Landmark },
      { id: "accounts", label: "Accounts", icon: PiggyBank },
      { id: "transfers", label: "Transfers & Payments", icon: ArrowRightLeft },
      { id: "cards", label: "Cards & Limits", icon: CreditCard },
      { id: "investments", label: "Investments", icon: Compass },
      { id: "history", label: "Transaction History", icon: FileText },
      { id: "support", label: "Support Desk", icon: LifeBuoy },
    ],
    [],
  );

  // Interactive Card reveal states
  const [revealedCards, setRevealedCards] = useState<{
    [key: string]: boolean;
  }>({});
  const toggleRevealCard = (cardId: string) => {
    setRevealedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  // Search transactions query
  const [txSearch, setTxSearch] = useState("");
  const [txFilter, setTxFilter] = useState<
    "all" | "deposit" | "withdrawal" | "pending"
  >("all");

  // Interactive Chart Slider control
  const [chartPointerIndex, setChartPointerIndex] = useState<number>(6); // Default mid point

  // Notification dropdown visibility
  const [showNotifications, setShowNotifications] = useState(false);

  // Transfers Desk parameters
  const [transferFrom, setTransferFrom] = useState(accounts[0]?.id || "");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferMemo, setTransferMemo] = useState("");
  const [transferSuccess, setTransferSuccess] = useState("");
  const [transferErr, setTransferErr] = useState("");

  // Bill pay parameters
  const [billPayee, setBillPayee] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [billCategory, setBillCategory] = useState("Utilities");
  const [billFromAccount, setBillFromAccount] = useState(accounts[0]?.id || "");
  const [billSuccess, setBillSuccess] = useState("");
  const [billErr, setBillErr] = useState("");

  // Add Funds Sandbox tester
  const [sandboxAmount, setSandboxAmount] = useState("5000");
  const [sandboxAccount, setSandboxAccount] = useState(accounts[0]?.id || "");

  // Support AI Assistant Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "user" | "assistant"; text: string; time: string }>
  >([
    {
      sender: "assistant",
      text: `Hello ${user?.name || "Client"}. I am your NovaaSecure Chat Assistant. How may I assist you with transfers, checking statements, or security issues today?`,
      time: "Now",
    },
  ]);

  // Handle support message
  const handleSupportChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: userMsg, time: "Just now" },
    ]);
    setChatInput("");

    setIsGeneratingChat(true);
    setTimeout(() => {
      let reply =
        "Your request has been filed with Novaa Premium Support. A registered personal wealth advisor will call your verified number shortly.";
      const query = userMsg.toLowerCase();
      if (query.includes("transfer") || query.includes("pay")) {
        reply =
          "To execute an instant transfer, head to the 'Transfers & Payments' menu in the sidebar list. You can move capital securely between external checking accounts with custom memos.";
      } else if (
        query.includes("freeze") ||
        query.includes("card") ||
        query.includes("lost")
      ) {
        reply =
          "If a card is misplaced, select the 'Cards & Loans' tab. You'll see real-time micro-toggles to freeze or unfreeze physical plastic cards instantly, blocking all downstream unauthorized transactions.";
      } else if (
        query.includes("balance") ||
        query.includes("checking") ||
        query.includes("money")
      ) {
        reply = `Your checking account balance is actively evaluated at $${accounts[0]?.balance.toLocaleString()}. High-yield savings hold $${accounts[1]?.balance.toLocaleString()}.`;
      } else if (query.includes("rate") || query.includes("interest")) {
        reply =
          "High-Yield Savings currently pays a premium 4.85% APY, structured monthly. You can monitor savings targets directly inside the investments module.";
      }
      setChatMessages((prev) => [
        ...prev,
        { sender: "assistant", text: reply, time: "Just now" },
      ]);
      setIsGeneratingChat(false);
    }, 800);
  };
  const [isGeneratingChat, setIsGeneratingChat] = useState(false);

  // Active chart point selection
  const selectedChartPoint =
    JUNE_CHART_DATA[chartPointerIndex] || JUNE_CHART_DATA[0];

  // Calculated Net Worth totals
  const totalBalance = useMemo(() => {
    let checkingSavings = accounts
      .filter((a) => a.type === "checking" || a.type === "savings")
      .reduce((sum, a) => sum + a.balance, 0);
    let creditBalance = accounts
      .filter((a) => a.type === "credit")
      .reduce((sum, a) => sum + a.balance, 0);
    return checkingSavings + creditBalance; // credit balance is negative, so it subtracts correctly
  }, [accounts]);

  // Monthly stats
  const monthlyDirectIncome = 12500000.0;
  const monthlyExpensesTotal = useMemo(() => {
    return transactions
      .filter((t) => t.type === "withdrawal" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Unread news alert counter
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferSuccess("");
    setTransferErr("");

    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) {
      setTransferErr("Please provide a positive numerical amount.");
      return;
    }

    if (!transferTo.trim()) {
      setTransferErr("Please select or write a valid recipient.");
      return;
    }

    const success = transferFunds(transferFrom, transferTo, amt, transferMemo);
    if (success) {
      setTransferSuccess(
        `Fund transfer of $${amt.toLocaleString()} to ${transferTo} registered successfully!`,
      );
      setTransferAmount("");
      setTransferMemo("");
    } else {
      setTransferErr("Insufficient available balance in selected account.");
    }
  };

  const handleBillPaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBillSuccess("");
    setBillErr("");

    const amt = parseFloat(billAmount);
    if (isNaN(amt) || amt <= 0) {
      setBillErr("Please supply a positive numerical amount.");
      return;
    }

    if (!billPayee.trim()) {
      setBillErr("Please select a valid service payee.");
      return;
    }

    const success = payBill(billPayee, amt, billCategory, billFromAccount);
    if (success) {
      setBillSuccess(
        `Payment of $${amt.toLocaleString()} successfully sent to ${billPayee}.`,
      );
      setBillAmount("");
      setBillPayee("");
    } else {
      setBillErr("Insufficient available balance to lock transaction.");
    }
  };

  const triggerSandboxDeposit = () => {
    const amt = parseFloat(sandboxAmount);
    if (!isNaN(amt) && amt > 0) {
      const tgt = accounts.find((a) => a.id === sandboxAccount);
      if (tgt) {
        addFunds(sandboxAccount, amt, "NovaaSecure Sandbox Deposit");
        alert(`Success! Deposited $${amt.toLocaleString()} into ${tgt.name}.`);
      }
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const searchMatch =
        tx.description.toLowerCase().includes(txSearch.toLowerCase()) ||
        tx.category.toLowerCase().includes(txSearch.toLowerCase());
      if (!searchMatch) return false;
      if (txFilter === "all") return true;
      if (txFilter === "deposit") return tx.type === "deposit";
      if (txFilter === "withdrawal") return tx.type === "withdrawal";
      if (txFilter === "pending") return tx.status === "pending";
      return true;
    });
  }, [transactions, txSearch, txFilter]);

  // Route protection redirect
  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-primary transition-colors text-brand-primary dark:text-white flex flex-col">
      {/* Dynamic Sub-header Info Alert Strip */}
      <div className="bg-brand-primary border-b border-white/8 px-4 py-2 text-xs flex flex-wrap justify-between items-center gap-2 relative z-20">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-brand-accent"></span>
          <span className="text-white/60">
            Multi-Factor Token Status:{" "}
            <strong className="text-white/90">Secure</strong>
          </span>
        </div>
        <div className="flex items-center gap-4 text-white/40">
          <span>
            Client:{" "}
            <strong className="text-white/70 font-medium">{user.email}</strong>
          </span>
          <span className="hidden md:inline">
            Last login IP: 192.168.1.104
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-w-0 relative">
        {/* Mobile Header / Hamburger Row */}
        <div className="lg:hidden sticky top-0 bg-brand-primary border-b border-white/8 px-4 py-3 flex items-center justify-between z-40">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 -ml-2 rounded-lg text-white/70 hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              <Menu size={24} />
            </button>
            <span className="font-medium text-sm text-white/80 tracking-wide">
              {NAV_ITEMS.find((n) => n.id === activeTab)?.label || "Dashboard"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-accent/20 border border-brand-accent/30 text-white flex items-center justify-center font-medium text-sm">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Sidebar Overlay (Mobile) */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* =======================================================
            LEFT SIDEBAR (Main Navigation)
           ======================================================= */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 lg:w-64 bg-brand-primary shrink-0 flex flex-col transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:translate-x-0 lg:border-r border-white/8 ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile Sidebar Header */}
          <div className="p-4 flex items-center justify-between lg:hidden border-b border-white/8">
            <NovaaLogo className="text-xl text-white" iconSize={24} />
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 text-white/60 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sidebar Menu User Unit */}
          <div className="p-6 border-b border-white/8 hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center font-semibold text-white text-sm">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-white/35 font-medium uppercase tracking-widest">
                  Private Banking
                </p>
                <p className="text-sm font-medium text-white truncate">
                  {user.name}
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/8 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-brand-accent" />
                <span className="text-white/50">Credit score</span>
              </div>
              <span className="font-medium text-white font-mono">
                {creditScore}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 lg:p-4 space-y-1 flex-1 select-none flex flex-col overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-normal tracking-wide transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-white/8 text-white border-l-2 border-brand-accent pl-3.5"
                      : "text-white/45 hover:bg-white/5 hover:text-white/80 border-l-2 border-transparent pl-3.5"
                  }`}
                >
                  <Icon
                    size={16}
                    className={
                      isActive ? "text-brand-accent" : "text-white/30"
                    }
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Unit */}
          <div className="p-4 border-t border-white/8">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-sm bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 border border-white/8 transition-all text-xs font-normal tracking-wide"
            >
              <LogOut size={14} />
              <span>Sign out</span>
            </button>
          </div>
        </aside>

        {/* =======================================================
            MAIN CONTENT WORKSPACE
           ======================================================= */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Top Greeting and Notification Bell Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="space-y-1">
              <span className="text-[10px] font-medium text-brand-accent uppercase tracking-[3px] block">
                Operational Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-brand-primary dark:text-white transition-colors">
                Welcome back, {user.name}
              </h2>
            </div>

            <div className="flex items-center gap-3 self-stretch sm:self-auto relative">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 bg-white dark:bg-brand-secondary transition-colors rounded-lg border border-brand-dark dark:border-white/10 hover:bg-brand-muted transition-all relative"
                >
                  <Bell size={18} className="text-brand-primary/60" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-white text-[9px] font-medium">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Panel List */}
                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowNotifications(false)}
                      ></div>
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 sm:w-96 bg-brand-primary border border-white/10 rounded-xl shadow-2xl p-4 z-50 space-y-3 text-left list-none"
                      >
                        <div className="flex justify-between items-center pb-2 border-b border-white/8">
                          <h4 className="font-medium text-xs uppercase tracking-widest text-white/50">
                            Alerts ({unreadCount} new)
                          </h4>
                          <span className="text-[10px] text-white/30">
                            Live monitor
                          </span>
                        </div>

                        <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                          {notifications.length === 0 ? (
                            <p className="text-xs text-white/30 py-4 text-center">
                              No alerts.
                            </p>
                          ) : (
                            notifications.map((notif) => (
                              <div
                                key={notif.id}
                                className={`p-3 rounded-lg border text-xs relative group ${
                                  notif.read
                                    ? "bg-white/4 border-white/8"
                                    : "bg-brand-accent/10 border-brand-accent/25"
                                }`}
                              >
                                {notif.type === "warning" && (
                                  <span className="absolute top-3 right-3 text-amber-400">
                                    <AlertTriangle size={13} />
                                  </span>
                                )}
                                {notif.type === "critical" && (
                                  <span className="absolute top-3 right-3 text-red-400">
                                    <ShieldAlert size={13} />
                                  </span>
                                )}
                                {notif.type === "success" && (
                                  <span className="absolute top-3 right-3 text-brand-accent">
                                    <CheckCircle2 size={13} />
                                  </span>
                                )}

                                <p className={`font-medium pr-5 ${notif.read ? "text-white/40" : "text-white/80"}`}>
                                  {notif.title}
                                </p>
                                <p className="text-white/40 mt-1 leading-snug">
                                  {notif.message}
                                </p>
                                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-white/8">
                                  <span className="text-[10px] text-white/25 font-mono">
                                    {notif.time}
                                  </span>
                                  <div className="flex gap-2">
                                    {!notif.read && (
                                      <button
                                        onClick={() => markNotificationAsRead(notif.id)}
                                        className="text-[9px] uppercase tracking-wide text-brand-accent hover:underline"
                                      >
                                        Acknowledge
                                      </button>
                                    )}
                                    <button
                                      onClick={() => clearNotification(notif.id)}
                                      className="text-[9px] uppercase tracking-wide text-white/25 hover:text-white/60"
                                    >
                                      Dismiss
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Simulator Switch */}
              <div className="hidden sm:flex p-1 bg-brand-muted dark:bg-brand-surface transition-colors rounded-lg border border-brand-dark dark:border-white/10 text-[10px] font-medium">
                <span className="px-2 py-1 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent rounded-sm">
                  Sandbox
                </span>
              </div>
            </div>
          </div>

          {/* Render Tab Contents */}
          <AnimatePresence mode="wait">
            {/* =======================================================
                PANEL: MAIN DASHBOARD
               ======================================================= */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* 1. Account Snapshot / Total Net Worth Container */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Big Balance Box */}
                  <div className="bg-brand-secondary p-6 rounded-xl border border-white/8 flex flex-col justify-between relative overflow-hidden lg:col-span-2 text-white">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent/40 to-transparent" />
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-medium uppercase tracking-[2.5px] text-white/40">
                          Total combined assets
                        </span>
                        <span className="text-[10px] bg-brand-accent/15 text-brand-accent border border-brand-accent/20 px-2 py-0.5 rounded-sm font-medium uppercase tracking-wider">
                          Verified
                        </span>
                      </div>
                      <h3 className="text-4xl sm:text-5xl font-display font-semibold text-white mt-2">
                        ${" "}
                        {totalBalance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </h3>
                      <p className="text-xs text-white/35 mt-1">
                        Cash deposits net of outstanding credit lines
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-8 pt-5 border-t border-white/8 text-center">
                      <div>
                        <p className="text-[10px] text-white/35 uppercase tracking-widest">
                          Payroll income
                        </p>
                        <p className="font-medium text-sm text-white font-mono mt-1">
                          +${monthlyDirectIncome.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/35 uppercase tracking-widest">
                          MTD expenses
                        </p>
                        <p className="font-medium text-sm text-white/70 font-mono mt-1">
                          -$
                          {monthlyExpensesTotal.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/35 uppercase tracking-widest">
                          Savings capital
                        </p>
                        <p className="font-medium text-sm text-white font-mono mt-1">
                          ${accounts[1]?.balance.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vault Actions and Quick Check deposit */}
                  <div className="bg-white dark:bg-brand-secondary transition-colors p-6 rounded-xl border border-brand-dark dark:border-white/10 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-widest text-brand-accent mb-3">
                        Instant Check Deposit (Sandbox)
                      </h4>
                      <p className="text-xs text-brand-primary/80 leading-relaxed mb-4">
                        Simulate scanning a certified cashier check. Declare
                        account destination & currency value to clear instantly.
                      </p>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] uppercase tracking-widest text-brand-primary/70 dark:text-white/70 block mb-1">
                              Target
                            </label>
                            <select
                              value={sandboxAccount}
                              title="Select target account for deposit"
                              onChange={(e) =>
                                setSandboxAccount(e.target.value)
                              }
                              className="w-full text-xs font-mono bg-brand-muted dark:bg-brand-surface transition-colors p-2 rounded-lg border border-brand-dark dark:border-white/10 text-brand-primary dark:text-white focus:outline-none focus:border-brand-accent"
                            >
                              {accounts.map((acc) => (
                                <option key={acc.id} value={acc.id}>
                                  {acc.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] uppercase tracking-widest text-brand-primary/70 dark:text-white/70 block mb-1">
                              Value ($USD)
                            </label>
                            <input
                              type="number"
                              value={sandboxAmount}
                              title="Check deposit amount"
                              placeholder="5000"
                              onChange={(e) => setSandboxAmount(e.target.value)}
                              className="w-full text-xs bg-brand-muted dark:bg-brand-surface transition-colors p-2 border border-brand-dark dark:border-white/10 rounded-lg text-brand-primary dark:text-white focus:outline-none focus:border-brand-accent font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={triggerSandboxDeposit}
                      className="mt-4 w-full py-2.5 rounded-xl bg-brand-accent text-white font-bold hover:bg-brand-accent/90 text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-brand-accent/10"
                    >
                      <PlusCircle size={15} />
                      <span>Credit Check Deposit</span>
                    </button>
                  </div>
                </div>

                {/* Account Cards Carousel/Rows Grid */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-brand-primary/60 mb-4 font-mono">
                    Current Secure Vault Accounts
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {accounts.map((acc) => {
                      const isMinus = acc.balance < 0;
                      return (
                        <div
                          key={acc.id}
                          className="bg-white dark:bg-brand-secondary transition-colors p-5 rounded-lg border border-brand-dark dark:border-white/10 hover:border-brand-accent transition-all shadow-sm flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] text-brand-primary/60 dark:text-white/60 font-bold uppercase tracking-wider">
                                {acc.type}
                              </span>
                              <span className="text-[10px] text-brand-accent font-mono font-medium">
                                {acc.accountNo}
                              </span>
                            </div>
                            <h5 className="font-bold text-brand-primary dark:text-white transition-colors text-sm tracking-tight">
                              {acc.name}
                            </h5>
                          </div>
                          <div className="mt-6 flex justify-between items-end">
                            <span className="text-brand-primary/60 text-[10px] uppercase font-bold">
                              Ledger Balance
                            </span>
                            <span
                              className={`text-lg font-mono font-semibold ${isMinus ? "text-red-500" : "text-brand-accent"}`}
                            >
                              $
                              {Math.abs(acc.balance).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. ADJUSTABLE INTERACTIVE CHART (HIGH PRIORITY WRITTEN REQUIREMENTS) */}
                <div className="bg-white dark:bg-brand-secondary transition-colors p-6 rounded-xl border border-brand-dark dark:border-white/10 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-brand-accent/10 text-brand-accent rounded-lg border border-brand-accent/20">
                          <TrendingUp size={16} />
                        </span>
                        <h4 className="font-bold text-sm uppercase tracking-wider text-brand-accent">
                          Cash Expenditure Trend Tracker
                        </h4>
                      </div>
                      <p className="text-xs text-brand-primary/80 mt-1">
                        Adjust the calendar drag pointer to view daily ledger
                        events, net expenditure and balance updates.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono bg-brand-muted dark:bg-brand-surface transition-colors px-3 py-1.5 rounded-xl border border-brand-dark dark:border-white/10">
                      <Calendar size={14} className="text-brand-accent" />
                      <span>
                        Viewing Month: <strong>June 2026</strong>
                      </span>
                    </div>
                  </div>

                  {/* SVG Line Graph plotted in code */}
                  <div className="h-64 relative mb-6 border-b border-brand-dark/30">
                    {/* Y-axis grid lines */}
                    <div className="absolute inset-x-0 top-1/4 border-t border-brand-dark/20 text-[9px] text-brand-primary/60 pt-1">
                      Balance High: $58K
                    </div>
                    <div className="absolute inset-x-0 top-1/2 border-t border-brand-dark/20 text-[9px] text-brand-primary/60 pt-1">
                      Balance Mid: $54K
                    </div>
                    <div className="absolute inset-x-0 top-3/4 border-t border-brand-dark/20 text-[9px] text-brand-primary/60 pt-1">
                      Balance Low: $50K
                    </div>

                    {/* Plot SVG Line for Balance Curve */}
                    <svg
                      className="w-full h-full absolute inset-0 z-10"
                      viewBox="0 0 1000 220"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient
                          id="chartGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#059669"
                            stopOpacity="0.3"
                          />
                          <stop
                            offset="100%"
                            stopColor="#059669"
                            stopOpacity="0.0"
                          />
                        </linearGradient>
                      </defs>
                      {/* Dynamic path generation would replace the static string below */}
                      <path
                        d="M 50,190 L 120,192 C 160,192 200,100 240,102 C 280,105 325,108 360,111 L 420,115 C 450,115 480,20 540,22 C 580,25 640,140 680,142 C 720,145 760,152 805,155 L 870,110 L 950,112"
                        className="stroke-brand-accent fill-none stroke-3"
                      />
                      <path
                        d="M 50,190 L 120,192 C 160,192 200,100 240,102 C 280,105 325,108 360,111 L 420,115 C 450,115 480,20 540,22 C 580,25 640,140 680,142 C 720,145 760,152 805,155 L 870,110 L 950,112 L 950,220 L 50,220 Z"
                        fill="url(#chartGradient)"
                      />

                      {/* Map interactive dot indicator visually */}
                      {(() => {
                        const totalPoints = JUNE_CHART_DATA.length;
                        const xPercent =
                          50 + chartPointerIndex * (900 / (totalPoints - 1));
                        // Interpolate vertical height base
                        const balanceVal = selectedChartPoint.balance;
                        const minVal = 49000;
                        const maxVal = 58000;
                        const rawY =
                          220 -
                          (((balanceVal - minVal) / (maxVal - minVal)) * 180 +
                            20);
                        const bulletY = Math.max(15, Math.min(rawY, 205));
                        return (
                          <g>
                            {/* vertical rule line */}
                            <line
                              x1={xPercent}
                              y1="0"
                              x2={xPercent}
                              y2="220"
                              stroke="#059669"
                              strokeWidth="1.5"
                              strokeDasharray="4 4"
                              opacity="0.8"
                            />
                            {/* main point */}
                            <circle
                              cx={xPercent}
                              cy={bulletY}
                              r={8}
                              fill="#059669"
                              className="animate-pulse"
                            />
                            <circle
                              cx={xPercent}
                              cy={bulletY}
                              r={4}
                              fill="#ffffff"
                            />
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Calendar dragging timeline bar slider */}
                  <div className="space-y-4">
                    <label className="text-xs font-semibold uppercase tracking-wider text-brand-primary/60 flex justify-between items-center">
                      <span>
                        Drag timeline pointer below to track calendar activity
                      </span>
                      <span className="text-brand-accent font-bold">
                        Selected Index: Point {chartPointerIndex + 1} of{" "}
                        {JUNE_CHART_DATA.length}
                      </span>
                    </label>

                    {/* Timeline range tracker */}
                    <div className="relative pt-1 pb-4">
                      <input
                        type="range"
                        min="0"
                        max={JUNE_CHART_DATA.length - 1}
                        value={chartPointerIndex}
                        title="Timeline activity slider"
                        placeholder="Select date index"
                        onChange={(e) =>
                          setChartPointerIndex(parseInt(e.target.value))
                        }
                        className="w-full h-2 bg-brand-muted dark:bg-brand-surface transition-colors rounded-lg appearance-none cursor-pointer accent-brand-accent border border-brand-dark dark:border-white/10"
                      />
                      <div className="flex justify-between text-[10px] text-brand-primary/50 font-mono mt-2">
                        <span>June 1st</span>
                        <span>June 8th</span>
                        <span>June 15th</span>
                        <span>June 22nd</span>
                        <span>June 30th</span>
                      </div>
                    </div>

                    {/* Detailed Interactive Indicator Box plotted contextual updates */}
                    <div className="p-4 rounded-lg bg-brand-muted dark:bg-brand-surface transition-colors border border-brand-dark dark:border-white/10 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="border-b md:border-b-0 md:border-r border-brand-dark/30 pb-2 md:pb-0">
                        <span className="text-[10px] tracking-widest text-brand-primary/60 dark:text-white/60 font-bold uppercase block">
                          Timeline Date
                        </span>
                        <p className="text-lg font-bold text-brand-primary dark:text-white transition-colors mt-1 flex items-center gap-2">
                          <Calendar size={16} className="text-brand-accent" />
                          {selectedChartPoint.dateStr}, 2026
                        </p>
                      </div>

                      <div className="border-b md:border-b-0 md:border-r border-brand-dark/30 pb-2 md:pb-0">
                        <span className="text-[10px] tracking-widest text-brand-primary/60 dark:text-white/60 font-bold uppercase block">
                          Combined Vault Balance
                        </span>
                        <p className="text-lg font-bold text-brand-accent mt-1 font-mono">
                          $
                          {selectedChartPoint.balance.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>

                      <div className="border-b md:border-b-0 md:border-r border-brand-dark/30 pb-2 md:pb-0">
                        <span className="text-[10px] tracking-widest text-brand-primary/60 dark:text-white/60 font-bold uppercase block">
                          Day Net Expenses
                        </span>
                        <p
                          className={`text-lg font-extrabold mt-1 font-mono ${selectedChartPoint.expenditure > 0 ? "text-red-500" : "text-brand-accent"}`}
                        >
                          {selectedChartPoint.expenditure > 0
                            ? `-$${selectedChartPoint.expenditure.toFixed(2)}`
                            : "$0.00"}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] tracking-widest text-brand-primary/60 dark:text-white/60 font-bold uppercase block">
                          Calendar Event Activity
                        </span>
                        <p className="text-xs text-brand-primary/80 font-medium truncate mt-1.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0"></span>
                          {selectedChartPoint.event}
                        </p>
                        <span className="text-[9px] bg-brand-secondary/30 border border-brand-dark dark:border-white/10 transition-colors text-brand-primary dark:text-white px-1.5 py-0.5 rounded font-mono mt-1 inline-block uppercase font-bold">
                          {selectedChartPoint.eventCategory}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Operational Forms Quick Action Desks & Goals (Left) and Recent Transactions (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Quick Action desks (6 Columns) */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Goal Progress Tracker widget */}
                    <div className="bg-white dark:bg-brand-secondary transition-colors p-5 rounded-xl border border-brand-dark dark:border-white/10 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-brand-accent flex items-center gap-2">
                          <PiggyBank size={15} />
                          <span>Savings Destination Goal</span>
                        </h4>
                        <span className="text-[10px] font-mono font-bold text-brand-primary/60">
                          {Math.round(
                            (savingsGoal.current / savingsGoal.target) * 100,
                          )}
                          % Locked
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-primary dark:text-white transition-colors font-semibold">
                        {savingsGoal.name}
                      </p>

                      <div className="w-full bg-brand-muted dark:bg-brand-surface transition-colors h-2.5 rounded-full mt-3 overflow-hidden border border-brand-dark dark:border-white/10">
                        <div
                          className={`bg-brand-accent h-full rounded-full transition-all duration-500 ${getSavingsProgressWidthClass(savingsGoal.current, savingsGoal.target)}`}
                        />
                      </div>

                      <div className="flex justify-between items-center mt-3 text-xs">
                        <div>
                          <p className="text-[10px] text-brand-primary/50">
                            Current Savings
                          </p>
                          <p className="font-bold text-brand-accent font-mono">
                            ${savingsGoal.current.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-brand-primary/50">
                            Target Amount
                          </p>
                          <p className="font-bold text-brand-primary dark:text-white transition-colors font-mono">
                            ${savingsGoal.target.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Transfer panel */}
                    <div className="bg-white dark:bg-brand-secondary transition-colors p-5 rounded-xl border border-brand-dark dark:border-white/10 shadow-sm space-y-4">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-brand-accent flex items-center gap-2">
                        <ArrowRightLeft size={15} />
                        <span>Instant Funds Transfer desk</span>
                      </h4>

                      {transferSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                          <CheckCircle2
                            size={16}
                            className="text-emerald-600"
                          />
                          <span>{transferSuccess}</span>
                        </div>
                      )}

                      {transferErr && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                          <AlertTriangle size={16} className="text-red-600" />
                          <span>{transferErr}</span>
                        </div>
                      )}

                      <form
                        onSubmit={handleTransferSubmit}
                        className="space-y-3"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label
                              htmlFor="transferFrom"
                              className="text-[9px] text-brand-primary/60 dark:text-white/60 font-bold uppercase tracking-widest block mb-1"
                            >
                              Source Wallet
                            </label>
                            <select
                              id="transferFrom"
                              value={transferFrom}
                              onChange={(e) => setTransferFrom(e.target.value)}
                              className="w-full bg-brand-muted dark:bg-brand-surface transition-colors p-2 rounded-xl border border-brand-dark dark:border-white/10 text-xs text-brand-primary dark:text-white focus:outline-none"
                            >
                              {accounts.map((acc) => (
                                <option key={acc.id} value={acc.id}>
                                  {acc.name} (${acc.balance.toLocaleString()})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="transferTo"
                              className="text-[9px] text-brand-primary/60 dark:text-white/60 font-bold uppercase tracking-widest block mb-1"
                            >
                              Target Account / Name
                            </label>
                            <select
                              id="transferTo"
                              value={transferTo}
                              onChange={(e) => setTransferTo(e.target.value)}
                              className="w-full bg-brand-muted dark:bg-brand-surface transition-colors p-2 rounded-xl border border-brand-dark dark:border-white/10 text-xs text-brand-primary dark:text-white focus:outline-none"
                            >
                              <option value="">-- Choose Recipient --</option>
                              <option value="High-Yield Savings">
                                High-Yield Savings (A/C: *9153)
                              </option>
                              <option value="Infinite Black Visa">
                                Infinite Black Visa (A/C: *3099)
                              </option>
                              <option value="Premium mortgage Loan">
                                Premium mortgage Loan (A/C: *7741)
                              </option>
                              <option value="Marcus Fredebel (External Checking)">
                                Marcus Fredebel (Chase Checking *8100)
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] text-brand-primary/60 dark:text-white/60 font-bold uppercase tracking-widest block mb-1">
                              Capital Value ($USD)
                            </label>
                            <input
                              type="number"
                              required
                              placeholder="0.00"
                              value={transferAmount}
                              onChange={(e) =>
                                setTransferAmount(e.target.value)
                              }
                              className="w-full bg-brand-muted dark:bg-brand-surface transition-colors p-2 rounded-xl border border-brand-dark dark:border-white/10 text-xs text-brand-primary dark:text-white font-mono focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-brand-primary/60 dark:text-white/60 font-bold uppercase tracking-widest block mb-1">
                              Brief Description (Memo)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. rent, groceries"
                              value={transferMemo}
                              onChange={(e) => setTransferMemo(e.target.value)}
                              className="w-full bg-brand-muted dark:bg-brand-surface transition-colors p-2 rounded-xl border border-brand-dark dark:border-white/10 text-xs text-brand-primary dark:text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-brand-accent hover:bg-brand-accent/90 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Execute Instant Wire Check
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Recent Transactions List (7 Columns) */}
                  <div className="lg:col-span-7 bg-white dark:bg-brand-secondary transition-colors p-6 rounded-xl border border-brand-dark dark:border-white/10 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-brand-accent">
                          Secure Session Transactions Ledger
                        </h4>

                        {/* Filters panel */}
                        <div className="flex gap-1.5 flex-wrap">
                          {["all", "deposit", "withdrawal", "pending"].map(
                            (filterVal) => (
                              <button
                                key={filterVal}
                                onClick={() => setTxFilter(filterVal as any)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                                  txFilter === filterVal
                                    ? "bg-brand-accent text-white"
                                    : "bg-brand-muted dark:bg-brand-surface transition-colors text-brand-primary dark:text-white border border-brand-dark/50 hover:bg-brand-secondary/25"
                                }`}
                              >
                                {filterVal}
                              </button>
                            ),
                          )}
                        </div>
                      </div>

                      {/* Search query box */}
                      <div className="relative mb-4">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-primary/70">
                          <Search size={16} />
                        </span>
                        <input
                          type="text"
                          placeholder="Search transactions by category or keyword..."
                          value={txSearch}
                          onChange={(e) => setTxSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-muted dark:bg-brand-surface transition-colors border border-brand-dark dark:border-white/10 text-xs text-brand-primary dark:text-white focus:outline-none focus:border-brand-accent/60"
                        />
                      </div>

                      {/* Transactions scroll area */}
                      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                        {filteredTransactions.length === 0 ? (
                          <div className="p-8 text-center text-brand-primary/50 text-xs">
                            No matching ledger events recorded.
                          </div>
                        ) : (
                          filteredTransactions.map((tx) => {
                            const isDeposit = tx.type === "deposit";
                            return (
                              <div
                                key={tx.id}
                                className="p-3 bg-brand-muted dark:bg-brand-surface transition-colors rounded-xl border border-brand-dark/65 flex justify-between items-center text-xs hover:border-brand-accent/40 transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                                      isDeposit
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {isDeposit ? (
                                      <ArrowDownLeft size={16} />
                                    ) : (
                                      <ArrowUpRight size={16} />
                                    )}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-bold text-brand-primary dark:text-white transition-colors">
                                        {tx.description}
                                      </p>
                                      {tx.status === "pending" && (
                                        <span className="text-[9px] bg-amber-100 text-brand-accent border border-amber-200 px-1 py-0.5 rounded font-mono font-bold">
                                          PENDING
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-brand-primary/60 font-mono mt-0.5">
                                      <span>{tx.date}</span>
                                      <span>•</span>
                                      <span className="uppercase text-[9px] tracking-wider text-brand-primary/70 font-bold">
                                        {tx.category}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <span
                                  className={`font-mono font-bold text-sm ${isDeposit ? "text-emerald-700" : "text-red-600"}`}
                                >
                                  {isDeposit ? "+" : "-"}$
                                  {tx.amount.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                  })}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-brand-dark/40 mt-4 flex justify-between items-center">
                      <span className="text-[10px] text-brand-primary/50">
                        Showing {filteredTransactions.length} of{" "}
                        {transactions.length} entries
                      </span>
                      <button
                        onClick={() => setActiveTab("history")}
                        className="text-xs text-brand-accent hover:underline flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <span>Examine full statement history</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* =======================================================
                PANEL: DEEP ACCOUNT VAULTS
               ======================================================= */}
            {activeTab === "accounts" && (
              <motion.div
                key="accounts-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-semibold text-brand-primary dark:text-white transition-colors">
                    Secure asset accounts
                  </h3>
                  <p className="text-xs text-brand-primary/80">
                    Comprehensive bank audit registers with secure copy routing
                    keys.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {accounts.map((acc) => {
                    const isMinus = acc.balance < 0;
                    return (
                      <div
                        key={acc.id}
                        className="bg-white dark:bg-brand-secondary transition-colors p-6 rounded-xl border border-brand-dark dark:border-white/10 shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <span className="text-[10px] bg-brand-muted dark:bg-brand-surface transition-colors px-3 py-1 rounded-full border border-brand-dark dark:border-white/10 text-brand-primary dark:text-white uppercase tracking-widest font-mono font-bold">
                                {acc.type}
                              </span>
                              <h4 className="text-lg font-bold text-brand-primary dark:text-white transition-colors mt-2.5">
                                {acc.name}
                              </h4>
                            </div>
                            <span className="font-mono text-xs text-brand-accent font-bold py-1 px-2 bg-brand-accent/5 rounded-md border border-brand-accent/20">
                              {acc.accountNo}
                            </span>
                          </div>

                          <div className="space-y-3 bg-brand-muted dark:bg-brand-surface transition-colors p-4 rounded-lg border border-brand-dark dark:border-white/10">
                            <div className="flex justify-between text-xs py-1.5 border-b border-brand-dark/50">
                              <span className="text-brand-primary/65">
                                ABA Routing Transit Number
                              </span>
                              <span className="font-mono font-bold text-brand-primary dark:text-white transition-colors">
                                021000021
                              </span>
                            </div>
                            <div className="flex justify-between text-xs py-1.5 border-b border-brand-dark/50">
                              <span className="text-brand-primary/65">
                                IBAN Ident Key
                              </span>
                              <span className="font-mono font-bold text-brand-primary dark:text-white transition-colors">
                                US89 NOVAA 0210 0002 4820 5
                              </span>
                            </div>
                            <div className="flex justify-between text-xs py-1.5">
                              <span className="text-brand-primary/65">
                                Standard Clear Period
                              </span>
                              <span className="text-emerald-700 font-bold whitespace-nowrap">
                                Instant Realtime clearing
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 flex justify-between items-center pt-4 border-t border-brand-dark/30">
                          <div>
                            <p className="text-[10px] text-brand-primary/60 uppercase font-bold tracking-wider">
                              Accounting Ledger Balance
                            </p>
                            <span
                              className={`text-2xl font-semibold font-mono ${isMinus ? "text-red-500" : "text-brand-accent"}`}
                            >
                              $
                              {acc.balance.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* =======================================================
                PANEL: TRANSFERS & PAYMENTS OFFICE
               ======================================================= */}
            {activeTab === "transfers" && (
              <motion.div
                key="transfers-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-semibold text-brand-primary dark:text-white transition-colors">
                    Transfers Transfers & payments Office payments
                  </h3>
                  <p className="text-xs text-brand-primary/85">
                    Wire immediate capital securely or clear monthly utility
                    liabilities.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Wire transfer desk */}
                  <div className="bg-white dark:bg-brand-secondary transition-colors p-6 rounded-xl border border-brand-dark dark:border-white/10 shadow-sm">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-brand-accent mb-4">
                      Execute Local/Domestic Wire Transfer
                    </h4>

                    {transferSuccess && (
                      <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span>{transferSuccess}</span>
                      </div>
                    )}

                    {transferErr && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                        <AlertTriangle size={16} className="text-red-600" />
                        <span>{transferErr}</span>
                      </div>
                    )}

                    <form onSubmit={handleTransferSubmit} className="space-y-4">
                      <div>
                        <label className="text-[10px] text-brand-primary/60 dark:text-white/60 font-bold uppercase tracking-widest block mb-1">
                          Source Account Wallet
                        </label>
                        <select
                          value={transferFrom}
                          title="Select source account for transfer"
                          onChange={(e) => setTransferFrom(e.target.value)}
                          className="w-full bg-brand-muted dark:bg-brand-surface transition-colors p-3 rounded-xl border border-brand-dark dark:border-white/10 text-xs text-brand-primary dark:text-white focus:outline-none"
                        >
                          {accounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                              {acc.name} (${acc.balance.toLocaleString()})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-brand-primary/60 dark:text-white/60 font-bold uppercase tracking-widest block mb-1">
                          Target Account / Name
                        </label>
                        <select
                          value={transferTo}
                          title="Select target account or recipient"
                          onChange={(e) => setTransferTo(e.target.value)}
                          className="w-full bg-brand-muted dark:bg-brand-surface transition-colors p-3 rounded-xl border border-brand-dark dark:border-white/10 text-xs text-brand-primary dark:text-white focus:outline-none"
                        >
                          <option value="">-- Select Verified Dest --</option>
                          <option value="High-Yield Savings">
                            High-Yield Savings (A/C: *9153)
                          </option>
                          <option value="Infinite Black Visa">
                            Infinite Black Visa (A/C: *3099)
                          </option>
                          <option value="Premium mortgage Loan">
                            Premium mortgage Loan (A/C: *7741)
                          </option>
                          <option value="Marcus Fredebel (External Checking)">
                            Marcus Fredebel (Chase Checking *8100)
                          </option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-brand-primary/60 dark:text-white/60 font-bold uppercase tracking-widest block mb-1">
                            Capital Value ($USD)
                          </label>
                          <input
                            type="number"
                            required
                            placeholder="0.00"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            className="w-full bg-brand-muted dark:bg-brand-surface transition-colors p-3 rounded-xl border border-brand-dark dark:border-white/10 text-xs text-brand-primary dark:text-white font-mono focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-brand-primary/60 dark:text-white/60 font-bold uppercase tracking-widest block mb-1">
                            Private Memo Key
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. loan payout"
                            value={transferMemo}
                            onChange={(e) => setTransferMemo(e.target.value)}
                            className="w-full bg-brand-muted dark:bg-brand-surface transition-colors p-3 rounded-xl border border-brand-dark dark:border-white/10 text-xs text-brand-primary dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-brand-accent hover:bg-brand-accent/90 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Initiate Encrypted Transfer Route
                      </button>
                    </form>
                  </div>

                  {/* Bill pays desk */}
                  <div className="bg-white dark:bg-brand-secondary transition-colors p-6 rounded-xl border border-brand-dark dark:border-white/10 shadow-sm">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-brand-accent mb-4">
                      Secure Utility / Payee Remittance
                    </h4>

                    {billSuccess && (
                      <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span>{billSuccess}</span>
                      </div>
                    )}

                    {billErr && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                        <AlertTriangle size={16} className="text-red-600" />
                        <span>{billErr}</span>
                      </div>
                    )}

                    <form onSubmit={handleBillPaySubmit} className="space-y-4">
                      <div>
                        <label className="text-[10px] text-brand-primary/60 dark:text-white/60 font-bold uppercase tracking-widest block mb-1">
                          Select Service Payee
                        </label>
                        <select
                          value={billPayee}
                          title="Select service payee"
                          onChange={(e) => setBillPayee(e.target.value)}
                          className="w-full bg-brand-muted dark:bg-brand-surface transition-colors p-3 rounded-xl border border-brand-dark dark:border-white/10 text-xs text-brand-primary dark:text-white focus:outline-none"
                        >
                          <option value="">
                            -- Choose Registered Vendor --
                          </option>
                          <option value="Comcast Cable Communications">
                            Comcast Cable Communications (Broadband)
                          </option>
                          <option value="ConEd Consolidated Power">
                            ConEd Consolidated Power (Energy)
                          </option>
                          <option value="Verizon Personal Mobile">
                            Verizon Personal Mobile (Cellular)
                          </option>
                          <option value="Geico Private Insurance">
                            Geico Private Insurance (Auto coverage)
                          </option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-brand-primary/60 dark:text-white/60 font-bold uppercase tracking-widest block mb-1">
                            Fund Source
                          </label>
                          <select
                            value={billFromAccount}
                            title="Select source account for bill payment"
                            onChange={(e) => setBillFromAccount(e.target.value)}
                            className="w-full bg-brand-muted dark:bg-brand-surface transition-colors p-3 rounded-xl border border-brand-dark dark:border-white/10 text-xs text-brand-primary dark:text-white focus:outline-none"
                          >
                            {accounts.map((acc) => (
                              <option key={acc.id} value={acc.id}>
                                {acc.name} (${acc.balance.toLocaleString()})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-brand-primary/60 dark:text-white/60 font-bold uppercase tracking-widest block mb-1">
                            Bill Category
                          </label>
                          <select
                            value={billCategory}
                            title="Select bill category"
                            onChange={(e) => setBillCategory(e.target.value)}
                            className="w-full bg-brand-muted dark:bg-brand-surface transition-colors p-3 rounded-xl border border-brand-dark dark:border-white/10 text-xs text-brand-primary dark:text-white focus:outline-none"
                          >
                            <option value="Utilities">Utilities</option>
                            <option value="Rent">Rent</option>
                            <option value="Insurance">Insurance</option>
                            <option value="Entertainment">Entertainment</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-brand-primary/60 dark:text-white/60 font-bold uppercase tracking-widest block mb-1">
                          Remittance Capital ($USD)
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="0.00"
                          value={billAmount}
                          onChange={(e) => setBillAmount(e.target.value)}
                          className="w-full bg-brand-muted dark:bg-brand-surface transition-colors p-3 rounded-xl border border-brand-dark dark:border-white/10 text-xs text-brand-primary dark:text-white font-mono focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-brand-accent hover:bg-brand-accent/90 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Acknowledge and Dispatch Payment
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {/* =======================================================
                PANEL: CARDS & LIMITS OFFICE
               ======================================================= */}
            {activeTab === "cards" && (
              <motion.div
                key="cards-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-semibold text-brand-primary dark:text-white transition-colors">
                    Card management
                  </h3>
                  <p className="text-xs text-brand-primary/85">
                    Manage direct credit card parameters, lock statuses, and
                    spending limits instantly.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className="bg-white dark:bg-brand-secondary transition-colors p-6 rounded-xl border border-brand-dark dark:border-white/10 shadow-sm flex flex-col justify-between space-y-8 relative overflow-hidden"
                    >
                      {card.isFrozen && (
                        <div className="absolute inset-0 bg-brand-muted/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-3">
                          <Lock
                            size={44}
                            className="text-red-500"
                          />
                          <p className="text-sm font-semibold uppercase text-red-600 tracking-widest">
                            Card Locked & Frozen
                          </p>
                          <p className="text-xs text-brand-primary dark:text-white transition-colors px-12 text-center font-bold">
                            Unfreeze this security parameter below to reactive
                            downstream transacting capabilities.
                          </p>
                          <button
                            onClick={() => toggleCardFreeze(card.id)}
                            className="px-5 py-2 rounded-xl bg-brand-accent text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-accent/90 transition-all shadow-md z-20 cursor-pointer"
                          >
                            Unfreeze Instantly
                          </button>
                        </div>
                      )}

                      {/* Plastic mockup */}
                      <div
                        onClick={() => toggleRevealCard(card.id)}
                        className="bg-linear-to-tr from-brand-primary via-brand-accent to-brand-primary p-6 rounded-lg border border-brand-dark/50 shadow-xl flex flex-col justify-between min-h-48 relative cursor-pointer group/card select-none group-active/card:scale-95 transition-transform"
                        title="Click anywhere to reveal or hide card credentials"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

                        {/* Eye reveal indicator tab */}
                        <div className="absolute bottom-5 right-5 bg-white/10 hover:bg-white/20 backdrop-blur-md p-1.5 rounded-lg border border-white/10 text-white/90 shadow transition-colors">
                          {revealedCards[card.id] ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}
                        </div>

                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-white font-mono tracking-widest">
                              NOVAA PRIVATE
                            </span>
                            <p className="text-xs text-brand-muted/70 font-bold mt-1 uppercase">
                              Infinite Signature
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] bg-white/10 font-bold px-1.5 py-0.5 rounded text-white border border-white/10 tracking-widest uppercase">
                              Click To Reveal
                            </span>
                            <Landmark size={24} className="text-white" />
                          </div>
                        </div>

                        <div>
                          <p className="font-mono text-sm sm:text-lg tracking-wider text-white gap-2 flex items-center font-semibold">
                            {revealedCards[card.id]
                              ? card.cardNumber
                              : card.cardNumber.replace(
                                  /(\d{4}\s){3}/,
                                  "•••• •••• •••• ",
                                )}
                          </p>
                          <div className="flex justify-between items-end mt-4 text-[10px] text-white/80">
                            <div>
                              <p className="text-[8px] uppercase tracking-wider text-brand-muted/60">
                                Holder Name
                              </p>
                              <p className="font-bold text-white uppercase">
                                {card.holderName}
                              </p>
                            </div>
                            <div className="flex gap-4 mr-8">
                              <div>
                                <p className="text-[8px] uppercase tracking-wider text-brand-muted/60">
                                  Expires
                                </p>
                                <p className="font-bold text-white font-mono">
                                  {card.expiry}
                                </p>
                              </div>
                              <div>
                                <p className="text-[8px] uppercase tracking-wider text-brand-muted/60">
                                  CVV
                                </p>
                                <p className="font-bold text-white font-mono">
                                  {revealedCards[card.id] ? card.cvv : "•••"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Management Tools */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-brand-dark/70">
                          <span className="text-xs font-bold text-brand-primary dark:text-white transition-colors">
                            Freeze Security Guard
                          </span>
                          <button
                            onClick={() => toggleCardFreeze(card.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                              card.isFrozen
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-red-50 text-red-600 border border-red-200"
                            }`}
                          >
                            {card.isFrozen ? (
                              <Unlock size={14} />
                            ) : (
                              <Lock size={14} />
                            )}
                            <span>
                              {card.isFrozen ? "Unfreeze Card" : "Freeze Card"}
                            </span>
                          </button>
                        </div>

                        {/* Limit Slider */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-brand-primary dark:text-white transition-colors">
                              Card Limit Slider
                            </span>
                            <span className="text-brand-accent font-mono">
                              ${card.limit.toLocaleString()}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1000"
                            max="25000"
                            step="1000"
                            value={card.limit}
                            aria-label={`Spending limit for card ending in ${card.cardNumber.slice(-4)}`}
                            title="Adjust spending limit"
                            onChange={(e) =>
                              updateCardLimit(card.id, parseInt(e.target.value))
                            }
                            className="w-full accent-brand-accent bg-brand-dark cursor-pointer border border-brand-dark dark:border-white/10 transition-colors h-2 rounded-lg"
                          />
                          <p className="text-[10px] text-brand-primary/70">
                            Change this threshold instantly to limit
                            unauthorized online transactions.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* =======================================================
                PANEL: WEALTH GOALS
               ======================================================= */}
            {activeTab === "investments" && (
              <motion.div
                key="wealth-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-semibold text-brand-primary dark:text-white transition-colors">
                    Wealth management
                  </h3>
                  <p className="text-xs text-brand-primary/85">
                    Automated portfolios and sandbox stock ticker evaluation
                    indices.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Automated Robo Advisor desk */}
                  <div className="bg-white dark:bg-brand-secondary transition-colors p-6 rounded-xl border border-brand-dark dark:border-white/10 shadow-sm lg:col-span-2 space-y-4">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-brand-accent flex items-center gap-2">
                      <Compass size={16} />
                      <span>Novaa Robo-Advisory Intelligent Portfolio</span>
                    </h4>

                    <p className="text-xs text-brand-primary/85 leading-relaxed">
                      Your capital is algorithmically assigned over certified
                      global high-yield indexes. We automatically rebalance the
                      portfolio based on macroeconomic fluctuations.
                    </p>

                    <div className="grid grid-cols-3 gap-4 p-4 bg-brand-muted dark:bg-brand-surface transition-colors rounded-lg border border-brand-dark dark:border-white/10 text-center text-xs">
                      <div>
                        <p className="text-brand-primary/65 uppercase text-[9px] font-bold">
                          Equity Stock Exposure
                        </p>
                        <p className="font-extrabold text-brand-primary dark:text-white transition-colors mt-1">
                          75% (Global Large Cap)
                        </p>
                      </div>
                      <div>
                        <p className="text-brand-primary/65 uppercase text-[9px] font-bold">
                          Fixed Income Bonds
                        </p>
                        <p className="font-extrabold text-brand-primary dark:text-white transition-colors mt-1">
                          20% (Treasuries)
                        </p>
                      </div>
                      <div>
                        <p className="text-brand-primary/65 uppercase text-[9px] font-bold">
                          Commodities & Cash
                        </p>
                        <p className="font-extrabold text-brand-primary dark:text-white transition-colors mt-1">
                          5% (Physical Gold)
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <h5 className="text-xs font-bold text-brand-primary dark:text-white transition-colors uppercase tracking-wider mb-2">
                        Sandbox Automated Tickers Tracker
                      </h5>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {[
                          { symbol: "NVDA", price: "$126.50", change: "+3.4%" },
                          { symbol: "AAPL", price: "$194.20", change: "+1.2%" },
                          { symbol: "MSFT", price: "$418.90", change: "-0.5%" },
                          { symbol: "BTC", price: "$68,450", change: "+5.7%" },
                        ].map((stock, i) => (
                          <div
                            key={i}
                            className="p-2.5 bg-brand-muted dark:bg-brand-surface transition-colors border border-brand-dark dark:border-white/10 rounded-xl"
                          >
                            <p className="font-semibold text-brand-primary dark:text-white transition-colors text-[11px]">
                              {stock.symbol}
                            </p>
                            <p className="font-mono text-brand-accent font-bold text-[10px] mt-0.5">
                              {stock.price}
                            </p>
                            <span
                              className={`text-[9px] font-bold ${stock.change.startsWith("+") ? "text-emerald-700" : "text-red-500"}`}
                            >
                              {stock.change}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Savings Calculator Goals builder */}
                  <div className="bg-white dark:bg-brand-secondary transition-colors p-6 rounded-xl border border-brand-dark dark:border-white/10 shadow-sm">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-brand-accent mb-3">
                      Goal target creator
                    </h4>

                    <div className="space-y-4 text-xs">
                      <div>
                        <span className="text-[10px] text-brand-primary/65 font-bold uppercase">
                          Savings Portfolio Goal Name
                        </span>
                        <p className="text-sm font-bold text-brand-primary dark:text-white transition-colors mt-1">
                          {savingsGoal.name}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-primary/65 font-bold uppercase">
                          Target Pool ($USD)
                        </span>
                        <p className="text-lg font-mono font-semibold text-brand-accent">
                          ${savingsGoal.target.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] text-brand-primary dark:text-white transition-colors font-medium">
                          <span>Accumulated Cash Assets</span>
                          <span>
                            {Math.round(
                              (savingsGoal.current / savingsGoal.target) * 100,
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-brand-dark h-3 rounded-full overflow-hidden border border-brand-dark dark:border-white/10 transition-colors">
                          <div
                            className={`bg-brand-accent h-full rounded-full transition-all duration-500 ${getSavingsProgressWidthClass(savingsGoal.current, savingsGoal.target)}`}
                          ></div>
                        </div>
                        <p className="font-mono text-brand-accent font-semibold text-center mt-2">
                          ${savingsGoal.current.toLocaleString()} / $
                          {savingsGoal.target.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* =======================================================
                PANEL: STATEMENTS LEDGER
               ======================================================= */}
            {activeTab === "history" && (
              <motion.div
                key="history-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-semibold text-brand-primary dark:text-white transition-colors">
                    Statements ledger
                  </h3>
                  <p className="text-xs text-brand-primary/75">
                    Generate and download formal statements from past billing
                    cycles instantly.
                  </p>
                </div>

                <div className="bg-white dark:bg-brand-secondary transition-colors p-6 rounded-xl border border-brand-dark dark:border-white/10 shadow-sm">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-brand-accent mb-4">
                    Request Monthly Official PDF Statements
                  </h4>

                  <div className="space-y-3">
                    {[
                      {
                        period: "June 01 - June 30, 2026",
                        title: "June Monthly Vault Statement (Current)",
                        code: "DEC-2026-J06",
                      },
                      {
                        period: "May 01 - May 31, 2026",
                        title: "May Monthly Vault Statement",
                        code: "DEC-2026-M05",
                      },
                      {
                        period: "Apr 01 - Apr 30, 2026",
                        title: "April Monthly Vault Statement",
                        code: "DEC-2026-A04",
                      },
                    ].map((st, i) => (
                      <div
                        key={i}
                        className="p-4 bg-brand-muted dark:bg-brand-surface transition-colors rounded-lg border border-brand-dark dark:border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-brand-accent/50 transition-all text-xs"
                      >
                        <div className="space-y-1 text-left">
                          <p className="font-bold text-brand-primary dark:text-white transition-colors text-sm">
                            {st.title}
                          </p>
                          <p className="text-brand-primary/60 font-mono text-[10px] font-bold">
                            {st.period} • Ident: {st.code}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            alert(
                              `Requested download of file statement identifying: ${st.code}. Preparing encrypted package...`,
                            )
                          }
                          className="px-4 py-2 rounded-xl bg-white dark:bg-brand-secondary transition-colors hover:bg-brand-accent/25 text-brand-primary dark:text-white text-xs font-bold uppercase tracking-wider transition-all border border-brand-accent/40 cursor-pointer"
                        >
                          Generate PDF Ledger
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* =======================================================
                PANEL: SECURE HELP DESK
               ======================================================= */}
            {activeTab === "support" && (
              <motion.div
                key="support-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-semibold text-brand-primary dark:text-white transition-colors">
                    Secure help desk
                  </h3>
                  <p className="text-xs text-brand-primary/75">
                    Realtime chat support assistant & immediate fraud prevention
                    hotlines.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Chat interface card */}
                  <div className="lg:col-span-8 bg-white dark:bg-brand-secondary transition-colors p-6 rounded-xl border border-brand-dark dark:border-white/10 shadow-sm flex flex-col h-[28rem] justify-between">
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-brand-accent mb-4 flex items-center gap-2">
                        <MessageSquare size={16} />
                        <span>NovaaSecure Automated Advisor Chat</span>
                      </h4>

                      <div className="space-y-3 h-64 overflow-y-auto pr-1 mb-4 select-text">
                        {chatMessages.map((msg, i) => {
                          const isAsst = msg.sender === "assistant";
                          return (
                            <div
                              key={i}
                              className={`flex ${isAsst ? "justify-start" : "justify-end"}`}
                            >
                              <div
                                className={`p-3 rounded-lg max-w-sm text-xs relative ${
                                  isAsst
                                    ? "bg-brand-muted dark:bg-brand-surface transition-colors text-brand-primary dark:text-white border border-brand-dark dark:border-white/10"
                                    : "bg-brand-accent text-white font-medium"
                                }`}
                              >
                                <p>{msg.text}</p>
                                <span
                                  className={`text-[8px] font-mono mt-1 block text-right ${isAsst ? "text-brand-primary/50" : "text-white/80"}`}
                                >
                                  {msg.time}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                        {isGeneratingChat && (
                          <div className="flex justify-start">
                            <div className="p-3 bg-brand-muted dark:bg-brand-surface transition-colors text-brand-primary dark:text-white rounded-lg border border-brand-dark dark:border-white/10 text-xs flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-bounce"></span>
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-bounce [animation-delay:200ms]"></span>
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-bounce [animation-delay:400ms]"></span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <form onSubmit={handleSupportChat} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Write support inquiry (e.g. transfers, card blocks)..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="grow bg-brand-muted dark:bg-brand-surface transition-colors p-3 rounded-xl border border-brand-dark dark:border-white/10 text-xs text-brand-primary dark:text-white placeholder:text-brand-primary/50 focus:outline-none"
                      />
                      <button
                        type="submit"
                        title="Send message"
                        className="px-5 rounded-xl bg-brand-accent text-white font-bold hover:bg-brand-accent/90 transition-all flex items-center justify-center cursor-pointer"
                      >
                        <Send size={15} />
                      </button>
                    </form>
                  </div>

                  {/* Immediate Emergency Action desk */}
                  <div className="lg:col-span-4 bg-white dark:bg-brand-secondary transition-colors p-6 rounded-xl border border-brand-dark dark:border-white/10 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-rose-600 mb-3 flex items-center gap-1">
                        <ShieldAlert size={16} className="text-red-500" />
                        <span className="text-red-600">
                          EMERGENCY LINE RECALLS
                        </span>
                      </h4>
                      <p className="text-xs text-brand-primary/80 leading-relaxed mb-4">
                        Misplaced your card or detected suspicious activities?
                        Trigger absolute lock protocols instantly.
                      </p>

                      <div className="space-y-3 text-xs">
                        <button
                          onClick={() =>
                            alert(
                              "Emergency Protocol Block: Activated. All pending and downstream check clearings are strictly halted pending security phone screening.",
                            )
                          }
                          className="w-full py-2.5 rounded-xl bg-red-50 text-red-700 border border-red-200 font-bold hover:bg-red-100 transition-all uppercase tracking-wider text-[10px] cursor-pointer"
                        >
                          HALT ALL ACH TRANSFER WIRES
                        </button>
                        <button
                          onClick={() => {
                            toggleCardFreeze("card-1");
                            toggleCardFreeze("card-2");
                            alert("All cards locked immediately.");
                          }}
                          className="w-full py-2.5 rounded-xl bg-yellow-50 text-yellow-800 border border-yellow-200 font-bold hover:bg-yellow-105 transition-all uppercase tracking-wider text-[10px] cursor-pointer"
                        >
                          FREEZE PHYSICAL DECK CARDS
                        </button>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-brand-dark dark:border-white/10 transition-colors text-xs text-center">
                      <p className="text-brand-primary dark:text-white transition-colors font-semibold">
                        Registered toll-free helpline
                      </p>
                      <p className="font-bold text-brand-accent text-base mt-1">
                        +1-800-NOVAA-SAFE
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}