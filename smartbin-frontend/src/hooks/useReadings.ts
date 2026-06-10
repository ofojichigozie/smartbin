import { useState, useEffect, useCallback } from 'react';
import { readingService, Reading } from '@/services/reading.service';

export const useReadings = (binId?: string, limit = 50) => {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReadings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = binId
        ? await readingService.getByBin(binId, limit)
        : await readingService.getAll(undefined, limit);
      setReadings(data);
    } catch {
      setError('Failed to load readings');
    } finally {
      setLoading(false);
    }
  }, [binId, limit]);

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

  const deleteReading = async (id: string) => {
    await readingService.delete(id);
    setReadings((prev) => prev.filter((r) => r._id !== id));
  };

  return { readings, loading, error, refetch: fetchReadings, deleteReading };
};
