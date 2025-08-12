import { useState } from 'react';
import { TrendingUp, TrendingDown, Info, ChevronDown, ChevronUp } from 'lucide-react';

const DynamicPricingInfo = ({ pricing, loading }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (loading) {
    return (
      <div className="mt-4 p-4 bg-base-200 rounded-lg animate-pulse">
        <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-base-300 rounded w-1/2"></div>
      </div>
    );
  }

  if (!pricing) {
    return null;
  }

  const {
    basePrice,
    dynamicPrice,
    totalBasePrice,
    totalDynamicPrice,
    totalSavings,
    totalIncrease,
    appliedFactors,
    multiplier
  } = pricing;

  const hasPriceChange = totalSavings > 0 || totalIncrease > 0;
  const isDiscount = totalSavings > 0;
  const priceChangeAmount = isDiscount ? totalSavings : totalIncrease;

  return (
    <div className="mt-4 p-4 bg-base-200 rounded-lg border-l-4 border-l-primary">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {hasPriceChange && (
              isDiscount ? (
                <TrendingDown className="text-green-500" size={20} />
              ) : (
                <TrendingUp className="text-orange-500" size={20} />
              )
            )}
            <span className="font-semibold text-lg">
              {hasPriceChange ? 'Smart Pricing Active' : 'Standard Pricing'}
            </span>
          </div>
          {appliedFactors.length > 0 && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="btn btn-ghost btn-xs"
            >
              <Info size={14} />
              {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>
        
        {hasPriceChange && (
          <div className={`badge ${isDiscount ? 'badge-success' : 'badge-warning'} font-semibold`}>
            {isDiscount ? '-' : '+'}₹{priceChangeAmount}
          </div>
        )}
      </div>

      <div className="mt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Base Rate: ₹{basePrice}/hour
          </span>
          <span className="text-lg font-bold text-primary">
            Current Rate: ₹{dynamicPrice}/hour
          </span>
        </div>
        
        {hasPriceChange && (
          <div className="mt-1">
            <span className={`text-sm ${isDiscount ? 'text-green-600' : 'text-orange-600'}`}>
              {isDiscount 
                ? `You're saving ₹${totalSavings} on this booking!`
                : `Peak time pricing applies (+₹${totalIncrease})`
              }
            </span>
          </div>
        )}
      </div>

      {showDetails && appliedFactors.length > 0 && (
        <div className="mt-4 p-3 bg-base-100 rounded border">
          <h4 className="font-semibold text-sm mb-2">Pricing Factors Applied:</h4>
          <div className="space-y-2">
            {appliedFactors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">{factor.name}</span>
                  <span className="text-gray-500 ml-2">({factor.description})</span>
                </div>
                <span className={`font-semibold ${
                  factor.factor > 0 ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {factor.factor > 0 ? '+' : ''}{(factor.factor * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-2 border-t border-base-300">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Total Adjustment:</span>
              <span className={`${
                multiplier > 1 ? 'text-orange-600' : multiplier < 1 ? 'text-green-600' : 'text-gray-600'
              }`}>
                {multiplier > 1 ? '+' : ''}{((multiplier - 1) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {!hasPriceChange && (
        <div className="mt-2 text-sm text-gray-500">
          Standard pricing applies for this time slot.
        </div>
      )}
    </div>
  );
};

export default DynamicPricingInfo;
