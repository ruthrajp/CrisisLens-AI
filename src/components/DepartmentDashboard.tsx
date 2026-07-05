import { useState, useMemo } from "react";
import { ShieldAlert, Flame, ClipboardList, Clock, Eye, ShieldAlert as PoliceIcon, HelpCircle, Activity, Lightbulb, Compass, Radio } from "lucide-react";
import { Incident, DepartmentName, PageId } from "../types";

interface DepartmentDashboardProps {
  incidents: Incident[];
  department: DepartmentName;
  onSelectIncident: (incident: Incident) => void;
  onUpdateStatus: (id: string, status: any) => Promise<void>;
  onChangeDepartment: (dept: DepartmentName) => void;
}

export default function DepartmentDashboard({
  incidents,
  department,
  onSelectIncident,
  onUpdateStatus,
  onChangeDepartment,
}: DepartmentDashboardProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Departments List
  const departments: DepartmentName[] = [
    "Fire and Rescue",
    "Police",
    "Ambulance and Medical",
    "Disaster Management",
    "Electricity Department",
  ];

  // Map departments to high quality icons and colors
  const getDepartmentIcon = (dept: string) => {
    switch (dept) {
      case "Fire and Rescue":
        return { icon: Flame, color: "text-red-500", bg: "bg-red-500/10 border-red-500/20" };
      case "Police":
        return { icon: PoliceIcon, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" };
      case "Ambulance and Medical":
        return { icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" };
      case "Disaster Management":
        return { icon: Compass, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" };
      case "Electricity Department":
        return { icon: Lightbulb, color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20" };
      default:
        return { icon: HelpCircle, color: "text-slate-500", bg: "bg-slate-500/10 border-slate-500/20" };
    }
  };

  const deptMeta = getDepartmentIcon(department);
  const DeptIcon = deptMeta.icon;

  // Filter incidents assigned to this department
  const departmentIncidents = useMemo(() => {
    return incidents.filter((inc) => inc.assignedDepartment === department);
  }, [incidents, department]);

  // Compute sub-statistics
  const stats = useMemo(() => {
    const total = departmentIncidents.length;
    const pending = departmentIncidents.filter((i) => i.status === "New" || i.status === "Acknowledged").length;
    const active = departmentIncidents.filter((i) => i.status === "Team Dispatched" || i.status === "In Progress").length;
    const resolved = departmentIncidents.filter((i) => i.status === "Resolved").length;

    return { total, pending, active, resolved };
  }, [departmentIncidents]);

  const handleStatusShift = async (id: string, currentStatus: string) => {
    let nextStatus: any = "Acknowledged";
    if (currentStatus === "New") nextStatus = "Acknowledged";
    else if (currentStatus === "Acknowledged") nextStatus = "Team Dispatched";
    else if (currentStatus === "Team Dispatched") nextStatus = "In Progress";
    else if (currentStatus === "In Progress") nextStatus = "Resolved";
    else return;

    setUpdatingId(id);
    await onUpdateStatus(id, nextStatus);
    setUpdatingId(null);
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

  // Status step progression text
  const getButtonActionLabel = (status: string) => {
    switch (status) {
      case "New":
        return "Acknowledge Report";
      case "Acknowledged":
        return "Dispatch Incident Team";
      case "Team Dispatched":
        return "Begin Active Operations";
      case "In Progress":
        return "Mark as Resolved";
      default:
        return "Complete";
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Department Switcher & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-900">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-2xl border ${deptMeta.bg} ${deptMeta.color}`}>
              <DeptIcon className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  DEPT STATION ACTIVE CONTROL
                </span>
              </div>
              <h1 className="font-display text-2xl font-extrabold text-white">{department} Dashboard</h1>
            </div>
          </div>

          {/* Quick Department Selector */}
          <div className="space-y-1">
            <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest text-right">
              Switch Division Console
            </label>
            <select
              value={department}
              onChange={(e) => onChangeDepartment(e.target.value as DepartmentName)}
              className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-4 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Local Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-2xl font-extrabold font-display">{stats.total}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Total Assigned</div>
            </div>
            <ClipboardList className="h-5 w-5 text-slate-500" />
          </div>

          <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-2xl font-extrabold font-display text-rose-500">{stats.pending}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Pending Triage</div>
            </div>
            <Radio className="h-5 w-5 text-rose-500 animate-pulse" />
          </div>

          <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-2xl font-extrabold font-display text-amber-500">{stats.active}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">In Action</div>
            </div>
            <Clock className="h-5 w-5 text-amber-500 animate-pulse" />
          </div>

          <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-2xl font-extrabold font-display text-emerald-500">{stats.resolved}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Resolved</div>
            </div>
            <Activity className="h-5 w-5 text-emerald-500" />
          </div>
        </div>

        {/* Division Queue Table */}
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4">
          <h3 className="font-display font-bold text-sm text-slate-200">
            Active Division Incident Queue
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Address / Sector</th>
                  <th className="py-3 px-4 text-center">Severity</th>
                  <th className="py-3 px-4">Latest Summary</th>
                  <th className="py-3 px-4 text-center">Operational Stage</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {departmentIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                      No emergency tickets currently routed to your station queue. Good job!
                    </td>
                  </tr>
                ) : (
                  departmentIncidents.map((inc) => (
                    <tr key={inc.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                        {inc.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">{inc.crisisType}</td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">{inc.location}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getSeverityBadge(inc.severity)}`}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-sm truncate">
                        {inc.summary || inc.description}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-[10px] font-bold uppercase">
                        <span className="text-slate-300 bg-slate-950 p-1 px-2 border border-slate-850 rounded">
                          {inc.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => onSelectIncident(inc)}
                            className="p-1 px-2 bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-300 rounded text-[11px]"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {inc.status !== "Resolved" && (
                            <button
                              onClick={() => handleStatusShift(inc.id, inc.status)}
                              disabled={updatingId === inc.id}
                              className="py-1 px-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-800 text-white rounded text-[11px] font-semibold transition-all shadow-sm"
                            >
                              {updatingId === inc.id ? "Progressing..." : getButtonActionLabel(inc.status)}
                            </button>
                          )}
                        </div>
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
