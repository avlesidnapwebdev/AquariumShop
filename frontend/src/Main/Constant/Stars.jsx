import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Stars = ({ rating }) => {
  const stars = [];

  // Fill stars array with icons based on rating
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-yellow-400 w-4 h-4" />); // full star
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 w-4 h-4" />); // half star
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400 w-4 h-4" />); // empty star
    }
  }

  return (
    <div className="flex items-center gap-1">
      {stars}
    </div>
  );
};

export default Stars;
