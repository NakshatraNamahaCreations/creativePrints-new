import React, { useState, useRef, useCallback } from 'react';

const LogoUpload = () => {
  const [logos, setLogos] = useState([]);
  const [primaryIndex, setPrimaryIndex] = useState(-1);
  const fileInputRef = useRef(null);

  // Mockup images using the URLs you provided
  const mockups = {
    businessCard: "https://t4.ftcdn.net/jpg/05/37/41/81/360_F_537418161_Pd4FP3UOC8Uau8EeLCdicOnhAuFDJIYT.jpg",
    tShirt: "https://unblast.com/wp-content/uploads/2024/03/Mens-T-shirt-Mockup-PSD.jpg",
    mug: "https://img.freepik.com/free-vector/cup-mockup_1053-247.jpg?t=st=1741497628~exp=1741501228~hmac=f16d372ae5fefccbc1881f6c120b5a09a55c23081741cb20bd6cb67cd691b58b",
    keychain: "https://i.fbcd.co/products/resized/resized-750-500/43ef742f4e50abfcee7c000c117af3764160891cf9fb946f3d9bed7c9481b287.jpg"
  };

  const handleFileUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    const newLogos = files.map(file => ({
      url: URL.createObjectURL(file),
      isPrimary: logos.length === 0 && primaryIndex === -1
    }));
    
    setLogos(prev => [...prev, ...newLogos]);
    
    // Set first uploaded logo as primary if none exists
    if (primaryIndex === -1 && newLogos.length > 0) {
      setPrimaryIndex(logos.length);
    }
  }, [logos.length, primaryIndex]);

  const setPrimary = useCallback((index) => {
    setPrimaryIndex(index);
    setLogos(prev => prev.map((logo, i) => ({
      ...logo,
      isPrimary: i === index
    })));
  }, []);

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    
    if (e.dataTransfer.files.length) {
      const event = {
        target: {
          files: e.dataTransfer.files
        }
      };
      handleFileUpload(event);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Logo</h2>
          <p className="text-gray-600 mt-2">
            Upload an existing logo or create one with Logomaker by VistaPrint®. 
            Then, you can check out your logo in action on a variety of products.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
          {/* Upload area */}
          <div 
            className="upload-area border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer flex flex-col items-center justify-center space-y-3 w-[180px] h-[180px]"
            onClick={handleClickUpload}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
            />
            <div className="text-center text-gray-500">
              <i className="fas fa-cloud-upload-alt text-4xl text-blue-500 mb-2"></i>
              <p className="mt-2 text-sm font-medium">Click to upload</p>
              <p className="text-xs mt-1">or drag and drop</p>
            </div>
          </div>

          {/* Display uploaded logos */}
          <div className="flex flex-wrap gap-4 w-full md:w-2/3">
            {logos.length === 0 ? (
              <div className="text-center text-gray-400 flex flex-col items-center justify-center h-40 w-40 border border-dashed border-gray-300 rounded-lg">
                <i className="fas fa-image text-2xl"></i>
                <p className="text-xs mt-2">No logos uploaded</p>
              </div>
            ) : (
              logos.map((logo, index) => (
                <div 
                  key={index} 
                  className={`logo-container relative flex flex-col items-center p-3 rounded-lg ${logo.isPrimary ? 'logo-primary bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 border border-gray-200'}`}
                  onClick={() => setPrimary(index)}
                >
                  <img
                    src={logo.url}
                    alt={`Uploaded logo ${index + 1}`}
                    className="h-32 w-32 object-contain mb-2"
                  />
                  <div className="flex items-center justify-between w-full mt-2 absolute top-0 left-1">
                    <span className={`text-xs font-medium px-2 py-1 rounded-xl ${logo.isPrimary ? 'text-blue-600 bg-blue-100 ' : 'text-gray-600 bg-gray-100'}`}>
                      {logo.isPrimary ? 'Primary' : 'Secondary'}
                    </span>
                  </div>
                  <button 
                    className={`mt-2 text-sm font-medium py-1 px-3 rounded ${logo.isPrimary ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPrimary(index);
                    }}
                  >
                    {logo.isPrimary ? 'Selected' : 'Set as Primary'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Product preview section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Preview on products</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Business Card */}
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="h-40 bg-white rounded-lg flex items-center justify-center p-2 mb-2 relative overflow-hidden">
                <img 
                  src={mockups.businessCard} 
                  alt="Business card mockup" 
                  className="h-full w-full object-cover rounded-md" 
                />
                {primaryIndex >= 0 && (
                  <img 
                    src={logos[primaryIndex]?.url} 
                    alt="Logo preview" 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-12 max-w-20 object-contain shadow-md" 
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                  />
                )}
              </div>
              <p className="text-xs text-gray-600 mt-2">Business Card</p>
            </div>
            
            {/* T-Shirt */}
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="h-40 bg-white rounded-lg flex items-center justify-center p-2 mb-2 relative overflow-hidden">
                <img 
                  src={mockups.tShirt} 
                  alt="T-Shirt mockup" 
                  className="h-full w-full object-cover rounded-md" 
                />
                {primaryIndex >= 0 && (
                  <img 
                    src={logos[primaryIndex]?.url} 
                    alt="Logo preview" 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-10 max-w-16 object-contain" 
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                  />
                )}
              </div>
              <p className="text-xs text-gray-600 mt-2">T-Shirt</p>
            </div>
            
            {/* Mug */}
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="h-40 bg-white rounded-lg flex items-center justify-center p-2 mb-2 relative overflow-hidden">
                <img 
                  src={mockups.mug} 
                  alt="Mug mockup" 
                  className="h-full w-full object-cover rounded-md" 
                />
                {primaryIndex >= 0 && (
                  <img 
                    src={logos[primaryIndex]?.url} 
                    alt="Logo preview" 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-10 max-w-12 object-contain" 
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                  />
                )}
              </div>
              <p className="text-xs text-gray-600 mt-2">Mug</p>
            </div>
            
            {/* Keychain */}
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="h-40 bg-white rounded-lg flex items-center justify-center p-2 mb-2 relative overflow-hidden">
                <img 
                  src={mockups.keychain} 
                  alt="Keychain mockup" 
                  className="h-full w-full object-cover rounded-md" 
                />
                {primaryIndex >= 0 && (
                  <img 
                    src={logos[primaryIndex]?.url} 
                    alt="Logo preview" 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-8 max-w-10 object-contain" 
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                  />
                )}
              </div>
              <p className="text-xs text-gray-600 mt-2">Keychain</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoUpload;