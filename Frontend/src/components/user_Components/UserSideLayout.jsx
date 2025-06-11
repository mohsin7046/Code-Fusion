import { Routes, Route } from 'react-router-dom';
import SideBar from '../common_Dashboard/Pages/SideBar/sideBar';
import UserDashboard from './Dashboard/UserDashboard';
import UserInterviewFeedback from './Interviews/UserInterviewFeedback';
import Profile from '../common_Dashboard/Pages/SideBar/UserProfile/profile';
import Billing from '../common_Dashboard/Pages/SideBar/Billing';
import UserAllInterviews from './Interviews/UserAllInterviews';
function UserSideLayouts() {
    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <SideBar />
                <main className="lg:ml-64 p-8">
                    <div className="max-w-7xl mx-auto">
                        <Routes>
                            <Route path="/" element={<UserDashboard />} />
                            <Route path="all-interview" element={<UserAllInterviews />} />
                            <Route path='all-interview/:id' element = { <UserInterviewFeedback />} />
                            <Route path="billings" element={<Billing />} />
                            <Route path="profile" element={<Profile />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </>
    );
}

export default UserSideLayouts;
