function ClassCard({ isLoading, onClick, code, title, room, schedule, bgImage, bgColor = "bg-[#0097b2]"}) {

    // Helper function to format 24-hour time to 12-hour AM/PM
    const formatTime = (timeString24hr) => {
        // Handle cases where time string might be null, undefined, or empty
        if (!timeString24hr) {
            return '';
        }

        try {
            const [hours, minutes, seconds] = timeString24hr.split(':');

            // Basic validation for numbers
            if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
                throw new Error("Invalid time components");
            }

            // Create a dummy Date object. The date part doesn't matter for time formatting.
            const dummyDate = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes), parseInt(seconds));

            const options = {
                hour: 'numeric',   // '2-digit' for 01, 'numeric' for 1
                minute: '2-digit', // '2-digit' ensures 05, 06 etc.
                // second: '2-digit', // Uncomment if you want seconds displayed
                hour12: true       // Set to true for 12-hour format with AM/PM
            };

            // You can specify a locale (e.g., 'en-US') or let it default to the user's browser locale
            return dummyDate.toLocaleTimeString('en-US', options);
        } catch (error) {
            console.error("Error formatting time string:", timeString24hr, error);
            // Fallback to the original string or a custom error message
            return timeString24hr;
        }
    };

    // Prepare schedule parts for display.
    // It's good practice to do this once outside the JSX,
    // especially since you're calling split multiple times.
    let displayDay1 = '';
    let displayTime1 = '';
    let displayDay2 = '';
    let displayTime2 = '';

    if (schedule && !isLoading) {
        const parts = schedule.split(" ");
        // Ensure we have enough parts to safely access the indices
        if (parts.length > 5) { // Need at least 6 parts (0 to 5)
            displayDay1 = parts[0];
            displayTime1 = formatTime(parts[3]); // Assuming parts[3] is the first time string

            displayDay2 = parts[2]; // Assuming parts[2] is the second day
            displayTime2 = formatTime(parts[5]); // Assuming parts[5] is the second time string
        } else {
            console.warn("Schedule string does not have enough parts for expected format:", schedule);
            // Handle cases where schedule might not conform to the expected format
            // Perhaps display the raw schedule or an "N/A"
            displayDay1 = schedule; // Fallback to displaying the whole raw string if insufficient parts
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
                        <h2 className="text-white text-lg font-bold max-w-[160px] leading-tight">
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