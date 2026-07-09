import { useState } from "react";
import { motion } from "motion/react";
import { BarChart3, Zap, CheckCircle2, MessageSquare } from "lucide-react";
import { User, Role } from "../types";
import { Background } from "../components/Background";
import { GlowBtn } from "../components/GlowBtn";
import { styles } from "../constants";
import { login, register } from "../../services/authService";

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [name, setName] = useState("Nadia Okafor");
  const [isReg, setIsReg] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {

      e.preventDefault();

      try {

          setLoading(true);

          let data;
          if (isReg) {
              data = await register({ name, email, password, role });
          } else {
              data = await login(email, password);
          }

          localStorage.setItem("token", data.token);

          onLogin(data.user);

      }

      catch(error:any){

          alert(
              error.response?.data?.message ||
              (isReg ? "Registration failed" : "Login failed")
          );

      }

      finally{

          setLoading(false);

      }

  }

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Background />
      <div className="relative z-10 flex w-full">
        <div className="hidden lg:flex w-[46%] flex-col justify-between p-14">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#4f7bff,#7b5ff8)", boxShadow: "0 0 24px rgba(79,123,255,0.5)" }}>
              <BarChart3 size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-xl">WorkPulse</span>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: "rgba(79,123,255,0.12)", border: "1px solid rgba(79,123,255,0.25)" }}>
              <Zap size={12} style={{ color: "#4f7bff" }} />
              <span className="text-xs font-medium" style={{ color: "#4f7bff" }}>New — AI report summaries</span>
            </div>
            <h2 className="font-display font-bold text-5xl text-white leading-[1.1] mb-5">
              Track. Report.<br />
            </h2>
            <p className="text-white/45 text-base leading-relaxed max-w-xs">
              Structured weekly reporting that keeps every team member accountable and every manager informed.
            </p>

            <div className="mt-8 space-y-3">
              {[
                { icon: CheckCircle2, c: "#22d3a5", t: "Consistent weekly reports — everyone follows the same format" },
                { icon: BarChart3, c: "#4f7bff", t: "Manager analytics dashboards with real-time insights" },
                { icon: MessageSquare, c: "#a78bfa", t: "AI assistant that surfaces blockers and patterns" },
              ].map(({ icon: Icon, c, t }) => (
                <div key={t} className={`flex items-center gap-3 p-3 rounded-xl ${styles.glass}`}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${c}18` }}>
                    <Icon size={13} style={{ color: c }} />
                  </div>
                  <span className="text-[13px] text-white/60">{t}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/15 text-xs">© 2026 WorkPulse Inc.</p>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="w-full max-w-md">
            <div className={`${styles.glass} rounded-3xl p-8`} style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
              <h3 className="font-display font-bold text-2xl text-white">{isReg ? "Create account" : "Welcome back"}</h3>
              <p className="text-sm text-white/35 mt-1 mb-7">{isReg ? "Join your team on WorkPulse" : "Sign in to your workspace"}</p>

              <form onSubmit={submit} className="space-y-4">
                {isReg && (
                  <div>
                    <label className="block text-[11px] font-semibold text-white/45 mb-1.5 uppercase tracking-wider">Full Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className={styles.inputCls} />
                  </div>
                )}
                <div>
                  <label className="block text-[11px] font-semibold text-white/45 mb-1.5 uppercase tracking-wider">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.io" className={styles.inputCls} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/45 mb-1.5 uppercase tracking-wider">Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={styles.inputCls} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/45 mb-1.5 uppercase tracking-wider">I am a</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["member", "manager"] as Role[]).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                          role === r ? "text-white border-[#4f7bff]/50" : "text-white/35 border-white/[0.08] bg-white/[0.03] hover:border-white/20"
                        }`}
                        style={
                          role === r
                            ? {
                                background: "linear-gradient(135deg,rgba(79,123,255,0.22),rgba(123,95,248,0.16))",
                                boxShadow: "0 0 14px rgba(79,123,255,0.12)"
                              }
                            : {}
                        }
                      >
                        {r === "member" ? "Team Member" : "Manager"}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60 mt-2"
                  style={{ background: "linear-gradient(135deg,#4f7bff,#7b5ff8)", boxShadow: "0 8px 28px rgba(79,123,255,0.38)" }}
                >
                  {loading ? "Signing in…" : isReg ? "Create Account" : "Sign In →"}
                </button>
              </form>

              <p className="text-center text-xs text-white/25 mt-6">
                {isReg ? "Have an account? " : "No account? "}
                <button onClick={() => setIsReg(!isReg)} className="text-[#4f7bff] font-semibold hover:underline">
                  {isReg ? "Sign in" : "Register"}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
