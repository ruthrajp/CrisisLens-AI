import { useEffect, useRef } from "react";
import L from "leaflet";
import { Incident } from "../types";

interface LeafletMapProps {
  incidents: Incident[];
  selectedIncident?: Incident | null;
  onSelectIncident?: (incident: Incident) => void;
  severityFilter?: string;
  typeFilter?: string;
  statusFilter?: string;
  center?: [number, number];
  zoom?: number;
}

export default function LeafletMap({
  incidents,
  selectedIncident,
  onSelectIncident,
  severityFilter = "all",
  typeFilter = "all",
  statusFilter = "all",
  center = [11.0168, 76.9558], // Coimbatore default center
  zoom = 13,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Severity color resolver
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "#ef4444"; // Emergency Red
      case "High":
        return "#f97316"; // Alert Orange
      case "Medium":
        return "#eab308"; // Warning Yellow
      case "Low":
        return "#3b82f6"; // Blue
      default:
        return "#94a3b8";
    }
  };

  // Severity bg resolver
  const getSeverityBgClass = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500 shadow-red-500/50";
      case "High":
        return "bg-orange-500 shadow-orange-500/50";
      case "Medium":
        return "bg-yellow-500 shadow-yellow-500/50";
      case "Low":
        return "bg-blue-500 shadow-blue-500/50";
      default:
        return "bg-slate-400 shadow-slate-400/50";
    }
  };

  // Status border resolver
  const getStatusBorder = (status: string) => {
    switch (status) {
      case "Resolved":
        return "border-emerald-500";
      case "In Progress":
        return "border-amber-500 animate-pulse";
      case "Team Dispatched":
        return "border-orange-500";
      case "Acknowledged":
        return "border-sky-500";
      case "New":
        return "border-rose-500 animate-ping";
      default:
        return "border-slate-400";
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
      }).setView(center, zoom);

      // Add modern dark styled map tiles using CartoDB Dark Matter
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(mapInstanceRef.current);
    } else {
      // If map exists, pan to center if it changed
      mapInstanceRef.current.setView(center, zoom);
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Filter incidents
    const filteredIncidents = incidents.filter((inc) => {
      const matchSev = severityFilter === "all" || inc.severity === severityFilter;
      const matchType = typeFilter === "all" || inc.crisisType === typeFilter;
      const matchStatus = statusFilter === "all" || inc.status === statusFilter;
      return matchSev && matchType && matchStatus;
    });

    // Populate markers
    filteredIncidents.forEach((inc) => {
      const lat = inc.latitude || center[0];
      const lng = inc.longitude || center[1];

      const markerColor = getSeverityColor(inc.severity);
      const bgClass = getSeverityBgClass(inc.severity);
      const statusClass = getStatusBorder(inc.status);

      // Use elegant HTML DivIcon for custom look and feel matching our dark command style
      const customIcon = L.divIcon({
        className: "custom-marker-icon",
        html: `
          <div class="relative flex items-center justify-center w-8 h-8">
            <span class="absolute inline-flex w-full h-full rounded-full opacity-75 ${inc.severity === 'Critical' ? 'animate-ping bg-red-400' : ''}"></span>
            <div class="w-5 h-5 rounded-full ${bgClass} border-2 border-slate-900 shadow-lg flex items-center justify-center text-[10px] text-white font-bold">
              ${inc.crisisType.charAt(0)}
            </div>
            <div class="absolute -bottom-1 w-2 h-2 rounded-full border-2 ${statusClass} bg-slate-900"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Popup Content matching dark dashboard theme
      const popupContent = `
        <div class="text-slate-100 bg-slate-950 p-2 rounded border border-slate-800 text-xs font-sans max-w-xs" style="min-width: 180px;">
          <div class="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-800">
            <span class="font-mono text-[10px] text-slate-400">${inc.id}</span>
            <span class="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider" style="background-color: ${markerColor}20; color: ${markerColor}; border: 1px solid ${markerColor}40">
              ${inc.severity}
            </span>
          </div>
          <h4 class="font-bold text-slate-200 mb-0.5">${inc.crisisType}</h4>
          <p class="text-slate-400 text-[11px] leading-relaxed mb-1">${inc.location}</p>
          <div class="flex items-center justify-between mt-2 pt-1 border-t border-slate-900 text-[10px]">
            <span class="text-slate-500">Status: <strong class="text-slate-300">${inc.status}</strong></span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: "dark-popup-theme",
        closeButton: false,
      });

      // Handle marker selection clicks
      marker.on("click", () => {
        if (onSelectIncident) {
          onSelectIncident(inc);
        }
      });

      // Maintain ref to markers to clean them up
      markersRef.current.push(marker);
    });

    // Handle selected incident zoom/pan focus
    if (selectedIncident) {
      const sLat = selectedIncident.latitude;
      const sLng = selectedIncident.longitude;
      if (sLat && sLng) {
        map.setView([sLat, sLng], 15, { animate: true });
        // Find and trigger popup
        const idx = filteredIncidents.findIndex((i) => i.id === selectedIncident.id);
        if (idx !== -1 && markersRef.current[idx]) {
          markersRef.current[idx].openPopup();
        }
      }
    }

    // Force map sizing update after load/renders
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      // Map cleanup on destruction is fully handled
    };
  }, [incidents, selectedIncident, severityFilter, typeFilter, statusFilter, center, zoom]);

  // Clean up completely on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[350px] border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
      <div id="leaflet-map-element" ref={mapContainerRef} className="w-full h-full absolute inset-0" />
      {incidents.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-10 text-slate-400 font-mono text-sm">
          No incident data available to map.
        </div>
      )}
    </div>
  );
}
