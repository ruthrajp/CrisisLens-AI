import React, { useState, useRef } from "react";
import {
  ShieldAlert,
  User,
  Phone,
  FileText,
  Image as ImageIcon,
  Mic,
  Square,
  Trash2,
  MapPin,
  Compass,
  ArrowRight,
  Upload,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Incident, PageId } from "../types";

interface ReportPageProps {
  onSubmitReport: (formData: any) => Promise<void>;
  onNavigate: (page: PageId) => void;
  isSubmitting: boolean;
}

export default function ReportPage({ onSubmitReport, onNavigate, isSubmitting }: ReportPageProps) {
  // Input states
  const [reporterName, setReporterName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [crisisCategory, setCrisisCategory] = useState("Fire Emergency");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // File states (Image)
  const [imageBase64, setImageBase64] = useState<string>("");
  const [imageMimeType, setImageMimeType] = useState<string>("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // File states (Voice Recording)
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioBase64, setAudioBase64] = useState<string>("");
  const [audioMimeType, setAudioMimeType] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // UI helpers
  const [micError, setMicError] = useState("");
  const [gpsError, setGpsError] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Crisis Categories
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

  // Geolocation handling
  const handleUseCurrentLocation = () => {
    setGpsLoading(true);
    setGpsError("");

    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);

        // Simulated high-fidelity location name lookup based on coordinates
        let detectedStreet = "Gandhipuram Sector 4";
        if (lat > 11.01) detectedStreet = "Race Course Road, Central Park";
        else if (lat < 10.99) detectedStreet = "Sungam Bypass, near Lake";

        setLocation(`${detectedStreet} (GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)})`);
        setGpsLoading(false);
      },
      (error) => {
        console.error("GPS error:", error);
        setGpsError("GPS Access Denied. Falling back to Central Command Station (Coimbatore Central).");
        // Fallback coordinates
        setLatitude(11.0168);
        setLongitude(76.9558);
        setLocation("Coimbatore Central Command (Manual Entry Suggested)");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Convert File to Base64 helper
  const convertFileToBase64 = (file: File | Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Image upload handling
  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    setImageMimeType(file.type);
    setImagePreviewUrl(URL.createObjectURL(file));

    try {
      const base64 = await convertFileToBase64(file);
      setImageBase64(base64);
    } catch (err) {
      console.error("Failed to parse image file:", err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // Browser Microphone Voice controls
  const handleStartRecording = async () => {
    setMicError("");
    audioChunksRef.current = [];

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError("Voice reporting is not supported on this browser or environment.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioMimeType("audio/webm");
        setAudioUrl(URL.createObjectURL(blob));

        try {
          const base64 = await convertFileToBase64(blob);
          setAudioBase64(base64);
        } catch (err) {
          console.error("Audio arcing error:", err);
        }

        // Stop all track streams to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(250); // Capture chunks every 250ms
      setIsRecording(true);
    } catch (err: any) {
      console.error("Mic Access Error:", err);
      setMicError("Microphone permission denied. Please allow microphone permissions in your browser bar.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleDeleteRecording = () => {
    setAudioBlob(null);
    setAudioBase64("");
    setAudioMimeType("");
    setAudioUrl("");
  };

  // Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName || !phone) {
      alert("Please provide your name and phone number for responder alerts.");
      return;
    }
    if (!description && !audioBase64) {
      alert("Please enter an emergency description or record a voice memo.");
      return;
    }

    const reportPayload = {
      reporterName,
      phone,
      description,
      location: location || "Coimbatore Central (Manual Entry Missing)",
      latitude: latitude || 11.0168,
      longitude: longitude || 76.9558,
      imageBase64,
      imageMimeType,
      audioBase64,
      audioMimeType,
    };

    await onSubmitReport(reportPayload);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />

      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10">
        <div className="border-b border-slate-800 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-500">
                ACTIVE TRIAGE FEED
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-100">
              Submit Emergency Incident Report
            </h1>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Fill in the details below. Our Gemini 3.5 AI pipeline will instantly analyze, extract critical threat summaries, and alert relevant departments.
            </p>
          </div>
          <button
            onClick={() => onNavigate("landing")}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-colors self-start sm:self-center"
          >
            Cancel Report
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Reporter Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Reporter Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-500 text-white placeholder-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Callback Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Phone className="h-4 w-4" />
                </span>
                <input
                  type="tel"
                  required
                  placeholder="+91 XXXXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-500 text-white placeholder-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Incident Type Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Observed Crisis Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCrisisCategory(cat)}
                  className={`py-2 px-3 border rounded-xl text-xs font-medium transition-all text-left flex items-center justify-between ${
                    crisisCategory === cat
                      ? "bg-red-500/10 border-red-500 text-red-400 font-semibold"
                      : "bg-slate-950 border-slate-850 hover:border-slate-800 text-slate-300"
                  }`}
                >
                  <span>{cat}</span>
                  {crisisCategory === cat && (
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Location Input & Geolocation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Incident Location <span className="text-slate-500 font-normal">(Manual or GPS)</span>
              </label>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={gpsLoading}
                className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 font-semibold transition-colors disabled:opacity-50"
              >
                <Compass className={`h-4 w-4 ${gpsLoading ? "animate-spin text-red-400" : ""}`} />
                {gpsLoading ? "Acquiring GPS..." : "Use Current Location"}
              </button>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <MapPin className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Street address, neighborhood, landmark, or city sector"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-500 text-white placeholder-slate-600"
              />
            </div>

            {gpsError && (
              <div className="flex gap-1.5 p-2 bg-slate-950 rounded-lg text-[11px] text-orange-400 border border-orange-900/20">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                <span>{gpsError}</span>
              </div>
            )}
          </div>

          {/* Description Text area */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Emergency Description <span className="text-slate-500 font-normal">(Provide as much detail as possible)</span>
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-slate-500">
                <FileText className="h-4 w-4" />
              </span>
              <textarea
                rows={4}
                placeholder="What is happening? Describe the hazards, casualties, arcing structures, or ongoing dangers. Gemini AI parses this description to formulate an immediate emergency action report."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-500 text-white placeholder-slate-600 leading-relaxed"
              />
            </div>
          </div>

          {/* File Upload & Audio Recording Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Multimodal Image Drag-n-Drop */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Incident Image Attachment <span className="text-slate-500 font-normal">(Optional preview)</span>
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer min-h-[160px] transition-all ${
                  dragActive
                    ? "border-red-500 bg-red-500/5"
                    : imagePreviewUrl
                    ? "border-slate-800 bg-slate-950"
                    : "border-slate-800 hover:border-slate-700 bg-slate-950/40"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {imagePreviewUrl ? (
                  <div className="relative group w-full max-h-[140px] overflow-hidden rounded-xl">
                    <img
                      src={imagePreviewUrl}
                      alt="Emergency Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-[140px] object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs font-semibold text-white bg-red-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        <Trash2 className="h-3.5 w-3.5" /> Remove Photo
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl mb-2 text-slate-400">
                      <Upload className="h-5 w-5" />
                    </div>
                    <span className="text-xs text-slate-300 font-semibold mb-1">
                      Drag & Drop Photo Here
                    </span>
                    <span className="text-[10px] text-slate-500 leading-snug">
                      or click to browse local files<br />(Supports JPEG, PNG)
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Voice Memo Recording Controls */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Voice Emergency Broadcast <span className="text-slate-500 font-normal">(Optional transcript capture)</span>
              </label>

              <div className="border border-slate-800 bg-slate-950/40 rounded-2xl p-4 flex flex-col justify-center min-h-[160px]">
                {isRecording ? (
                  <div className="text-center py-2 space-y-3">
                    <div className="flex items-center justify-center gap-1">
                      <span className="h-3 w-3 bg-red-500 rounded-full animate-ping mr-1" />
                      <span className="text-xs font-mono font-bold text-red-500">RECORDING IN PROGRESS</span>
                    </div>
                    {/* Flashing audio equalizer nodes */}
                    <div className="flex items-center justify-center gap-1.5 h-6">
                      {[1, 2, 3, 4, 5, 4, 3, 2, 1, 3, 5, 4, 2].map((val, i) => (
                        <div
                          key={i}
                          className="bg-red-500 w-1 rounded-full animate-pulse"
                          style={{
                            height: `${val * 16}%`,
                            animationDelay: `${i * 100}ms`,
                          }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="px-4 py-1.5 bg-red-600 hover:bg-red-700 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 mx-auto"
                    >
                      <Square className="h-3.5 w-3.5 text-white fill-white" /> Stop Recording
                    </button>
                  </div>
                ) : audioUrl ? (
                  <div className="space-y-3">
                    <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-1.5 text-center font-semibold">
                      🎤 EMERGENCY AUDIO LOG READY FOR PIPELINE
                    </div>
                    <audio src={audioUrl} controls className="w-full h-8 px-1 mt-1 text-slate-900" />
                    <button
                      type="button"
                      onClick={handleDeleteRecording}
                      className="text-red-500 hover:text-red-400 text-[11px] font-bold flex items-center justify-center gap-1 mx-auto mt-2 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Discard Recording
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2 space-y-2">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl w-fit mx-auto text-slate-400">
                      <Mic className="h-5 w-5" />
                    </div>
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 mx-auto"
                    >
                      <Mic className="h-3.5 w-3.5 text-red-500" /> Record Emergency Call
                    </button>
                    <span className="block text-[10px] text-slate-500 leading-snug">
                      Speak clearly to dictate incident details for auto-transcription.
                    </span>
                  </div>
                )}

                {micError && (
                  <div className="flex gap-1 p-2 bg-red-950/10 rounded-lg text-[10px] text-red-400 border border-red-950/20 mt-2">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                    <span>{micError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit dispatch button */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Incidents are analyzed via Gemini multimodal framework.</span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-slate-850 text-white font-bold rounded-xl shadow-lg shadow-red-600/10 hover:shadow-red-600/25 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>AI Triaging & Analyzing...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-5 w-5 animate-pulse" />
                  <span>Analyze & Dispatch Responders</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
