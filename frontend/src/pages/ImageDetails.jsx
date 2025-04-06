import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function ImageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  
  // Fetch image details
  useEffect(() => {
    const fetchImageDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data } = await axios.get(`/api/images/${id}`);
        setImage(data);
        
        // Check if current user has liked the image
        if (user && data.likes) {
          setLiked(data.likes.includes(user._id));
          setLikesCount(data.likes.length);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching image details:', err);
        setError('Failed to load image details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchImageDetails();
  }, [id, user]);
  
  // Handle like/unlike
  const handleLike = async () => {
    if (!user) {
      toast.info('Please log in to like images');
      navigate('/login');
      return;
    }
    
    try {
      const { data } = await axios.put(`/api/images/${id}/like`);
      setLiked(!liked);
      setLikesCount(data.likes.length);
      toast.success(liked ? 'Image unliked' : 'Image liked');
    } catch (err) {
      console.error('Error liking/unliking image:', err);
      toast.error('Failed to process your request. Please try again.');
    }
  };
  
  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.info('Please log in to comment');
      navigate('/login');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      setSubmittingComment(true);
      
      const { data } = await axios.post(`/api/images/${id}/comment`, { text: comment });
      
      // Update image with new comments
      setImage(prevImage => ({
        ...prevImage,
        comments: data
      }));
      
      setComment('');
      toast.success('Comment added successfully');
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Failed to add comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };
  
  // Handle image download
  const handleDownload = async () => {
    try {
      // Create a function to download the image
      const downloadImage = (url, filename) => {
        fetch(url)
          .then(response => response.blob())
          .then(blob => {
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            
            // Set the download attribute with filename
            link.download = filename || 'image';
            
            // Append link to body
            document.body.appendChild(link);
            
            // Trigger click event to start download
            link.click();
            
            // Clean up
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
          });
      };
      
      // Extract filename from URL or use title
      const imageUrl = image.imageUrl;
      const filename = image.title.replace(/\s+/g, '-').toLowerCase() + 
                      imageUrl.substring(imageUrl.lastIndexOf('.'));
      
      // Initiate download
      downloadImage(imageUrl, filename);
      toast.success('Download started');
    } catch (err) {
      console.error('Error downloading image:', err);
      toast.error('Failed to download. Please try again.');
    }
  };
  
  // Handle image deletion (for owner or admin)
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(`/api/images/${id}`);
      toast.success('Image deleted successfully');
      navigate('/gallery');
    } catch (err) {
      console.error('Error deleting image:', err);
      toast.error('Failed to delete image. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (!image) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Image not found</p>
        <Link
          to="/gallery"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Return to Gallery
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          to="/gallery"
          className="text-primary-600 dark:text-primary-400 hover:underline flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Gallery
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        {/* Image Section */}
        <div className="relative">
          <img
            src={image.imageUrl}
            alt={image.title}
            className="w-full object-contain max-h-[600px]"
          />
        </div>
        
        {/* Image Info Section */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{image.title}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Uploaded by{' '}
                <Link 
                  to={`/gallery?uploader=${image.uploaderId._id}`} 
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {image.uploaderId.name}
                </Link>
                {' '}on{' '}
                {new Date(image.uploadDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={handleLike}
                className={`flex items-center px-3 py-1 rounded-full text-sm border ${
                  liked
                    ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-400'
                    : 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 mr-1 ${liked ? 'text-primary-600 dark:text-primary-400 fill-current' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={liked ? 2 : 1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
              </button>
              
              <button
                onClick={handleDownload}
                className="flex items-center px-3 py-1 rounded-full text-sm bg-gray-50 border border-gray-200 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </button>
              
              {/* Show delete button only if user is the owner or admin */}
              {user && (user._id === image.uploaderId._id || user.role === 'admin') && (
                <button
                  onClick={handleDelete}
                  className="flex items-center px-3 py-1 rounded-full text-sm bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              )}
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Description</h2>
            <p className="text-gray-700 dark:text-gray-300">
              {image.description || 'No description provided.'}
            </p>
          </div>
          
          {/* Category and Tags */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Details</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
              </span>
              {image.tags && image.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/gallery?search=${tag}`}
                  className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Comments Section */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Comments ({image.comments ? image.comments.length : 0})
            </h2>
            
            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="flex">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="form-input flex-grow rounded-r-none"
                  placeholder={user ? 'Add a comment...' : 'Log in to comment'}
                  disabled={!user || submittingComment}
                />
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-r-md hover:bg-primary-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!user || !comment.trim() || submittingComment}
                >
                  {submittingComment ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
            
            {/* Comments List */}
            {image.comments && image.comments.length > 0 ? (
              <div className="space-y-4">
                {image.comments.map((comment, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                    <div className="flex items-start">
                      <div className="mr-3">
                        {comment.user.profileImage ? (
                          <img
                            src={comment.user.profileImage}
                            alt={comment.user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                              {comment.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {comment.user.name}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(comment.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageDetails; 