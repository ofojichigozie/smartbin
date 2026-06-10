import { Trash2 } from 'lucide-react';
import { Reading } from '@/services/reading.service';
import { notify } from '@/utils/notifications';

interface ReadingsTableProps {
  readings: Reading[];
  onDelete: (id: string) => Promise<void>;
}

const ReadingsTable = ({ readings, onDelete }: ReadingsTableProps) => {
  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      notify.success('Reading deleted');
    } catch {
      notify.error('Failed to delete reading');
    }
  };

  if (readings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400 text-sm">
        No readings recorded yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Recent Readings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-6 py-3 text-left">Timestamp</th>
              <th className="px-6 py-3 text-left">Fill Level</th>
              <th className="px-6 py-3 text-left">Distance</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {readings.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-gray-600 whitespace-nowrap">
                  {new Date(r.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${r.fillPercentage}%`,
                          backgroundColor:
                            r.fillPercentage >= 95
                              ? '#ef4444'
                              : r.fillPercentage >= 80
                                ? '#f59e0b'
                                : '#10b981',
                        }}
                      />
                    </div>
                    <span className="font-medium text-gray-700">{r.fillPercentage}%</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-gray-600">{r.distanceCm} cm</td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete reading"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReadingsTable;
