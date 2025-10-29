import React, { useState } from "react";

/** Chevron icon (rotates when open) */
const Chevron = ({ open }) => (
  <svg
    className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const faqs = [
  {
    q: "What are the dimensions of the Classic Visiting Cards?",
    a: "The final card size is 9.1 x 5.5 cm. The dimensions shown on the design page include the bleed area (safety area).",
  },
  {
    q: "How do I upload my own design?",
    a: "Click ‘Upload design’, choose a file (PNG/JPG/PDF), and follow the crop/safety guides before adding to cart.",
  },
  {
    q: "What is the bleed area, and why is it important?",
    a: "Bleed is extra space beyond the final trim. Extending backgrounds into bleed prevents unintended white edges.",
  },
  {
    q: "Can I preview my visiting card before placing the order?",
    a: "Yes. You’ll see a live preview with trim and safety guides. Review all text and imagery before checkout.",
  },
  {
    q: "What paper options are available for the Classic Visiting Cards?",
    a: "Matte, Glossy, and Premium Textured stocks are available. Thickness and finish vary by selection.",
  },
  {
    q: "Can I reorder my previous designs?",
    a: "Absolutely—find past orders in your account and reorder with the same specs or make quick edits.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState(0); // default: first one open

  const toggle = (idx) => setOpen((prev) => (prev === idx ? -1 : idx));

  return (
    <main className="min-h-screen bg-[#F7F7EC]">
      <div className="max-w-20xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Heading */}
          <div className="lg:col-span-5">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Frequently Asked Questions
            </h1>
          </div>

          {/* Right: Accordion */}
          <section className="lg:col-span-7">
            <div className="divide-y divide-gray-200">
              {faqs.map((item, idx) => {
                const isOpen = open === idx;
                return (
                  <div key={idx} className="py-5">
                    <button
                      className="w-full flex items-center justify-between text-left group"
                      onClick={() => toggle(idx)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${idx}`}
                    >
                      <p className="text-gray-900 font-semibold">
                        <span className="mr-2 text-gray-700">Q)</span>
                        {item.q}
                      </p>
                      <span className="text-gray-700 group-hover:text-gray-900">
                        <Chevron open={isOpen} />
                      </span>
                    </button>

                    {/* Answer */}
                    <div
                      id={`faq-panel-${idx}`}
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="mt-4 text-gray-800 leading-7">
                          <span className="mr-2 font-medium text-gray-700">A:</span>
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
