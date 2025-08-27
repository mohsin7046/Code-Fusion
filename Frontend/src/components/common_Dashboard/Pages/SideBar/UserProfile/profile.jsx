import { useEffect, useState } from "react";
import { LogOut, Save, Upload } from "lucide-react";
import getToken from "../../../../../hooks/role.js";
import { UseOnLogout } from "../../../../../hooks/useOnLogout";
import { useNavigate } from "react-router-dom";

function Profile() {
  const data = getToken();
  const { logout } = UseOnLogout();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: data.username || "No name",
    email: data.email || "No email",
    bio: data.bio || "",
    profilePicture: data.profilePicture || "",
    role: data.role || "CANDIDATE",
    // recruiter fields
    company_name: "",
    company_role: "",
    company_location: "",
    company_description: "",
    company_website: "",
    // candidate fields
    skills: [],
    socialLinks: [],
    notifications: true,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };

  // Fetch profile from backend
  useEffect(() => {
    const getProfile = async () => {
      const res = await fetch("/api/auth/get-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, role: data.role }),
      });
      if (!res.ok) {
        console.error("Failed to fetch profile data");
        return;
      }
      const profileData = await res.json();
      console.log("Fetched Profile:", profileData);
      setFormData((prev) => ({ ...prev, ...profileData }));
    };
    getProfile();
  }, [data.email, data.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finaldata = {
      username: formData.username,
      bio: formData.bio,
      userId: data.userId,
      newPassword: formData.newPassword,
    };
    const res = await fetch("/api/auth/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finaldata),
    });
    if (res.ok) {
      const data = await res.json();
      console.log("Profile updated successfully:", data);
    } else {
      console.error("Failed to update profile");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md border p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile picture */}
          <div className="flex items-center space-x-6">
            <img
              src={formData.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-blue-500 shadow-sm"
            />
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              Change Photo
            </button>
          </div>

          {/* General fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="mt-1 block w-full rounded-lg bg-gray-100 border-gray-300 text-gray-500 shadow-sm cursor-not-allowed"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Write something about yourself..."
            />
          </div>

          {/* Recruiter fields */}
          {formData.role === "RECRUITER" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  name="company_name"
                  value={formData.company_name || ""}
                  disabled
                  className="mt-1 block w-full rounded-lg bg-gray-100 border-gray-300 text-gray-500 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Role
                </label>
                <input
                  name="company_role"
                  value={formData.company_role || ""}
                  disabled
                  className="mt-1 block w-full rounded-lg bg-gray-100 border-gray-300 text-gray-500 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Location
                </label>
                <input
                  name="company_location"
                  value={formData.company_location || ""}
                  disabled
                  className="mt-1 block w-full rounded-lg bg-gray-100 border-gray-300 text-gray-500 shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Candidate fields */}
          {formData.role === "CANDIDATE" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Skills
                </label>
                <ul className="list-disc ml-5 text-gray-700">
                  {formData.skills?.map((skill, idx) => (
                    <li key={idx}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Social Links
                </label>
                <ul className="list-disc ml-5 text-blue-600">
                  {formData.socialLinks?.map((link, idx) => (
                    <li key={idx}>
                      <a href={link} target="_blank" rel="noreferrer">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Notifications */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="notifications"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="notifications" className="text-sm text-gray-700">
              Receive email notifications about account activity
            </label>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all duration-200"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
