import { useState, useEffect } from "react";
import {
  ShieldAlert,
  LogOut,
  Radio,
  FileText,
  LayoutDashboard,
  MapPin,
  Activity,
  Sparkles,
  Menu,
  X,
  User,
  Layers,
} from "lucide-react";

import { Incident, PageId, UserRole, DepartmentName } from "./types";

// Import all sub-pages
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ReportPage from "./components/ReportPage";
import AnalysisResultPage from "./components/AnalysisResultPage";
import AdminDashboard from "./components/AdminDashboard";
import IncidentsList from "./components/IncidentsList";
import IncidentDetails from "./components/IncidentDetails";
import DepartmentDashboard from "./components/DepartmentDashboard";
import LiveMapPage from "./components/LiveMapPage";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import AiPipelinePage from "./components/AiPipelinePage";

export default function App() {
  const [currentPageId, setCurrentPageId] = useState<PageId>("landing");
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth States
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    role: UserRole;
    department?: DepartmentName;
  } | null>(null);

  // Active Department station selected (for officer role)
  const [activeDepartment, setActiveDepartment] = useState<DepartmentName>("Fire and Rescue");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Load incidents from Node.js backend
  const fetchIncidents = async () => {
    try {
       const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/incidents`);
      if (res.ok) {
        const data = await res.json();
        setIncidents(data);
      }
    } catch (e) {
      console.error("Failed to load incidents ledger:", e);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Handle reporting submissions
  const handleReportSubmit = async (reportData: {
    reporterName: string;
    phone: string;
    description: string;
    location: string;
    latitude: number;
    longitude: number;
    image?: string;
    audio?: string;
  }) => {
    setIsSubmittingReport(true);
    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      if (res.ok) {
        const result = await res.json();
        
        // Refresh full registry list
        await fetchIncidents();
        
        // Target active triage page
        setSelectedIncident(result);
        setCurrentPageId("analysis-result");
      } else {
        alert("Server failed to analyze the emergency. Falling back to local simulations.");
      }
    } catch (err) {
      console.error("Submission crash:", err);
      alert("Network connectivity issue. Failed to process report.");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // Handle Ticket modifications (Status and Department dispatching)
  const handleUpdateIncidentStatus = async (
    id: string,
    status: "New" | "Acknowledged" | "Team Dispatched" | "In Progress" | "Resolved",
    dept?: DepartmentName
  ) => {
    try {
      const res = await fetch(`/api/incidents/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, assignedDepartment: dept }),
      });

      if (res.ok) {
        const updated = await res.json();
        
        // Refresh local memory and select state
        await fetchIncidents();
        if (selectedIncident && selectedIncident.id === id) {
          setSelectedIncident(updated);
        }
      }
    } catch (e) {
      console.error("Failed to route ticket dispatch update:", e);
    }
  };

  // Handle Login successes
  const handleLoginSuccess = (role: UserRole, department?: DepartmentName) => {
    const email = role === "Admin" ? "admin@crisislens.gov" : role === "Department Officer" ? "officer@crisislens.gov" : "citizen@gmail.com";
    setCurrentUser({ email, role, department });
    if (role === "Admin") {
      setCurrentPageId("admin-dashboard");
    } else if (role === "Department Officer") {
      if (department) {
        setActiveDepartment(department);
      }
      setCurrentPageId("department-dashboard");
    } else {
      setCurrentPageId("report");
    }
  };

  // Handle Register success
  const handleRegisterSuccess = () => {
    setCurrentPageId("login");
  };

  // Reset demo tickets
  const handleResetIncidentsQueue = async () => {
    try {
      const res = await fetch("/api/incidents", {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchIncidents();
        setSelectedIncident(null);
      }
    } catch (e) {
      console.error("Failed to reset queue:", e);
    }
  };

  // Handle logouts
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPageId("landing");
  };

  // Determine standard page view rendering
  const renderPage = () => {
    switch (currentPageId) {
      case "landing":
        return <LandingPage onNavigate={setCurrentPageId} />;
      case "login":
        return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={setCurrentPageId} />;
      case "register":
        return <RegisterPage onRegisterSuccess={handleRegisterSuccess} onNavigate={setCurrentPageId} />;
      case "report":
        return <ReportPage onSubmitReport={handleReportSubmit} isSubmitting={isSubmittingReport} onNavigate={setCurrentPageId} />;
      case "analysis-result":
        return <AnalysisResultPage incident={selectedIncident} onNavigate={setCurrentPageId} />;
      case "admin-dashboard":
        return (
          <AdminDashboard
            incidents={incidents}
            onSelectIncident={(inc) => {
              setSelectedIncident(inc);
              setCurrentPageId("incident-details");
            }}
            onNavigate={setCurrentPageId}
            onResetIncidents={handleResetIncidentsQueue}
          />
        );
      case "incidents-list":
        return (
          <IncidentsList
            incidents={incidents}
            onSelectIncident={(inc) => {
              setSelectedIncident(inc);
              setCurrentPageId("incident-details");
            }}
            onNavigate={setCurrentPageId}
          />
        );
      case "incident-details":
        return (
          <IncidentDetails
            incident={selectedIncident}
            onBack={() => {
              if (currentUser?.role === "Admin") setCurrentPageId("admin-dashboard");
              else if (currentUser?.role === "Department Officer") setCurrentPageId("department-dashboard");
              else setCurrentPageId("incidents-list");
            }}
            onNavigate={setCurrentPageId}
            onUpdateStatus={handleUpdateIncidentStatus}
            currentUserRole={currentUser?.role || "Citizen"}
          />
        );
      case "department-dashboard":
        return (
          <DepartmentDashboard
            incidents={incidents}
            department={activeDepartment}
            onSelectIncident={(inc) => {
              setSelectedIncident(inc);
              setCurrentPageId("incident-details");
            }}
            onUpdateStatus={async (id, status) => {
              await handleUpdateIncidentStatus(id, status);
            }}
            onChangeDepartment={setActiveDepartment}
          />
        );
      case "live-map":
        return (
          <LiveMapPage
            incidents={incidents}
            onSelectIncident={(inc) => {
              setSelectedIncident(inc);
              setCurrentPageId("incident-details");
            }}
            onNavigate={setCurrentPageId}
          />
        );
      case "analytics":
        return <AnalyticsDashboard incidents={incidents} onNavigate={setCurrentPageId} />;
      case "ai-pipeline":
        return <AiPipelinePage onNavigate={setCurrentPageId} />;
      default:
        return <LandingPage onNavigate={setCurrentPageId} />;
    }
  };

  // Navigation panel layout conditional
  const hasNavbar = currentPageId !== "landing" && currentPageId !== "login" && currentPageId !== "register";

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 selection:bg-red-500 selection:text-white antialiased">
      {/* Global Command Header */}
      {hasNavbar && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 border-b border-slate-900 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              
              {/* Brand Logo */}
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setCurrentPageId("landing")}
              >
                <ShieldAlert className="h-5 w-5 text-red-500 animate-pulse" />
                <span className="font-display font-black text-sm uppercase tracking-wider text-slate-100">
                  CrisisLens <span className="text-red-500">AI</span>
                </span>
              </div>

              {/* Desktop Menu links */}
              <div className="hidden md:flex items-center gap-1">
                {/* Citizen Specific Link */}
                {currentUser?.role === "Citizen" && (
                  <button
                    onClick={() => setCurrentPageId("report")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      currentPageId === "report" ? "bg-red-500/10 text-red-400 border border-red-500/25" : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" /> File Report
                  </button>
                )}

                {/* Admin Specific Links */}
                {currentUser?.role === "Admin" && (
                  <button
                    onClick={() => setCurrentPageId("admin-dashboard")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      currentPageId === "admin-dashboard" ? "bg-red-500/10 text-red-400 border border-red-500/25" : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" /> Command Panel
                  </button>
                )}

                {/* Department Officer Specific Links */}
                {currentUser?.role === "Department Officer" && (
                  <button
                    onClick={() => setCurrentPageId("department-dashboard")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      currentPageId === "department-dashboard" ? "bg-red-500/10 text-red-400 border border-red-500/25" : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" /> Station Desk
                  </button>
                )}

                {/* Generic Shared Pages */}
                <button
                  onClick={() => setCurrentPageId("incidents-list")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    currentPageId === "incidents-list" ? "bg-red-500/10 text-red-400 border border-red-500/25" : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  All Incidents
                </button>

                <button
                  onClick={() => setCurrentPageId("live-map")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    currentPageId === "live-map" ? "bg-red-500/10 text-red-400 border border-red-500/25" : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5" /> Incident Map
                </button>

                <button
                  onClick={() => setCurrentPageId("analytics")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    currentPageId === "analytics" ? "bg-red-500/10 text-red-400 border border-red-500/25" : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  <Activity className="h-3.5 w-3.5" /> Analytics
                </button>

                <button
                  onClick={() => setCurrentPageId("ai-pipeline")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    currentPageId === "ai-pipeline" ? "bg-red-500/10 text-red-400 border border-red-500/25" : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" /> Neural Pipeline
                </button>
              </div>

              {/* Session Profile Information */}
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 justify-end">
                    <User className="h-3 w-3" />
                    {currentUser?.role || "Citizen Reporter"}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-300">
                    {currentUser?.email || "Anonymous Access"}
                  </div>
                </div>

                <div className="h-8 w-px bg-slate-900" />

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 rounded-xl transition-all"
                  title="Secure logout session"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Mobile Menu Action button */}
              <div className="md:hidden flex items-center gap-2">
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-500 hover:text-red-500"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>

            </div>
          </div>

          {/* Mobile Dropdown menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-slate-950 border-b border-slate-900 px-4 pt-2 pb-4 space-y-2">
              {currentUser?.role === "Citizen" && (
                <button
                  onClick={() => {
                    setCurrentPageId("report");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 px-3 hover:bg-slate-900 text-xs text-slate-300"
                >
                  File Triage Report
                </button>
              )}

              {currentUser?.role === "Admin" && (
                <button
                  onClick={() => {
                    setCurrentPageId("admin-dashboard");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 px-3 hover:bg-slate-900 text-xs text-slate-300 font-bold"
                >
                  Command Dashboard
                </button>
              )}

              {currentUser?.role === "Department Officer" && (
                <button
                  onClick={() => {
                    setCurrentPageId("department-dashboard");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 px-3 hover:bg-slate-900 text-xs text-slate-300 font-bold"
                >
                  Station Desk Board
                </button>
              )}

              <button
                onClick={() => {
                  setCurrentPageId("incidents-list");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 px-3 hover:bg-slate-900 text-xs text-slate-300"
              >
                All Incident Logs
              </button>

              <button
                onClick={() => {
                  setCurrentPageId("live-map");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 px-3 hover:bg-slate-900 text-xs text-slate-300"
              >
                Municipal Tactical Map
              </button>

              <button
                onClick={() => {
                  setCurrentPageId("analytics");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 px-3 hover:bg-slate-900 text-xs text-slate-300"
              >
                Core Analytics Feed
              </button>

              <button
                onClick={() => {
                  setCurrentPageId("ai-pipeline");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 px-3 hover:bg-slate-900 text-xs text-slate-300"
              >
                AI Neural Pipeline
              </button>
            </div>
          )}
        </nav>
      )}

      {/* Main Content Stage */}
      <main>{renderPage()}</main>
    </div>
  );
}
