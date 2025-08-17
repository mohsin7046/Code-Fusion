import { useState } from "react";
import { useNavigate } from "react-router-dom";
import getToken from "../../../hooks/role";

export default function StudentForm() {
  const [resume, setResume] = useState(null);
  const [tenth, setTenth] = useState(null);
  const [twelfth, setTwelfth] = useState(null);
  const [lastSem, setLastSem] = useState(null);
  const [collegeName, setCollegeName] = useState("");
  const [passingYear, setPassingYear] = useState("");
  const [course, setCourse] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [tenthPercentage, setTenthPercentage] = useState("");
  const [twelfthPercentage, setTwelfthPercentage] = useState("");
  const [cgpa, setCgpa] = useState("");

  const next = useNavigate();
  const form = getToken();

  const renderPreview = (file) => {
    if (!file) return null;
    const fileURL = URL.createObjectURL(file);

    if (file.type.startsWith("image/")) {
      return (
        <img
          src={fileURL}
          alt="Preview"
          className="w-20 h-20 object-cover rounded-lg border"
        />
      );
    } else if (file.type === "application/pdf") {
      return (
        <a
          href={fileURL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-sm"
        >
          View PDF
        </a>
      );
    } else {
      return (
        <div className="px-3 py-2 border rounded-lg bg-gray-100 text-sm text-gray-700">
          {file.name}
        </div>
      );
    }
  };

  const RequiredLabel = ({ children }) => (
    <label className="block text-gray-700 mb-2 font-medium">
      {children} <span className="text-red-500">*</span>
    </label>
  );


  const handleSubmit = async () => {
    const formData = new FormData();
    
    formData.append("collegeName", collegeName);
    formData.append("passingYear", passingYear);
    formData.append("course", course);
    formData.append("specialization", specialization);
    formData.append("tenthPercentage", tenthPercentage);
    formData.append("twelfthPercentage", twelfthPercentage);
    formData.append("cgpa", cgpa);
    formData.append("userId", form.userId);

    
    if (resume) formData.append("resume", resume);
    if (tenth) formData.append("tenth", tenth);
    if (twelfth) formData.append("twelfth", twelfth);
    if (lastSem) formData.append("lastSem", lastSem);

    for (let [key, value] of formData.entries()) {
       console.log(key, value);
      }
    

    try {
      const response = await fetch("/api/user/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Form submitted successfully!");
        next("/");

      } else {
        alert("Upload failed!");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex justify-center items-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl p-6 sm:p-10">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          College & Education Details
        </h2>

        
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <RequiredLabel>College Name</RequiredLabel>
            <input
              type="text"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              placeholder="Enter your college name"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <RequiredLabel>Passing Year</RequiredLabel>
            <input
              type="text"
              value={passingYear}
              onChange={(e) => setPassingYear(e.target.value)}
              placeholder="2025"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <RequiredLabel>Course</RequiredLabel>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="B.Tech / B.Sc / M.Sc"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <RequiredLabel>Course Specialization</RequiredLabel>
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="Computer Science / IT"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        <h2 className="text-2xl font-bold text-blue-700 mb-6">Documents</h2>

        <div className="space-y-6">
         
          <div>
            <RequiredLabel>Resume</RequiredLabel>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setResume(e.target.files[0])}
                className="hidden"
                id="resume"
              />
              <label
                htmlFor="resume"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
              >
                Browse
              </label>
              {renderPreview(resume)}
            </div>
          </div>

          
          <div>
            <RequiredLabel>10th Marksheet (Percentage)</RequiredLabel>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="text"
                value={tenthPercentage}
                onChange={(e) => setTenthPercentage(e.target.value)}
                placeholder="85%"
                className="w-full sm:w-32 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setTenth(e.target.files[0])}
                className="hidden"
                id="tenth"
              />
              <label
                htmlFor="tenth"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
              >
                Browse
              </label>
              {renderPreview(tenth)}
            </div>
          </div>

          
          <div>
            <RequiredLabel>12th Marksheet (Percentage)</RequiredLabel>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="text"
                value={twelfthPercentage}
                onChange={(e) => setTwelfthPercentage(e.target.value)}
                placeholder="90%"
                className="w-full sm:w-32 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setTwelfth(e.target.files[0])}
                className="hidden"
                id="twelfth"
              />
              <label
                htmlFor="twelfth"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
              >
                Browse
              </label>
              {renderPreview(twelfth)}
            </div>
          </div>

          
          <div>
            <RequiredLabel>Last Sem Marksheet (CPI/CGPA)</RequiredLabel>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="text"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder="8.5"
                className="w-full sm:w-32 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setLastSem(e.target.files[0])}
                className="hidden"
                id="lastSem"
              />
              <label
                htmlFor="lastSem"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
              >
                Browse
              </label>
              {renderPreview(lastSem)}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-10">
          <button
            onClick={handleSubmit}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-800 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
