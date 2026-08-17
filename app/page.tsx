import LandingPage from "@/components/LandingPage";
import { homeFaqs } from "@/lib/constants/faqs";

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
          "email": "connect@theskadi.com",
          "areaServed": [
            "US",
            "CA",
            "GB",
            "AU",
            "NZ",
            "SG"
          ],
          "availableLanguage": [
            "English"
          ]
        },
        "sameAs": [
          "https://www.facebook.com/people/Skadi/61589043703390/"
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
        "mainEntity": homeFaqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
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
