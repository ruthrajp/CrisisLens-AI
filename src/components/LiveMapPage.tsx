import { useState, useMemo } from "react";
import { ShieldAlert, MapPin, Filter, Search, Shield, Target } from "lucide-react";
import LeafletMap from "./LeafletMap";
import { Incident, PageId } from "../types";

interface LiveMapPageProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onNavigate: (page: PageId) => void;
}

export default function LiveMapPage({ incidents, onSelectIncident, onNavigate }: LiveMapPageProps) {
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIncidentLocal, setSelectedIncidentLocal] = useState<Incident | null>(null);

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

  // Filtered list specifically for the sidebar
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchSearch =
        inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.crisisType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSev = severityFilter === "all" || inc.severity === severityFilter;
      const matchType = typeFilter === "all" || inc.crisisType === typeFilter;
      const matchStatus = statusFilter === "all" || inc.status === statusFilter;

      return matchSearch && matchSev && matchType && matchStatus;
    });
  }, [incidents, searchTerm, severityFilter, typeFilter, statusFilter]);

  // Style helpers
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500/10 border-red-500/20 text-red-400";
      case "High":
        return "bg-orange-500/10 border-orange-500/20 text-orange-400";
      case "Medium":
        return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
      default:
        return "bg-blue-500/10 border-blue-500/20 text-blue-400";
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-5">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-white">Interactive Tactical Command Map</h1>
            <p className="text-slate-400 text-xs mt-1">
              Geospatial arcing overlaying active citizen triage tickets over local municipal sectors.
            </p>
          </div>
          <button
            onClick={() => onNavigate("report")}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            File Instant Triage
          </button>
        </div>

        {/* Outer Box Layer */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px] lg:h-[650px]">
          
          {/* Sidebar controls (Width 1) */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 flex flex-col h-full overflow-hidden space-y-4">
            
            {/* Search and Filters */}
            <div className="space-y-3 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search location, code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Advanced select filters */}
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                    Severity
                  </label>
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1 px-2.5 text-xs text-slate-300"
                  >
                    <option value="all">All Severities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                    Crisis Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1 px-2.5 text-xs text-slate-300"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1 px-2.5 text-xs text-slate-300"
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
            </div>

            {/* Scroller active list items */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold sticky top-0 bg-slate-900 pb-1.5 border-b border-slate-850">
                Filtered Records ({filteredIncidents.length})
              </div>

              {filteredIncidents.length === 0 ? (
                <div className="text-center py-8 text-slate-500 font-mono">
                  No matches found.
                </div>
              ) : (
                filteredIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    onClick={() => {
                      setSelectedIncidentLocal(inc);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-left space-y-1.5 ${
                      selectedIncidentLocal?.id === inc.id
                        ? "bg-slate-950 border-red-500"
                        : "bg-slate-950/40 border-slate-850 hover:bg-slate-950"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-slate-500">{inc.id}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${getSeverityColor(inc.severity)}`}>
                        {inc.severity}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-200 text-xs truncate">{inc.crisisType}</h4>
                    
                    <p className="text-slate-400 text-[10px] leading-relaxed line-clamp-2">
                      {inc.summary || inc.description}
                    </p>

                    <div className="flex justify-between items-center pt-1 border-t border-slate-900 text-[9px] text-slate-500">
                      <span className="truncate">{inc.location}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectIncident(inc);
                        }}
                        className="text-red-500 hover:underline font-bold"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Interactive Map Visualizer (Width 3) */}
          <div className="lg:col-span-3 h-full rounded-2xl overflow-hidden border border-slate-850 relative">
            <LeafletMap
              incidents={incidents}
              selectedIncident={selectedIncidentLocal}
              onSelectIncident={(inc) => {
                setSelectedIncidentLocal(inc);
              }}
              severityFilter={severityFilter}
              typeFilter={typeFilter}
              statusFilter={statusFilter}
            />

            {/* Quick Map floating legends box */}
            <div className="absolute top-4 right-4 bg-slate-950/90 border border-slate-800 p-3 rounded-xl z-[999] text-[10px] font-mono space-y-1.5 shadow-2xl backdrop-blur-sm pointer-events-none">
              <div className="font-bold text-slate-400 mb-1 border-b border-slate-800 pb-1">MAP LEGENDS</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> Critical Alert</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-orange-500" /> High Severity</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-yellow-500" /> Medium Severity</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /> Low Severity</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
