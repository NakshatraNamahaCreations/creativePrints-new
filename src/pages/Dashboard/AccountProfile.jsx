import React, { useState } from "react";
import Select from "react-select";

const AccountProfile = () => {
  const [businessInfo, setBusinessInfo] = useState({
    hasBusiness: "yes",
    businessName: "ewwgwg",
    industry: "other",
    employees: "11-50",
    launchYear: "2012",
    businessStage: "established",
    businessType: [],
    vistaprintUsage: [],
    designMethod: [],
    personalUse: "yes",
    personalReason: [],
    personalRecipient: [],
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      // Handle checkbox inputs for arrays
      setBusinessInfo((prev) => {
        const currentArray = prev[name] || [];
        if (e.target.checked) {
          return {
            ...prev,
            [name]: [...currentArray, value],
          };
        } else {
          return {
            ...prev,
            [name]: currentArray.filter((item) => item !== value),
          };
        }
      });
    } else {
      // Handle all other inputs
      setBusinessInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const industries = [
    "Accounting & Financial",
    "Advertising & Marketing",
    "Agriculture",
    "Automotive",
    "Beauty & Personal Care",
    "Construction",
    "Education",
    "Entertainment",
    "Food & Beverage",
    "Healthcare",
    "Legal",
    "Manufacturing",
    "Non-profit",
    "Real Estate",
    "Retail",
    "Technology",
    "Travel & Hospitality",
    "Other",
  ];

  const industryOptions = industries.map((industry) => ({
    label: industry,
    value: industry.toLowerCase().replace(/\s+/g, "-"),
  }));

  const handleIndustryChange = (selectedOption) => {
    setBusinessInfo((prev) => ({
      ...prev,
      industry: selectedOption ? selectedOption.value : "",
    }));
  };

  const employeeRanges = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1000+",
  ];

  const launchYears = Array.from({ length: 25 }, (_, i) =>
    (2023 - i).toString()
  );

  const businessStages = [
    { id: "established", label: "Established business" },
    { id: "planning", label: "Planning to launch" },
    { id: "justLaunched", label: "Just launched" },
    { id: "growing", label: "Growing business" },
  ];

  const businessTypes = [
    { id: "online", label: "Online (For example, e-commerce)" },
    { id: "instore", label: "In-store / brick-and-mortar" },
    {
      id: "offsite",
      label: "Offsite / on-the-go (For example, construction or landscaping)",
    },
    { id: "popup", label: "Pop-up shops and temporary locations" },
    { id: "otherBusiness", label: "Other" },
  ];

  const vistaprintUsages = [
    { id: "branding", label: "Strengthen my branding" },
    { id: "launch", label: "Launch my new business" },
    { id: "local", label: "Grow my local presence" },
    { id: "event", label: "Prepare for an event" },
    { id: "gifts", label: "Create engaging gifts and giveaways" },
    { id: "team", label: "Outfit my team" },
    { id: "otherUsage", label: "Other" },
  ];

  const designMethods = [
    { id: "templates", label: "I use VistaPrint templates" },
    {
      id: "thirdParty",
      label: "I use a third-party tool (Canva, Adobe Illustrator)",
    },
    { id: "designer", label: "I have a designer" },
    { id: "needHelp", label: "I need design help" },
  ];

  const personalReasons = [
    { id: "parties", label: "Parties & events" },
    { id: "gifting", label: "Gifting" },
    { id: "home", label: "Products for the home" },
    { id: "holidays", label: "Holidays" },
    { id: "otherReason", label: "Other" },
  ];

  const personalRecipients = [
    { id: "myself", label: "Myself" },
    { id: "spouse", label: "Spouse / significant other" },
    { id: "children", label: "Children" },
    { id: "family", label: "Parent(s) / extended family" },
    { id: "friends", label: "Friends" },
    { id: "otherRecipient", label: "Other" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", businessInfo);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="font-semibold text-lg mb-4">Account Profile</h2>

      <div className="space-y-6">
        {/* Profile Image Section */}
        {/* <div className="flex items-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500">Profile Image</span>
          </div>
          <div className="ml-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
              Upload Photo
            </button>
          </div>
        </div> */}

        {/* Personal Information */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Doe"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="john.doe@example.com"
            />
          </div>
        </div> */}

        {/* Business Information Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-md font-medium text-gray-900 mb-4">Business</h3>
          <p className="text-sm text-gray-600 mb-4">
            Do you use CreativePrint for a business?
          </p>

          <div className="flex space-x-4 mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="hasBusiness"
                value="yes"
                checked={businessInfo.hasBusiness === "yes"}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="hasBusiness"
                value="no"
                checked={businessInfo.hasBusiness === "no"}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">No</span>
            </label>
          </div>

          {businessInfo.hasBusiness === "yes" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What's the business name?
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={businessInfo.businessName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What industry best describes this business?
                </label>
                <Select
                  options={industryOptions}
                  onChange={handleIndustryChange}
                  value={
                    industryOptions.find(
                      (option) => option.value === businessInfo.industry
                    ) || null
                  }
                  placeholder="Select industry"
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How many employees does this business have?
                </label>
                <select
                  name="employees"
                  value={businessInfo.employees}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {employeeRanges.map((range) => (
                    <option key={range} value={range}>
                      {range} employees
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What year did this business launch?
                </label>
                <select
                  name="launchYear"
                  value={businessInfo.launchYear}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select year</option>
                  {launchYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      My business hasn't launched yet
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What stage is this business in?
                </label>
                <div className="space-y-2">
                  {businessStages.map((stage) => (
                    <label key={stage.id} className="flex items-center">
                      <input
                        type="radio"
                        name="businessStage"
                        value={stage.id}
                        checked={businessInfo.businessStage === stage.id}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {stage.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What best describes this business?
                </label>
                <div className="space-y-2">
                  {businessTypes.map((type) => (
                    <label key={type.id} className="flex items-center">
                      <input
                        type="checkbox"
                        name="businessType"
                        value={type.id}
                        checked={businessInfo.businessType.includes(type.id)}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What do you use VistaPrint for?
                </label>
                <div className="space-y-2">
                  {vistaprintUsages.map((usage) => (
                    <label key={usage.id} className="flex items-center">
                      <input
                        type="checkbox"
                        name="vistaprintUsage"
                        value={usage.id}
                        checked={businessInfo.vistaprintUsage.includes(
                          usage.id
                        )}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {usage.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How does this business design things?
                </label>
                <div className="space-y-2">
                  {designMethods.map((method) => (
                    <label key={method.id} className="flex items-center">
                      <input
                        type="checkbox"
                        name="designMethod"
                        value={method.id}
                        checked={businessInfo.designMethod.includes(method.id)}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Personal Use Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-md font-medium text-gray-900 mb-4">Personal</h3>
          <p className="text-sm text-gray-600 mb-4">
            Do you use VistaPrint for personal use?
          </p>

          <div className="flex space-x-4 mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="personalUse"
                value="yes"
                checked={businessInfo.personalUse === "yes"}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="personalUse"
                value="no"
                checked={businessInfo.personalUse === "no"}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">No</span>
            </label>
          </div>

          {businessInfo.personalUse === "yes" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What is your reason for shopping?
                </label>
                <div className="space-y-2">
                  {personalReasons.map((reason) => (
                    <label key={reason.id} className="flex items-center">
                      <input
                        type="checkbox"
                        name="personalReason"
                        value={reason.id}
                        checked={businessInfo.personalReason.includes(
                          reason.id
                        )}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {reason.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Who do you shop for?
                </label>
                <div className="space-y-2">
                  {personalRecipients.map((recipient) => (
                    <label key={recipient.id} className="flex items-center">
                      <input
                        type="checkbox"
                        name="personalRecipient"
                        value={recipient.id}
                        checked={businessInfo.personalRecipient.includes(
                          recipient.id
                        )}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {recipient.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-200 flex justify-between">
          <div>
            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 mr-2"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
          <button
            type="button"
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;
