import React from 'react';
import { FiSettings } from 'react-icons/fi';

export default function Teacher_Dashboard() {
  return (
    <div
      className="min-h-screen flex bg-cover bg-center"
      style={{ backgroundImage: "url('assets/forest_theme.png')" }}
    >
      <section className="w-full pt-12 px-4 sm:px-6 md:px-12 max-w-[1440px] mx-auto">
        {/* Header card */}
        <div
          className="bg-[#0097b2] rounded-lg p-6 text-white font-poppins mb-6 relative overflow-hidden"
          style={{
            backgroundImage: "url('assets/classes_vector_2.png')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 50px center',
            backgroundSize: 'contain',
          }}
        >
          <div className="flex justify-between items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <FiSettings className="text-xl text-white cursor-pointer" />
          </div>
          <div className="mt-12 max-w-xs sm:max-w-md md:max-w-lg">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-xl font-semibold">IT 221</h2>
              <p className="text-sm">T 7:30 AM - 9:00 AM</p>
            </div>
            <h1 className="text-2xl font-bold leading-tight mt-1">Information Management</h1>
            <p className="text-sm">2R12</p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative max-w-[200px] sm:max-w-[250px] md:max-w-[300px] mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className="font-poppins block w-full pl-10 pr-4 py-2 text-sm text-white rounded-lg bg-[#0097b2] placeholder-white/50 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
            placeholder="Search for items"
          />
        </div>

        {/* Student cards grid */}
        <div className="grid grid-cols-3 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {[
            {
              img: 'assets/student_files/Jean_Grey_Uniform_III.png',
              status: 'Absent',
              nameLine1: 'The',
              nameLine2: 'Pheonix',
              grayscale: true,
              opacity: 'opacity-60',
              textColor: '#737373',
            },
            {
              img: 'assets/student_files/Wave_Uniform_I.png',
              status: 'Present',
              nameLine1: 'Pearl',
              nameLine2: 'Pangan',
              grayscale: false,
              opacity: 'opacity-100',
              textColor: '#0097b2',
            },
            {
              img: 'assets/student_files/Luna_Snow_Uniform_III.png',
              status: 'Present',
              nameLine1: 'Luna',
              nameLine2: 'Snow',
              grayscale: false,
              opacity: 'opacity-100',
              textColor: '#0097b2',
            },
            {
              img: 'assets/student_files/Invisible_Woman_Uniform_III.png',
              status: 'Present',
              nameLine1: 'Invisible',
              nameLine2: 'Woman',
              grayscale: false,
              opacity: 'opacity-100',
              textColor: '#0097b2',
            },
            {
              img: 'assets/student_files/Ghost_Uniform_II.png',
              status: 'Present',
              nameLine1: '',
              nameLine2: 'Ghost',
              grayscale: false,
              opacity: 'opacity-100',
              textColor: '#0097b2',
            },
            {
              img: 'assets/student_files/Sentry_Uniform_II.png',
              status: 'Absent',
              nameLine1: 'The',
              nameLine2: 'Sentry',
              grayscale: true,
              opacity: 'opacity-60',
              textColor: '#737373',
            },
          ].map(({ img, status, nameLine1, nameLine2, grayscale, opacity, textColor }, i) => (
            <div
              key={i}
              className={`${opacity} bg-white border-2 border-[#e4eae9] rounded-[20px] flex flex-col justify-between transition duration-300 ease-in-out hover:shadow-md hover:scale-[1.02]
                h-[180px] sm:h-auto
              `}
            >
              <div className="overflow-hidden rounded-t-[20px]">
                <img
                  src={img}
                  alt={`${nameLine1} ${nameLine2}`}
                  className={`w-36 h-36 object-cover ${grayscale ? 'grayscale' : ''} mx-auto`}
                  loading="lazy"
                />
              </div>
              <div className="pl-3 pr-4 pt-2 pb-4">
                <p
                  className="font-[Barlow] text-xs font-poppins font-bold ml-[5px]"
                  style={{ color: textColor }}
                >
                  {status}
                </p>
                <div className="flex items-center justify-between">
                  <p
                    className="font-[Barlow] text-base ml-[5px] leading-[1]"
                    style={{ color: '#737373' }}
                  >
                    {nameLine1 && (
                      <>
                        {nameLine1}
                        <br />
                      </>
                    )}
                    {nameLine2}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
