import {
  FileText,
  Volume2,
  Image as ImageIcon,
  ChevronRight,
  Database,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  ArrowDown,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { PageId } from "../types";

interface AiPipelinePageProps {
  onNavigate: (page: PageId) => void;
}

export default function AiPipelinePage({ onNavigate }: AiPipelinePageProps) {
  const pipelineStages = [
    {
      id: "ingestion",
      num: "01",
      title: "Multimodal Data Ingestion",
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10 border-blue-500/20",
      desc: "Emergency management endpoints consume text narratives, raw browser PCM audio call logs, and high-definition JPG/PNG visual evidence uploaded directly by citizen reporters.",
    },
    {
      id: "audio",
      num: "02",
      title: "Audio Transcription Pipeline",
      icon: Volume2,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10 border-indigo-500/20",
      desc: "Captured binary voice reports are sent to server-side transcription layers where spoken emergencies are rendered into structured textual parameters ready for language model synthesis.",
    },
    {
      id: "neural",
      num: "03",
      title: "Neural Gemini Processing",
      icon: Cpu,
      color: "text-red-500",
      bg: "bg-red-500/10 border-red-500/20",
      desc: "Our server transmits raw narratives, transcribing data, and raw image file matrices directly to Gemini AI model. The neural net performs semantic diagnostic threat valuation in real-time.",
    },
    {
      id: "schema",
      num: "04",
      title: "Strict JSON Structured Schema",
      icon: Layers,
      color: "text-orange-500",
      bg: "bg-orange-500/10 border-orange-500/20",
      desc: "Using JSON-schema guidelines, Gemini parses fields including isCrisis (boolean), crisisType (categorical), severity (Critical, High, Medium, Low), confidence, and recommendedDepartments.",
    },
    {
      id: "routing",
      num: "05",
      title: "Dynamic Municipal Router",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
      desc: "An intelligent heuristics router matches the AI-triage list against active station queues (Fire and Rescue, Police, Ambulance, Electricity), instantly scheduling division dispatch protocols.",
    },
    {
      id: "logging",
      num: "06",
      title: "Durable JSON Ledger Storage",
      icon: Database,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      desc: "The validated ticket object is committed to incidents.json on our server filesystem. Automated webhooks update active dashboards, enabling field responders to coordinate rescue operations.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 py-24 px-4 overflow-hidden">
      {/* Background Matrix Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        {/* Header section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5 text-red-500 animate-spin" />
            CrisisLens Intelligence Telemetry
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            AI Triage & Emergency Response Pipeline
          </h1>
          <p className="text-slate-400 text-sm">
            Inspect the high-speed data flow mapping live citizen incident inputs to neural dispatch routing protocols in under 2 seconds.
          </p>
        </div>

        {/* Visual Pipeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          
          {/* Loop over stages */}
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.id}
                className="bg-slate-900 border border-slate-850 rounded-2xl p-6 relative group hover:border-slate-800 transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  {/* Top line with stage ID */}
                  <div className="flex justify-between items-center pb-2 border-b border-slate-850 mb-4">
                    <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      Stage {stage.num}
                    </span>
                    <div className={`p-2 rounded-lg border ${stage.bg} ${stage.color}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-slate-200 text-sm group-hover:text-red-400 transition-colors">
                    {stage.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed mt-2.5">
                    {stage.desc}
                  </p>
                </div>

                {/* Decorative bottom element */}
                <div className="pt-4 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-850/40">
                  <span>TELEMETRY: ACTIVE</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Schema Preview card */}
        <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-4">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <h3 className="font-display font-bold text-base text-slate-200">
              Active Gemini AI JSON-Schema Validation Template
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
              <p>
                The CrisisLens server-side module enforces a strict typings schema during the prompt completion cycle. By instructing Gemini to output valid structured JSON objects directly, we eliminate raw textual parsing latency.
              </p>
              <p>
                Any submitted reports failing validation or registering low safety/confidence parameters automatically fall back onto a robust, high-availability local simulation routine to ensure uninterrupted emergency dispatch capabilities.
              </p>
              <div className="bg-slate-950/50 p-4 border border-slate-850 rounded-xl space-y-1.5 font-mono text-[10px]">
                <div className="text-slate-300 font-bold">🎯 Expected Category Schemas:</div>
                <div>"Fire Emergency", "Road Accident", "Medical Emergency", "Flood"</div>
                <div>"Building Collapse", "Electrical Hazard", "Natural Disaster", etc.</div>
              </div>
            </div>

            {/* Code Mirror Mockup */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between font-mono text-[10px] text-slate-500">
                <span>gemini_triage_schema.json</span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  STRICT_JSON
                </span>
              </div>
              <pre className="p-4 font-mono text-[11px] text-emerald-400 leading-relaxed overflow-x-auto select-none">
{`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "isCrisis": { "type": "boolean" },
    "crisisType": { "type": "string" },
    "severity": { "enum": ["Critical", "High", "Medium", "Low"] },
    "confidence": { "type": "integer", "minimum": 0, "maximum": 100 },
    "summary": { "type": "string" },
    "extractedLocation": { "type": "string" },
    "recommendedDepartments": { 
      "type": "array", 
      "items": { "type": "string" } 
    }
  },
  "required": ["isCrisis", "crisisType", "severity", "confidence"]
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-900">
          <button
            onClick={() => onNavigate("landing")}
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition-all"
          >
            Back to Hub Landing
          </button>
          
          <button
            onClick={() => onNavigate("report")}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            Test Triage Pipeline Now
          </button>
        </div>

      </div>
    </div>
  );
}
