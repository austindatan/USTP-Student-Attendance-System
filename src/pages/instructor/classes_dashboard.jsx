import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import ClassCard from './components/class_card';
import { format } from 'date-fns';

export default function Classes_Dashboard({ selectedDate }) {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Parse instructor once on mount
  const instructor = useMemo(() => {
    const stored = localStorage.getItem('instructor');
    return stored ? JSON.parse(stored) : null;
  }, []);

  // Fetch sections by instructor ID
  const fetchSections = async () => {
    if (!instructor?.instructor_id) return;

    setIsLoading(true);
    try {
      console.log('Fetching sections...');
      const response = await fetch(
        `http://localhost/USTP-STUDENT-ATTENDANCE-SYSTEM/instructor_backend/get_sections.php?instructor_id=${instructor.instructor_id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched sections:', data);
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
      setSections([]); // Clear sections on error
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch once when instructor_id changes
  useEffect(() => {
    if (instructor?.instructor_id) {
      fetchSections();
    }
  }, [instructor?.instructor_id]);

  // Filter sections by search term
  const filteredSections = sections.filter(section =>
    section.section_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) // Also search by course name
  );

  // Corrected handleSectionClick to pass full section object and use URL param
  const handleSectionClick = (section) => { // Receive the full section object here
    if (!section?.section_id) return; // Ensure sectionId exists

    const dateParam = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null; // Use date-fns format
    const url = `/section-dashboard/${section.section_id}`;

    // Pass the entire section object in the state
    navigate(url, { state: { sectionInfo: section, selectedDate: dateParam } });
  };

  return (
    <section className="w-full pt-12 px-6 sm:px-6 md:px-12">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 20 20">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="text"
          className="font-poppins block w-80 ps-10 py-2 text-sm text-black rounded-lg bg-white focus:ring-pink-500 focus:border-pink-500 placeholder-gray-500"
          placeholder="Search for classes."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 w-full mt-6 mb-6">
        {(isLoading ? Array.from({ length: 6 }) : filteredSections).map((section, index) => (
          <ClassCard
            key={section?.section_id || index} // Use section.section_id as key for better performance and stability
            isLoading={isLoading}
            onClick={() => {
              // Call the correct handler and pass the 'section' object
              if (!isLoading && section?.section_id) {
                handleSectionClick(section); // Pass the entire section object
              }
            }}
            code={!isLoading ? section?.course_code || 'COURSE CODE' : ''}
            title={!isLoading ? section?.course_name || 'Course Title' : ''}
            room={!isLoading ? section?.section_name || 'TBA' : ''}
            schedule={
              !isLoading
                ? `${section?.schedule_day || 'Day'} ${section?.start_time || ''} – ${section?.end_time || ''}`
                : ''
            }
            // Ensure these paths are correct relative to your public folder
            bgImage={`${process.env.PUBLIC_URL}/assets/classes_vector_2.png`}
            bgClass="bg-[#0097b2]"
          />
        ))}
      </div>
    </section>
  );
}