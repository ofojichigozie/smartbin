import { useState, useEffect, useCallback } from 'react';
import { binService, Bin } from '@/services/bin.service';
import { getSocket } from '@/services/socket.service';
import { Reading } from '@/services/reading.service';
import { notify } from '@/utils/notifications';

export const useBin = () => {
  const [bin, setBin] = useState<Bin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBin = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await binService.getAll();
      setBin(data[0] ?? null);
    } catch {
      setError('Failed to load bin');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBin();

    const socket = getSocket();

    socket.on('bin:reading', (payload: Reading) => {
      setBin((prev) =>
        prev?.binId === (payload as Reading & { binId: string }).binId
          ? { ...prev, latestReading: payload }
          : prev,
      );
    });

    socket.on(
      'bin:alert',
      (payload: { binName: string; fillPercentage: number; level: 'warning' | 'critical' }) => {
        notify.binAlert(payload.binName, payload.fillPercentage, payload.level);
      },
    );

    return () => {
      socket.off('bin:reading');
      socket.off('bin:alert');
    };
  }, [fetchBin]);

  return { bin, loading, error, refetch: fetchBin };
};
