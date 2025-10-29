import React, { useState } from "react";
import Input from "../ui/Input";

const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the subscription logic
    console.log("Subscribed with email:", email);
    setSubscribed(true);
    setEmail("");

    // Reset after 3 seconds
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-blue-50 to-white p-4">
      <div className="max-w-4xl w-full flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
        {/* Image Section */}
        <div className="md:w-2/5 relative">
          <img
            // src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
            src="/bg-news.jpg"
            alt="Shopping discount"
            className="w-full h-64 md:h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <div className="text-white">
              <p className="text-xs uppercase tracking-wider">
                Exclusive Offer
              </p>
              <h3 className="text-2xl font-bold mt-1">New Customer Discount</h3>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="md:w-3/5 bg-white p-8 md:p-10 flex flex-col justify-center">
          <div className="text-center mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
              Just For You
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">
            GET YOUR DISCOUNT AT FIRST ORDER
          </h2>

          <div className="text-center mb-6">
            <span className="inline-block bg-gradient-to-r from-blue-300 to-blue-800 text-white text-4xl md:text-5xl font-bold px-6 py-3 rounded-lg shadow-lg">
              15% OFF
            </span>
          </div>

          <h3 className="text-xl font-semibold text-center text-gray-700 mb-6">
            Subscribe & Get 15% Discount
          </h3>

          {subscribed ? (
            <div className="bg-green-100 text-green-700 p-4 rounded-lg text-center mb-6">
              <p className="font-medium">
                Thank you for subscribing! Check your email for your discount
                code.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
       
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-300 to-blue-800 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-center text-gray-600 text-sm mb-6">
            Always Get Up to Date With Our Offers...!!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSubscription;
