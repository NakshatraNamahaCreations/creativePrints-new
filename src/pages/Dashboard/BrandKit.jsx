import React, { useState } from 'react';
import LogoUpload from "../../ui/LogoUpload"

const BrandKit = () => {
  const [logo, setLogo] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result); // Set the image source to the state
      };
      reader.readAsDataURL(file); // Convert the image to a base64 string
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Brand Kit Container */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">

        {/* Heading */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-4">Primary Brand Kit</h2>
          <p className="text-sm text-gray-600 mb-4">
            New! Create the ultimate design toolkit for your business.
          </p>
        </div>

        {/* Identity Section */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name*</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Tips if it embodies the feeling of your brand, the name will be memorable."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Text (optional)</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder='Examples: "Best pizza in London", "Since 2001", "Law Officer"'
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry (optional)</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder='Try something like "Restaurant" or "Shop"'
            />
          </div>
        </div>

        {/* Logo Section */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Logo</label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
            {logo ? (
              <img src={logo} alt="Logo" className="mx-auto h-12 w-12" />
            ) : (
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="mt-4 text-sm text-gray-600"
            />
            <p className="mt-2 text-sm text-gray-600">Upload an existing logo.</p>
          </div>
        </div> */}

        <LogoUpload/>

        {/* Colors Section */}
        <div className="mt-8">
          <h3 className="font-semibold text-lg mb-4">Colours</h3>
          <p className="text-sm text-gray-600 mb-6">Create your own colour palette.</p>

          <button className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mb-8">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </button>

          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="h-24 w-full bg-gray-200 rounded-md"></div>
            <div className="h-24 w-full bg-green-500 rounded-md"></div>
            <div className="h-24 w-full bg-yellow-200 rounded-md"></div>
          </div>
        </div>

        {/* Fonts Section */}
        <div className="mt-8">
          <h3 className="font-semibold text-lg mb-4">Fonts</h3>
          <p className="text-sm text-gray-600 mb-6">
            Select one for each headline and body text. Then we'll show you an example.
          </p>

          {/* Font Selection Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left text-sm font-medium text-gray-700 pb-2">Headline</th>
                  <th className="text-left text-sm font-medium text-gray-700 pb-2">Subheading</th>
                  <th className="text-left text-sm font-medium text-gray-700 pb-2">Body</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="pr-4 py-2">
                    <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                      <option>Select Font</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                      <option>Select Font</option>
                    </select>
                  </td>
                  <td className="pl-4 py-2">
                    <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                      <option>Select Font</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Font Preview */}
          <div className="mt-8 p-4 border border-gray-200 rounded-md">
            <h4 className="text-lg font-semibold mb-2">Here's a really great headline</h4>
            <p className="text-gray-600">
              This is an example of body text that would appear underneath the headline to demonstrate how your font choices work together.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BrandKit;
