import React, { useState } from "react";

const   FAQPage = () => {
  const sections = [
    {
      id: "subscriber",
      title: "Becoming a Subscriber",
      content: (
        <>
          <p className="text-lg mb-4">
            <strong>Q: How do I subscribe?</strong>
            <br />
            A: Visit our subscription page to explore options that best suit your culinary needs. You can choose from monthly or annual plans for access to exclusive recipes and e-books.
          </p>
          <p className="text-lg">
            <strong>Q: Is international access available?</strong>
            <br />
            A: Yes, subscriptions are available globally. Prices will be shown in your local currency during checkout.
          </p>
        </>
      ),
    },
    {
      id: "subscription",
      title: "Subscription Benefits",
      content: (
        <>
          <p className="text-lg mb-4">
            <strong>Q: What benefits do I receive as a subscriber?</strong>
            <br />
            A: Subscribers enjoy unlimited access to thousands of curated recipes, in-depth cooking guides, and exclusive content. You also receive free or discounted access to premium e-books and printed cookbooks from top chefs.
          </p>
          <p className="text-lg">
            <strong>Q: Do I get access to new content?</strong>
            <br />
            A: Yes, we frequently update our collection with new recipes, culinary guides, and special editions of e-books.
          </p>
        </>
      ),
    },
    {
      id: "account-management",
      title: "Account Creation & Management",
      content: (
        <>
          <p className="text-lg mb-4">
            <strong>Q: How do I create an account?</strong>
            <br />
            A: Upon subscribing, you'll receive a welcome email with a link to set up your account. Follow the instructions to create a username and password for easy access to all your purchases.
          </p>
          <p className="text-lg">
            <strong>Q: How can I update my personal information?</strong>
            <br />
            A: Log into your account dashboard where you can update your email, password, or other account details. If you encounter issues, feel free to contact our support team.
          </p>
        </>
      ),
    },
    {
      id: "purchase",
      title: "Purchasing Recipes and Cookbooks",
      content: (
        <>
          <p className="text-lg mb-4">
            <strong>Q: How do I buy individual recipes or e-books?</strong>
            <br />
            A: Simply browse our store, select the items you’re interested in, and add them to your cart. You can purchase them individually without a subscription, though members enjoy exclusive discounts.
          </p>
          <p className="text-lg">
            <strong>Q: Do you offer gift options?</strong>
            <br />
            A: Yes, you can purchase e-book or recipe gift cards for friends and family. Personalized gift messages are available during checkout.
          </p>
        </>
      ),
    },
    {
      id: "billing",
      title: "Billing & Refunds",
      content: (
        <>
          <p className="text-lg mb-4">
            <strong>Q: What payment methods are accepted?</strong>
            <br />
            A: We accept major credit cards, PayPal, and Google Pay. Recurring subscriptions will be charged automatically based on your billing cycle.
          </p>
          <p className="text-lg">
            <strong>Q: How do refunds work?</strong>
            <br />
            A: Refunds may be available for specific cases and are processed within 7-10 business days. Please contact customer support if you believe you're eligible for a refund.
          </p>
        </>
      ),
    },
    {
      id: "app-access",
      title: "App Access",
      content: (
        <>
          <p className="text-lg mb-4">
            <strong>Q: Can I access my purchases through the app?</strong>
            <br />
            A: Yes, subscribers can access their recipes and e-books directly through our app. Simply sign in with the email linked to your account.
          </p>
          <p className="text-lg">
            <strong>Q: Is the app available on all devices?</strong>
            <br />
            A: Our app is currently available on iOS and Android devices. Download it from the Apple App Store or Google Play.
          </p>
        </>
      ),
    },
    {
      id: "contact",
      title: "Contact Us",
      content: (
        <>
          <p className="text-lg">
            If you have further questions, feel free to contact us:
          </p>
          <ul className="text-lg mt-4 space-y-2">
            <li><strong>Email:</strong> support@recipehub.com</li>
            <li><strong>Phone:</strong> (555) 123-4567</li>
            <li><strong>Support Hours:</strong> Monday to Friday, 9am - 5pm</li>
          </ul>
        </>
      ),
    }
  ];

  const [openSections, setOpenSections] = useState(sections.map(section => section.id));

  const toggleSection = (sectionId) => {
    setOpenSections((prevOpenSections) =>
      prevOpenSections.includes(sectionId)
        ? prevOpenSections.filter((id) => id !== sectionId)
        : [...prevOpenSections, sectionId]
    );
  };

  return (
      <div className="min-h-screen bg-gray-50 py-6 flex flex-col justify-center relative overflow-hidden sm:py-12">
        <img
          src="https://play.tailwindcss.com/img/beams.jpg"
          alt=""
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none"
          width="1308"
        />
        <div className="relative z-10 max-w-5xl mx-auto p-8 mb-12 mt-24">
          <h1 className="inline-block py-1 px-3 mb-4 text-xs font-semibold text-center text-orange-900 bg-orange-50 rounded-full">
            Frequently Asked Questions: Recipe and Cookbook Marketplace
          </h1>
          <p className="font-heading text-5xl xs:text-6xl md:text-7xl font-bold">
            You ask? We <span className="font-serif italic">answer.</span>
          </p>

          {/* Section Navigation */}
          <nav className="mb-12 mt-12">
            <h2 className="text-2xl font-semibold mb-4">Jump to a Section:</h2>
            <ul className="text-lg space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-blue-600 hover:underline">
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Accordion Sections */}
          {sections.map((section) => (
            <div
              key={section.id}
              className={`accordion border border-solid border-gray-300 p-4 rounded-xl mb-8 ${
                openSections.includes(section.id) ? "bg-indigo-50 border-indigo-600" : ""
              }`}
            >
              <button
                className="accordion-toggle inline-flex items-center justify-between text-left text-lg font-normal leading-8 text-gray-900 w-full transition duration-500 "
                onClick={() => toggleSection(section.id)}
                aria-expanded={openSections.includes(section.id)}
              >
                <h5>{section.title}</h5>
                <svg
                  className={`w-6 h-6 text-gray-900 transition duration-500 ${openSections.includes(section.id) ? "hidden" : "block"}`}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path d="M6 12H18M12 18V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <svg
                  className={`w-6 h-6 text-gray-900 transition duration-500 ${openSections.includes(section.id) ? "block" : "hidden"}`}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path d="M6 12H18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
              {openSections.includes(section.id) && (
                <div className="accordion-content w-full overflow-hidden mt-4">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
  );
};

export default FAQPage;
