import { useState } from 'react';

export default function ProfileSetting() {
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    personalEmail: 'john.doe.personal@email.com',
  });
  const [profileImage, setProfileImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 1048576) { // 1MB in bytes
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a JPG or PNG file under 1MB');
    }
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', formData);
    // Add your save logic here
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="max-w-8xl  p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-500">Update your photo and personal details.</p>
      </div>

      {/* Profile Photo Section */}
      <div className="mb-8 flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-indigo-200 flex items-center justify-center text-3xl font-semibold text-indigo-600 overflow-hidden">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            getInitials(formData.fullName)
          )}
        </div>
        <div>
          <label htmlFor="photo-upload" className="cursor-pointer inline-block">
            <span className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Change photo
            </span>
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/jpeg,image/png"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <p className="text-sm text-gray-500 mt-2">JPG, PNG. 1MB max.</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

          {/* Personal Email */}
          <div>
            <label htmlFor="personalEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Personal Email
            </label>
            <input
              type="email"
              id="personalEmail"
              name="personalEmail"
              value={formData.personalEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="john.doe.personal@email.com"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSaveChanges}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}