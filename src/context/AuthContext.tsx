import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface BankAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'loan';
  accountNo: string;
  balance: number;
  availableLimit?: number; // for credit card
  color: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  status: 'completed' | 'pending';
}

export interface CardState {
  id: string;
  cardNumber: string;
  holderName: string;
  expiry: string;
  cvv: string;
  isFrozen: boolean;
  limit: number;
  spent: number;
}

export interface BankNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  time: string;
  read: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'support' | 'user';
  status: 'active' | 'pending' | 'suspended';
  lastLogin: string;
}

export interface AdminAccount {
  id: string;
  owner: string;
  type: 'checking' | 'savings' | 'credit' | 'loan';
  balance: number;
  status: 'active' | 'review' | 'suspended';
}

export interface AdminTransaction {
  id: string;
  date: string;
  user: string;
  account: string;
  amount: number;
  risk: 'low' | 'medium' | 'high';
  status: 'completed' | 'pending' | 'flagged';
}

export interface AuditLog {
  id: string;
  title: string;
  message: string;
  time: string;
}

interface AuthUser {
  id?: string;
  name: string;
  email?: string;
  role: 'admin' | 'support' | 'user';
}

interface AuthContextType {
  user: AuthUser | null;
  accounts: BankAccount[];
  transactions: Transaction[];
  cards: CardState[];
  notifications: BankNotification[];
  creditScore: number;
  savingsGoal: { target: number; current: number; name: string };
  adminUsers: AdminUser[];
  adminAccounts: AdminAccount[];
  adminTransactions: AdminTransaction[];
  auditLogs: AuditLog[];
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, name: string, role?: 'admin' | 'support' | 'user', password?: string) => Promise<void> | void;
  register: (userData: {
    firstName: string;
    lastName: string;
    middleName?: string;
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  transferFunds: (fromAccountId: string, toAccountName: string, amount: number, memo: string) => boolean;
  payBill: (payeeName: string, amount: number, category: string, fromAccountId: string) => boolean;
  toggleCardFreeze: (cardId: string) => void;
  updateCardLimit: (cardId: string, limit: number) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotification: (id: string) => void;
  addFunds: (accountId: string, amount: number, reason: string) => void;
  toggleAdminUserStatus: (id: string) => void;
  updateAdminUserRole: (id: string, role: AdminUser['role']) => void;
  updateAdminAccountStatus: (id: string, status: AdminAccount['status']) => void;
  flagAdminTransaction: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_ACCOUNTS: BankAccount[] = [
  { id: 'checking-1', name: 'Corporate Operating Fund', type: 'checking', accountNo: '•••• 4820', balance: 15132500.00, color: 'bg-brand-primary' },
  { id: 'savings-1', name: 'Treasury Reserves', type: 'savings', accountNo: '•••• 9153', balance: 28950000.00, color: 'bg-brand-secondary' },
  { id: 'credit-1', name: 'Infinite Commercial Visa', type: 'credit', accountNo: '•••• 3099', balance: -142500.75, availableLimit: 1000000, color: 'bg-brand-dark' },
  { id: 'loan-1', name: 'Syndicated Term Facility', type: 'loan', accountNo: '•••• 7741', balance: -12241200.00, color: 'bg-slate-800' }
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1', date: '2026-06-04', description: 'Enterprise AWS Cloud Cluster Systems', category: 'Infrastructure', amount: 185420.00, type: 'withdrawal', status: 'completed' },
  { id: 'tx-2', date: '2026-06-04', description: 'Apex Global Strategic Venture Fund Round-B Deposit', category: 'Liquidity Receipt', amount: 12500000.00, type: 'deposit', status: 'completed' },
  { id: 'tx-3', date: '2026-06-03', description: 'Salesforce & Slack Enterprise Suite Lizensing', category: 'Software Services', amount: 45000.00, type: 'withdrawal', status: 'completed' },
  { id: 'tx-4', date: '2026-06-02', description: 'Commercial Hub Lease Manhattan HQ Terminal', category: 'Real Estate', amount: 210000.00, type: 'withdrawal', status: 'completed' },
  { id: 'tx-5', date: '2026-06-01', description: 'Stripe Merchant Consolidated Escrow Settlement', category: 'Receivables Operations', amount: 1420500.00, type: 'deposit', status: 'completed' },
  { id: 'tx-6', date: '2026-05-28', description: 'PwC Corporate Audit & Tax Advisory Q2 Payment', category: 'Professional Services', amount: 85000.00, type: 'withdrawal', status: 'completed' },
  { id: 'tx-7', date: '2026-05-27', description: 'Enterprise Cisco Security Firewalls Suite Upgrade', category: 'Security Hardware', amount: 115000.00, type: 'withdrawal', status: 'completed' },
  { id: 'tx-8', date: '2026-05-25', description: 'Vanguard Treasury Yield Bond Maturity Settlement', category: 'Investments', amount: 2350000.00, type: 'deposit', status: 'completed' },
  { id: 'tx-9', date: '2026-06-05', description: 'Apple Inc - hardware Refresh Program Macbook Pros', category: 'Enterprise IT', amount: 849000.00, type: 'withdrawal', status: 'pending' }
];

const INITIAL_CARDS: CardState[] = [
  { id: 'card-1', cardNumber: '4532 9982 7741 3099', holderName: 'ALEX CARTER', expiry: '12/29', cvv: '382', isFrozen: false, limit: 1000000, spent: 142500.75 },
  { id: 'card-2', cardNumber: '4912 3088 4410 9851', holderName: 'ALEX CARTER', expiry: '06/28', cvv: '114', isFrozen: true, limit: 500000, spent: 0 }
];

const INITIAL_NOTIFICATIONS: BankNotification[] = [
  { id: 'notif-1', title: 'Operational Treasury Shift', message: 'Corporate Treasury Reserves account balance has climbed beyond current quarterly target, liquidity allocation recommended.', type: 'info', time: '2 hours ago', read: false },
  { id: 'notif-2', title: 'Secure Access Validation', message: 'A standard webhook verified successful connection with NovaaSecure API nodes for secure invoice generation.', type: 'success', time: '1 day ago', read: false },
  { id: 'notif-3', title: 'Q2 Audit Compiled Statement', message: 'Federal corporate tax records and detailed Novaa fiscal account statements are ready for advisory review.', type: 'info', time: '2 days ago', read: true }
];

const INITIAL_ADMIN_USERS: AdminUser[] = [
  { id: 'admin-1', name: 'Tara Morgan', email: 'natalieaubrey44@gmail.com', role: 'admin', status: 'active', lastLogin: 'Today, 09:14 AM' },
  { id: 'admin-2', name: 'Jamal Ortiz', email: 'jamal.ortiz@novaa.com', role: 'support', status: 'active', lastLogin: 'Yesterday, 04:32 PM' },
  { id: 'admin-3', name: 'Nina Patel', email: 'nina.patel@novaa.com', role: 'user', status: 'pending', lastLogin: '3 days ago' },
];

const INITIAL_ADMIN_ACCOUNTS: AdminAccount[] = [
  { id: 'acct-1001', owner: 'Corporate Operating Fund', type: 'checking', balance: 15132500.0, status: 'active' },
  { id: 'acct-1002', owner: 'Treasury Reserves', type: 'savings', balance: 28950000.0, status: 'active' },
  { id: 'acct-1003', owner: 'Infinite Commercial Visa', type: 'credit', balance: -142500.75, status: 'review' },
  { id: 'acct-1004', owner: 'Syndicated Term Facility', type: 'loan', balance: -12241200.0, status: 'active' },
];

const INITIAL_ADMIN_TRANSACTIONS: AdminTransaction[] = [
  { id: 'admin-tx-1', date: '2026-06-17', user: 'Alex Carter', account: 'Corporate Operating Fund', amount: 185420.0, risk: 'medium', status: 'completed' },
  { id: 'admin-tx-2', date: '2026-06-16', user: 'Nina Patel', account: 'Treasury Reserves', amount: 4120000.0, risk: 'high', status: 'pending' },
  { id: 'admin-tx-3', date: '2026-06-15', user: 'Marcus Fredebel', account: 'Infinite Commercial Visa', amount: 142500.75, risk: 'low', status: 'flagged' },
  { id: 'admin-tx-4', date: '2026-06-14', user: 'Tara Morgan', account: 'Syndicated Term Facility', amount: 210000.0, risk: 'medium', status: 'completed' },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'audit-1', title: 'New user onboarding review', message: 'Support team reviewed pending ID verification for a new corporate profile.', time: '1 hour ago' },
  { id: 'audit-2', title: 'Transaction anomaly flagged', message: 'Auto-monitor detected a large cross-border payment requiring manual approval.', time: '4 hours ago' },
  { id: 'audit-3', title: 'Account status update', message: 'A treasury account was moved from review to active after compliance checks.', time: 'Yesterday' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Initially keep local fallback; prefer server-side cookie-based detection
    const saved = localStorage.getItem('novaa_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem('novaa_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const holdsOldBalance = parsed.some((acc: any) => acc.type === 'checking' && acc.balance < 1000000);
        if (holdsOldBalance) {
          localStorage.removeItem('novaa_accounts');
          localStorage.removeItem('novaa_transactions');
          localStorage.removeItem('novaa_cards');
          localStorage.removeItem('novaa_notifs');
          return INITIAL_ACCOUNTS;
        }
        return parsed;
      } catch (e) {
        return INITIAL_ACCOUNTS;
      }
    }
    return INITIAL_ACCOUNTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('novaa_transactions');
    const accountsSaved = localStorage.getItem('novaa_accounts');
    if (!accountsSaved) {
      return INITIAL_TRANSACTIONS;
    }
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [cards, setCards] = useState<CardState[]>(() => {
    const saved = localStorage.getItem('novaa_cards');
    const accountsSaved = localStorage.getItem('novaa_accounts');
    if (!accountsSaved) {
      return INITIAL_CARDS;
    }
    return saved ? JSON.parse(saved) : INITIAL_CARDS;
  });

  const [notifications, setNotifications] = useState<BankNotification[]>(() => {
    const saved = localStorage.getItem('novaa_notifs');
    const accountsSaved = localStorage.getItem('novaa_accounts');
    if (!accountsSaved) {
      return INITIAL_NOTIFICATIONS;
    }
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>(INITIAL_ADMIN_ACCOUNTS);
  const [adminTransactions, setAdminTransactions] = useState<AdminTransaction[]>(INITIAL_ADMIN_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  const [savingsGoal, setSavingsGoal] = useState(() => {
    return { name: 'Acquisition & Capital Expansion Portfolio', target: 50000000, current: 28950000.00 };
  });

  useEffect(() => {
    // persist a lightweight client-side cache, but primary authority is server cookies
    if (user) localStorage.setItem('novaa_user', JSON.stringify(user));
    else localStorage.removeItem('novaa_user');
  }, [user]);

  // On mount, attempt to bootstrap auth state from server via cookie
  const resolveRoleAndProfile = async (userId: string | undefined, email?: string | null) => {
    if (!userId && !email) return;
    try {
      if (userId) {
        const { data: platformUser } = await supabase.from('platform_users').select('role,email,name').eq('user_id', userId).maybeSingle();
        if (platformUser) {
          setUser(prev => prev ? { ...prev, role: platformUser.role as AuthUser['role'], id: userId } : { id: userId, name: platformUser.name || email || '', email: platformUser.email || email || undefined, role: platformUser.role as AuthUser['role'] });
          return;
        }
      }

      if (email) {
        const { data: adminUser } = await supabase.from('admin_users').select('role,user_id').eq('email', email).maybeSingle();
        if (adminUser) {
          setUser(prev => prev ? { ...prev, role: adminUser.role || 'admin', id: adminUser.user_id || prev?.id } : { id: adminUser.user_id || undefined, name: email || '', email: email || undefined, role: adminUser.role || 'admin' });
          return;
        }
      }

      setUser(prev => prev ? { ...prev, role: 'user' } : { name: email || '', email: email || undefined, role: 'user' });
    } catch (e) {
      // ignore - keep user as-is
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: any) => {
      const session = (data as any)?.session;
      if (session?.user) {
        const u = session.user;
        setUser({ id: u.id, name: (u.user_metadata as any)?.full_name || u.email || '', email: u.email || undefined, role: 'user' });
        resolveRoleAndProfile(u.id, u.email);
      }
    }).catch(() => {});

    const { data: authListener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        const u = session.user;
        setUser({ id: u.id, name: (u.user_metadata as any)?.full_name || u.email || '', email: u.email || undefined, role: 'user' });
        resolveRoleAndProfile(u.id, u.email);
      } else {
        setUser(null);
      }
    });

    return () => {
      try { authListener.subscription.unsubscribe(); } catch (e) {}
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('novaa_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('novaa_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('novaa_cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('novaa_notifs', JSON.stringify(notifications));
  }, [notifications]);

  const login = async (email: string, name: string, role: 'admin' | 'support' | 'user' = 'user', password?: string) => {
    // If password provided, attempt Supabase auth; otherwise fall back to local demo login
    if (password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const userMeta = data.user;
        setUser({ name: (userMeta?.user_metadata as any)?.full_name || name || email, email: userMeta?.email || email, role: 'user' });
        setNotifications(prev => [
          {
            id: `notif-${Date.now()}`,
            title: 'Secure Session Initiated',
            message: `Welcome back, ${(userMeta?.user_metadata as any)?.full_name || name || email}. Access verified securely at ${new Date().toLocaleTimeString()}.`,
            type: 'success',
            time: 'Just now',
            read: false
          },
          ...prev
        ]);
        return;
      } catch (e: any) {
        throw new Error(e.message || 'Authentication failed');
      }
    }

    // Local fallback (keeps existing demo behavior)
    setUser({ name: name || 'User 1', email, role });
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Secure Session Initiated',
        message: `Welcome back, ${name || 'User 1'}. Access verified securely at ${new Date().toLocaleTimeString()}.`,
        type: 'success',
        time: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    middleName?: string;
    username: string;
    email: string;
    password: string;
  }) => {
    const fullName = `${userData.firstName} ${userData.lastName}`.trim();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      }, {
        data: {
          full_name: fullName,
          username: userData.username,
        },
      });
      if (error) throw error;

      // If signUp returned a user id, create a platform_users row linking auth user -> platform user
      const newUserId = (data as any)?.user?.id;
      if (newUserId) {
        try {
          const { error: insertErr } = await supabase.from('platform_users').insert([{ user_id: newUserId, email: userData.email, name: fullName, role: 'user' }]);
          if (insertErr) {
            // Non-fatal: log and continue
            console.warn('platform_users insert error:', insertErr.message || insertErr);
          }
        } catch (ie: any) {
          console.warn('platform_users insert exception:', ie.message || ie);
        }
      }

      setUser({ name: fullName || userData.email, email: userData.email, role: 'user' });
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: 'Account Created',
          message: `Welcome to Novaa, ${fullName}. Your new account has been initialized securely.`,
          type: 'success',
          time: 'Just now',
          read: false,
        },
        ...prev,
      ]);
    } catch (e: any) {
      throw new Error(e.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setUser(null);
  };

  const transferFunds = (fromAccountId: string, toAccountName: string, amount: number, memo: string) => {
    if (amount <= 0) return false;

    // Check balance in source
    const srcAccount = accounts.find(a => a.id === fromAccountId);
    if (!srcAccount) return false;
    
    // Check if enough funds (credit card balance increases negatively or standard accounts can cover)
    if (srcAccount.type !== 'credit' && srcAccount.balance < amount) {
      return false;
    }

    setAccounts(prev => prev.map(acc => {
      if (acc.id === fromAccountId) {
        return { ...acc, balance: acc.balance - amount };
      }
      // If the destination is one of our own accounts, add it there
      const matchingDest = prev.find(p => p.name.toLowerCase() === toAccountName.toLowerCase() || p.id === toAccountName);
      if (matchingDest && acc.id === matchingDest.id) {
        return { ...acc, balance: acc.balance + amount };
      }
      return acc;
    }));

    // Create custom transactions
    const newTx: Transaction = {
      id: `tx-f-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: `Transfer to ${toAccountName}: ${memo || 'No memo'}`,
      category: 'Transfers',
      amount,
      type: 'withdrawal',
      status: 'completed'
    };

    setTransactions(prev => [newTx, ...prev]);

    // Check if transferring to savings, update current goal progress
    if (toAccountName.toLowerCase().includes('savings') || toAccountName === 'savings-1') {
      setSavingsGoal(g => ({ ...g, current: g.current + amount }));
    }

    // Add alert
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Transfer Completed',
        message: `$${amount.toLocaleString()} transferred to ${toAccountName} successfully.`,
        type: 'success',
        time: 'Just now',
        read: false
      },
      ...prev
    ]);

    return true;
  };

  const payBill = (payeeName: string, amount: number, category: string, fromAccountId: string) => {
    if (amount <= 0) return false;

    const srcAccount = accounts.find(a => a.id === fromAccountId);
    if (!srcAccount) return false;

    if (srcAccount.type !== 'credit' && srcAccount.balance < amount) {
      return false;
    }

    setAccounts(prev => prev.map(acc => {
      if (acc.id === fromAccountId) {
        return { ...acc, balance: acc.balance - amount };
      }
      return acc;
    }));

    const newTx: Transaction = {
      id: `tx-b-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: `Bill Paid: ${payeeName}`,
      category: category || 'Utilities',
      amount,
      type: 'withdrawal',
      status: 'completed'
    };

    setTransactions(prev => [newTx, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Bill Pay Registered',
        message: `$${amount.toLocaleString()} has been sent to ${payeeName}.`,
        type: 'info',
        time: 'Just now',
        read: false
      },
      ...prev
    ]);

    return true;
  };

  const toggleCardFreeze = (cardId: string) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        const frozenState = !c.isFrozen;
        // Trigger notification
        setNotifications(notif => [
          {
            id: `notif-${Date.now()}`,
            title: frozenState ? 'Card Deactivated' : 'Card Activated',
            message: `Card ending in ${c.cardNumber.slice(-4)} was successfully ${frozenState ? 'frozen for security purposes' : 'unfrozen and is fully active'}.`,
            type: frozenState ? 'warning' : 'success',
            time: 'Just now',
            read: false
          },
          ...notif
        ]);
        return { ...c, isFrozen: frozenState };
      }
      return c;
    }));
  };

  const updateCardLimit = (cardId: string, limit: number) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        return { ...c, limit };
      }
      return c;
    }));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addFunds = (accountId: string, amount: number, reason: string) => {
    if (amount <= 0) return;
    setAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        return { ...acc, balance: acc.balance + amount };
      }
      return acc;
    }));
    const newTx: Transaction = {
      id: `tx-dep-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: reason || 'Electronic Deposit',
      category: 'Income',
      amount,
      type: 'deposit',
      status: 'completed'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const toggleAdminUserStatus = (id: string) => {
    setAdminUsers(prev => prev.map((user) => {
      if (user.id !== id) return user;
      const nextStatus = user.status === 'active' ? 'suspended' : 'active';
      return { ...user, status: nextStatus };
    }));
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        title: 'Admin user status changed',
        message: `Admin user status was updated for ${id}.`,
        time: 'Just now'
      },
      ...prev,
    ]);
  };

  const updateAdminUserRole = (id: string, role: AdminUser['role']) => {
    setAdminUsers(prev => prev.map((user) => (user.id === id ? { ...user, role } : user)));
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        title: 'Admin role updated',
        message: `Role changed to ${role} for user ${id}.`,
        time: 'Just now'
      },
      ...prev,
    ]);
  };

  const updateAdminAccountStatus = (id: string, status: AdminAccount['status']) => {
    setAdminAccounts(prev => prev.map((account) => (account.id === id ? { ...account, status } : account)));
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        title: 'Account status updated',
        message: `Account ${id} status was changed to ${status}.`,
        time: 'Just now'
      },
      ...prev,
    ]);
  };

  const flagAdminTransaction = (id: string) => {
    setAdminTransactions(prev => prev.map((transaction) => {
      if (transaction.id !== id) return transaction;
      return { ...transaction, status: 'flagged', risk: 'high' };
    }));
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        title: 'Transaction flagged',
        message: `Transaction ${id} was flagged for manual review.`,
        time: 'Just now'
      },
      ...prev,
    ]);
  };

  return (
    <AuthContext.Provider value={{
      user,
      accounts,
      transactions,
      cards,
      notifications,
      creditScore: 785,
      savingsGoal,
      adminUsers,
      adminAccounts,
      adminTransactions,
      auditLogs,
      isLoggedIn: !!user,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      transferFunds,
      payBill,
      toggleCardFreeze,
      updateCardLimit,
      markNotificationAsRead,
      clearNotification,
      addFunds,
      toggleAdminUserStatus,
      updateAdminUserRole,
      updateAdminAccountStatus,
      flagAdminTransaction,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
