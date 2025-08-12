import { format } from "date-fns";
import { getEndTime } from "../../utils/dateUtils";
import DynamicPricingInfo from "./DynamicPricingInfo";

const ReservationSummary = ({
  selectedDate,
  selectedStartTime,
  duration,
  pricePerHour,
  dynamicPricing,
  pricingLoading,
}) => {
  const finalPrice = dynamicPricing?.totalDynamicPrice || (pricePerHour * duration);
  const baseTotalPrice = pricePerHour * duration;
  const hasDynamicPrice = dynamicPricing && dynamicPricing.totalDynamicPrice !== baseTotalPrice;
 
  return (
    <div className="mt-6 space-y-4">
      <div className="p-4 bg-base-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Your Reservation</h3>
        <p>Date: {format(selectedDate, "dd-MM-yyyy")}</p>
        <p>
          Time: {selectedStartTime} to {getEndTime(selectedStartTime, duration)}
        </p>
        <p>
          Duration: {duration} hour{duration > 1 ? "s" : ""}
        </p>
        
        <div className="mt-3 pt-2 border-t border-base-300">
          {hasDynamicPrice ? (
            <div className="space-y-1">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Base Price:</span>
                <span className="line-through">₹{baseTotalPrice}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-primary">
                <span>Final Price:</span>
                <span>₹{finalPrice}</span>
              </div>
            </div>
          ) : (
            <p className="font-bold text-lg text-primary">Price: ₹{finalPrice}</p>
          )}
        </div>
      </div>

      <DynamicPricingInfo 
        pricing={dynamicPricing} 
        loading={pricingLoading}
      />
    </div>
  );
};

export default ReservationSummary;
