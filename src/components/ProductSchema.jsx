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
      "price": watch.price.replace(/[₹,]/g, ''),
      "priceCurrency": "INR",
      "availability": watch.outOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Meridian Watches"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "IN"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 3, "unitCode": "DAY" },
          "transitTime": { "@type": "QuantitativeValue", "minValue": 3, "maxValue": 7, "unitCode": "DAY" }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "IN",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 7
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
