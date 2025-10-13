const mongoose = require('mongoose');
require('dotenv').config();

const FAQ = require('../models/FAQ');

const faqData = [
  {
    question: "How do I reset my password?",
    answer: "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address and follow the instructions sent to your email.",
    category: "Account",
    keywords: ["password", "reset", "login", "forgot"],
    priority: 1
  },
  {
    question: "What are your business hours?",
    answer: "Our customer support is available Monday through Friday, 9 AM to 6 PM EST. For urgent matters outside these hours, please email us and we'll respond within 24 hours.",
    category: "General",
    keywords: ["hours", "business", "support", "time", "available"],
    priority: 1
  },
  {
    question: "How can I track my order?",
    answer: "You can track your order by logging into your account and going to 'My Orders', or by using the tracking number sent to your email. You can also track packages directly on the shipping carrier's website.",
    category: "Orders",
    keywords: ["track", "order", "shipping", "delivery", "package"],
    priority: 1
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Some items like electronics have a 14-day return window. Please contact us before returning items.",
    category: "Returns",
    keywords: ["return", "refund", "policy", "exchange", "30 days"],
    priority: 1
  },
  {
    question: "How do I update my billing information?",
    answer: "To update your billing information, log into your account, go to 'Account Settings', then 'Billing Information'. You can update your payment method, billing address, and other billing details there.",
    category: "Billing",
    keywords: ["billing", "payment", "credit card", "update", "information"],
    priority: 1
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. Please check our shipping calculator for specific rates to your country.",
    category: "Shipping",
    keywords: ["international", "shipping", "worldwide", "global", "overseas"],
    priority: 2
  },
  {
    question: "How do I cancel my subscription?",
    answer: "To cancel your subscription, go to your account settings, find the 'Subscription' section, and click 'Cancel Subscription'. You'll continue to have access until the end of your current billing period.",
    category: "Subscription",
    keywords: ["cancel", "subscription", "unsubscribe", "stop", "end"],
    priority: 1
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers for certain amounts. All payments are processed securely.",
    category: "Payment",
    keywords: ["payment", "credit card", "paypal", "apple pay", "methods"],
    priority: 1
  },
  {
    question: "How do I contact customer support?",
    answer: "You can contact our customer support through this chat, email at support@company.com, or phone at 1-800-SUPPORT. Our support team is available Monday-Friday, 9 AM to 6 PM EST.",
    category: "Support",
    keywords: ["contact", "support", "help", "phone", "email"],
    priority: 1
  },
  {
    question: "Is my personal information secure?",
    answer: "Yes, we take data security seriously. All personal information is encrypted and stored securely. We never share your information with third parties without your consent and comply with all data protection regulations.",
    category: "Security",
    keywords: ["security", "privacy", "data", "personal", "information", "secure"],
    priority: 1
  }
];

async function seedFAQs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/customer_support_bot');
    console.log('Connected to MongoDB');

    // Clear existing FAQs
    await FAQ.deleteMany({});
    console.log('Cleared existing FAQs');

    // Insert new FAQs
    await FAQ.insertMany(faqData);
    console.log(`Seeded ${faqData.length} FAQs`);

    console.log('FAQ seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding FAQs:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedFAQs();

