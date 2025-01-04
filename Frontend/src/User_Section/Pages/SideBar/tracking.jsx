import React, { useState } from 'react';

const allMeetings = {
    upcoming: [
        {
            title: 'Sales Kickoff Meeting',
            date: 'Jan 5',
            time: '09:30',
            status: 'Ready',
            participants: 10,
            isSurveyAvailable: false,
            isToggleOn: true,
        },
        {
            title: 'Marketing Biweekly',
            date: 'Jan 5',
            time: '09:45',
            status: 'Draft',
            participants: 10,
            isSurveyAvailable: false,
            isToggleOn: false,
        },
    ],
    past: [
        {
            title: 'Catch up Call',
            date: 'Jan 4',
            time: '10:15',
            status: '',
            participants: 8,
            isSurveyAvailable: true,
            isToggleOn: false,
        },
    ],
    archived: [
        {
            title: 'Team Call',
            date: 'Jan 3',
            time: '10:30',
            status: 'Ready',
            participants: 12,
            isSurveyAvailable: false,
            isToggleOn: true,
        },
    ],
};

const Tracking = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [meetings, setMeetings] = useState(allMeetings[activeTab]);

    const handleToggle = (index) => {
        const updatedMeetings = meetings.map((meeting, i) => 
            i === index ? { ...meeting, isToggleOn: !meeting.isToggleOn } : meeting
        );
        setMeetings(updatedMeetings);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setMeetings(allMeetings[tab]);
    };

    return (
        <div className="flex flex-col p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                Tracking
            </h1>

            {/* Tabs */}
            <div className="flex gap-6 overflow-x-auto mb-4">
                {['upcoming', 'past', 'archived'].map((tab) => (
                    <button
                        key={tab}
                        className={`pb-2 whitespace-nowrap ${activeTab === tab
                            ? 'border-b-2 border-blue-500 text-blue-500'
                            : 'text-gray-500 hover:text-blue-500'}`}
                        onClick={() => handleTabChange(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Meeting List */}
            <div className="bg-white rounded-md shadow-md p-4">
                {meetings.map((meeting, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b last:border-none">
                        {/* Left Section */}
                        <div className="flex items-start sm:items-center gap-4 flex-1">
                            <div className="text-yellow-500">★</div>
                            <div>
                                <h2 className="text-gray-800 font-medium text-lg">
                                    {meeting.title}
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    {meeting.date} {meeting.time}
                                </p>
                            </div>
                            {meeting.status && (
                                <span className={`text-sm font-medium px-2 py-1 rounded ${meeting.status === 'Ready'
                                    ? 'bg-green-100 text-green-500'
                                    : 'bg-gray-100 text-gray-500'}`}>
                                    {meeting.status}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 sm:mt-0">
                            <div className="flex items-center gap-1 text-gray-500">
                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 18.75V15a2.25 2.25 0 00-2.25-2.25h-6A2.25 2.25 0 006.75 15v3.75M12 12a3.375 3.375 0 100-6.75A3.375 3.375 0 0012 12z"/>
                                </svg>
                                <span>{meeting.participants} Participants</span>
                            </div>
                            <div className="text-gray-500 text-sm">Average rating</div>
                            {meeting.isSurveyAvailable ? (
                                <button className="text-sm text-blue-500 bg-blue-100 px-4 py-2 rounded">
                                    Create Survey
                                </button>
                            ) : (
                                <div className="w-20"/>
                            )}
                            <div>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only" checked={meeting.isToggleOn} onChange={() => handleToggle(index)}/>
                                    <div className="w-10 h-5 bg-gray-300 rounded-full shadow-inner flex items-center justify-start px-1">
                                        <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${meeting.isToggleOn ? 'translate-x-5' : ''}`}></div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tracking;
