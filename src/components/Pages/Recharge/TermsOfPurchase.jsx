import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md text-gray-800 mb-10">
      <h1 className="text-2xl font-black mb-6">
        Terms and Conditions for Purchasing Coins
      </h1>
      <p className="mb-4">
        <strong>Effective Date:</strong> November 2023
      </p>
      <p className="mb-6">
        These terms and conditions ("Terms") govern the purchase of virtual
        coins ("Coins") and digital content (including eBooks, recipes, and
        other materials) on our website ("Website"). By making a transaction,
        you agree to these Terms.
      </p>

      <h2 className="text-lg font-semibold mb-4">1. Conditions for Purchasing Coins and Content</h2>
      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>
          To make a purchase, you must:
          <ul className="list-decimal ml-8 space-y-1">
            <li>Be a registered user on the Website.</li>
            <li>
              Be at least 18 years old or the legal age of majority in your
              jurisdiction.
            </li>
          </ul>
        </li>
        <li>
          Coins can only be used within the Website and cannot be exchanged for
          cash or used for purposes outside the platform.
        </li>
        <li>
          We reserve the right to refuse transactions if we detect violations or
          suspect fraudulent activities.
        </li>
      </ul>

      <h2 className="text-lg font-semibold mb-4">2. Payment Methods and Transactions</h2>
      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>
          We accept payments via bank cards, e-wallets, and other methods
          specified on the Website.
        </li>
        <li>
          If a transaction fails due to errors from the bank or payment service
          provider, we will cancel the transaction.
        </li>
        <li>
          If your account is mistakenly credited with more Coins than the
          purchased amount, we reserve the right to adjust the balance.
        </li>
      </ul>

      <h2 className="text-lg font-semibold mb-4">3. Refund Policy</h2>
      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>
          You may request a refund within 14 days of the transaction, provided
          that the Coins or content have not been used.
        </li>
        <li>
          To request a refund, please contact our customer support team and
          provide the transaction details.
        </li>
        <li>
          Refunds will be processed to the original payment method and may take
          up to 7 business days to complete.
        </li>
        <li>
          We reserve the right to deny refund requests if we detect abuse or
          violations of the policy.
        </li>
      </ul>

      <h2 className="text-lg font-semibold mb-4">4. Changes to Terms</h2>
      <p className="mb-6">
        We may update these Terms without prior notice. Continued use of the
        Website after changes are made constitutes acceptance of the updated
        Terms.
      </p>

      <h2 className="text-lg font-semibold mb-4">5. Contact Support</h2>
      <p>
        If you have any questions or concerns, please contact us via email at:{" "}
        <a
          href="mailto:support@example.com"
          className="text-blue-500 hover:underline"
        >
          support@example.com
        </a>
        .
      </p>
    </div>
  );
};

export default TermsAndConditions;
