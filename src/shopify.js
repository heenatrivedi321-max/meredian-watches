const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'smgnhj-dr.myshopify.com';
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

const API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

async function shopifyFetch(query, variables = {}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map(e => e.message).join(', '));
  return json.data;
}

export async function createCheckout(variantId) {
  const gid = variantId.startsWith('gid://') ? variantId : `gid://shopify/ProductVariant/${variantId}`;
  
  const data = await shopifyFetch(`
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          message
        }
      }
    }
  `, {
    input: {
      lines: [{ merchandiseId: gid, quantity: 1 }],
    },
  });

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  const cart = data.cartCreate.cart;
  // If the custom domain is still propagating, fall back to the myshopify domain to ensure checkout always opens
  if (cart && cart.checkoutUrl && cart.checkoutUrl.includes('shop.meredianwatches.store')) {
    cart.checkoutUrl = cart.checkoutUrl.replace('shop.meredianwatches.store', SHOPIFY_DOMAIN);
  }

  return cart;
}
