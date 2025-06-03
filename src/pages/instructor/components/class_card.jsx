function ClassCard({ isLoading, onClick, code, title, room, schedule, bgImage, bgColor = "bg-[#0097b2]"}) {

    const formatTime = (timeString24hr) => {
        if (!timeString24hr) {
            return '';
        }

        try {
            const [hours, minutes, seconds] = timeString24hr.split(':');

            if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
                throw new Error("Invalid time components");
            }

            const dummyDate = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes), parseInt(seconds));

            const options = {
                hour: 'numeric',   
                minute: '2-digit',
                hour12: true
            };

            return dummyDate.toLocaleTimeString('en-US', options);
        } catch (error) {
            console.error("Error formatting time string:", timeString24hr, error);
            return timeString24hr;
        }
    };

    let displayDay1 = '';
    let displayTime1 = '';
    let displayDay2 = '';
    let displayTime2 = '';

    if (schedule && !isLoading) {
        const parts = schedule.split(" ");
        if (parts.length > 5) { 
            displayDay1 = parts[0];
            displayTime1 = formatTime(parts[3]); 

            displayDay2 = parts[2]; 
            displayTime2 = formatTime(parts[5]); 
        } else {
            console.warn("Schedule string does not have enough parts for expected format:", schedule);
            displayDay1 = schedule; 
        }
    }


    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full text-left max-w-xs bg-white rounded-2xl shadow-md overflow-hidden shadow-lg"
        >
            <div
                className={`p-4 flex items-start justify-between rounded-t-2xl relative z-10 ${
                    isLoading ? 'bg-white animate-pulse' : ''
                }`}
                style={
                    !isLoading
                        ? {
                            backgroundColor: bgColor,
                            backgroundImage: `url(${bgImage})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 5px bottom",
                            backgroundSize: "150px",
                            marginTop: '-1px'
                        }
                        : {}
                }
            >
                {isLoading ? (
                    <div className="w-full space-y-2">
                        <div className="bg-gray-300 h-8 w-20 rounded"></div>
                        <div className="bg-gray-300 h-10 w-32 rounded"></div>
                        <div className="bg-gray-300 h-8 w-12 rounded mt-2"></div>
                    </div>
                ) : (
                    <div className="font-poppins h-24 text-shadow-sm">
                        <p className="text-white text-sm font-semibold">{code}</p>
                        <h2 className="text-white text-lg font-bold max-w-[200px] leading-tight">
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
                        <p className="text-[#737373] text-base font-dm-sans">
                            {/* Use the pre-processed variables */}
                            {displayDay1} - {displayTime1} <br />
                            {displayDay2} - {displayTime2}
                        </p>
                    </>
                )}
            </div>
        </button>
    );
}

export default ClassCard;