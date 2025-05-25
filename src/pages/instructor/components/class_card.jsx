function ClassCard({ isLoading, onClick, code, title, room, schedule, bgImage, bgClass = "bg-[#0097b2]"}) {
    return (
        <button 
            type="button" 
            onClick={onClick}
            className="w-full text-left max-w-xs bg-white rounded-2xl shadow-md overflow-hidden shadow-lg"
        >
            <div
                className={`p-4 flex items-start justify-between rounded-t-xl relative ${
                    isLoading ? 'bg-white animate-pulse' : bgClass
                }`}
                style={
                    !isLoading
                        ? {
                              backgroundImage: `url(${bgImage})`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "right 5px bottom",
                              backgroundSize: "130px"
                          }
                        : {}
                }
            >
                {isLoading ? (
                    <div className="w-full space-y-2">
                        <div className="bg-gray-300 h-6 w-20 rounded"></div>
                        <div className="bg-gray-300 h-7 w-32 rounded"></div>
                        <div className="bg-gray-300 h-5 w-12 rounded mt-2"></div>
                    </div>
                ) : (
                    <div className="font-poppins text-shadow-sm">
                        <p className="text-white text-sm font-semibold">{code}</p>
                        <h2 className="text-white text-lg font-bold max-w-[180px] leading-tight">
                            {title}
                        </h2>
                        <p className="text-white text-sm mt-1">{room}</p>
                    </div>
                )}
            </div>

            <div className="px-4 pt-4 mb-24">
                {isLoading ? (
                    <div className="animate-pulse space-y-2">
                        <div className="bg-gray-300 h-4 w-20 rounded"></div>
                        <div className="bg-gray-300 h-5 w-32 rounded"></div>
                    </div>
                ) : (
                    <>
                        <p className="text-[#737373] text-sm font-bold font-dm-sans">Upcoming Class</p>
                        <p className="text-[#737373] text-base font-dm-sans">{schedule}</p>
                    </>
                )}
            </div>
        </button>
    );
}

export default ClassCard;
