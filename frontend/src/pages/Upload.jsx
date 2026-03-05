import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function Upload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  // Categories array
  const categories = [
    { id: 'photography', name: 'Photography' },
    { id: 'digital', name: 'Digital Art' },
    { id: 'painting', name: 'Painting' },
    { id: 'sculpture', name: 'Sculpture' },
    { id: 'illustration', name: 'Illustration' },
    { id: 'other', name: 'Other' }
  ];
  
  // Handle image selection
  const handleImageChange = (e) => {
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
    
    setImage(file);
    setError('');
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !category || !image) {
      setError('Please fill in all required fields and upload an image');
      return;
    }
    
    try {
      setUploading(true);
      setError('');
      
      // Create form data
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('tags', tags);
      formData.append('image', image);
      
      // Upload image
      const { data } = await axios.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Image uploaded successfully!');
      navigate(`/image/${data._id}`);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Upload Artwork</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md">
                {imagePreview ? (
                  <div className="text-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-64 object-contain mb-4"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-300 dark:bg-red-900/30 dark:hover:bg-red-900/50"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="image-upload"
                        className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none"
                      >
                        <span>Upload an image</span>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                placeholder="Enter title for your artwork"
                required
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="form-input"
                placeholder="Describe your artwork (optional)"
              />
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
                required
              >
                <option value="" disabled>Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="form-input"
                placeholder="Enter tags separated by commas (e.g. landscape, nature, abstract)"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Separate tags with commas
              </p>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full btn btn-primary py-2"
                disabled={uploading}
              >
                {uploading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  'Upload Artwork'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Upload; 