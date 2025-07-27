import { useState,useEffect } from 'react';
import {useParams} from 'react-router-dom'
import { toast } from 'react-toastify';

export function TestAuto() {
    const { jobId } = useParams();
    const [tests, setTests] = useState({
        onlineTest: { date: '', saved: false },
        behaviouralTest: { date: '', saved: false },
        codingTest: { date: '', saved: false }
    });

    const handleDateChange = (testType, value) => {
        setTests(prev => ({
            ...prev,
            [testType]: { ...prev[testType], date: value }
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/recruiter/schedule/getSchedule`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ jobId })
                });
                if (!response.ok) {
                    toast.error("Failed to fetch test data");
                    throw new Error('Failed to fetch test data');
                }
                const data = await response.json();
                setTests(prev =>({
                    ...prev,
                    onlineTest: {date : data?.data[0]?.onlineTestDate || "" , saved: true},
                    behaviouralTest: {date : data?.data[0]?.behaviouralTestDate || "" , saved: true},
                    codingTest: {date : data?.data[0]?.codingTestDate || "" , saved: true}
                }))
                console.log("Fetched test data:", data);
                toast.success("Test data fetched successfully");
            } catch (error) {
                console.error("Error fetching test data:", error);
                toast.error("Failed to fetch test data");
            }
        }
        fetchData();
    }, []);

    const handleToggle = (testType) => {
        setTests(prev => ({
            ...prev,
            [testType]: { ...prev[testType], saved: !prev[testType].saved }
        }));
        console.log(tests.onlineTest.date)
    };

    const handleSubmit = async (idx) => {
        try {
            const response = await fetch('/api/recruiter/schedule/createTestSchedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    jobId,
                    status: testConfigs[idx].key,
                    Datetime: tests[testConfigs[idx].key].date
                })
            });

            if (!response.ok) {
                toast.error("Failed to schedule test");
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            toast.success(data.message || "Test scheduled successfully");
            console.log("Scheduled test data:", data);

        } catch (error) {
            console.error("Error submitting test:", error);
            toast.error("An error occurred while saving the test");
        }
    }

    const testConfigs = [
        { key: 'onlineTest', label: 'Online Test' },
        { key: 'behaviouralTest', label: 'Behavioural Test' },
        { key: 'codingTest', label: 'Coding Test' }
    ];

    return (
    <div className='flex justify-center items-center w-screen h-screen'>
        <div className="max-w-6xl p-4 bg-gray-100 rounded-md shadow">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Schedule Tests</h1>

            <div className="space-y-4">
                {testConfigs.map((idx,config) => {
                    const test = tests[config.key];
                    return (
                        <div 
                            key={config.key} 
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-3 rounded-md border border-gray-300"
                        >
                            <label className="sm:w-1/3 font-medium text-gray-700 mb-2 sm:mb-0">
                                {config.label}
                            </label>

                            <input
                                type="datetime-local"
                                value={test.date}
                                onChange={(e) => handleDateChange(config.key, e.target.value)}
                                disabled={test.saved}
                                className={`w-full sm:w-2/3 max-w-xs p-2 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                                    test.saved ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                                }`}
                            />

                            <button
                                onClick={() => {
                                    handleToggle(config.key); 
                                    if (!test.saved) {
                                        handleSubmit(idx);
                                    }
                                }}
                                disabled={!test.date}
                                className={`mt-2 sm:mt-0 sm:ml-4 px-4 py-2 text-sm rounded-md font-medium text-white ${
                                    test.saved 
                                        ? 'bg-gray-500 hover:bg-gray-600' 
                                        : 'bg-blue-500 hover:bg-blue-600'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {test.saved ? 'Edit' : 'Save'}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 p-3 bg-white border border-gray-300 rounded-md">
                <h3 className="font-semibold text-gray-700 mb-1">Summary</h3>
                <p className="text-sm text-gray-600">
                    Scheduled Tests: {Object.values(tests).filter(t => t.saved).length} / {Object.keys(tests).length}
                </p>
            </div>
        </div>
        </div>
    );
}
