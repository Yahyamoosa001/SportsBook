import axios from 'axios';
import Booking from '../models/booking.model.js';
import { format, getHours, getDay, parseISO, subDays, startOfDay, endOfDay } from 'date-fns';

class DynamicPricingService {
  constructor() {
    // Pricing factors configuration
    this.factors = {
      timeOfDay: {
        peak: { hours: [18, 19, 20, 21], multiplier: 0.20 }, // 6-9 PM
        morning: { hours: [6, 7, 8, 9], multiplier: 0.10 }, // 6-9 AM  
        offPeak: { hours: [10, 11, 12, 13, 14, 15], multiplier: -0.10 }, // 10 AM - 3 PM
        late: { hours: [22, 23, 0, 1, 2, 3, 4, 5], multiplier: -0.15 } // 10 PM - 5 AM
      },
      dayOfWeek: {
        weekend: { days: [5, 6, 0], multiplier: 0.15 }, // Fri, Sat, Sun
        weekday: { days: [1, 2, 3, 4], multiplier: -0.05 } // Mon-Thu
      },
      duration: {
        short: { threshold: 1, multiplier: 0.10 }, // Less than 1 hour
        long: { threshold: 3, multiplier: -0.10 } // More than 3 hours
      },
      weather: {
        good: { conditions: ['clear', 'sunny'], multiplier: 0.20 },
        rain: { conditions: ['rain', 'drizzle', 'thunderstorm'], multiplier: -0.15 },
        snow: { conditions: ['snow'], multiplier: -0.15 }
      }
    };
  }

  /**
   * Calculate dynamic price based on multiple factors
   */
  async calculateDynamicPrice(basePrice, bookingData) {
    try {
      const {
        startTime,
        endTime,
        duration,
        turfId,
        selectedDate,
        location
      } = bookingData;

      let finalMultiplier = 1.0; // Start with base price (100%)
      const appliedFactors = [];

      // 1. Time of Day Factor
      const timeOfDayFactor = this.getTimeOfDayFactor(startTime);
      if (timeOfDayFactor.factor !== 0) {
        finalMultiplier += timeOfDayFactor.factor;
        appliedFactors.push({
          name: 'Time of Day',
          category: timeOfDayFactor.category,
          factor: timeOfDayFactor.factor,
          description: `${timeOfDayFactor.category} hours`
        });
      }

      // 2. Day of Week Factor
      const dayOfWeekFactor = this.getDayOfWeekFactor(selectedDate);
      if (dayOfWeekFactor.factor !== 0) {
        finalMultiplier += dayOfWeekFactor.factor;
        appliedFactors.push({
          name: 'Day of Week',
          category: dayOfWeekFactor.category,
          factor: dayOfWeekFactor.factor,
          description: `${dayOfWeekFactor.category} pricing`
        });
      }

      // 3. Duration Factor
      const durationFactor = this.getDurationFactor(duration);
      if (durationFactor.factor !== 0) {
        finalMultiplier += durationFactor.factor;
        appliedFactors.push({
          name: 'Booking Duration',
          category: durationFactor.category,
          factor: durationFactor.factor,
          description: `${durationFactor.category} booking discount/premium`
        });
      }

      // 4. Weather Factor (if location provided)
      if (location) {
        const weatherFactor = await this.getWeatherFactor(location, selectedDate);
        if (weatherFactor.factor !== 0) {
          finalMultiplier += weatherFactor.factor;
          appliedFactors.push({
            name: 'Weather Conditions',
            category: weatherFactor.category,
            factor: weatherFactor.factor,
            description: `${weatherFactor.description} weather adjustment`
          });
        }
      }

      // 5. Historical Demand Factor
      const demandFactor = await this.getDemandFactor(turfId, selectedDate, startTime);
      if (demandFactor.factor !== 0) {
        finalMultiplier += demandFactor.factor;
        appliedFactors.push({
          name: 'Historical Demand',
          category: demandFactor.category,
          factor: demandFactor.factor,
          description: `${demandFactor.category} demand period`
        });
      }

      // 6. Utilization Factor
      const utilizationFactor = await this.getUtilizationFactor(turfId, selectedDate);
      if (utilizationFactor.factor !== 0) {
        finalMultiplier += utilizationFactor.factor;
        appliedFactors.push({
          name: 'Facility Utilization',
          category: utilizationFactor.category,
          factor: utilizationFactor.factor,
          description: `${utilizationFactor.category} utilization adjustment`
        });
      }

      // Ensure minimum multiplier (don't go below 50% of base price)
      finalMultiplier = Math.max(finalMultiplier, 0.5);
      
      // Ensure maximum multiplier (don't go above 300% of base price)
      finalMultiplier = Math.min(finalMultiplier, 3.0);

      const finalPrice = Math.round(basePrice * finalMultiplier);
      const savings = basePrice - finalPrice;
      const increase = finalPrice - basePrice;

      return {
        basePrice,
        finalPrice,
        totalMultiplier: finalMultiplier,
        savings: savings > 0 ? savings : 0,
        increase: increase > 0 ? increase : 0,
        appliedFactors,
        breakdown: {
          basePrice,
          totalAdjustment: finalPrice - basePrice,
          finalPrice
        }
      };

    } catch (error) {
      console.error('Error calculating dynamic price:', error);
      // Fallback to base price if calculation fails
      return {
        basePrice,
        finalPrice: basePrice,
        totalMultiplier: 1.0,
        savings: 0,
        increase: 0,
        appliedFactors: [],
        error: 'Dynamic pricing temporarily unavailable'
      };
    }
  }

