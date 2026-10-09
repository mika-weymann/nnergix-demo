import 'leaflet/dist/leaflet.css';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { siteTodayKwh } from '../../data/portfolio';
import type { Site, Status } from '../../data/types';
import { kwh } from '../../lib/format';
import { Badge } from '../ui/Badge';

const COLORS: Record<Status, string> = { ok: '#16A34A', underperforming: '#D97706', offline: '#DC2626' };
const LABELS: Record<Status, string> = { ok: 'Working', underperforming: 'Underperforming', offline: 'Offline' };
const TONES = { ok: 'ok', underperforming: 'warn', offline: 'alert' } as const;

export default function PortfolioMap({ sites, height = 460 }: { sites: Site[]; height?: number }) {
  return (
    <div>
      <div style={{ height }} role="region" aria-label={`Map of ${sites.length} rooftops around Barcelona, coloured by status`}>
        <MapContainer bounds={[[41.315, 2.05], [41.475, 2.23]]} boundsOptions={{ padding: [8, 8] }} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            maxZoom={16}
          />
          {sites.map((s) => (
            <CircleMarker
              key={s.id}
              center={[s.lat, s.lng]}
              radius={s.status === 'ok' ? 5 : 7}
              pathOptions={{ color: '#fff', weight: 1.5, fillColor: COLORS[s.status], fillOpacity: 0.95 }}
            >
              <Popup>
                <div className="min-w-[200px] space-y-1.5 text-sm">
                  <p className="m-0 font-semibold text-ink">{s.name}</p>
                  <Badge tone={TONES[s.status]}>{LABELS[s.status]}</Badge>
                  <p className="m-0">
                    {s.kWp.toFixed(1)} kWp · {kwh(siteTodayKwh(s))} kWh so far today
                  </p>
                  <Link to={`/app/site/${s.id}`} className="font-medium text-brand-700">
                    Open site →
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      <ul className="mt-3 flex flex-wrap gap-4 text-xs text-body" aria-label="Map legend">
        {(Object.keys(COLORS) as Status[]).map((st) => (
          <li key={st} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: COLORS[st] }} aria-hidden />
            {LABELS[st]}
          </li>
        ))}
      </ul>
    </div>
  );
}
