const domain = 'smgnhj-dr.myshopify.com';
const adminToken = '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';

const watches = [
  {
    title: 'OLEVS BROWN LEATHER',
    body_html: 'A testament to timeless elegance, this chronograph blends a rich crocodile-texture leather strap with a meticulously crafted rose gold case.',
    vendor: 'OLEVS',
    product_type: 'Watch',
    tags: 'luxury, leather, chronograph',
    price: '4420.00'
  },
  {
    title: 'OLEVS MOON PHASE',
    body_html: 'Navigate the celestial dance with a stunning moon phase complication set against a deep royal blue dial.',
    vendor: 'OLEVS',
    product_type: 'Watch',
    tags: 'moon phase, automatic',
    price: '4419.00'
  },
  {
    title: 'HEXA HUSTLER AUTO',
    body_html: 'Built for the relentless. The HEXA Hustler features a kinetic automatic movement powered by your own momentum.',
    vendor: 'HEXA',
    product_type: 'Watch',
    tags: 'automatic, steel, brutalist',
    price: '7999.00'
  },
  {
    title: 'FORSINING TOURBILLON',
    body_html: 'Mechanical artistry unveiled. This skeletonized tourbillon-style watch strips away the dial to reveal the mesmerizing heartbeat.',
    vendor: 'FORSINING',
    product_type: 'Watch',
    tags: 'tourbillon, skeleton, mechanical',
    price: '9106.00'
  },
  {
    title: 'OLEVS DIAMOND DRESS',
    body_html: 'Command attention in any boardroom. A vibrant ruby-red dial provides a stunning contrast to diamond-accented hour markers.',
    vendor: 'OLEVS',
    product_type: 'Watch',
    tags: 'diamond, dress watch, luxury',
    price: '4420.00'
  },
  {
    title: 'OLEVS PREM CHRONO',
    body_html: 'The ultimate intersection of sport and luxury. Featuring a rugged diver-style bezel and a jet-black dial accented in gold.',
    vendor: 'OLEVS',
    product_type: 'Watch',
    tags: 'diver, chronograph, sport',
    price: '4420.00'
  }
];

async function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function uploadWatches() {
  for (const watch of watches) {
    try {
      console.log(`Processing: ${watch.title}`);
      
      const payload = {
        product: {
          title: watch.title,
          body_html: watch.body_html,
          vendor: watch.vendor,
          product_type: watch.product_type,
          tags: watch.tags,
          status: 'active',
          variants: [
            {
              price: watch.price,
              inventory_management: "shopify",
              inventory_quantity: 100
            }
          ]
        }
      };

      const res = await fetch(`https://${domain}/admin/api/2024-01/products.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminToken
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        console.error(`Failed to create ${watch.title}. Status: ${res.status}`);
        const errorText = await res.text();
        console.error(errorText);
      } else {
        const data = await res.json();
        console.log(`Successfully created: ${data.product.title} (Variant ID: ${data.product.variants[0].id})`);
      }
      
      // Wait 1s between requests to avoid rate limits
      await delay(1000);
      
    } catch (err) {
      console.error(`Exception while processing ${watch.title}:`, err);
    }
  }
  console.log("Upload script finished.");
}

uploadWatches();
