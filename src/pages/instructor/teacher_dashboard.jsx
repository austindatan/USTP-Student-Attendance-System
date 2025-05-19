import React from 'react';

export default function Teacher_Dashboard() {
    return (
        <div
            className="h-full min-h-screen flex bg-cover bg-center"
            style={{ backgroundImage: "url('assets/white_theme.png')" }}
        >
            <section class="max-w-[1200px] mx-auto pt-12 px-4 sm:px-6 md:px-[60px] lg:px-[100px]">

                <div class="flex justify-between items-center w-full mb-7">
                <h4 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F27A6] font-[Poppins]">
                    Tasty Treats
                </h4>
                <img src="assets/ustp_logo.png" alt="Sabrosa Logo" class="w-[80px] sm:w-[100px] md:w-[120px] object-contain" />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                    <div class="bg-[#FDC0D0] border-2 border-[#E55182] rounded-[20px] flex flex-col justify-between transition duration-300 ease-in-out hover:shadow-md hover:scale-[1.02]">
                        <div class="aspect-[3/2] overflow-hidden rounded-t-[20px]">
                        <img src="assets/Jean_Grey_Uniform_III.png" class="w-full h-full object-cover" />
                        </div>
                        <div class="bg-white p-4 flex items-center justify-between rounded-b-[20px]">
                        <p class="font-[Barlow] text-sm sm:text-base text-black font-medium ml-[5px]">Title</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
