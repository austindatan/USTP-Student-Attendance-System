import React, { useEffect, useState } from 'react';

export default function StudentCard({ student, isPresent, onToggle }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className={`cursor-pointer animate-pulse bg-white border-2 border-[#e4eae9] rounded-[20px] flex flex-col justify-between w-24 sm:w-36`}>
            <div className="overflow-hidden rounded-t-[20px] flex justify-center">
                <img
                    src="assets/white_placeholder2.jpg"
                    className="w-24 h-24 sm:w-36 sm:h-36 object-cover grayscale"
                    alt="Loading..."
                />
            </div>
            <div className="pl-3 pr-4 pt-2 pb-6 items-center">
                <p className="font-[Barlow] text-xs font-bold ml-[5px] text-[#737373] bg-gray-200 rounded w-16 h-4 mb-2"></p>
                <div className="flex items-center justify-between">
                    <div className="font-[Barlow] text-sm text-[#737373] ml-[5px] leading-[1.2] bg-gray-200 rounded w-20 h-4"></div>
                    <div className="font-[Barlow] text-sm text-[#737373] ml-[5px] leading-[1.2] bg-gray-200 rounded w-20 h-4"></div>
                </div>
            </div>
        </div>


        );
    }

    return (
        <div
            onClick={() => onToggle(student.name)}
            className={`cursor-pointer transition duration-300 ease-in-out hover:shadow-md hover:scale-[1.02]
                bg-white border-2 border-[#e4eae9] rounded-[20px] flex flex-col justify-between
                ${isPresent ? 'opacity-100' : 'opacity-60'}`}
        >
            <div className="overflow-hidden rounded-t-[20px] flex justify-center">
                <img
                    src={student.img}
                    className={`w-24 h-24 sm:w-36 sm:h-36 object-cover ${isPresent ? '' : 'grayscale'}`}
                    alt={student.name}
                />
            </div>
            <div className="pl-3 pr-4 pt-2 pb-3 items-center">
                <p className={`font-[Barlow] text-xs font-poppins font-bold ml-[5px]
                    ${isPresent ? 'text-[#0097b2]' : 'text-[#737373]'}`}>
                    {isPresent ? 'Present' : 'Absent'}
                </p>
                <div className="flex items-center justify-between">
                    <p className="font-[Barlow] text-sm text-[#737373] ml-[5px] leading-[1.2]">
                        {student.name.includes(" ") ? (
                            <>
                                {student.name.split(" ")[0]} <br /> {student.name.split(" ")[1]}
                            </>
                        ) : student.name}
                    </p>
                </div>
            </div>
        </div>
    );
}
