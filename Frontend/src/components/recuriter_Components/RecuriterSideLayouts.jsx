import { Routes, Route } from 'react-router-dom';
import SideBar from '../common_Dashboard/Pages/SideBar/sideBar';
import CurrentInterview from './CurrentInterview/currentInterview';
import RecuriterDashboard from './Dashboard/RecruiterDashboard';
import Billing from '../common_Dashboard/Pages/SideBar/Billing';
import Profile from '../common_Dashboard/Pages/SideBar/UserProfile/profile';
import AllMeetings from './AllMeetings/AllMeetings';
import LevelSelection from './Dashboard/LevelSelectForm';
import OnlineTest_Subject from './Dashboard/OnlineTest/OnlineTest_Subject';
import GeneratedQuestion from './Dashboard/OnlineTest/GeneratedOnlineTest'
import BehaviourSubject from './Dashboard/BehaviourTest/BehaviorSubject'
import InterviewSummary from './Dashboard/InterviewSummary';
import BasicInfo from './Dashboard/BasicInfo';
import AllInterviews from './AllInterviews/AllInterviews';
import CommonDetailsOverview from './Common_Components/CommonDetailsOverview';
import GeneratedBehavior from './Dashboard/BehaviourTest/GeneratedBehavior';
import CodingTest from './Dashboard/CodingTest/codingTest';
import Verify_candidate from './VerifyCandidate/Verify_candidate';
import CandidateTable from './VerifyCandidate/Candidate_details';

function RecuriterSideLayouts() {
    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <SideBar />
                <main className="lg:ml-64 p-8">
                    <div className="max-w-7xl mx-auto">
                        <Routes>
                            <Route path="/" element={<RecuriterDashboard />} />
                            <Route path="current_interview" element={<CurrentInterview isSidebarOpen={true} />}  />
                            <Route path='current_interview/:id' element = { <CommonDetailsOverview />} />
                            <Route path='all-interview/:id' element = { <CommonDetailsOverview />} />
                            <Route path="meetings" element={<AllMeetings />} />
                            <Route path="all-interview" element={<AllInterviews />} />
                            <Route path="billings" element={<Billing />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="create-interview" element={<LevelSelection />} />
                            <Route path='online-test' element={<OnlineTest_Subject />} />
                            <Route path='generate-test' element={<GeneratedQuestion />} />
                            <Route path='behavior-test' element={<BehaviourSubject />} />
                            <Route path='generate-behavior-test' element={<GeneratedBehavior />} />
                            <Route path='coding-test' element={<CodingTest />} />
                        
                            <Route path='interviews-summary' element = { <InterviewSummary />} />
                            <Route path='info' element = { <BasicInfo />} />
                            <Route path='verify-candidate' element={<Verify_candidate />} />
                            <Route path='candidate-details/:id' element={<CandidateTable />} />
                            
                        </Routes>
                    </div>
                </main>
            </div>
        </>
    );
}

export default RecuriterSideLayouts;
