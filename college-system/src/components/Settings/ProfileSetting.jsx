import { useState } from 'react';

export default function ProfileSetting() {
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    personalEmail: 'john.doe.personal@email.com',
    academicEmail: 'john.doe.academic@email.com',
    ID: '123456789'
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
    <div className="w-full p-4 md:p-6 bg-white rounded-lg">
      {/* Header */}
      <div className="mb-6 md:mb-8">
         <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Profile Settings</h1>
        <p className="text-sm md:text-base text-gray-500">Update your photo and personal details.</p>
      </div>

      {/* Profile Photo Section */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-center gap-4 md:gap-6">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-indigo-200 flex items-center justify-center text-2xl md:text-3xl font-semibold text-indigo-600 overflow-hidden">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            getInitials(formData.fullName)
          )}
        </div>
        <div className="text-center sm:text-left">
          <label htmlFor="photo-upload" className="cursor-pointer inline-block">
            <span className="bg-indigo-600 text-white px-4 md:px-6 py-2 text-sm md:text-base rounded-lg hover:bg-indigo-700 transition-colors">
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
      <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
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
          {/* Academic Email */}
           <div>
            <label htmlFor="academicEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Academic Email
            </label>
            <input
              type="email"
              id="academicEmail"
              name="academicEmail"
              value={formData.academicEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="john.doe.academic@email.com"
            />
          </div>
          {/* ID */}
           <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
              ID  
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.ID}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="123456789"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSaveChanges}
            className="bg-indigo-600 text-white px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base rounded-lg hover:bg-indigo-700 transition-colors font-medium w-full sm:w-auto"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}