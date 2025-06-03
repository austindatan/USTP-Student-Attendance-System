import React from 'react';
import { useNavigate } from 'react-router-dom';

function ClassCard({ code, title, room, schedule, bgImage, bgColor = "#0097b2" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/Attendance-Summary/${code}`);
  };

  return (
    <div
      className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-2xl shadow-lg overflow-hidden cursor-pointer"
      style={{ minHeight: '225px' }}
      onClick={handleClick}
    >
      <div
        className="p-4 sm:p-6 h-32 rounded-t-2xl relative z-10 flex flex-col justify-between"
        style={{
          backgroundColor: bgColor,
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 5px bottom',
          backgroundSize: '100px', 
        }}
      >
        <p className="text-white text-xs sm:text-sm font-semibold">{code}</p>
        <h2 className="text-white text-base sm:text-lg font-bold leading-tight max-w-[140px]">
          {title}
        </h2>
        <p className="text-white text-xs sm:text-sm">{room}</p>
      </div>

      <div className="px-4 pt-4 sm:pt-6 pb-6 sm:pb-8 bg-white">
        <p className="text-[#737373] text-xs sm:text-sm font-bold font-dm-sans">Upcoming Class</p>
        <p className="text-[#737373] text-sm sm:text-base font-dm-sans">
          {schedule}
        </p>
      </div>
    </div>
  );
}

export default ClassCard;