  /**
   * Get time of day pricing factor
   */
  getTimeOfDayFactor(startTime) {
    const hour = getHours(parseISO(startTime));
    
    if (this.factors.timeOfDay.peak.hours.includes(hour)) {
      return { factor: this.factors.timeOfDay.peak.multiplier, category: 'Peak' };
    }
    if (this.factors.timeOfDay.morning.hours.includes(hour)) {
      return { factor: this.factors.timeOfDay.morning.multiplier, category: 'Morning Prime' };
    }
    if (this.factors.timeOfDay.offPeak.hours.includes(hour)) {
      return { factor: this.factors.timeOfDay.offPeak.multiplier, category: 'Off-Peak' };
    }
    if (this.factors.timeOfDay.late.hours.includes(hour)) {
      return { factor: this.factors.timeOfDay.late.multiplier, category: 'Late Night' };
    }
    
    return { factor: 0, category: 'Standard' };
  }

  /**
   * Get day of week pricing factor
   */
  getDayOfWeekFactor(selectedDate) {
    const dayOfWeek = getDay(parseISO(selectedDate));
    
    if (this.factors.dayOfWeek.weekend.days.includes(dayOfWeek)) {
      return { factor: this.factors.dayOfWeek.weekend.multiplier, category: 'Weekend' };
    }
    if (this.factors.dayOfWeek.weekday.days.includes(dayOfWeek)) {
      return { factor: this.factors.dayOfWeek.weekday.multiplier, category: 'Weekday' };
    }
    
    return { factor: 0, category: 'Standard' };
  }

  /**
   * Get duration pricing factor
   */
  getDurationFactor(duration) {
    if (duration < this.factors.duration.short.threshold) {
      return { factor: this.factors.duration.short.multiplier, category: 'Short' };
    }
    if (duration >= this.factors.duration.long.threshold) {
      return { factor: this.factors.duration.long.multiplier, category: 'Extended' };
    }
    
    return { factor: 0, category: 'Standard' };
  }

