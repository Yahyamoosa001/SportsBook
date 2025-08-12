import DynamicPricingService from '../../services/dynamicPricingService.js';
import Turf from '../../models/turf.model.js';
import { validationResult } from 'express-validator';

/**
 * Calculate dynamic price for a booking
 * POST /api/user/pricing/calculate
 */
export const calculateDynamicPrice = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation errors',
        errors: errors.array() 
      });
    }

    const {
      turfId,
      startTime,
      endTime,
      duration,
      selectedDate
    } = req.body;

    // Get turf details including base price and location
    const turf = await Turf.findById(turfId).select('pricePerHour location state');
    if (!turf) {
      return res.status(404).json({ 
        success: false, 
        message: 'Turf not found' 
      });
    }

    const bookingData = {
      startTime,
      endTime,
      duration,
      turfId,
      selectedDate,
      location: `${turf.location}, ${turf.state}` // Combine location and state for weather API
    };

    // Calculate dynamic pricing
    const pricingResult = await DynamicPricingService.calculateDynamicPrice(
      turf.pricePerHour,
      bookingData
    );

    // Calculate total price based on duration
    const totalBasePrice = turf.pricePerHour * duration;
    const totalFinalPrice = pricingResult.finalPrice * duration;

    const response = {
      success: true,
      pricing: {
        basePrice: turf.pricePerHour,
        totalBasePrice,
        dynamicPrice: pricingResult.finalPrice,
        totalDynamicPrice: totalFinalPrice,
        totalSavings: totalBasePrice - totalFinalPrice,
        totalIncrease: totalFinalPrice - totalBasePrice,
        multiplier: pricingResult.totalMultiplier,
        appliedFactors: pricingResult.appliedFactors,
        breakdown: {
          ...pricingResult.breakdown,
          duration,
          totalDynamicPrice: totalFinalPrice
        }
      },
      timestamp: new Date().toISOString()
    };

    if (pricingResult.error) {
      response.warning = pricingResult.error;
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error('Dynamic pricing calculation error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error calculating dynamic price',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get pricing factors information
 * GET /api/user/pricing/factors
 */
export const getPricingFactors = async (req, res) => {
  try {
    const factors = {
      timeOfDay: {
        peak: 'Evening hours (6-9 PM): +20%',
        morning: 'Morning hours (6-9 AM): +10%',
        offPeak: 'Afternoon hours (10 AM-3 PM): -10%',
        late: 'Late night (10 PM-5 AM): -15%'
      },
      dayOfWeek: {
        weekend: 'Weekends (Fri-Sun): +15%',
        weekday: 'Weekdays (Mon-Thu): -5%'
      },
      duration: {
        short: 'Short bookings (<1 hour): +10%',
        long: 'Extended bookings (3+ hours): -10%'
      },
      weather: {
        good: 'Perfect weather: +20%',
        rain: 'Rainy conditions: -15%',
        snow: 'Snow conditions: -15%'
      },
      demand: {
        high: 'High historical demand: +30%',
        low: 'Low historical demand: -10%'
      },
      utilization: {
        high: 'High facility utilization: +25%',
        low: 'Low facility utilization: -20%'
      }
    };

    return res.status(200).json({
      success: true,
      factors,
      description: 'Dynamic pricing adjusts based on multiple factors to provide fair and competitive rates.',
      note: 'Final price will never be less than 50% or more than 300% of the base rate.'
    });

  } catch (error) {
    console.error('Error fetching pricing factors:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error fetching pricing factors' 
    });
  }
};
