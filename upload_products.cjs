const fs = require('fs');

const domain = 'smgnhj-dr.myshopify.com';
const adminToken = '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';

const productsToCreate = [
  {
    title: 'THE LIQUID OBSIDIAN',
    body_html: '<strong>Vibe:</strong> 3D rendered matte black ferrofluid frozen in mid-air with subtle gold reflections.',
    vendor: 'Apex Archives',
    product_type: 'Art Print',
    tags: 'neo-brutalist, abstract, 3d',
    imagePath: '/Users/mypc/.gemini/antigravity/brain/d1fe49fb-dc4c-434a-b361-0d4ffd555bb5/liquid_obsidian_1783854892090.jpg'
  },
  {
    title: 'BRUTALIST VOID',
    body_html: '<strong>Vibe:</strong> Stark, abstract close-up of brutalist concrete architecture with harsh geometric angles and heavy shadows.',
    vendor: 'Apex Archives',
    product_type: 'Art Print',
    tags: 'neo-brutalist, architecture, photography',
    imagePath: '/Users/mypc/.gemini/antigravity/brain/d1fe49fb-dc4c-434a-b361-0d4ffd555bb5/brutalist_void_1783854903330.jpg'
  },
  {
    title: 'SMOKED GLASS MINIMALISM',
    body_html: '<strong>Vibe:</strong> Heavy blocks of frosted smoked glass stacked in a pitch-black room refracting a single beam of pure white light.',
    vendor: 'Apex Archives',
    product_type: 'Art Print',
    tags: 'minimalist, surrealism, 3d',
    imagePath: '/Users/mypc/.gemini/antigravity/brain/d1fe49fb-dc4c-434a-b361-0d4ffd555bb5/smoked_glass_1783854912918.jpg'
  },
  {
    title: 'TOPOGRAPHIC ALIEN RANGE',
    body_html: '<strong>Vibe:</strong> Pure black-on-black 3D topographic map of an alien mountain range with extreme macro textures.',
    vendor: 'Apex Archives',
    product_type: 'Art Print',
    tags: 'topographic, abstract, macro',
    imagePath: '/Users/mypc/.gemini/antigravity/brain/d1fe49fb-dc4c-434a-b361-0d4ffd555bb5/alien_topo_1783854923187.jpg'
  },
  {
    title: 'SCARLET IMPASTO',
    body_html: '<strong>Vibe:</strong> Highly textured abstract oil painting using extremely thick layers of glossy black and vivid crimson red paint.',
    vendor: 'Apex Archives',
    product_type: 'Art Print',
    tags: 'oil painting, abstract, red, black',
    imagePath: '/Users/mypc/.gemini/antigravity/brain/d1fe49fb-dc4c-434a-b361-0d4ffd555bb5/scarlet_impasto_1783854934552.jpg'
  }
];

async function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function uploadProducts() {
  for (const productData of productsToCreate) {
    try {
      console.log(`Processing: ${productData.title}`);
      
      const imageBase64 = fs.readFileSync(productData.imagePath, { encoding: 'base64' });

      const payload = {
        product: {
          title: productData.title,
          body_html: productData.body_html,
          vendor: productData.vendor,
          product_type: productData.product_type,
          tags: productData.tags,
          status: 'active',
          variants: [
            {
              price: "599.00",
              inventory_management: "shopify",
              inventory_quantity: 100
            }
          ],
          images: [
            {
              attachment: imageBase64
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
        console.error(`Failed to create ${productData.title}. Status: ${res.status}`);
        const errorText = await res.text();
        console.error(errorText);
      } else {
        const data = await res.json();
        console.log(`Successfully created: ${data.product.title} (ID: ${data.product.id})`);
      }
      
      // Wait 1s between requests to avoid rate limits
      await delay(1000);
      
    } catch (err) {
      console.error(`Exception while processing ${productData.title}:`, err);
    }
  }
  console.log("Upload script finished.");
}

uploadProducts();
