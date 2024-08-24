import ogImageSrc from "@images/social.png";

export const SITE = {
  title: "PriceResonance",
  tagline: "Top saas price track Tools",
  description: "Building price dataset with PriceResonance.straightforward with a bunch of url list,natural language task description,AI take care of everything.",
  description_short: "Building price dataset with PriceResonance.straightforward with a bunch of url list,natural language task description,AI take care of everything.",
  url: "https://priceresonance.com",
  author: "Emil Gulamov",
};

export const SEO = {
  title: SITE.title,
  description: SITE.description,
  structuredData: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    inLanguage: "en-US",
    "@id": SITE.url,
    url: SITE.url,
    name: SITE.title,
    description: SITE.description,
    isPartOf: {
      "@type": "WebSite",
      url: SITE.url,
      name: SITE.title,
      description: SITE.description,
    },
  },
};

export const OG = {
  locale: "en_US",
  type: "website",
  url: SITE.url,
  title: `${SITE.title}: : tool that help to Track your competitor pricing strategy with LLM No code No point click method`,
  description: "Building price dataset with PriceResonance.straightforward with a bunch of url list,natural language task description,AI take care of everything.",
  image: ogImageSrc,
};
