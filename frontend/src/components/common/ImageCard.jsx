import { Link } from 'react-router-dom';
import { getFullImageUrl } from '../../utils/imageHelper';

function ImageCard({ image }) {
  return (
    <div className="card overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative pb-[75%] bg-gray-200 dark:bg-gray-700">
        <Link to={`/image/${image._id}`}>
          <img
            src={getFullImageUrl(image.imageUrl)}
            alt={image.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </Link>
      </div>
      <div className="p-4">
        <Link to={`/image/${image._id}`}>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {image.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              By{' '}
              <Link 
                to={`/gallery?uploader=${image.uploaderId._id}`} 
                className="hover:text-primary-600 dark:hover:text-primary-400"
              >
                {image.uploaderId.name}
              </Link>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
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
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {image.likes ? image.likes.length : 0}
            </span>
            <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
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
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {image.comments ? image.comments.length : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCard; 