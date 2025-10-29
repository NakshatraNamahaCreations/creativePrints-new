const MyFavorites = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="font-semibold text-lg mb-4">My Favorites</h2>
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
      <p className="text-gray-500 mb-4">When you save items as favorites, they will appear here.</p>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
        Browse Templates
      </button>
    </div>
  </div>
);

export default MyFavorites;