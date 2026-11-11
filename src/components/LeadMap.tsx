import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Lead } from '../types';
import { MessageCircle, Eye, Star, MapPin } from 'lucide-react';

interface LeadMapProps {
  leads: Lead[];
  onOpenPitch: (lead: Lead) => void;
  onOpenAudit: (lead: Lead) => void;
}

// Custom map recenter controller
const MapRecenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 12, { duration: 1.2 });
  }, [center, map]);
  return null;
};

export const LeadMap: React.FC<LeadMapProps> = ({
  leads,
  onOpenPitch,
  onOpenAudit
}) => {
  const defaultCenter: [number, number] = leads.length > 0 && leads[0].lat && leads[0].lng
    ? [leads[0].lat, leads[0].lng]
    : [-23.5505, -46.6333];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl h-[620px] flex flex-col relative">
      
      {/* Map Header & Legend */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-10 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-brand-400" />
          <span className="text-sm font-bold text-white">Mapa de Empresas Auditadas ({leads.length})</span>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center space-x-1 text-red-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            <span>Sem Site</span>
          </span>
          <span className="flex items-center space-x-1 text-amber-300 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>Sem Landing Page</span>
          </span>
          <span className="flex items-center space-x-1 text-purple-300 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
            <span>Só Instagram</span>
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 w-full h-full relative z-0">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <MapRecenter center={defaultCenter} />
          
          {/* Dark / Modern Map Tiles with API Key */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_56l4_1_afedf8c3415a5b372e6eb0f0"
          />

          {leads.map((lead) => {
            if (!lead.lat || !lead.lng) return null;

            const iconHtml = createCustomPinHtml(lead.websiteStatus, lead.opportunityScore);
            const customIcon = L.divIcon({
              className: 'custom-lead-pin',
              html: iconHtml,
              iconSize: [28, 28],
              iconAnchor: [14, 28],
              popupAnchor: [0, -28]
            });

            return (
              <Marker
                key={lead.id}
                position={[lead.lat, lead.lng]}
                icon={customIcon}
              >
                <Popup>
                  <div className="min-w-[220px] max-w-[280px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                        {lead.category}
                      </span>
                      <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">
                        Score {lead.opportunityScore}%
                      </span>
                    </div>

                    <h4 className="font-extrabold text-white text-sm leading-snug mb-1">
                      {lead.name}
                    </h4>

                    {lead.rating !== undefined && (
                      <div className="flex items-center space-x-1 text-amber-400 text-xs mb-2">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="font-bold">{lead.rating}</span>
                        <span className="text-slate-400">({lead.reviewsCount ?? 0} reviews)</span>
                      </div>
                    )}

                    <p className="text-[11px] text-slate-300 mb-2 leading-relaxed">
                      {lead.address}
                    </p>

                    <div className="pt-2 border-t border-slate-700/80 flex items-center space-x-1.5">
                      <button
                        onClick={() => onOpenPitch(lead)}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1 shadow"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => onOpenAudit(lead)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs"
                        title="Ver Auditoria"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-400" />
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

    </div>
  );
};

function createCustomPinHtml(status: Lead['websiteStatus'], score: number): string {
  let bgColor = '#ef4444'; // Red
  if (status === 'NO_LANDING_PAGE') bgColor = '#f59e0b'; // Amber
  if (status === 'SOCIAL_ONLY') bgColor = '#a855f7'; // Purple
  if (status === 'HAS_WEBSITE') bgColor = '#10b981'; // Emerald

  return `
    <div style="
      background-color: ${bgColor};
      width: 26px;
      height: 26px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid #ffffff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    ">
      <div style="
        transform: rotate(45deg);
        color: white;
        font-size: 10px;
        font-weight: 800;
        font-family: sans-serif;
      ">
        ${score >= 85 ? '★' : '•'}
      </div>
    </div>
  `;
}
