import { ArrowRight, Cpu, ShieldAlert, Navigation, FileImage, MapPin, BarChart3, ShieldCheck } from "lucide-react";
import { PageId } from "../types";

interface LandingPageProps {
  onNavigate: (page: PageId) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      title: "AI Crisis Detection",
      desc: "Instant text and sound categorization using Gemini 3.5 models to classify active threats under 9 distinct civil emergency types.",
      icon: Cpu,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Smart Severity Analysis",
      desc: "Intelligent triage matrix automatically calculating emergency tier rankings from Critical to Low based on semantic impact.",
      icon: ShieldAlert,
      color: "text-red-500 bg-red-500/10 border-red-500/20",
    },
    {
      title: "Automatic Department Routing",
      desc: "Smart dispatch triggers recommend and route active folders straight to Fire, Police, Medical, Electricity, or Disaster teams.",
      icon: Navigation,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Multimodal Reporting",
      desc: "Enables citizens to upload emergency photos and speak voice reports parsed live by Gemini's multimodal audio-visual understanding.",
      icon: FileImage,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Real-Time Incident Mapping",
      desc: "Visual interactive tactical boards rendering citizen reports live on OpenStreetMap with color-coded threat clusters.",
      icon: MapPin,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Emergency Analytics",
      desc: "Comprehensive operational dashboards rendering dispatch stats, department workload, average response rates, and weekly trends.",
      icon: BarChart3,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Dynamic Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />

      {/* Decorative Blur Spheres */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-red-900/10 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-900/15 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
        {/* Banner Announcement */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 text-xs text-slate-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">System Live:</span>
            <span>Gemini-powered Emergency Response Engine active</span>
          </div>
        </div>

        {/* Hero Area */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <ShieldCheck className="h-10 w-10 text-red-500" />
            </div>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400">
            AI-Powered Crisis Detection<br />
            <span className="text-red-500 font-bold">and Emergency Response</span>
          </h1>
          <p className="font-sans text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            CrisisLens AI analyzes citizen emergency reports in real-time using artificial intelligence to identify incident type, severity, location extraction, and automatically routes files to the appropriate responder teams.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => onNavigate("report")}
              className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl font-semibold shadow-lg shadow-red-600/20 hover:shadow-red-600/35 transition-all flex items-center justify-center gap-2"
            >
              Report Active Emergency
              <ArrowRight className="h-5 w-5 animate-pulse" />
            </button>
            <button
              onClick={() => onNavigate("login")}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              Access Command Center
            </button>
          </div>
        </div>

        {/* Tactical Features Grid */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-200 mb-3">
              Comprehensive Disaster Operations Matrix
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Fully integrated automated responder pipeline, built to accelerate response dispatch from minutes to split seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/50 border border-slate-900 hover:border-slate-800 rounded-2xl p-6 transition-all hover:bg-slate-900 group"
                >
                  <div className={`p-3 rounded-xl border w-fit mb-4 ${feat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-slate-200 mb-2 group-hover:text-white transition-colors">
                    {feat.title}
                  </h3>
                  <p className="font-sans text-sm text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operational Statistics Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-900 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/5 rounded-full filter blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full filter blur-2xl pointer-events-none" />
          
          <h3 className="font-display text-2xl font-bold text-slate-200 mb-4">
            Designed for Critical Infrastructure Triage
          </h3>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto mb-8">
            CrisisLens AI deploys LLMs, multimodal computer vision and speech-to-text models directly into local government workflows, guaranteeing secure, real-time dispatcher coordination when seconds count.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-slate-900">
            <div>
              <div className="font-display text-3xl font-extrabold text-red-500">98%</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 mt-1">Triage Confidence</div>
            </div>
            <div>
              <div className="font-display text-3xl font-extrabold text-slate-200">&lt; 3.5s</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 mt-1">Analysis Latency</div>
            </div>
            <div>
              <div className="font-display text-3xl font-extrabold text-slate-200">100%</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 mt-1">Local Persistence</div>
            </div>
            <div>
              <div className="font-display text-3xl font-extrabold text-emerald-500">Zero</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 mt-1">Exposed secrets</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
