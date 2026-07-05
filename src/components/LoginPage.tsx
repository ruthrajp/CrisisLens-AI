import React, { useState } from "react";
import { Shield, User, Landmark, AlertTriangle, Key } from "lucide-react";
import { UserRole, PageId, DepartmentName } from "../types";

interface LoginPageProps {
  onLoginSuccess: (role: UserRole, department?: DepartmentName) => void;
  onNavigate: (page: PageId) => void;
}

export default function LoginPage({ onLoginSuccess, onNavigate }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("Citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState<DepartmentName>("Fire and Rescue");
  const [error, setError] = useState("");

  const departmentsList: DepartmentName[] = [
    "Fire and Rescue",
    "Police",
    "Ambulance and Medical",
    "Disaster Management",
    "Electricity Department",
  ];

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (selectedRole === "Admin") {
      if (email === "admin@crisislens.gov" && password === "admin123") {
        onLoginSuccess("Admin");
      } else {
        setError("Invalid Admin credentials. Use admin@crisislens.gov / admin123");
      }
    } else if (selectedRole === "Department Officer") {
      if (email === "officer@crisislens.gov" && password === "officer123") {
        onLoginSuccess("Department Officer", department);
      } else {
        setError("Invalid Officer credentials. Use officer@crisislens.gov / officer123");
      }
    } else {
      // Citizen login - allow any
      if (!email || !password) {
        setError("Please enter your email and password.");
      } else {
        onLoginSuccess("Citizen");
      }
    }
  };

  // Quick action demo logins
  const handleQuickLogin = (role: UserRole, dept?: DepartmentName) => {
    if (role === "Admin") {
      onLoginSuccess("Admin");
    } else if (role === "Department Officer") {
      onLoginSuccess("Department Officer", dept || "Fire and Rescue");
    } else {
      onLoginSuccess("Citizen");
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-red-500/10 border border-red-500/20 rounded-2xl mb-4">
            <Shield className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-100">Command Center Login</h2>
          <p className="text-slate-400 text-xs mt-1">
            Access secure emergency response consoles or report active emergencies
          </p>
        </div>

        {/* Role Switcher tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-xl mb-6 border border-slate-850">
          {(["Citizen", "Admin", "Department Officer"] as UserRole[]).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                setSelectedRole(role);
                setError("");
                if (role === "Admin") {
                  setEmail("admin@crisislens.gov");
                  setPassword("admin123");
                } else if (role === "Department Officer") {
                  setEmail("officer@crisislens.gov");
                  setPassword("officer123");
                } else {
                  setEmail("citizen@gmail.com");
                  setPassword("citizen123");
                }
              }}
              className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all capitalize ${
                selectedRole === role
                  ? "bg-slate-850 text-white shadow"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {role === "Department Officer" ? "Officer" : role}
            </button>
          ))}
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleFormLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Secure Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <User className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                placeholder={selectedRole === "Admin" ? "admin@crisislens.gov" : "your@email.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white placeholder-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Access Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Key className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white placeholder-slate-600"
              />
            </div>
          </div>

          {/* Department Selection for Officers */}
          {selectedRole === "Department Officer" && (
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-2">
                Assigned Responder Division
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as DepartmentName)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {departmentsList.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <div className="flex gap-2 p-3 bg-red-950/40 border border-red-900/35 rounded-xl text-xs text-red-400">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-red-600/10 hover:shadow-red-600/25 mt-2"
          >
            Authenticate & Log In
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => onNavigate("register")}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Don't have a secure citizen profile? <span className="text-red-500 font-bold hover:underline">Register here</span>
          </button>
        </div>

        {/* Quick Demo Logins Box */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
              🔐 Quick Access - Demo / Reviewer login
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickLogin("Citizen")}
                className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 text-slate-300 text-[11px] font-medium transition-colors"
              >
                <User className="h-3 w-3 text-blue-400" />
                Citizen Portal
              </button>
              <button
                onClick={() => handleQuickLogin("Admin")}
                className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 text-slate-300 text-[11px] font-medium transition-colors"
              >
                <Shield className="h-3 w-3 text-red-400" />
                Command Admin
              </button>
            </div>
            <div className="mt-2">
              <div className="text-[9px] text-center text-slate-500 font-semibold uppercase tracking-wider mb-1.5">
                Officer Divisions
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {departmentsList.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => handleQuickLogin("Department Officer", dept)}
                    className="py-1 px-2 bg-slate-900 hover:bg-slate-850 rounded border border-slate-800 text-slate-300 text-[10px] font-medium transition-colors"
                  >
                    {dept.split(" ")[0]} Team
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
