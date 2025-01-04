import { Routes, Route } from 'react-router-dom';
import SideBar from './sideBar';
import Meeting from './Meeting';
import Tracking from './tracking';
import Setting from './setting';
import Profile from './UserProfile/profile';
// import CommunityHome from './Community/communityHome';

function SidebarLayout() {
    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <SideBar />
                <main className="lg:ml-64 p-8">
                    <div className="max-w-7xl mx-auto">
                        <Routes>
                            <Route path="dashboard" element={<SideBar />} />
                            <Route path="meeting" element={<Meeting isSidebarOpen={true} />} />
                            <Route path="tracking" element={<Tracking />} />
                            {/* <Route path="community" element={<CommunityHome />} /> */}
                            <Route path="settings" element={<Setting />} />
                            <Route path="profile" element={<Profile />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </>
    );
}

export default SidebarLayout;
