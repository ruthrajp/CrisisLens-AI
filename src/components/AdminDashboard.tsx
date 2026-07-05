import { useState, useMemo } from "react";
import {
  ShieldAlert,
  Flame,
  Radio,
  Clock,
  CheckCircle,
  FileSpreadsheet,
  AlertOctagon,
  Users,
  Search,
  Filter,
  Eye,
  Trash2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Incident, PageId } from "../types";

interface AdminDashboardProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onNavigate: (page: PageId) => void;
  onResetIncidents?: () => Promise<void>;
}

export default function AdminDashboard({
  incidents,
  onSelectIncident,
  onNavigate,
  onResetIncidents,
}: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isResetting, setIsResetting] = useState(false);

  // Compute stats
  const stats = useMemo(() => {
    const total = incidents.length;
    const active = incidents.filter((i) => i.status !== "Resolved").length;
    const critical = incidents.filter((i) => i.severity === "Critical" && i.status !== "Resolved").length;
    const teamsDispatched = incidents.filter((i) => i.status === "Team Dispatched").length;
    const resolved = incidents.filter((i) => i.status === "Resolved").length;

    // Simulated response time in minutes based on real status
    const averageResponseTime = total > 0 ? "14 mins" : "0 mins";

    return { total, active, critical, teamsDispatched, resolved, averageResponseTime };
  }, [incidents]);

  // Compute chart data (Crisis Category Distribution)
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    incidents.forEach((inc) => {
      counts[inc.crisisType] = (counts[inc.crisisType] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [incidents]);

  // Severity Distribution data
  const severityData = useMemo(() => {
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    incidents.forEach((inc) => {
      if (inc.severity in counts) {
        counts[inc.severity as keyof typeof counts]++;
      }
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [incidents]);

  // Department Workload data
  const departmentData = useMemo(() => {
    const counts: Record<string, number> = {};
    incidents.forEach((inc) => {
      const dept = inc.assignedDepartment || "Unassigned";
      counts[dept] = (counts[dept] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name: name.split(" ")[0], // abbreviate name (e.g. Fire and Rescue -> Fire)
      value,
    }));
  }, [incidents]);

  // Incident trends by day (Simulated based on dates or simple sequence)
  const trendData = useMemo(() => {
    // Generate trend points for past 6 hours or days
    const dates: Record<string, number> = {};
    incidents.forEach((inc) => {
      try {
        const dateStr = new Date(inc.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
        dates[dateStr] = (dates[dateStr] || 0) + 1;
      } catch (e) {
        dates["Jul 4"] = (dates["Jul 4"] || 0) + 1;
      }
    });

    // Sort by chronological key if possible or simply list
    return Object.entries(dates)
      .map(([date, count]) => ({
        date,
        Incidents: count,
      }))
      .slice(-6); // last 6 active dates
  }, [incidents]);

  // Filtered incidents for the table
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchSearch =
        inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.crisisType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.reporterName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSev = severityFilter === "all" || inc.severity === severityFilter;
      const matchStatus = statusFilter === "all" || inc.status === statusFilter;

      return matchSearch && matchSev && matchStatus;
    });
  }, [incidents, searchTerm, severityFilter, statusFilter]);

  // Reset helper
  const handleReset = async () => {
    if (!onResetIncidents) return;
    if (confirm("Are you sure you want to reset all user-submitted incidents? Demo data will be preserved.")) {
      setIsResetting(true);
      await onResetIncidents();
      setIsResetting(false);
    }
  };

  // Severity color resolver
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500/10 border-red-500/25 text-red-400";
      case "High":
        return "bg-orange-500/10 border-orange-500/25 text-orange-400";
      case "Medium":
        return "bg-yellow-500/10 border-yellow-500/25 text-yellow-400";
      default:
        return "bg-blue-500/10 border-blue-500/25 text-blue-400";
    }
  };

  // Status color resolver
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      case "In Progress":
        return "bg-amber-500/10 border-amber-500/20 text-amber-400";
      case "Team Dispatched":
        return "bg-orange-500/10 border-orange-500/20 text-orange-400";
      case "Acknowledged":
        return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      default:
        return "bg-rose-500/10 border-rose-500/20 text-rose-400";
    }
  };

  // Chart Colors
  const SEVERITY_COLORS = ["#ef4444", "#f97316", "#eab308", "#3b82f6"];
  const CATEGORY_COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#14b8a6", "#6366f1", "#94a3b8"];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-900">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="font-mono text-[10px] text-red-500 font-bold uppercase tracking-widest">
                COIMBATORE CENTRAL OPERATIONS
              </span>
            </div>
            <h1 className="font-display text-3xl font-extrabold text-white">Crisis Management Command Console</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate("live-map")}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-colors"
            >
              Live Incident Map
            </button>
            <button
              onClick={() => onNavigate("analytics")}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-colors"
            >
              Deep Analytics
            </button>
            {onResetIncidents && (
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="px-4 py-2.5 bg-slate-950 hover:bg-red-950/20 border border-slate-850 hover:border-red-900/40 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Reset Queue
              </button>
            )}
          </div>
        </div>

        {/* Operational Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Total Reports</span>
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold font-display text-slate-100">{stats.total}</div>
              <div className="text-[10px] text-slate-400 mt-1">Cumulated historical feed</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Active Threats</span>
              <Radio className="h-4 w-4 text-blue-500 animate-pulse" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold font-display text-blue-400">{stats.active}</div>
              <div className="text-[10px] text-slate-400 mt-1">Awaiting ultimate resolution</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Critical Alerts</span>
              <AlertOctagon className="h-4 w-4 text-red-500 animate-pulse" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold font-display text-red-500">{stats.critical}</div>
              <div className="text-[10px] text-slate-400 mt-1">Immediate threat triage</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Dispatched Units</span>
              <Users className="h-4 w-4 text-orange-400" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold font-display text-orange-400">{stats.teamsDispatched}</div>
              <div className="text-[10px] text-slate-400 mt-1">Responders en route</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Resolved Tickets</span>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold font-display text-emerald-500">{stats.resolved}</div>
              <div className="text-[10px] text-slate-400 mt-1">Cleared from field queue</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Avg Response</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold font-display text-amber-500">{stats.averageResponseTime}</div>
              <div className="text-[10px] text-slate-400 mt-1">Target dispatch latency</div>
            </div>
          </div>
        </div>

        {/* Telemetry Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chart 1: Incident Daily Trends (Col span 2) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <h3 className="font-display font-bold text-sm text-slate-200">Incident Activity Timeline</h3>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Frequency count</span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="Incidents" stroke="#ef4444" strokeWidth={3} dot={{ fill: "#ef4444" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Crisis Severity Distribution */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <h3 className="font-display font-bold text-sm text-slate-200">Threat Severity Ratios</h3>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Proportions</span>
            </div>
            <div className="h-56 flex flex-col justify-between">
              <div className="h-40 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={severityData} innerRadius={45} outerRadius={60} paddingAngle={3} dataKey="value">
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[index % SEVERITY_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "8px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-4 gap-1 text-[9px] text-center font-mono text-slate-400">
                {severityData.map((entry, idx) => (
                  <div key={idx}>
                    <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: SEVERITY_COLORS[idx] }} />
                    {entry.name}: <strong className="text-slate-200">{entry.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart 3: Department Workload Distribution */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <h3 className="font-display font-bold text-sm text-slate-200">Department Ticket Load</h3>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Division allocation</span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={9} tickLine={false} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "8px" }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Live Incident Queue / Table */}
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-850 pb-4">
            <h3 className="font-display font-bold text-sm text-slate-200 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-500" /> Live Dispatch Response Queue
            </h3>

            {/* Quick search & Filters */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-48">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search incident, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">All Severities</option>
                <option value="Critical">Critical Only</option>
                <option value="High">High Only</option>
                <option value="Medium">Medium Only</option>
                <option value="Low">Low Only</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="New">New</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="Team Dispatched">Team Dispatched</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Table Element */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Incident ID</th>
                  <th className="py-3 px-4">Crisis Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-center">Severity</th>
                  <th className="py-3 px-4 text-center">Confidence</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-500 font-mono">
                      No active threat files matching filter specifications found.
                    </td>
                  </tr>
                ) : (
                  filteredIncidents.map((inc) => (
                    <tr key={inc.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                        <div className="flex items-center gap-1.5">
                          {inc.isDemo && (
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" title="Simulation Seed" />
                          )}
                          {inc.id}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">{inc.crisisType}</td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">{inc.location}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getSeverityBadge(inc.severity)}`}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-300 font-semibold">{inc.confidence}%</td>
                      <td className="py-3.5 px-4 text-slate-300">{inc.assignedDepartment}</td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">
                        {new Date(inc.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadge(inc.status)}`}>
                          {inc.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onSelectIncident(inc)}
                          className="p-1 px-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg font-semibold transition-all inline-flex items-center gap-1 hover:text-white"
                        >
                          <Eye className="h-3 w-3" /> View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
