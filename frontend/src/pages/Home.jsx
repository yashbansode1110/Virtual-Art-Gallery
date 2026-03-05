import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ImageCard from '../components/common/ImageCard';

function Home() {
  const [featuredImages, setFeaturedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch featured images
  useEffect(() => {
    const fetchFeaturedImages = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/images/featured');
        setFeaturedImages(data.images || data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured images:', err);
        setError('Failed to load featured images. Please try again.');
        setLoading(false);
      }
    };
    
    fetchFeaturedImages();
  }, []);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-primary-600 dark:bg-primary-800 text-white rounded-lg overflow-hidden">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Virtual Art Gallery
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-xl">
                Explore a diverse collection of artwork from talented artists around the world.
                Find inspiration, share your creations, and connect with the art community.
              </p>
              <div className="mt-10 flex justify-center">
                <Link
                  to="/gallery"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50"
                >
                  Explore Gallery
                </Link>
                <Link
                  to="/upload"
                  className="ml-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800"
                >
                  Upload Artwork
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Images Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Artwork</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 dark:text-red-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {featuredImages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No featured images available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredImages.map(image => (
                    <ImageCard key={image._id} image={image} />
                  ))}
                </div>
              )}
              <div className="mt-8 text-center">
                <Link
                  to="/gallery"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-gray-700 dark:text-primary-300 dark:hover:bg-gray-600"
                >
                  View All Artwork
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Photography', 'Digital', 'Painting', 'Sculpture', 'Illustration', 'Other'].map(category => (
              <Link
                key={category}
                to={`/gallery?category=${category.toLowerCase()}`}
                className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center hover:shadow-md transition-shadow duration-200"
              >
                <span className="block text-gray-900 dark:text-white font-medium">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home; 