import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';
import { getStudentProfile, updateStudentProfile } from '../../services/userProfile';
import { getNonStudentProfile, updateNonStudentProfile } from '../../services/settings';
import Toast from '../Toast/Toast';

export default function ProfileSetting() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    ID: '',
    phone: '',
    address: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  
  const [isStudent, setIsStudent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setToast(null);
    const authUser = await getCurrentUser();
      const isUserStudent = authUser.role === 'student';
      setIsStudent(isUserStudent);

      if (isUserStudent) {
         const response = await getStudentProfile();
         const p = response.studentProfile;
         setFormData({
            fullName: p.full_name || '',
            email: p.email || '',
            ID: p.student_profiles?.student_id || '',
            phone: p.phone || '',
            address: p.address || ''
         });
         setProfileImage(p.avatar_url || null);
      } else {
         const response = await getNonStudentProfile();
         const p = response.user;
         setFormData({
            fullName: p.full_name || '',
            email: p.email || '',
            ID: p.id || '',
            phone: p.phone || '',
            address: p.address || ''
         });
         setProfileImage(p.avatar_url || null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setToast({ message: 'Failed to load profile data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

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
      setFileToUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a JPG or PNG file under 1MB');
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setToast(null);
    try {
      const data = new FormData();
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      if (fileToUpload) {
        data.append('avatar', fileToUpload);
      }
      
      if (isStudent) {
        await updateStudentProfile(data);
      } else {
        await updateNonStudentProfile(data);
      }
      setToast({ message: 'Profile updated successfully!', type: 'success' });
      setFileToUpload(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setToast({ message: err.response?.data?.message || 'Failed to update profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
        <div className="w-full p-4 md:p-6 bg-white rounded-lg flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6 bg-white rounded-lg relative">
      {toast && (
        <div className="fixed top-24 right-4 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* Header */}
      <div className="mb-6 md:mb-8">
         <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Profile Settings</h1>
        <p className="text-sm md:text-base text-gray-500">
          Update your phone, address, and photo.
        </p>
      </div>

      {/* Profile Photo Section */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-center gap-4 md:gap-6">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-indigo-200 flex items-center justify-center text-2xl md:text-3xl font-semibold text-indigo-600 overflow-hidden shrink-0">
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
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-0 text-gray-500"
              placeholder="Full Name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-0 text-gray-500"
              placeholder="Email Address"
            />
          </div>

          {/* ID */}
          {isStudent && (
            <div>
              <label htmlFor="ID" className="block text-sm font-medium text-gray-700 mb-2">
                Student ID
              </label>
              <input
                type="text"
                id="ID"
                name="ID"
                value={formData.ID}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-0 text-gray-500"
                placeholder="ID"
              />
            </div>
          )}

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-all focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
              placeholder="Phone Number"
            />
          </div>

          {/* Home Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Home Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-all focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
              placeholder="Home Address"
            />
          </div>
        </div>



        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className={`text-white px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base rounded-lg transition-colors font-medium w-full sm:w-auto ${
               saving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}