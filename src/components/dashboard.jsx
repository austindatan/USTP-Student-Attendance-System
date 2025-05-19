import React, { useState } from 'react';
import RightSidebar from './rightsidebar';
import Teacher_Dashboard from '../pages/instructor/teacher_dashboard';


export default function DashboardPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <div className="flex">
            <Teacher_Dashboard selectedDate={selectedDate} />
            <RightSidebar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
    );
}
