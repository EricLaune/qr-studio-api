const QRCode = require('qrcode');
const crypto = require('crypto');

const API_KEYS = new Set([
  'demo-key-12345',
  'test-key-67890'
]);

const requestCounts = new Map();
const MONTHLY_LIMIT = 50; // Free tier: 50 requests/month with ALL features

function checkAuth(req) {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  if (!apiKey) return { authorized: false, error: 'API key required' };
  if (!API_KEYS.has(apiKey)) return { authorized: false, error: 'Invalid API key' };
  return { authorized: true, apiKey };
}

function checkRateLimit(apiKey) {
  const now = Date.now();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthStartTime = monthStart.getTime();
  
  if (!requestCounts.has(apiKey)) {
    requestCounts.set(apiKey, []);
  }
  
  // Filter requests for current month only
  const requests = requestCounts.get(apiKey).filter(time => time > monthStartTime);
  requestCounts.set(apiKey, [...requests, now]);
  
  if (requests.length >= MONTHLY_LIMIT) {
    return { 
      allowed: false, 
      error: `Monthly limit exceeded (${MONTHLY_LIMIT} requests/month). Upgrade at rapidapi.com` 
    };
  }
  
  return { allowed: true, remaining: MONTHLY_LIMIT - requests.length };
}

function generateWiFiString(ssid, password, encryption = 'WPA') {
  return `WIFI:T:${encryption};S:${ssid};P:${password};;`;
}

function generateVCardString(contact) {
  const { name, phone, email, company, title } = contact;
  return `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL:${phone}
EMAIL:${email}
ORG:${company}
TITLE:${title}
END:VCARD`;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET' && req.url === '/') {
    return res.json({
      message: 'QR Studio API - Generate branded QR codes',
      version: '1.0.0',
      endpoints: {
        'POST /api/v1/generate': 'Generate QR code with customization',
        'POST /api/v1/wifi': 'Generate WiFi QR code',
        'POST /api/v1/vcard': 'Generate vCard QR code',
        'POST /api/v1/batch': 'Batch generate QR codes',
        'GET /api/v1/stats': 'Get API usage stats'
      },
      authentication: 'Required - Use x-api-key header',
      pricing: 'Free tier: 50 requests/month'
    });
  }
  
  if (req.url === '/api/v1/stats') {
    return res.json({
      totalKeys: API_KEYS.size,
      activeInLastHour: Array.from(requestCounts.entries()).filter(([key, times]) => 
        times.some(time => time > Date.now() - 3600000)
      ).length
    });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const auth = checkAuth(req);
  if (!auth.authorized) {
    return res.status(401).json({ error: auth.error });
  }
  
  const rateLimit = checkRateLimit(auth.apiKey);
  if (!rateLimit.allowed) {
    return res.status(429).json({ error: rateLimit.error });
  }
  
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining);
  
  try {
    if (req.url === '/api/v1/generate') {
      const {
        text,
        width = 400,
        height = 400,
        color = '#000000',
        backgroundColor = '#ffffff',
        margin = 2,
        errorCorrectionLevel = 'M',
        format = 'png'
      } = req.body || {};
      
      if (!text) {
        return res.status(400).json({ error: 'Text parameter is required' });
      }
      
      // Generate QR code using only the qrcode package (no canvas)
      const qrOptions = {
        width: width,
        margin: margin,
        color: {
          dark: color,
          light: backgroundColor
        },
        errorCorrectionLevel: errorCorrectionLevel
      };
      
      if (format === 'svg') {
        const svgString = await QRCode.toString(text, { ...qrOptions, type: 'svg' });
        res.setHeader('Content-Type', 'image/svg+xml');
        return res.send(svgString);
      }
      
      // For PNG, generate data URL and convert
      const dataUrl = await QRCode.toDataURL(text, qrOptions);
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      res.setHeader('Content-Type', 'image/png');
      return res.send(buffer);
    }
    
    if (req.url === '/api/v1/wifi') {
      const { ssid, password, encryption = 'WPA', ...options } = req.body || {};
      
      if (!ssid || !password) {
        return res.status(400).json({ error: 'SSID and password are required' });
      }
      
      const wifiString = generateWiFiString(ssid, password, encryption);
      
      const qrOptions = {
        width: options.width || 400,
        margin: options.margin || 2,
        color: {
          dark: options.color || '#000000',
          light: options.backgroundColor || '#ffffff'
        },
        errorCorrectionLevel: options.errorCorrectionLevel || 'M'
      };
      
      const dataUrl = await QRCode.toDataURL(wifiString, qrOptions);
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      res.setHeader('Content-Type', 'image/png');
      return res.send(buffer);
    }
    
    if (req.url === '/api/v1/vcard') {
      const { contact, ...options } = req.body || {};
      
      if (!contact || !contact.name || !contact.phone) {
        return res.status(400).json({ error: 'Contact name and phone are required' });
      }
      
      const vcardString = generateVCardString(contact);
      
      const qrOptions = {
        width: options.width || 400,
        margin: options.margin || 2,
        color: {
          dark: options.color || '#000000',
          light: options.backgroundColor || '#ffffff'
        },
        errorCorrectionLevel: options.errorCorrectionLevel || 'M'
      };
      
      const dataUrl = await QRCode.toDataURL(vcardString, qrOptions);
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      res.setHeader('Content-Type', 'image/png');
      return res.send(buffer);
    }
    
    if (req.url === '/api/v1/batch') {
      const { items } = req.body || {};
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Items array is required' });
      }
      
      if (items.length > 100) {
        return res.status(400).json({ error: 'Maximum 100 items allowed per batch' });
      }
      
      const results = await Promise.all(
        items.map(async (item, index) => {
          try {
            const {
              text,
              width = 400,
              color = '#000000',
              backgroundColor = '#ffffff',
              margin = 2,
              errorCorrectionLevel = 'M'
            } = item;
            
            const qrOptions = {
              width: width,
              margin: margin,
              color: {
                dark: color,
                light: backgroundColor
              },
              errorCorrectionLevel: errorCorrectionLevel
            };
            
            const dataUrl = await QRCode.toDataURL(text, qrOptions);
            
            return {
              index,
              success: true,
              dataUrl,
              text: text.substring(0, 50) + (text.length > 50 ? '...' : '')
            };
          } catch (itemError) {
            return {
              index,
              success: false,
              error: itemError.message
            };
          }
        })
      );
      
      return res.json({
        success: true,
        generated: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
      });
    }
    
    return res.status(404).json({ error: 'Endpoint not found' });
    
  } catch (error) {
    console.error('QR Code generation error:', error);
    return res.status(500).json({ error: 'Failed to generate QR code', details: error.message });
  }
};