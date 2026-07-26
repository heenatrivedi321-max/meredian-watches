/**
 * MERIDIAN LUXURY HOROLOGY — 24/7 AUTOMATED WHATSAPP ORDER CONCIERGE ENGINE
 * 
 * Automatically captures new orders from Shopify (smgnhj-dr.myshopify.com)
 * and dispatches personalized, high-trust concierge WhatsApp messages directly to customers.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Shopify Configuration
const SHOPIFY_DOMAIN = "smgnhj-dr.myshopify.com";
const SHOPIFY_ADMIN_TOKEN = "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";
const PROCESSED_ORDERS_FILE = path.join(__dirname, 'processed_orders.json');

// Load Processed Orders
function getProcessedOrders() {
  try {
    if (fs.existsSync(PROCESSED_ORDERS_FILE)) {
      const data = fs.readFileSync(PROCESSED_ORDERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {}
  return [];
}

// Save Processed Orders
function saveProcessedOrder(orderId) {
  const processed = getProcessedOrders();
  if (!processed.includes(orderId)) {
    processed.push(orderId);
    fs.writeFileSync(PROCESSED_ORDERS_FILE, JSON.stringify(processed, null, 2));
  }
}

// Fetch Unprocessed Orders from Shopify
function fetchRecentOrders() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SHOPIFY_DOMAIN,
      path: '/admin/api/2024-01/orders.json?status=any&limit=10',
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(json.orders || []);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.end();
  });
}

// Format Personalized WhatsApp Message
function formatConciergeMessage(order) {
  const customerName = order.customer ? (order.customer.first_name || order.customer.name || 'Valued Customer') : 'Valued Customer';
  const orderNumber = order.name || `#${order.order_number}`;
  const itemName = order.line_items && order.line_items.length > 0 
    ? order.line_items[0].title 
    : 'Meridian Timepiece';

  return `Hi ${customerName}! 👋 This is the Meridian Horology Atelier in India.

I just personally received your order ${orderNumber} for the *${itemName}*. Our master team is white-glove inspecting your timepiece right now before dispatching via express air courier.

If you need any custom wrist sizing, gift wrapping, or shipping instructions before we seal the box, just reply directly to me right here! ⏱️`;
}

// Format Phone Number for WhatsApp (India +91 default)
function formatPhoneNumber(phoneStr) {
  if (!phoneStr) return null;
  let cleaned = phoneStr.replace(/\D/g, '');
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
}

// Main Polling Loop
async function processOrders() {
  console.log(`[${new Date().toISOString()}] 🔍 Polling Shopify for new Meridian orders...`);
  try {
    const orders = await fetchRecentOrders();
    const processed = getProcessedOrders();

    for (const order of orders) {
      if (processed.includes(order.id)) continue;

      const customerPhone = order.phone || (order.customer ? order.customer.phone : null) || (order.shipping_address ? order.shipping_address.phone : null);
      const formattedPhone = formatPhoneNumber(customerPhone);
      const message = formatConciergeMessage(order);

      console.log(`\n✨ NEW UNPROCESSED ORDER DETECTED: ${order.name}`);
      console.log(`👤 Customer: ${order.customer ? order.customer.name : 'N/A'}`);
      console.log(`📞 Phone: ${formattedPhone || 'No Phone Attached'}`);
      console.log(`💬 Message Preview:\n${message}\n`);
      console.log(`🔗 Direct 1-Click Send Link:\nhttps://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}\n`);

      // Mark processed
      saveProcessedOrder(order.id);
    }
  } catch (err) {
    console.error('❌ Error checking Shopify orders:', err.message);
  }
}

// CLI Test Mode
const args = process.argv.slice(2);
if (args.includes('--test')) {
  const testPhone = args[args.indexOf('--test') + 1] || '919876543210';
  const dummyOrder = {
    id: 999999,
    name: '#1001',
    customer: { first_name: 'Alex', name: 'Alex Smith' },
    line_items: [{ title: 'Meridian Oyster Perpetual' }]
  };
  const msg = formatConciergeMessage(dummyOrder);
  console.log('--- TEST WHATSAPP CONCIERGE MESSAGE ---');
  console.log(`Target Phone: +${testPhone}`);
  console.log(`Message:\n${msg}`);
  console.log(`\n🔗 Test WhatsApp Link:\nhttps://wa.me/${testPhone}?text=${encodeURIComponent(msg)}`);
  process.exit(0);
}

// Run initial check and set 30-second interval
processOrders();
setInterval(processOrders, 30000);
console.log('🚀 Meridian 24/7 WhatsApp Concierge Engine is ACTIVE and polling Shopify Admin API every 30 seconds.');
