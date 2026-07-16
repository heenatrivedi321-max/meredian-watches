import Client from 'shopify-buy';


const client = Client.buildClient({
  domain: 'smgnhj-dr.myshopify.com',
  storefrontAccessToken: '5770c9532d9ecb053fe315c61eb054b3',
});

client.product.fetchAll().then((products) => {
  console.log("=== SHOPIFY PRODUCTS ===");
  if (products.length === 0) {
    console.log("No products found.");
  }
  products.forEach(p => {
    console.log(`Title: ${p.title}`);
    console.log(`Handle: ${p.handle}`);
    console.log(`Price: $${p.variants[0]?.price?.amount}`);
    console.log(`Image: ${p.images[0]?.src}`);
    console.log("------------------------");
  });
}).catch((err) => {
  console.error("Error fetching products:", err);
});
