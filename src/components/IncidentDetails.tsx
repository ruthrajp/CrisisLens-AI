import { useState } from "react";
import {
  ShieldAlert,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  Cpu,
  Layers,
  CheckCircle2,
  Clock,
  Play,
  Share2,
  History,
  Workflow,
  AlertTriangle,
} from "lucide-react";
import { Incident, PageId, DepartmentName } from "../types";

interface IncidentDetailsProps {
  incident: Incident | null;
  onBack: () => void;
  onNavigate: (page: PageId) => void;
  onUpdateStatus: (id: string, status: any, dept?: any) => Promise<void>;
  currentUserRole: string;
}

export default function IncidentDetails({
  incident,
  onBack,
  onNavigate,
  onUpdateStatus,
  currentUserRole,
}: IncidentDetailsProps) {
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<any>("");
  const [selectedDept, setSelectedDept] = useState<any>("");

  if (!incident) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="h-10 w-10 text-red-500 mx-auto mb-2 animate-bounce" />
          <p>No incident selected.</p>
          <button onClick={onBack} className="text-red-500 hover:underline mt-2">
            Back to Queue
          </button>
        </div>
      </div>
    );
  }

  // Allowed statuses
  const statuses = ["New", "Acknowledged", "Team Dispatched", "In Progress", "Resolved"];

  // Department list
  const departments: DepartmentName[] = [
    "Fire and Rescue",
    "Police",
    "Ambulance and Medical",
    "Disaster Management",
    "Electricity Department",
  ];

  // Severity style helper
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "text-red-500 bg-red-500/10 border-red-500/25";
      case "High":
        return "text-orange-500 bg-orange-500/10 border-orange-500/25";
      case "Medium":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/25";
      default:
        return "text-blue-500 bg-blue-500/10 border-blue-500/25";
    }
  };

  // Status color mapper
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "text-emerald-500 border-emerald-500/30";
      case "In Progress":
        return "text-amber-500 border-amber-500/30";
      case "Team Dispatched":
        return "text-orange-500 border-orange-500/30";
      case "Acknowledged":
        return "text-blue-500 border-blue-500/30";
      default:
        return "text-rose-500 border-rose-500/30";
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    await onUpdateStatus(
      incident.id,
      selectedStatus || incident.status,
      selectedDept || incident.assignedDepartment
    );
    setUpdating(false);
  };

  // Timeline completion index finder
  const currentStepIndex = statuses.indexOf(incident.status);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Incident Feed
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 uppercase">Telemetry: Active</span>
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          </div>
        </div>

        {/* Two-Column Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Details Panel (Left, 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Identity Card */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-400">{incident.id}</span>
                  {incident.isDemo && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 uppercase tracking-wide">
                      Simulation Seed
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase border ${getSeverityStyle(incident.severity)}`}>
                    {incident.severity}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase border ${getStatusColor(incident.status)}`}>
                    {incident.status}
                  </span>
                </div>
              </div>

              <div>
                <h1 className="font-display text-2xl font-extrabold text-white">{incident.crisisType}</h1>
                <p className="text-slate-400 text-xs mt-1.5 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-red-500" />
                  {incident.location}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-850">
                <h4 className="text-[10px] font-mono text-slate-500 uppercase font-bold mb-1.5">Original Incident Narrative</h4>
                <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950 p-4 rounded-xl border border-slate-850">
                  "{incident.description}"
                </p>
              </div>
            </div>

            {/* Neural Diagnostics Box */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                <Cpu className="h-5 w-5 text-red-500" />
                <h3 className="font-display font-bold text-sm text-slate-200">Neural Gemini AI Analysis Logs</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Triage Diagnostics Summary</div>
                  <p className="text-slate-300 mt-1 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-850">
                    {incident.summary}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase mb-1.5">Recommended Departments</div>
                    <div className="flex flex-wrap gap-1">
                      {incident.recommendedDepartments?.map((dept, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-950 border border-slate-850 text-slate-400 rounded text-[11px]"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Confidence Rating</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-850">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: `${incident.confidence}%` }} />
                      </div>
                      <span className="font-mono text-slate-300 font-bold">{incident.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Attachment Records */}
            {(incident.imageUrl || incident.audioUrl) && (
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-bold text-sm text-slate-200">Evidence Attachments</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {incident.imageUrl && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Citizens Photograph</span>
                      <img
                        src={incident.imageUrl}
                        alt="Evidence Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-40 object-cover rounded-xl border border-slate-800 shadow"
                      />
                    </div>
                  )}

                  {incident.audioUrl && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Audio Transmission Call Log</span>
                      <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col justify-center h-40">
                        <audio src={incident.audioUrl} controls className="w-full text-slate-900" />
                        <span className="block text-center text-[10px] text-slate-500 mt-2 font-mono">
                          PCM webm stream preserved
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (Right, 1 column) */}
          <div className="space-y-6">
            
            {/* Action Response Updates for Admin / Officers */}
            {currentUserRole !== "Citizen" && (
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                  <Workflow className="h-5 w-5 text-amber-500" />
                  <h3 className="font-display font-bold text-sm text-slate-200">Emergency Dispatch Controls</h3>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1">
                      Update Ticket Status
                    </label>
                    <select
                      value={selectedStatus || incident.status}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-red-500"
                    >
                      {statuses.map((stat) => (
                        <option key={stat} value={stat}>
                          {stat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1">
                      Re-route Department Team
                    </label>
                    <select
                      value={selectedDept || incident.assignedDepartment}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-red-500"
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all uppercase text-[10px] tracking-wider mt-2 shadow"
                  >
                    {updating ? "Executing Update..." : "Confirm Dispatch Route"}
                  </button>
                </div>
              </div>
            )}

            {/* Reporter Profile Box */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-3 text-xs">
              <h4 className="font-display font-bold text-slate-200 border-b border-slate-850 pb-2 mb-2">
                Reporter Dossier
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Full Name</span>
                  <strong className="text-slate-300">{incident.reporterName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact callback</span>
                  <strong className="text-slate-300">{incident.phone}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered</span>
                  <strong className="text-slate-300">
                    {new Date(incident.createdAt).toLocaleDateString()}
                  </strong>
                </div>
              </div>
            </div>

            {/* Visual Response Timeline */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
                <History className="h-4.5 w-4.5 text-slate-400" />
                <h3 className="font-display font-bold text-xs text-slate-200">Incident Triage Progression</h3>
              </div>

              {/* Progress Stepper list */}
              <div className="space-y-5">
                {statuses.map((step, idx) => {
                  const isCompleted = idx < currentStepIndex;
                  const isActive = idx === currentStepIndex;
                  return (
                    <div key={step} className="flex gap-3 relative">
                      {/* Connecting vertical line */}
                      {idx < statuses.length - 1 && (
                        <div
                          className={`absolute left-[7px] top-4 w-0.5 h-10 ${
                            idx < currentStepIndex ? "bg-emerald-500" : "bg-slate-800"
                          }`}
                        />
                      )}

                      {/* Icon bubble */}
                      <div
                        className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 z-10 ${
                          isCompleted
                            ? "bg-emerald-500/25 border-emerald-500 text-emerald-400"
                            : isActive
                            ? "bg-amber-500/20 border-amber-500 text-amber-400 animate-pulse"
                            : "bg-slate-950 border-slate-800 text-slate-600"
                        }`}
                      >
                        {isCompleted && <span className="h-2 w-2 rounded-full bg-emerald-400" />}
                        {isActive && <span className="h-2 w-2 rounded-full bg-amber-400" />}
                      </div>

                      {/* Step metadata */}
                      <div className="text-xs">
                        <div
                          className={`font-semibold ${
                            isActive ? "text-slate-200" : isCompleted ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {step}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {isActive
                            ? "Current active stage in field"
                            : isCompleted
                            ? "Successfully verified and logs stored"
                            : "Triage milestone pending"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
