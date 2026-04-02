import { useState, useEffect, useCallback } from 'react';
import { getCampaign, Campaign } from '@/lib/contract';

interface UseCampaignReturn {
  campaign: Campaign | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCampaign(contractId: string): UseCampaignReturn {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaign = useCallback(async () => {
    if (!contractId) {
       setIsLoading(false);
       return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCampaign();
      setCampaign(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load campaign');
    } finally {
      setIsLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    fetchCampaign();
    // Poll every 15 seconds for real-time updates
    const interval = setInterval(fetchCampaign, 15_000);
    return () => clearInterval(interval);
  }, [fetchCampaign]);

  return { campaign, isLoading, error, refetch: fetchCampaign };
}
