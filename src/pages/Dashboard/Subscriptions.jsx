const Subscriptions = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="font-semibold text-lg mb-4">Subscriptions</h2>
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions yet</h3>
      <p className="text-gray-500 mb-4">When you subscribe to a service, it will appear here.</p>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
        View Subscription Plans
      </button>
    </div>
  </div>
);

export default Subscriptions;