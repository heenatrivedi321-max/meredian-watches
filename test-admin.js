const domain = 'smgnhj-dr.myshopify.com';
const adminToken = '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';

async function testAdminApi() {
  const query = `
    {
      shop {
        name
      }
    }
  `;

  try {
    const res = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken
      },
      body: JSON.stringify({ query })
    });
    
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

testAdminApi();
