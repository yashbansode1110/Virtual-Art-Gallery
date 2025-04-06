import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="btn btn-primary px-6 py-3"
      >
        Return to Home
      </Link>
    </div>
  );
}

export default NotFound; 