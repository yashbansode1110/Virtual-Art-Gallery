import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ImageCard from '../components/common/ImageCard';
import InfiniteScroll from 'react-infinite-scroll-component';

function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalImages, setTotalImages] = useState(0);
  
  // Filter states
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  
  // Categories array
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'photography', name: 'Photography' },
    { id: 'digital', name: 'Digital Art' },
    { id: 'painting', name: 'Painting' },
    { id: 'sculpture', name: 'Sculpture' },
    { id: 'illustration', name: 'Illustration' },
    { id: 'other', name: 'Other' }
  ];
  
  // Sort options
  const sortOptions = [
    { id: 'newest', name: 'Newest' },
    { id: 'oldest', name: 'Oldest' },
    { id: 'popular', name: 'Most Popular' }
  ];
  
  // Load images based on filters
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let queryParams = new URLSearchParams();
        queryParams.append('page', 1);
        queryParams.append('limit', 12);
        
        if (category !== 'all') {
          queryParams.append('category', category);
        }
        
        if (searchTerm) {
          queryParams.append('search', searchTerm);
        }
        
        if (sortBy) {
          queryParams.append('sortBy', sortBy);
        }
        
        // Update URL search params
        setSearchParams(queryParams);
        
        const { data } = await axios.get(`/images?${queryParams.toString()}`);
        
        setImages(Array.isArray(data) ? data : (data?.images || []));
        setTotalImages(data.totalImages);
        setHasMore(data.pages > 1);
        setPage(1);
      } catch (err) {
        console.error('Error fetching images:', err);
        setError('Failed to load images. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchImages();
  }, [category, sortBy, searchTerm]);
  
  // Load more images for infinite scroll
  const fetchMoreImages = async () => {
    try {
      const nextPage = page + 1;
      
      let queryParams = new URLSearchParams();
      queryParams.append('page', nextPage);
      queryParams.append('limit', 12);
      
      if (category !== 'all') {
        queryParams.append('category', category);
      }
      
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      if (sortBy) {
        queryParams.append('sortBy', sortBy);
      }
      
      const { data } = await axios.get(`/images?${queryParams.toString()}`);
      
      const newImages = Array.isArray(data) ? data : (data?.images || []);
      setImages([...images, ...newImages]);
      setHasMore(nextPage < data.pages);
      setPage(nextPage);
    } catch (err) {
      console.error('Error fetching more images:', err);
    }
  };
  
  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchValue = formData.get('search');
    setSearchTerm(searchValue);
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Art Gallery</h1>
      
      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Category Filter */}
          <div className="flex-1">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-input"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sort Filter */}
          <div className="flex-1">
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1">
            <form onSubmit={handleSearchSubmit}>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="search"
                  name="search"
                  defaultValue={searchTerm}
                  placeholder="Search by title, tag, or description"
                  className="form-input rounded-r-none"
                />
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 rounded-r-md hover:bg-primary-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Gallery Content */}
      {loading && page === 1 ? (
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
          {images.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No images found</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Try changing your search criteria or check back later.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Showing {images.length} of {totalImages} results
              </p>
              
              <InfiniteScroll
                dataLength={images.length}
                next={fetchMoreImages}
                hasMore={hasMore}
                loader={
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                  </div>
                }
                endMessage={
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    You've seen all images
                  </p>
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map(image => (
                    <ImageCard key={image._id} image={image} />
                  ))}
                </div>
              </InfiniteScroll>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Gallery; 