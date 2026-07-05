import { ShieldAlert, ShieldCheck, MapPin, Phone, User, Calendar, Cpu, Layers, ClipboardCheck, ArrowRight } from "lucide-react";
import { Incident, PageId } from "../types";

interface AnalysisResultPageProps {
  incident: Incident | null;
  onNavigate: (page: PageId) => void;
}

export default function AnalysisResultPage({ incident, onNavigate }: AnalysisResultPageProps) {
  if (!incident) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto animate-pulse" />
          <h2 className="text-xl font-bold">No active incident triaged</h2>
          <button
            onClick={() => onNavigate("report")}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
          >
            Go Report Emergency
          </button>
        </div>
      </div>
    );
  }

  // Get color for severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "High":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "Medium":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      default:
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />

      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10 space-y-8">
        
        {/* Top Triage Banner */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-500 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  TICKET: {incident.id}
                </span>
                <span className="h-1 w-1 bg-slate-600 rounded-full" />
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  STATUS: {incident.status}
                </span>
              </div>
              <h2 className="font-display text-xl font-extrabold text-slate-200 mt-0.5">
                AI Triage Verification Completed Successfully
              </h2>
              <p className="text-slate-400 text-xs mt-0.5 max-w-xl">
                Incident has been logged securely in our persistent database. Dispatchers and recommended department teams have been notified.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("landing")}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-xl text-xs font-semibold text-slate-300 transition-colors shrink-0"
          >
            Back to Home
          </button>
        </div>

        {/* Main Two Column layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Column 1: AI Analysis Metadata (3 columns wide) */}
          <div className="md:col-span-3 space-y-6">
            <div className="border border-slate-850 bg-slate-950/60 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-red-500" />
                  <h3 className="font-display font-bold text-slate-200">Gemini Neural Diagnostics</h3>
                </div>
                <div className="font-mono text-[11px] text-slate-500 uppercase">
                  Confidence: <span className="text-emerald-400 font-bold">{incident.confidence}%</span>
                </div>
              </div>

              {/* Severity & Crisis Type Indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-850">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Incident Type</div>
                  <div className="text-sm font-bold text-slate-200 mt-1">{incident.crisisType}</div>
                </div>
                <div className={`p-3 rounded-xl border ${getSeverityColor(incident.severity)}`}>
                  <div className="text-[10px] font-mono uppercase font-semibold text-slate-400">Severity Tier</div>
                  <div className="text-sm font-bold mt-1 uppercase tracking-wide">{incident.severity}</div>
                </div>
              </div>

              {/* Structured AI Summary */}
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase font-semibold mb-1">
                  Automated Dispatch Summary
                </label>
                <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl text-xs leading-relaxed text-slate-300">
                  {incident.summary}
                </div>
              </div>

              {/* Recommended Departments */}
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase font-semibold mb-2">
                  Recommended Division Routers
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {incident.recommendedDepartments?.map((dept, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-red-500/5 border border-red-500/10 rounded-lg text-xs font-semibold text-red-400"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Assigned Responder */}
              <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Layers className="h-4 w-4 text-slate-500" />
                  <span>Immediate Route Assigned:</span>
                </div>
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg font-bold">
                  {incident.assignedDepartment}
                </span>
              </div>
            </div>

            {/* Media Previews (If present) */}
            {(incident.imageUrl || incident.audioUrl) && (
              <div className="border border-slate-850 bg-slate-950/60 rounded-2xl p-6 space-y-4">
                <h4 className="font-display text-sm font-bold text-slate-200">Incident Media Records</h4>
                
                {incident.imageUrl && (
                  <div>
                    <div className="text-[10px] font-mono text-slate-500 mb-1.5 uppercase">Captured Incident Image</div>
                    <img
                      src={incident.imageUrl}
                      alt="Incident Evidence"
                      referrerPolicy="no-referrer"
                      className="w-full h-48 object-cover rounded-xl border border-slate-800"
                    />
                  </div>
                )}

                {incident.audioUrl && (
                  <div className="pt-2">
                    <div className="text-[10px] font-mono text-slate-500 mb-1.5 uppercase">Captured Audio Call Log</div>
                    <audio src={incident.audioUrl} controls className="w-full text-slate-900 bg-slate-900 p-1 rounded-xl border border-slate-800" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Column 2: User Inputs Metadata (2 columns wide) */}
          <div className="md:col-span-2 space-y-6">
            <div className="border border-slate-850 bg-slate-950/40 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                <ClipboardCheck className="h-5 w-5 text-slate-400" />
                <h3 className="font-display font-bold text-slate-200">Submitted Reporter Details</h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <User className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Reporter</div>
                    <div className="text-slate-300 font-semibold mt-0.5">{incident.reporterName}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Phone Callback</div>
                    <div className="text-slate-300 font-semibold mt-0.5">{incident.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Reported Location</div>
                    <div className="text-slate-300 font-semibold mt-0.5 leading-relaxed">{incident.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Registered Date/Time</div>
                    <div className="text-slate-300 font-semibold mt-0.5">
                      {new Date(incident.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Original description box */}
            <div className="border border-slate-850 bg-slate-950/40 rounded-2xl p-6">
              <h4 className="text-[10px] font-mono text-slate-500 uppercase mb-2">Original Narrative</h4>
              <p className="text-xs text-slate-400 leading-relaxed italic bg-slate-900/40 p-3 rounded-xl border border-slate-850">
                "{incident.description}"
              </p>
            </div>

            {/* Action Card to Pipeline Visualizer */}
            <div className="bg-gradient-to-br from-red-950/20 to-slate-950 border border-red-900/10 rounded-2xl p-5 space-y-3.5 text-center">
              <h4 className="font-display text-xs font-bold text-red-400">Want to see how Gemini analyzed this?</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Observe the live telemetry process mapping textual parsing, location scraping, and arcing department routing pipelines.
              </p>
              <button
                onClick={() => onNavigate("ai-pipeline")}
                className="w-full py-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 rounded-xl text-xs font-bold text-red-400 transition-all flex items-center justify-center gap-1.5"
              >
                Inspect AI Pipeline <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-slate-850 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <button
            onClick={() => onNavigate("report")}
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all"
          >
            File Another Emergency Report
          </button>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => onNavigate("login")}
              className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              Access Admin Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
