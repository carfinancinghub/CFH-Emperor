/*
 * File: HaulerJobDetailsPage.tsx
 * Path: C:\CFH\frontend\src\components\hauler\HaulerJobDetailsPage.tsx
 * Purpose: Display details of a hauler's job in the CFH Marketplace
 * Author: CFH Dev Team
 * Date: 2025-07-22T15:33:00.000Z
 * Batch ID: Marketplace-072225
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import { analyticsApi } from '@/services/analyticsApi';
import { useParams } from 'react-router-dom';

type UserTier = 'Free' | 'Standard' | 'Premium' | 'Wow++';

interface JobDetails {
  jobId: string;
  title: string;
  pickupLocation: string;
  dropoffLocation: string;
  deliveryDate: string;
  price: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  haulerName: string;
  vehicleDetails?: {
    make: string;
    model: string;
    year: string;
  };
}

interface HaulerJobDetailsPageProps {
  userTier: UserTier;
}

const HaulerJobDetailsPage: React.FC<HaulerJobDetailsPageProps> = ({ userTier }) => {
  const { t } = useTranslation();
  const { jobId } = useParams<{ jobId: string }>();
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const hasPermission = (requiredTier: UserTier): boolean => {
    const tierLevels = { Free: 0, Standard: 1, Premium: 2, 'Wow++': 3 };
    return tierLevels[userTier] >= tierLevels[requiredTier];
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) {
        setError(t('haulerJobDetails.error.noJobId'));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await analyticsApi.getJobDetails(jobId);
        setJobDetails(response.data);
      } catch (err) {
        setError(t('haulerJobDetails.error.fetchFailed'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, t]);

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  if (error || !jobDetails) {
    return <div className="error-message">{error || t('haulerJobDetails.error.noData')}</div>;
  }

  return (
    <div className="hauler-job-details-container" role="main" aria-label={t('haulerJobDetails.title')}>
      <h1>{t('haulerJobDetails.title')}: {jobDetails.title}</h1>
      <div className="job-details">
        <p><strong>{t('haulerJobDetails.jobId')}:</strong> {jobDetails.jobId}</p>
        <p><strong>{t('haulerJobDetails.hauler')}:</strong> {jobDetails.haulerName}</p>
        <p><strong>{t('haulerJobDetails.pickup')}:</strong> {jobDetails.pickupLocation}</p>
        <p><strong>{t('haulerJobDetails.dropoff')}:</strong> {jobDetails.dropoffLocation}</p>
        <p><strong>{t('haulerJobDetails.date')}:</strong> {jobDetails.deliveryDate}</p>
        <p><strong>{t('haulerJobDetails.price')}:</strong> ${jobDetails.price.toLocaleString()}</p>
        <p><strong>{t('haulerJobDetails.status')}:</strong> {jobDetails.status}</p>
        {hasPermission('Premium') && jobDetails.vehicleDetails && (
          <div className="vehicle-details">
            <h2>{t('haulerJobDetails.vehicleDetails')}</h2>
            <p><strong>{t('haulerJobDetails.make')}:</strong> {jobDetails.vehicleDetails.make}</p>
            <p><strong>{t('haulerJobDetails.model')}:</strong> {jobDetails.vehicleDetails.model}</p>
            <p><strong>{t('haulerJobDetails.year')}:</strong> {jobDetails.vehicleDetails.year}</p>
          </div>
        )}
      </div>
      {hasPermission('Wow++') && (
        <button
          onClick={() => console.log('Export job details to PDF')}
          aria-label={t('haulerJobDetails.exportPDF')}
        >
          {t('haulerJobDetails.exportPDF')}
        </button>
      )}
    </div>
  );
};

// TODO: Future Improvements
// - Add support for editing job details for authorized users.
// - Integrate with exportDeliveryPDF to generate a PDF of job details.
// - Add a map view to visualize pickup and dropoff locations for Standard+ tiers.
// - Implement real-time status updates using WebSocket or polling.

export default HaulerJobDetailsPage;