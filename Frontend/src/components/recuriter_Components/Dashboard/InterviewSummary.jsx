import { useState, useEffect } from 'react';
import { Clock, Users, FileText, Brain, Code, Calendar, Building, User, CheckCircle, AlertCircle, Star } from 'lucide-react';

function InterviewSummary() {
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/recuriter/get-summary/${jobId}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch summary');
                }
                
                const data = await response.json();
                setSummaryData(data[0]);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching summary:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [jobId]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error && !summaryData) {
        return (
            <div className="flex items-center justify-center h-64 text-red-600">
                <AlertCircle className="mr-2" />
                Error loading summary: {error}
            </div>
        );
    }

    const data = summaryData;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                        <div className="mb-4 lg:mb-0">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                Interview Summary
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Complete overview of your interview process
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                <span className="font-medium">Ready to Start</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center">
                                <Building className="w-5 h-5 mr-3 opacity-80" />
                                <div>
                                    <p className="text-blue-100 text-sm">Company</p>
                                    <p className="font-semibold">{data.job.companyName}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <User className="w-5 h-5 mr-3 opacity-80" />
                                <div>
                                    <p className="text-blue-100 text-sm">Role</p>
                                    <p className="font-semibold">{data.job.interviewRole}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-5 h-5 mr-3 opacity-80" />
                                <div>
                                    <p className="text-blue-100 text-sm">Date</p>
                                    <p className="font-semibold">{formatDate(data.job.date)}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-5 h-5 mr-3 opacity-80" />
                                <div>
                                    <p className="text-blue-100 text-sm">Total Time</p>
                                    <p className="font-semibold">{formatTime(data.estimatedTime)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Recruiter Contact</h3>
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{data.recruiter.name}</p>
                                <p className="text-gray-600 text-sm">{data.recruiter.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                            <div className="flex items-center">
                                <FileText className="w-8 h-8 text-white mr-4" />
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Online Assessment</h2>
                                    <p className="text-green-100">Technical Skills Evaluation</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-900 mb-2">{data.onlineTest.title}</h3>
                                <p className="text-gray-600 mb-4">{data.onlineTest.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center mb-1">
                                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                                        <span className="text-sm text-gray-600">Duration</span>
                                    </div>
                                    <p className="font-semibold text-lg">{formatTime(data.onlineTest.duration)}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center mb-1">
                                        <FileText className="w-4 h-4 text-gray-500 mr-2" />
                                        <span className="text-sm text-gray-600">Questions</span>
                                    </div>
                                    <p className="font-semibold text-lg">{data.onlineTest.totalQuestions}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center mb-2">
                                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                                    <span className="text-sm font-medium text-gray-700">Passing Score: {data.onlineTest.passingScore}%</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">Topics Covered:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {data.onlineTest.subjects.map((subject, index) => (
                                        <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                            {subject}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
                            <div className="flex items-center">
                                <Brain className="w-8 h-8 text-white mr-4" />
                                <div>
                                    <h2 className="text-2xl font-bold text-white">AI Behavioral Interview</h2>
                                    <p className="text-purple-100">Communication & Cultural Fit</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <p className="text-gray-600 mb-4">AI-driven assessment of your communication skills and cultural alignment</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center mb-1">
                                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                                        <span className="text-sm text-gray-600">Duration</span>
                                    </div>
                                    <p className="font-semibold text-lg">{formatTime(data.behavioralInterview.duration)}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center mb-1">
                                        <Users className="w-4 h-4 text-gray-500 mr-2" />
                                        <span className="text-sm text-gray-600">Questions</span>
                                    </div>
                                    <p className="font-semibold text-lg">{data.behavioralInterview.totalQuestions}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center mb-2">
                                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                                    <span className="text-sm font-medium text-gray-700">Passing Score: {data.behavioralInterview.passingScore}%</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">Focus Areas:</h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {data.behavioralInterview.subjects.map((subject, index) => (
                                        <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                            {subject}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">Key Evaluation Points:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {data.behavioralInterview.keyWords.map((keyword, index) => (
                                        <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {data.job.hasCodingTest && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6">
                            <div className="flex items-center">
                                <Code className="w-8 h-8 text-white mr-4" />
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Live Coding Interview</h2>
                                    <p className="text-orange-100">Real-time Problem Solving</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 mb-4">
                                Interactive coding session to evaluate your problem-solving approach and technical implementation skills
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['Algorithms', 'Data Structures', 'System Design', 'Code Quality'].map((skill, index) => (
                                    <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-center sm:text-left">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Ready to Begin?</h3>
                            <p className="text-gray-600">All interview phases are configured and ready to start</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 font-medium">
                                Edit Configuration
                            </button>
                            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 font-medium shadow-lg transform hover:scale-105">
                                Start Interview Process
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InterviewSummary;