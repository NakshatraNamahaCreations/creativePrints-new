const DesignServices = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="font-semibold text-lg mb-4">My Design Services</h2>
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No design services yet</h3>
      <p className="text-gray-500 mb-4">When you use our design services, you'll see them here.</p>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
        Explore Design Services
      </button>
    </div>
  </div>
);

export default DesignServices;