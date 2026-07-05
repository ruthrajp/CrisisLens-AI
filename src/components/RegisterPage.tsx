import React, { useState } from "react";
import { Shield, User, Key, Phone, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { PageId } from "../types";

interface RegisterPageProps {
  onRegisterSuccess: () => void;
  onNavigate: (page: PageId) => void;
}

export default function RegisterPage({ onRegisterSuccess, onNavigate }: RegisterPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    setSuccess(true);
    setTimeout(() => {
      onRegisterSuccess();
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-16 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <button
          onClick={() => onNavigate("login")}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-6 group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Login
        </button>

        {success ? (
          <div className="text-center py-12">
            <div className="inline-flex p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-4 animate-bounce">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h3 className="font-display text-2xl font-bold text-slate-100">Profile Created!</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
              Your secure citizen response credentials have been successfully provisioned. Redirecting to your emergency report panel...
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="inline-flex p-3 bg-red-500/10 border border-red-500/20 rounded-2xl mb-3">
                <Shield className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="font-display text-xl font-bold text-slate-100">Create Citizen Profile</h2>
              <p className="text-slate-400 text-xs mt-1">
                Establish high-security dispatch access to report and track emergency incidents
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Enter your first and last name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-500 text-white placeholder-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  E-Mail Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="citizen@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-500 text-white placeholder-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Mobile Number (For dispatch alerts)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98451 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-500 text-white placeholder-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Secure Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Key className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-500 text-white placeholder-slate-600"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="agreed"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-800 bg-slate-950 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="agreed" className="text-xs text-slate-400 leading-normal select-none">
                  I understand that submitting false emergency reports is a legal offense. I agree to share my accurate GPS location for rescue purposes.
                </label>
              </div>

              <button
                type="submit"
                disabled={!agreed}
                className="w-full py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-red-600/10 hover:shadow-red-600/25 mt-4"
              >
                Register Citizen Profile
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
