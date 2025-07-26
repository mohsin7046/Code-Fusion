import  { useState } from 'react';
import { LogOut, Save } from 'lucide-react';
import getToken from '../../../../../hooks/role.js';
import  {UseOnLogout}  from "../../../../../hooks/useOnLogout";
import { useNavigate } from 'react-router-dom';

function Profile() {

  const data = getToken();
  console.log(data.bio);
  
   const { logout } = UseOnLogout();
   const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: data.username || 'No name',
    email: data.email || 'No email',
    bio: data.bio || '',
    notifications: true,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('Saving profile...', formData);
    const finaldata = {
      username: formData.username,
      bio: formData.bio,
      userId: data.userId,
      newPassword: formData.newPassword,
    }
    const res = await fetch('/api/auth/update-profile',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finaldata),
    })
    if (res.ok) {
      const data = await res.json();
      console.log('Profile updated successfully:', data);
    } else {
      console.error('Failed to update profile');
    }
  };


  const handleLogout = () => {
    logout();
    navigate('/login');
    console.log('Logging out...');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Profile Settings
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="flex items-center space-x-4">
            <img
              src={data.profilePicture}
              alt="Profile"
              className="w-20 h-20 rounded-full"
            />
            <button
              type="button"
              className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
            >
              Change Photo
            </button>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="mt-1 block w-full rounded-md bg-gray-300 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

        
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="notifications"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="notifications" className="text-sm text-gray-700">
              Receive email notifications about account activity
            </label>
          </div>

          
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
