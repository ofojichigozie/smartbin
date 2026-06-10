import { Bin } from '@/services/bin.service';
import FillGauge from '@/components/ui/FillGauge';
import StatusBadge from '@/components/ui/StatusBadge';
import { MapPin, Ruler } from 'lucide-react';

interface BinCardProps {
  bin: Bin;
}

const BinCard = ({ bin }: BinCardProps) => {
  const fill = bin.latestReading?.fillPercentage ?? 0;
  const lastSeen = bin.latestReading
    ? new Date(bin.latestReading.timestamp).toLocaleString()
    : 'No data yet';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-4">
      <div className="w-full flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-gray-800 text-base">{bin.name}</h2>
          <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
            <MapPin size={11} />
            {bin.location}
          </p>
        </div>
        <StatusBadge percentage={fill} />
      </div>

      <FillGauge percentage={fill} />

      <div className="w-full grid grid-cols-2 gap-3 text-center">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-0.5">Distance</p>
          <p className="text-sm font-semibold text-gray-700">
            {bin.latestReading ? `${bin.latestReading.distanceCm} cm` : '—'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-0.5">
            <Ruler size={10} /> Bin Height
          </p>
          <p className="text-sm font-semibold text-gray-700">{bin.heightCm} cm</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 self-start">Last updated: {lastSeen}</p>
    </div>
  );
};

export default BinCard;
