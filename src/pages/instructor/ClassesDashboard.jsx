import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import class_card from './components/class_card'; // Assuming this component exists
import { format } from 'date-fns';

export default function ClassesDashboard({ selectedDate }) {
  const [Sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const instructor = useMemo(() => {
    const stored = localStorage.getItem('instructor');
    return stored ? JSON.parse(stored) : null;
  }, []);

  const fetchSections = async () => {
    if (!instructor?.instructor_id) return;

    setIsLoading(true);
    try {
      console.log('Fetching Sections...');
      const response = await fetch(
        `http://localhost/ustp-student-attendance-system/api/instructor-backend/GetSections.php?instructor_id=${instructor.instructor_id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched Sections:', data);
      setSections(data);
    } catch (error) {
      console.error('Error fetching Sections:', error);
      setSections([]);
    } finally {
      setTimeout(() => {
      setIsLoading(false);
    }, 1500);
      }
  };

  useEffect(() => {
    if (instructor?.instructor_id) {
      fetchSections();
    }
  }, [instructor?.instructor_id]);

  const filteredSections = Sections.filter(section =>
    // Added year_level_name and semester_name to search filter
    section.section_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.year_level_name?.toLowerCase().includes(searchTerm.toLowerCase()) || // New filter
    section.semester_name?.toLowerCase().includes(searchTerm.toLowerCase())     // New filter
  );


  const handleSectionClick = (section) => {
    if (!section?.section_id) return;

    const dateParam = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
    const url = `/section-Dashboard/${section.section_id}`;

    // Pass all section information including year_level_name and semester_name
    navigate(url, { state: { sectionInfo: section, selectedDate: dateParam } });
  };

return (
  <section className="w-full pt-12 px-6 sm:px-6 md:px-12">
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

    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 mb-12">
      {isLoading
        ? Array.from({ length: 6 }).map((_, i) => (
            <class_card key={`loading-${i}`} isLoading={true} />
          ))
        : filteredSections.map((section) => (
            <class_card
              key={section.section_course_id}
              isLoading={false}
              code={section.course_code}
              title={section.course_name}
              room={section.section_name || 'TBA'}
              schedule={`${section.schedule_day} ${section.start_time} – ${section.end_time}`}
              yearLevel={section.year_level_name}
              semester={section.semester_name}
              onClick={() => handleSectionClick(section)}
              bgImage={`${process.env.PUBLIC_URL}/assets/${section?.image}`}
              bgColor={section?.hexcode || "#0097b2"}
            />
          ))
      }
    </div>
  </section>
);
}