  /**
   * Get weather-based pricing factor using OpenWeatherMap API
   */
  async getWeatherFactor(location, selectedDate) {
    try {
      // Note: You'll need to sign up for OpenWeatherMap API (free tier available)
      const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
      
      if (!WEATHER_API_KEY) {
        return { factor: 0, category: 'Weather data unavailable' };
      }

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_API_KEY}`
      );

      const weatherMain = response.data.weather[0].main.toLowerCase();
      
      if (this.factors.weather.good.conditions.some(condition => 
        weatherMain.includes(condition))) {
        return { 
          factor: this.factors.weather.good.multiplier, 
          category: 'Good',
          description: 'Perfect weather'
        };
      }
      
      if (this.factors.weather.rain.conditions.some(condition => 
        weatherMain.includes(condition))) {
        return { 
          factor: this.factors.weather.rain.multiplier, 
          category: 'Rainy',
          description: 'Rainy conditions'
        };
      }
      
      if (this.factors.weather.snow.conditions.some(condition => 
        weatherMain.includes(condition))) {
        return { 
          factor: this.factors.weather.snow.multiplier, 
          category: 'Snowy',
          description: 'Snow conditions'
        };
      }

      return { factor: 0, category: 'Normal', description: 'Normal weather' };
      
    } catch (error) {
      console.error('Weather API error:', error);
      return { factor: 0, category: 'Weather data unavailable', description: 'Unable to fetch weather' };
    }
  }

  /**
   * Get historical demand factor based on past bookings
   */
  async getDemandFactor(turfId, selectedDate, startTime) {
    try {
      const selectedHour = getHours(parseISO(startTime));
      const selectedDay = getDay(parseISO(selectedDate));
      
      // Look at last 30 days of historical data
      const thirtyDaysAgo = subDays(new Date(), 30);
      
      const historicalBookings = await Booking.aggregate([
        {
          $lookup: {
            from: 'timeslots',
            localField: 'timeSlot',
            foreignField: '_id',
            as: 'timeSlotData'
          }
        },
        { $unwind: '$timeSlotData' },
        {
          $match: {
            turf: turfId,
            createdAt: { $gte: thirtyDaysAgo },
            $expr: {
              $and: [
                { $eq: [{ $dayOfWeek: '$timeSlotData.startTime' }, selectedDay + 1] }, // MongoDB dayOfWeek is 1-7
                { $eq: [{ $hour: '$timeSlotData.startTime' }, selectedHour] }
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 }
          }
        }
      ]);

      const bookingCount = historicalBookings[0]?.count || 0;
      
      // High demand: more than 3 bookings in this time slot historically
      if (bookingCount > 3) {
        return { factor: 0.30, category: 'High Historical Demand' };
      }
      // Low demand: less than 1 booking historically
      if (bookingCount < 1) {
        return { factor: -0.10, category: 'Low Historical Demand' };
      }
      
      return { factor: 0, category: 'Normal Historical Demand' };
      
    } catch (error) {
      console.error('Demand analysis error:', error);
      return { factor: 0, category: 'Demand data unavailable' };
    }
  }

  /**
   * Get current day utilization factor
   */
  async getUtilizationFactor(turfId, selectedDate) {
    try {
      const dayStart = startOfDay(parseISO(selectedDate));
      const dayEnd = endOfDay(parseISO(selectedDate));
      
      const [totalSlots, bookedSlots] = await Promise.all([
        // Assuming 12 available hours per day (6 AM to 6 PM) = 12 slots
        Promise.resolve(12),
        Booking.aggregate([
          {
            $lookup: {
              from: 'timeslots',
              localField: 'timeSlot',
              foreignField: '_id',
              as: 'timeSlotData'
            }
          },
          { $unwind: '$timeSlotData' },
          {
            $match: {
              turf: turfId,
              'timeSlotData.startTime': {
                $gte: dayStart,
                $lte: dayEnd
              }
            }
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 }
            }
          }
        ])
      ]);

      const utilizationRate = (bookedSlots[0]?.count || 0) / totalSlots;
      
      // High utilization (>80%): Increase price
      if (utilizationRate > 0.8) {
        return { factor: 0.25, category: 'High Utilization' };
      }
      // Low utilization (<20%): Decrease price to encourage bookings
      if (utilizationRate < 0.2) {
        return { factor: -0.20, category: 'Low Utilization' };
      }
      
      return { factor: 0, category: 'Normal Utilization' };
      
    } catch (error) {
      console.error('Utilization analysis error:', error);
      return { factor: 0, category: 'Utilization data unavailable' };
    }
  }
}

export default new DynamicPricingService();
