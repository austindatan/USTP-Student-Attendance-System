import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css'; // Ensure this CSS file is correctly imported and defines global styles
import ClassCard from './components/class_card';
import { format } from 'date-fns';

export default function Classes_Dashboard({ selectedDate }) {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const student = useMemo(() => {
    const stored = localStorage.getItem('student');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  const fetchSections = async () => {
    if (!student?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost/ustp-student-attendance-system/api/student_backend/get_sections.php?student_id=${student.id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
      setSections([]);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  useEffect(() => {
    if (student?.id) {
      fetchSections();
    }
  }, [student?.id]);

  const filteredSections = sections.filter((section) =>
    section.section_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.course_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSectionClick = (section) => {
    if (!section?.course_code) return;

    const dateParam = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
    navigate(`/Attendance-Summary/${section.course_code}`, {
      state: { sectionInfo: section, selectedDate: dateParam }
    });
  };

  return (
    <section className="w-full pt-8 px-4 sm:px-6 md:px-12 mx-auto">
      {/* Search Input */}
      <div className="relative w-full sm:w-80 md:w-96 mb-6"> {/* Added mb-6 for spacing */}
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
          className="font-poppins block w-full ps-10 py-2 text-sm text-black rounded-lg bg-white focus:ring-pink-500 focus:border-pink-500 placeholder-gray-500"
          placeholder="Search for classes."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Class Cards */}
      <div className="lg:w-[75%] xl:w-[75%] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-8 mb-16">
        {(isLoading ? Array.from({ length: 6 }) : filteredSections).map((section, i) => {
          const key = isLoading
            ? `loading-${i}`
            : `${section.section_id}-${section.course_id}`;

          return (
            <ClassCard
              key={key}
              isLoading={isLoading}
              code={!isLoading ? section.course_code : ''}
              title={!isLoading ? section.course_name : ''}
              room={!isLoading ? section.section_name || 'TBA' : ''}
              schedule={
                !isLoading
                  ? `${section.schedule_day} ${section.start_time} – ${section.end_time}`
                  : ''
              }
              onClick={() => {
                if (!isLoading && section?.section_id) {
                  handleSectionClick(section);
                }
              }}
              bgImage={!isLoading ? `${process.env.PUBLIC_URL}/assets/${section.image}` : ''}
              bgColor={!isLoading ? section.hexcode || "#0097b2" : "#f0f0f0"}
            />
          );
        })}
      </div>
    </section>
  );
}