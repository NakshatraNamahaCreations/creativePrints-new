import { useState } from "react";
import { FiSearch, FiPackage, FiMail, FiThumbsUp, FiThumbsDown } from "react-icons/fi";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);

  const questions = [
    "Is there any support for Bulk Orders?",
    "Can I change my order?",
    "Can I cancel my order?",
    "Where's my order?",
    "What are your shipping speeds?",
  ];


  const faqData = {
    "Is there any support for Bulk Orders?": {
      video: null,
      answer: (
        <>
          <p>
            For Bulk orders exceeding Rs. 10,000, contact Customer Care for a
            discount and extra services like:
          </p>
          <ul className="list-disc ml-6">
            <li>Help with design creation</li>
            <li>Editing designs</li>
            <li>Order placement</li>
            <li>Shipping to multiple addresses</li>
          </ul>
        </>
      ),
      related: [
        "How do I get a sample before bulk order?",
        "Do you offer bulk discounts?",
      ],
    },

    "Can I change my order?": {
      video: "https://www.youtube.com/embed/VIDEO_ID", // Replace with real video
      answer: (
        <>
          <p>
            For most products, yes – up until we start printing your items.
            Here’s what you can do yourself:
          </p>
          <ul className="list-disc ml-6">
            <li>
              <a href="#" className="text-blue-800 underline">
                Cancel an order
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-800 underline">
                Change the shipping address
              </a>
            </li>
          </ul>
          <p className="mt-3 font-semibold">Contact us to change the following:</p>
          <ul className="list-disc ml-6">
            <li>The last name of the recipient or the company name</li>
            <li>The quantity, paper stock/finish, or ship speed</li>
            <li>If you need to edit the design of your product</li>
          </ul>
        </>
      ),
      related: [
        "Can I cancel my order?",
        "Why was my order canceled?",
        "Can I update my billing address?",
        "Can I change the shipping address?",
      ],
    },

    "Can I cancel my order?": {
      video: null,
      answer: (
        <>
          <p>
            Yes, you can cancel your order before it goes into production.
            Cancellation options:
          </p>
          <ul className="list-disc ml-6">
            <li>Log in to your account and go to My Orders.</li>
            <li>Select the order and click Cancel.</li>
            <li>If already shipped, you’ll need to return it after delivery.</li>
          </ul>
          <p>
            Refunds will be processed to your original payment method within 7–10
            working days.
          </p>
        </>
      ),
      related: [
        "Can I change my order?",
        "Refund policy for canceled orders?",
        "How do I track my refund?",
      ],
    },

    "Where's my order?": {
      video: null,
      answer: (
        <>
          <p>
            You can track your order online anytime using your order number.
          </p>
          <ul className="list-disc ml-6">
            <li>
              Visit{" "}
              <a href="/track-order" className="text-blue-800 underline">
                Track Order
              </a>{" "}
              page
            </li>
            <li>Enter your order number and registered email/phone</li>
            <li>See live tracking details with estimated delivery time</li>
          </ul>
        </>
      ),
      related: [
        "My order hasn't arrived, what can I do?",
        "What are your shipping speeds?",
        "Can I change my shipping address?",
      ],
    },

    "What are your shipping speeds?": {
      video: null,
      answer: (
        <>
          <p>
            We offer multiple shipping speeds depending on your location and
            product type:
          </p>
          <ul className="list-disc ml-6">
            <li>Standard Delivery: 5–7 business days</li>
            <li>Express Delivery: 2–4 business days</li>
            <li>Same-day delivery: Available in select cities</li>
          </ul>
          <p>
            Shipping cost is calculated at checkout. Look for the options during
            your order.
          </p>
        </>
      ),
      related: [
        "Where's my order?",
        "Can I change my order?",
        "Do you deliver internationally?",
      ],
    },
  };
    const categories = [
    {
      title: "Designing with VistaPrint",
      items: ["Designing my calendar", "Getting started with design studio", "Designing a Box", "Stamps & Ink", "Designing a die cut sticker"],
    },
    {
      title: "Print product details & information",
      items: ["Printing Process", "Paper Stock Descriptions", "Signage", "Office & Stationery", "Clothing & Bags"],
    },
    {
      title: "Websites, Domains & Vista x Wix",
      items: ["Vista x Wix", "Vista x Wix Plus", "Wix x 99designs by Vista", "Vista x Wix: Site Upgrade", "Domains and Mailboxes"],
    },
    {
      title: "Order tracking & follow-ups",
      items: ["Cancel or Change My Order", "Check Order Status", "Product Quality Problem", "Reordering", "Tracking My Order"],
    },
    {
      title: "Account, billing & payments",
      items: ["Billing & Invoices", "Sales Tax", "Payment", "Promotions & Credits", "My Vista Account"],
    },
    {
      title: "Design services",
      items: ["General Design Services Information", "Logos", "Postcard mailing services"],
    },
  ];

  return (
    <div className="w-full font-sans">
      {!activeFaq ? (
        <>
          {/* Hero */}
          <section className="bg-gray-100 py-16 text-center">
            <h1 className="text-3xl font-bold mb-6">Help is here.</h1>
            <div className="max-w-xl mx-auto relative">
              <input
                type="text"
                placeholder="Search for Articles"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <div className="mt-6 flex justify-center items-center space-x-2 text-gray-700 text-sm">
              <FiPackage size={18} />
              <span>
                Need help tracking an order?{" "}
                <a href="/track-order" className="text-blue-800 underline">
                  Find and track an order
                </a>
              </span>
            </div>
          </section>

          {/* Popular Questions */}
          <section className="max-w-6xl mx-auto py-12 px-6">
            <h2 className="text-xl font-bold mb-6">Popular Questions</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {questions
                .filter((q) => q.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveFaq(q)}
                    className="border rounded-md p-4 text-gray-700 hover:text-blue-800 hover:border-blue-400 transition flex justify-between items-center w-full text-left"
                  >
                    {q}
                    <span className="text-gray-400">&gt;</span>
                  </button>
                ))}
            </div>
          </section>

          {/* Contact Us */}
          <section className="max-w-6xl mx-auto py-12 px-6">
            <h2 className="text-xl font-bold mb-6">Contact us</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-gray-700">02522-669393</p>
                <p className="text-sm text-gray-500">Mon. – Sat. 10:00 AM – 7:00 PM</p>
                <span className="mt-2 inline-block text-xs bg-gray-800 text-white px-2 py-1 rounded">
                  Fastest
                </span>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-700">
                  Customer service responds Monday – Saturday.
                </p>
                <p className="text-gray-700 mt-2">
                  <a href="mailto:customerservice@vistaprint.in" className="text-blue-800 underline">
                    customerservice@vistaprint.in
                  </a>
                </p>
                <button className="mt-4 flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100">
                  <FiMail /> Email us
                </button>
              </div>
            </div>
          </section>
           {/* Help Categories */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-xl font-bold mb-6">Browse Help Centre</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {categories.map((cat, i) => (
            <div key={i}>
              <h3 className="font-semibold text-gray-800 mb-3">{cat.title}</h3>
              <ul className="space-y-2">
                {cat.items.map((item, j) => (
                  <li key={j}>
                    <a href={`/faq/${item}`} className="text-gray-700 hover:text-blue-600">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
              <a href={`/category/${cat.title}`} className="text-blue-600 text-sm mt-2 inline-block">
                See all →
              </a>
            </div>
          ))}
        </div>
      </section>
        </>
      ) : (
        /* FAQ Detail Page */
        <section className="max-w-6xl mx-auto py-12 px-6 grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <button onClick={() => setActiveFaq(null)} className="border-1 px-4 py-1 rounded-md cursor-pointer border-blue-800 text-blue-800 text-sm mb-4 block">
              ← Back
            </button>
            <h1 className="text-2xl font-bold mb-6">{activeFaq}</h1>

            {faqData[activeFaq]?.video && (
              <div className="mb-6">
                <iframe
                  width="100%"
                  height="315"
                  src={faqData[activeFaq].video}
                  title={activeFaq}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded"
                ></iframe>
              </div>
            )}

            <div className="prose prose-sm text-gray-700">{faqData[activeFaq]?.answer}</div>

            {/* Feedback */}
            <div className="mt-8 border-t pt-4">
              <p className="font-medium mb-2">Was this article helpful?</p>
              <div className="flex space-x-4">
                <button className="flex items-center gap-1 border px-3 py-2 rounded hover:bg-gray-100">
                  <FiThumbsUp /> Yes
                </button>
                <button className="flex items-center gap-1 border px-3 py-2 rounded hover:bg-gray-100">
                  <FiThumbsDown /> No
                </button>
              </div>
            </div>
          </div>

          {/* Related Questions */}
          <aside>
            <h3 className="font-semibold text-gray-800 mb-4">Related Questions</h3>
            <ul className="space-y-2">
              {faqData[activeFaq]?.related.map((q, i) => (
                <li key={i}>
                  <button
                    onClick={() => setActiveFaq(q)}
                    className="text-gray-600 hover:text-blue-800"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      )}
    </div>
  );
}
