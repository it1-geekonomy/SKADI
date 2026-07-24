import LandingPage from "@/components/LandingPage";

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://theskadi.com/#organization",
        "name": "Skadi",
        "url": "https://theskadi.com/",
        "description": "Skadi provides AI voice agents, AI receptionist solutions, missed call recovery, lead qualification, and automated call management solutions for businesses.",
        "knowsAbout": [
          "AI Voice Agents",
          "Artificial Intelligence",
          "Conversational AI",
          "Business Automation",
          "Customer Support Automation",
          "Sales Automation",
          "Lead Qualification",
          "Voice AI Technology"
        ],
        "areaServed": [
          { "@type": "Country", "name": "United States" },
          { "@type": "Country", "name": "United Kingdom" },
          { "@type": "Country", "name": "Canada" },
          { "@type": "Country", "name": "Australia" },
          { "@type": "Country", "name": "New Zealand" },
          { "@type": "Country", "name": "Ireland" },
          { "@type": "Country", "name": "Singapore" },
          { "@type": "Country", "name": "United Arab Emirates" }
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "availableLanguage": "English"
        },
        "sameAs": [
          "https://www.linkedin.com/company/skadi/"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://theskadi.com/#website",
        "url": "https://theskadi.com/",
        "name": "Skadi",
        "publisher": {
          "@id": "https://theskadi.com/#organization"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://theskadi.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How can businesses reduce missed calls?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Businesses can reduce missed calls by using AI voice agents that answer customer calls instantly, capture enquiries, and recover lost opportunities 24/7."
            }
          },
          {
            "@type": "Question",
            "name": "What is an AI receptionist?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "An AI receptionist uses artificial intelligence to answer business calls, handle customer questions, qualify leads, and assist with appointment scheduling."
            }
          },
          {
            "@type": "Question",
            "name": "Can AI answer business phone calls?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, AI voice agents can answer business phone calls, manage customer conversations, qualify leads, and provide automated call assistance."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <LandingPage />
    </>
  );
}
