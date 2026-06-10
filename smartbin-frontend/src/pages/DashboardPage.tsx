import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import BinCard from '@/components/dashboard/BinCard';
import FillChart from '@/components/dashboard/FillChart';
import ReadingsTable from '@/components/dashboard/ReadingsTable';
import { useBin } from '@/hooks/useBin';
import { useReadings } from '@/hooks/useReadings';
import { requestNotificationPermission } from '@/utils/notifications';

const DashboardPage = () => {
  const { bin, loading, error } = useBin();
  const { readings, loading: readingsLoading, deleteReading } = useReadings(bin?.binId, 50);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Real-time waste bin fill level monitoring</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm animate-pulse">
          Loading bin data…
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {!loading && !error && bin && (
        <div className="space-y-4">
          {/* Bin card + chart side-by-side on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 items-stretch">
            <BinCard bin={bin} />
            {readingsLoading ? (
              <div className="min-h-64 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ) : (
              <FillChart
                readings={readings}
                warningThreshold={bin.warningThreshold}
                criticalThreshold={bin.criticalThreshold}
              />
            )}
          </div>

          <ReadingsTable readings={readings} onDelete={deleteReading} />
        </div>
      )}
    </AppLayout>
  );
};

export default DashboardPage;
