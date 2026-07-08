import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { getLockoutDurationMs } from "../lib/authPolicy";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Email and password are required.");
        setIsLoading(false);
        return;
      }

      // Find admin by email
      const { data: adminUser, error: lookupError } = await supabase
        .from("admin_users")
        .select("id, user_id, email, status")
        .eq("email", email)
        .maybeSingle();

      if (!adminUser || lookupError) {
        setError("Admin account not found.");
        setIsLoading(false);
        return;
      }

      if (adminUser.status !== "active") {
        setError("This admin account is suspended or pending activation.");
        setIsLoading(false);
        return;
      }

      // No multi-code requirement: authenticate with username/password only

      // If admin has a Supabase Auth user, attempt sign-in
      if (adminUser.user_id) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: adminUser.email,
          password,
        });

        if (authError) {
          setError(authError.message || "Authentication failed");
          setIsLoading(false);
          return;
        }
      }

      // Log successful admin login
      await supabase.from("audit_logs").insert([
        {
          actor_user_id: adminUser.user_id,
          actor_email: adminUser.email,
          action: "admin_login_success",
          meta: { admin_id: adminUser.id, ip: "unknown" },
        },
      ]);

      setSuccess(
        "✓ Authentication successful! Redirecting to admin dashboard...",
      );
      setIsLoading(false);
      setTimeout(() => navigate("/admin"), 800);
    } catch (err: any) {
      setError(err.message || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-md p-8 bg-slate-800/80 rounded-2xl border border-white/6">
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="text-emerald-400" size={28} />
          <h2 className="text-2xl font-bold">Administrator Portal</h2>
        </div>
        <p className="text-sm text-slate-400 mb-6">
          Secure access for administrators
        </p>

        {error && (
          <div className="p-3 bg-red-900/20 border border-red-700/50 text-red-200 rounded mb-4 flex gap-2 text-sm">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-900/20 border border-green-700/50 text-green-200 rounded mb-4 flex gap-2 text-sm">
            <CheckCircle size={16} className="shrink-0 mt-0.5" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-300 mb-2">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded bg-slate-700 border border-white/8 focus:border-emerald-500/50 focus:outline-none"
                placeholder="admin@your-domain.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded bg-slate-700 border border-white/8 focus:border-emerald-500/50 focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Single-step username/password admin login (removed multi-code requirement) */}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-900 font-semibold flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader className="animate-spin" size={16} />
            ) : (
              <ShieldCheck size={16} />
            )}
            {isLoading ? "Verifying..." : "Access Admin Panel"}
          </button>
        </form>

        {/* Demo credentials removed from UI. Use test admin seed data in your Supabase instance for testing. */}
      </div>
    </div>
  );
}
