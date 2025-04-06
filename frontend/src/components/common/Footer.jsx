import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 py-6 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Virtual Art Gallery. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Home
            </Link>
            <Link to="/gallery" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Gallery
            </Link>
            <Link to="/upload" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Upload
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 