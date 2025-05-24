import React from 'react';

export default function StudentCard({ student, isPresent, onToggle }) {
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
            <div className="pl-3 pr-4 pt-2 pb-4 items-center">
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
