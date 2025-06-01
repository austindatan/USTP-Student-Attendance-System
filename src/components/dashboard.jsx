import React, { useState } from 'react';
import RightSidebar from './RightSidebar';
import TeacherDashboard from '../pages/instructor/TeacherDashboard';


export default function DashboardPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <div className="flex">
            <TeacherDashboard selectedDate={selectedDate} />
            <RightSidebar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
    );
}
