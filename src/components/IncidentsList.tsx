import { useState, useMemo } from "react";
import { Search, Filter, ShieldAlert, ChevronRight, Eye, Calendar, AlertTriangle } from "lucide-react";
import { Incident, PageId } from "../types";

interface IncidentsListProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onNavigate: (page: PageId) => void;
}

export default function IncidentsList({ incidents, onSelectIncident, onNavigate }: IncidentsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = [
    "Fire Emergency",
    "Road Accident",
    "Medical Emergency",
    "Flood",
    "Building Collapse",
    "Electrical Hazard",
    "Natural Disaster",
    "Public Safety Emergency",
    "Other",
  ];

  // Filter logic
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchSearch =
        inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.crisisType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.summary.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSev = severityFilter === "all" || inc.severity === severityFilter;
      const matchStatus = statusFilter === "all" || inc.status === statusFilter;
      const matchCat = categoryFilter === "all" || inc.crisisType === categoryFilter;

      return matchSearch && matchSev && matchStatus && matchCat;
    });
  }, [incidents, searchTerm, severityFilter, statusFilter, categoryFilter]);

  // Styling helper classes
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

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="border-b border-slate-900 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-white">Consolidated Incident Registry</h1>
            <p className="text-slate-400 text-xs mt-1">
              Historical ledger indexing all logged citizen reports and arced dispatcher records.
            </p>
          </div>
          <button
            onClick={() => onNavigate("report")}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            File New Emergency
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
            />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Crisis Types</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
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

        {/* Incidents Cards / Rows List */}
        <div className="space-y-3">
          {filteredIncidents.length === 0 ? (
            <div className="bg-slate-900 border border-slate-850 p-12 text-center rounded-2xl text-slate-500">
              <ShieldAlert className="h-8 w-8 mx-auto text-slate-600 mb-3" />
              <span>No crisis records indexed match these search parameters.</span>
            </div>
          ) : (
            filteredIncidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-slate-900 border border-slate-850 hover:border-slate-850 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:bg-slate-900/80 cursor-pointer"
                onClick={() => onSelectIncident(inc)}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {inc.id}
                    </span>
                    {inc.isDemo && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 uppercase tracking-wide">
                        Simulated
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${getSeverityBadge(inc.severity)}`}>
                      {inc.severity}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${getStatusBadge(inc.status)}`}>
                      {inc.status}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-slate-200 text-sm">
                    {inc.crisisType} – <span className="text-slate-400 font-normal">{inc.location}</span>
                  </h3>

                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {inc.summary || inc.description}
                  </p>

                  <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(inc.createdAt).toLocaleString()}
                    </span>
                    <span>Reporter: <strong>{inc.reporterName}</strong></span>
                    <span>Assigned Department: <strong className="text-slate-300">{inc.assignedDepartment}</strong></span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectIncident(inc);
                  }}
                  className="px-3.5 py-2 bg-slate-950 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1 w-full sm:w-auto justify-center"
                >
                  <Eye className="h-3.5 w-3.5" /> Inspect
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
