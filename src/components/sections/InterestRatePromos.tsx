import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  PiggyBank,
  Percent,
  Sparkles,
  CheckCircle2,
  Calculator,
  Gift,
  Lock,
  LockOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function InterestRatePromos() {
  // Mystery box state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockedRate, setUnlockedRate] = useState("5.65%");
  const [promoCode, setPromoCode] = useState("NOVAA-VAULT-2026");

  // Slider state
  const [depositAmount, setDepositAmount] = useState(25000);

  // Math variables
  const standardBankApy = 0.45; // 0.45% average standard bank APY
  const novaaBankApy = 5.25; // 5.25% standard premium Novaa vault APY

  const calculateEarnings = (apy: number) => {
    return Math.round(depositAmount * (apy / 100));
  };

  const standardEarnings = calculateEarnings(standardBankApy);
  const novaaEarnings = calculateEarnings(novaaBankApy);
  const earningsDifference = novaaEarnings - standardEarnings;

  return (
    <section className="py-24 bg-brand-light dark:bg-brand-primary transition-colors border-y border-brand-secondary/40 relative overflow-hidden select-none">
      {/* Background Decorative Accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-3xl z-0 -translate-y-1/2"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-success/5 rounded-full blur-3xl z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-4">
            Exclusive Offers & Rates
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-primary dark:text-white transition-colors tracking-tight leading-tight">
            Lock in Industry-Leading <br />
            <span className="text-brand-accent">Interest Promos</span>
          </h2>
          <p className="text-brand-primary/70 text-sm sm:text-base mt-4 font-semibold">
            Evaluate your returns, claim personalized rates, and accelerate your
            money's productivity.
          </p>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* LEFT: Dynamic Earnings Calculator */}
          <div className="bg-white dark:bg-brand-secondary transition-colors p-8 sm:p-10 rounded-[2.5rem] border border-brand-secondary shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-accent/15 flex items-center justify-center text-brand-accent">
                  <Calculator size={22} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-brand-primary dark:text-white transition-colors">
                    Growth Calculator
                  </h3>
                  <p className="text-xs text-brand-primary/60 font-semibold uppercase">
                    Watch your capital grow instantly
                  </p>
                </div>
              </div>

              {/* Slider Controller */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold uppercase text-brand-primary/80">
                    Estimated Deposit
                  </label>
                  <span className="text-2xl sm:text-3xl font-extrabold text-brand-accent font-mono">
                    ${depositAmount.toLocaleString()}
                  </span>
                </div>

                <input
                  type="range"
                  min="5000"
                  max="250000"
                  step="5000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full h-2 bg-brand-muted dark:bg-brand-surface transition-colors rounded-lg appearance-none cursor-ew-resize accent-brand-accent"
                  aria-label="Estimated deposit amount slider"
                  title="Deposit amount"
                />
                <div className="flex justify-between text-[10px] text-brand-primary/50 font-bold font-mono">
                  <span>$5,000</span>
                  <span>$100,000</span>
                  <span>$250,000</span>
                </div>
              </div>

              {/* Dynamic Comparison Cards */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-brand-muted/70 p-5 rounded-2xl border border-brand-secondary/60">
                  <p className="text-[10px] font-bold text-brand-primary/50 uppercase tracking-wider">
                    Traditional Bank (0.45% APY)
                  </p>
                  <p className="text-xl font-black text-brand-primary/80 mt-2 font-mono">
                    ${standardEarnings.toLocaleString()}
                  </p>
                  <p className="text-[9px] font-semibold text-brand-primary/40 mt-1">
                    Estimated Annual Interest
                  </p>
                </div>

                <div className="bg-brand-accent/10 p-5 rounded-2xl border border-brand-accent/25 relative overflow-hidden">
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-brand-accent/10 rounded-full blur-md"></div>
                  <p className="text-[10px] font-extrabold text-brand-accent uppercase tracking-wider">
                    Novaa Vault (5.25% APY)
                  </p>
                  <p className="text-xl font-display font-black text-brand-accent mt-2">
                    ${novaaEarnings.toLocaleString()}
                  </p>
                  <p className="text-[9px] font-bold text-brand-accent/80 mt-1">
                    Estimated Annual Interest
                  </p>
                </div>
              </div>
            </div>

            {/* Total Gains Callout */}
            <div className="mt-8 pt-6 border-t border-brand-secondary flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-brand-primary/70 font-semibold">
                  With a Novaa Vault, you earn an extra:
                </p>
                <p className="text-2xl font-bold text-emerald-600 flex items-center gap-1.5 font-mono mt-1">
                  <Sparkles size={20} className="animate-pulse shrink-0" />
                  +${earningsDifference.toLocaleString()} / year
                </p>
              </div>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-brand-primary text-white text-xs font-bold text-center hover:bg-brand-accent transition-all shadow-md uppercase tracking-wider block"
              >
                Claim My Vault
              </Link>
            </div>
          </div>

          {/* RIGHT: Click-To-Reveal Promo Code Card */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {!isUnlocked ? (
                /* LOCKED BOX MOCKUP */
                <motion.div
                  key="locked-card"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  onClick={() => setIsUnlocked(true)}
                  className="bg-gradient-to-br from-brand-navy via-brand-primary to-brand-navy text-white p-8 sm:p-10 rounded-[2.5rem] border border-brand-accent/20 dark:border-brand-accent/30 shadow-2xl flex flex-col justify-between items-center text-center min-h-88 cursor-pointer group hover:border-brand-accent transition-all duration-300 relative overflow-hidden"
                >
                  {/* Holographic backdrop glow */}
                  <div className="absolute -top-24 -left-2a w-52 h-52 bg-brand-accent/10 rounded-full blur-3xl group-hover:bg-brand-accent/20 transition-all"></div>

                  <div className="space-y-4 relative z-10">
                    <div className="inline-flex py-1 px-3 rounded-full bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-[10px] font-bold uppercase tracking-widest gap-1.5 items-center">
                      <Sparkles
                        size={11}
                        className="animate-spin-slow text-brand-accent"
                      />
                      Client Reward Program
                    </div>
                    <h3 className="text-2xl font-display font-medium text-white tracking-tight">
                      Mystery APY <br />
                      Rate Booster
                    </h3>
                    <p className="text-white/60 text-xs px-6 max-w-sm leading-relaxed">
                      Novaa is offering direct rate upgrades. Break the
                      seal on this secure voucher card to claim a boosted
                      savings rate yield.
                    </p>
                  </div>

                  {/* Padlock Visual Icon */}
                  <div className="my-8 relative">
                    <div className="absolute -inset-4 rounded-full bg-brand-accent/15 animate-ping opacity-60"></div>
                    <div className="w-20 h-20 rounded-full bg-linear-to-tr from-brand-accent to-brand-success flex items-center justify-center text-white border border-brand-accent/50 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Lock
                        size={32}
                        className="text-white animate-bounce-slow"
                      />
                    </div>
                  </div>

                  <span className="text-xs font-bold text-center uppercase tracking-wider text-brand-accent group-hover:text-white transition-colors relative z-10">
                    🔴 Click Anywhere to Break Seal & Reveal APY
                  </span>
                </motion.div>
              ) : (
                /* UNLOCKED / CLAIMABLE STATE MOCKUP */
                <motion.div
                  key="unlocked-card"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white dark:bg-brand-secondary transition-colors p-8 sm:p-10 rounded-[2.5rem] border-2 border-emerald-500 shadow-2xl flex flex-col justify-between min-h-88 relative overflow-hidden"
                >
                  {/* Sparkling party bits decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>

                  <div>
                    <div className="flex justify-between items-start">
                      <span className="inline-flex py-1 px-3 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-700 text-[10px] font-bold uppercase tracking-widest gap-1.5 items-center">
                        <LockOpen size={11} className="text-emerald-600" />
                        PROMO CODE ACTIVE
                      </span>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-100/60 px-3 py-1 rounded-full animate-bounce">
                        Special +0.40% Boost Unlocked!
                      </span>
                    </div>

                    <div className="mt-6 flex flex-col items-center text-center">
                      <p className="text-xs uppercase text-brand-primary/50 tracking-wider font-bold">
                        Your Unlocked Boost APY
                      </p>
                      <h4 className="text-6xl font-display font-black text-emerald-600 tracking-tight my-2 scale-110">
                        {unlockedRate}
                      </h4>
                      <p className="text-xs text-brand-primary/80 font-bold px-4 leading-relaxed max-w-sm">
                        Secures supreme rates on checking deposits and savings
                        vaults up to $500,000 for 12 months.
                      </p>
                    </div>

                    {/* Copiable Code field */}
                    <div className="mt-6 bg-brand-muted/70 rounded-2xl border border-brand-secondary p-3 flex items-center justify-between">
                      <div className="text-left">
                        <p className="text-[8px] uppercase font-bold text-brand-primary/40">
                          Promo Claim Token
                        </p>
                        <p className="font-mono text-xs sm:text-sm font-black text-brand-primary dark:text-white transition-colors uppercase tracking-widest">
                          {promoCode}
                        </p>
                      </div>
                      <span className="text-[10px] bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl uppercase shadow border border-emerald-600 animate-pulse">
                        Token Ready
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-brand-secondary flex gap-3">
                    <button
                      onClick={() => setIsUnlocked(false)}
                      className="px-4 py-3 rounded-full border border-brand-secondary text-brand-primary dark:text-white transition-colors text-xs font-bold uppercase hover:bg-brand-muted cursor-pointer"
                    >
                      Reset Seal
                    </button>
                    <Link
                      to="/login"
                      className="flex-1 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center uppercase tracking-wider shadow-md hover:shadow-xl transition-all cursor-pointer block"
                    >
                      Apply Code & Register Now
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
