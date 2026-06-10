import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Reading } from '@/services/reading.service';

interface FillChartProps {
  readings: Reading[];
  warningThreshold: number;
  criticalThreshold: number;
}

const FillChart = ({ readings, warningThreshold, criticalThreshold }: FillChartProps) => {
  const chartData = [...readings].reverse().map((r) => ({
    time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    fill: r.fillPercentage,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <h3 className="font-semibold text-gray-800 mb-4">Fill Level History</h3>
      <div className="flex-1 min-h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            unit="%"
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, 'Fill Level']}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }}
          />
          <ReferenceLine
            y={warningThreshold}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={{ value: 'Warning', fontSize: 10, fill: '#f59e0b' }}
          />
          <ReferenceLine
            y={criticalThreshold}
            stroke="#ef4444"
            strokeDasharray="4 4"
            label={{ value: 'Critical', fontSize: 10, fill: '#ef4444' }}
          />
          <Area
            type="monotone"
            dataKey="fill"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#fillGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#10b981' }}
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FillChart;
