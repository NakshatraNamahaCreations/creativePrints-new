import React, { useState } from 'react';

const EmailPreferences = () => {
  const [emailOffers, setEmailOffers] = useState(false);
  const [fewerEmails, setFewerEmails] = useState(false);

  const handleSave = () => {
    // Handle save logic here
    console.log('Email offers:', emailOffers);
    console.log('Fewer emails:', fewerEmails);
    alert('Preferences saved successfully!');
  };

  const handleCancel = () => {
    // Reset to initial state
    setEmailOffers(false);
    setFewerEmails(false);
  };

  return (
    // <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-lg mt-6 w-full max-w-md p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Email </h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Would you like to sign up for exclusive email offers?
            </h2>
            
            <div className="space-y-2">
              <div className="flex items-start">
                <input
                  id="email-offers-yes"
                  type="checkbox"
                  checked={emailOffers}
                  onChange={() => setEmailOffers(true)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="email-offers-yes" className="ml-2 block text-gray-700 text-sm">
                  <span className="font-medium">Yes</span>, I'd like to receive special email offers from VistaPrint, 
                  as well as news about products, services and my designs in progress.
                </label>
              </div>
              
              <div className="flex items-start">
                <input
                  id="email-offers-no"
                  type="checkbox"
                  checked={!emailOffers}
                  onChange={() => setEmailOffers(false)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="email-offers-no" className="ml-2 block text-gray-700 text-sm">
                  <span className="font-medium">No, thanks.</span>
                </label>
              </div>
            </div>
          </div>
          
          <hr className="border-gray-200" />
          
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3 text-sm">
              Would you prefer fewer emails?
            </h2>
            
            <div className="flex items-start">
              <input
                id="fewer-emails"
                type="checkbox"
                checked={fewerEmails}
                onChange={() => setFewerEmails(!fewerEmails)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="fewer-emails" className="ml-2 block text-gray-700 text-sm">
                Yes, I'd like to receive one email a week.
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    // </div>
  );
};

export default EmailPreferences;