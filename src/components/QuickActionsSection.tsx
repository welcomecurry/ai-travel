import React from 'react';

interface QuickActionsSectionProps {
  suggestions?: string[];
  tripsLeft?: number;
  onSuggestionClick?: (suggestion: string) => void;
  onUpgradeClick?: () => void;
}

const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({ 
  suggestions = [], 
  tripsLeft = 0, 
  onSuggestionClick, 
  onUpgradeClick 
}) => {
  return (
    <div className="mx-6">
      {/* Quick Action Suggestions - Above the container */}
      {suggestions.length > 0 && (
        <div className="mb-2">
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestionClick?.(suggestion)}
                className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-300 transition-colors shadow-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trip Count and Premium CTA Container */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-600">
            <span>{tripsLeft} trip plans left</span>
          </div>

          <button
            onClick={onUpgradeClick}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-black text-white text-xs rounded-md hover:bg-gray-800 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Get unlimited plans
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsSection;

