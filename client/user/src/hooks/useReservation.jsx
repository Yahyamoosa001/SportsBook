import { useParams } from "react-router-dom";
import useDateSelection from "./useDateSelection";
import useTimeSelection from "./useTimeSelection";
import useDurationSelection from "./useDurationSelection";
import useBookingConfirmation from "./useBookingConfirmation";
import useDynamicPricing from "./useDynamicPricing";
import { useState, useEffect } from "react";
import { format, parse, set, formatISO, addHours, parseISO } from "date-fns";

const useReservation = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [bookedTime, setBookedTime] = useState([]);
  const [timeSlots, setTimeSlots] = useState({ openTime: "", closeTime: "" });
  const [pricePerHour, setPricePerHour] = useState(0);
  const [duration, setDuration] = useState(1);

  // Dynamic pricing integration
  const { 
    pricing: dynamicPricing, 
    loading: pricingLoading, 
    calculateDynamicPrice,
    resetPricing
  } = useDynamicPricing();



  const { handleDateChange } = useDateSelection(
    setSelectedDate,
    setSelectedStartTime,
    setDuration
  );

  const { availableTimes, handleTimeSelection, isTimeSlotBooked } =
    useTimeSelection(
      selectedDate,
      id,
      setSelectedStartTime,
      setBookedTime,
      setTimeSlots,
      setPricePerHour,
      bookedTime,
      timeSlots,
      setDuration
    );

  const { handleDurationChange, isDurationAvailable } = useDurationSelection(
    selectedStartTime,
    timeSlots,
    isTimeSlotBooked,
    setDuration
  );

  const { confirmReservation } = useBookingConfirmation(
    id,
    selectedDate,
    selectedStartTime,
    duration,
    dynamicPricing?.totalDynamicPrice || (pricePerHour * duration),
    setLoading
  );

  // Calculate dynamic pricing when booking details change
  useEffect(() => {
    const calculatePricing = async () => {
      if (!selectedStartTime || !selectedDate || !id || !pricePerHour) {
        resetPricing();
        return;
      }

      try {
        const selectedTurfDate = format(selectedDate, "yyyy-MM-dd");
        const parsedStartTime = parse(selectedStartTime, "hh:mm a", new Date());

        const combinedStartDateTime = set(parseISO(selectedTurfDate), {
          hours: parsedStartTime.getHours(),
          minutes: parsedStartTime.getMinutes(),
          seconds: 0,
          milliseconds: 0,
        });

        const combinedEndDateTime = addHours(combinedStartDateTime, duration);

        const bookingData = {
          turfId: id,
          startTime: formatISO(combinedStartDateTime),
          endTime: formatISO(combinedEndDateTime),
          duration,
          selectedDate: selectedTurfDate
        };

        await calculateDynamicPrice(bookingData);
      } catch (error) {
        console.error('Error calculating dynamic pricing:', error);
      }
    };

    // Debounce the calculation to avoid too many API calls
    const timeoutId = setTimeout(calculatePricing, 500);
    return () => clearTimeout(timeoutId);
  }, [selectedStartTime, selectedDate, duration, id, pricePerHour]);

  return {
    selectedDate,
    selectedStartTime,
    duration,
    availableTimes,
    timeSlots,
    handleDateChange,
    handleTimeSelection,
    handleDurationChange,
    isTimeSlotBooked,
    isDurationAvailable,
    confirmReservation,
    pricePerHour,
    loading,
    dynamicPricing,
    pricingLoading,
  };
};

export default useReservation;
