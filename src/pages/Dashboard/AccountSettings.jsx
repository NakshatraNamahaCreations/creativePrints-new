import { useEffect, useState } from "react";
import OutlineButton from "../../ui/OutlineButton";
import DeleteAccountModal from "../../components/DeleteAccountModal";
import EmailPreferences from "../../components/EmailPreferences";

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState("Personal Info");
  const [showDelModal, setShowDelModal] = useState(false);

  const handleDeleteAccount = async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Account deleted successfully");
        resolve();
      }, 1500);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="font-semibold text-lg mb-4">Accounts Settings</h2>
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "Personal Info"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Personal Info")}
        >
          Personal Info
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "Security"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Security")}
        >
          Security
        </button>

        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "Preference"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Preference")}
        >
          Preference
        </button>
      </div>

      {activeTab === "Personal Info" && (
        <div className="max-w-sm">
          <div>
            <h5 className="font-semibold mb-2">Name</h5>
            <p className="text-gray-600 pb-4">Sonali Keshri</p>
          </div>
          <hr />
          <div>
            <h5 className="font-semibold my-2">Email</h5>
            <p className="text-gray-600 pb-4">sonaliKeshri@gmail.com</p>
            <p className="text-gray-600 pb-4">
              In order to change your email, disconnect your social accounts.
            </p>
          </div>
          <hr />
          <div>
            <div className="flex justify-between">
              <h5 className="font-semibold my-2">Google</h5>
              <a href="/">Disconnect</a>
            </div>
            <p className="text-gray-600 pb-4">
              In order to change your account information, visit your Google
              account settings.
            </p>
          </div>
          <hr />
          <p>
            To update your address, go to <a href="/">Payment & Delivery</a>
          </p>
        </div>
      )}
      {activeTab === "Security" && (
        <div>
          <h5 className="font-semibold mb-2">Delete account</h5>
          <OutlineButton
            buttonText="Start Process"
            onClick={() => setShowDelModal(true)}
          />
        </div>
      )}

      {activeTab === "Preference" && (
        <div>
          <h5 className="font-semibold mb-2">Email account</h5>
          <p className="text-gray-600 pb-4">
            You can update your marketing preferences at any time.
          </p>
          <p className="text-gray-600 ">
            For more information, please read our
          </p>
          <a href="/" className="underline">
            {" "}
            Privacy and Cookie Policy.
          </a>
          <EmailPreferences/>
        </div>
      )}

      <DeleteAccountModal
        isOpen={showDelModal}
        onClose={() => setShowDelModal(false)}
        onDelete={handleDeleteAccount}
      />

      {/* <div className="space-y-6">
      <div>
        <h3 className="text-md font-medium text-gray-900 mb-2">Account Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Email Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">SMS Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Two-Factor Authentication</span>
            <button className="text-blue-600 text-sm font-medium">Enable</button>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-medium text-gray-900 mb-2">Payment & Delivery</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Default Payment Method</span>
            <button className="text-blue-600 text-sm font-medium">Add Card</button>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Billing Address</span>
            <button className="text-blue-600 text-sm font-medium">Edit</button>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Shipping Address</span>
            <button className="text-blue-600 text-sm font-medium">Edit</button>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
          Save Changes
        </button>
      </div>
    </div> */}
    </div>
  );
};

export default AccountSettings;
