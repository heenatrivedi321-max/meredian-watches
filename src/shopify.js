import Client from 'shopify-buy';

// Initialize a client
// If the environment variables aren't set during dev, we use mock values so the UI doesn't break.
const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'mock-domain.myshopify.com';
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'mock-token';

export const shopifyClient = Client.buildClient({
  domain: domain,
  storefrontAccessToken: storefrontAccessToken,
});
