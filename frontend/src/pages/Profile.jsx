import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import ImageCard from '../components/common/ImageCard';

function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [userImages, setUserImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [imagesError, setImagesError] = useState(null);
  
  // Load user data into form
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setProfileImagePreview(user.profileImage || null);
    }
  }, [user]);
  
  // Fetch user uploaded images
  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        setLoadingImages(true);
        setImagesError(null);
        
        const { data } = await axios.get(`/images?uploader=${user._id}`);
        setUserImages(Array.isArray(data) ? data : (data?.images || []));
        setLoadingImages(false);
      } catch (err) {
        console.error('Error fetching user images:', err);
        setImagesError('Failed to load your images. Please try again.');
        setLoadingImages(false);
      }
    };
    
    if (user) {
      fetchUserImages();
    }
  }, [user]);
  
  // Handle profile image change
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should not exceed 5MB');
      return;
    }
    
    setProfileImage(file);
    setError('');
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // Validate passwords match if provided
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password length if provided
    if (password && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setIsSaving(true);
      setError('');
      
      const userData = {
        name,
        email
      };
      
      if (password) {
        userData.password = password;
      }
      
      const success = await updateProfile(userData, profileImage);
      
      if (success) {
        setIsEditing(false);
        setPassword('');
        setConfirmPassword('');
        setProfileImage(null);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Please log in to view your profile
          </p>
        </div>
        <Link
          to="/login"
          className="btn btn-primary px-6 py-2"
        >
          Log In
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700 rounded">
              {error}
            </div>
          )}
          
          {isEditing ? (
            // Edit Profile Form
            <form onSubmit={handleUpdateProfile}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Image */}
                <div className="md:col-span-1">
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-4">
                      {profileImagePreview ? (
                        <img
                          src={profileImagePreview}
                          alt={name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 text-2xl font-medium">
                            {name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <label
                        htmlFor="profile-image"
                        className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        <input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleProfileImageChange}
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Click the camera icon to change your profile picture
                    </p>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 gap-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>
                    
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>
                    
                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password (leave blank to keep current)
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-input"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    {/* Buttons */}
                    <div className="flex space-x-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 btn btn-primary py-2"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                            Saving...
                          </div>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setName(user.name || '');
                          setEmail(user.email || '');
                          setPassword('');
                          setConfirmPassword('');
                          setProfileImage(null);
                          setProfileImagePreview(user.profileImage || null);
                          setError('');
                        }}
                        className="flex-1 btn btn-secondary py-2"
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            // Profile View
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 mb-4">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400 text-2xl font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{user.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary py-2 px-4"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary py-2 px-4"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* User Uploaded Images */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Uploads</h2>
        
        {loadingImages ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : imagesError ? (
          <div className="text-center py-8">
            <p className="text-red-500 dark:text-red-400">{imagesError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {userImages.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No uploads yet</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  You haven't uploaded any images yet.
                </p>
                <div className="mt-6">
                  <Link
                    to="/upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Upload Your First Image
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userImages.map(image => (
                  <ImageCard key={image._id} image={image} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Profile; 