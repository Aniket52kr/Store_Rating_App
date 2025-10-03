// src/components/RatingStars.jsx
import { useState } from 'react';

export default function RatingStars({ rating: initialRating, onRate, readOnly = false, size = "medium" }) {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(initialRating || 0);

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  const sizeClasses = {
    small: "text-lg",
    medium: "text-xl",
    large: "text-2xl"
  };

  const handleMouseOver = (val) => {
    if (!readOnly) setHoverRating(val);
  };

  const handleClick = (val) => {
    if (!readOnly) {
      setCurrentRating(val);
      if (onRate) onRate(val);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) setHoverRating(0);
  };

  return (
    <div className="inline-flex space-x-1">
      {stars.map((star) => {
        const isFilled = star <= (hoverRating || currentRating);

        return (
          <button
            key={star}
            type="button"
            onMouseOver={() => handleMouseOver(star)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(star)}
            disabled={readOnly}
            className={`${sizeClasses[size]} transition-colors duration-150 ${
              isFilled ? 'text-yellow-500' : 'text-gray-300'
            } hover:text-yellow-400 focus:outline-none`}
            aria-label={`Rate ${star} out of 5`}
          >
            ★
          </button>
        );
      })}
      <span className="ml-2 text-sm text-gray-600">
        {hoverRating || currentRating || 'No rating'}
      </span>
    </div>
  );
}