import React from 'react';

export default function ProductSchema({ watch }) {
  if (!watch) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${watch.brand} ${watch.model}`,
    "description": watch.description,
    "image": watch.gallery || [watch.image],
    "brand": {
      "@type": "Brand",
      "name": watch.brand
    },
    "offers": {
      "@type": "Offer",
      "price": watch.price.replace(/[$₹,]/g, ''),
      "priceCurrency": "USD",
      "availability": watch.outOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Meridian Watches"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "US"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 2, "unitCode": "DAY" },
          "transitTime": { "@type": "QuantitativeValue", "minValue": 2, "maxValue": 5, "unitCode": "DAY" }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "US",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 30
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
