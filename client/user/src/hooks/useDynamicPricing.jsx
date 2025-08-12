import { useState, useEffect } from 'react';
import axiosInstance from './useAxiosInstance';
import toast from 'react-hot-toast';

const useDynamicPricing = () => {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateDynamicPrice = async (bookingData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post('/api/user/pricing/calculate', bookingData);
      
      if (response.data.success) {
        setPricing(response.data.pricing);
        
        // Show pricing notification if there's a significant change
        const { totalSavings, totalIncrease } = response.data.pricing;
        if (totalSavings > 0) {
          toast.success(`🎉 You're saving ₹${totalSavings} with dynamic pricing!`, {
            duration: 4000,
          });
        } else if (totalIncrease > 50) { // Only notify for significant increases
          toast(`💡 Peak time pricing: ₹${totalIncrease} increase`, {
            duration: 3000,
            icon: '⏰',
          });
        }
        
        return response.data.pricing;
      } else {
        throw new Error(response.data.message || 'Failed to calculate dynamic price');
      }
    } catch (err) {
      console.error('Dynamic pricing error:', err);
      
      const errorMessage = err.response?.data?.message || err.message || 'Error calculating dynamic price';
      setError(errorMessage);
      
      // Don't show error toast for minor issues, just log them
      if (err.response?.status !== 500) {
        console.warn('Dynamic pricing unavailable, using base price');
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getPricingFactors = async () => {
    try {
      const response = await axiosInstance.get('/api/user/pricing/factors');
      return response.data;
    } catch (err) {
      console.error('Error fetching pricing factors:', err);
      return null;
    }
  };

  const resetPricing = () => {
    setPricing(null);
    setError(null);
  };

  return {
    pricing,
    loading,
    error,
    calculateDynamicPrice,
    getPricingFactors,
    resetPricing
  };
};

export default useDynamicPricing;
