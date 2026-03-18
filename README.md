# QR Studio API

A powerful, customizable QR Code generation API with unique features. Generate branded QR codes, WiFi codes, vCards, and more.

## Deployed on Vercel (FREE tier!)

## Features

- 🎨 **Custom Colors** - Foreground & background colors
- 🖼️ **Logo Overlay** - Add your brand logo
- 📐 **Multiple Formats** - PNG, SVG
- 🔄 **Batch Generation** - Up to 100 codes at once
- 📶 **WiFi QR Codes** - Instant WiFi connection codes
- 👤 **vCard QR Codes** - Contact cards ready to scan
- 🔐 **API Key Authentication** - Secure access
- 📊 **Rate Limiting** - 60 requests/minute
- 🎨 **Style Options** - Square or rounded corners

## API Endpoints

### Authentication

All endpoints require an API key in the header:
```
x-api-key: your-api-key
```

Demo keys (for testing):
- `demo-key-12345`
- `test-key-67890`

### 1. Generate Custom QR Code

**POST** `/api/v1/generate`

**Request Body:**
```json
{
  "text": "https://example.com",
  "width": 400,
  "height": 400,
  "color": "#000000",
  "backgroundColor": "#ffffff",
  "logoUrl": "https://example.com/logo.png",
  "logoSize": 60,
  "margin": 2,
  "errorCorrectionLevel": "M",
  "format": "png",
  "style": "square"
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| text | string | Yes | - | URL or text to encode |
| width | number | No | 400 | Image width in pixels |
| height | number | No | 400 | Image height in pixels |
| color | string | No | #000000 | QR code color (hex) |
| backgroundColor | string | No | #ffffff | Background color (hex) |
| logoUrl | string | No | null | URL of logo to overlay |
| logoSize | number | No | 60 | Logo size in pixels |
| margin | number | No | 2 | Quiet zone margin |
| errorCorrectionLevel | string | No | M | L, M, Q, or H |
| format | string | No | png | png, svg |
| style | string | No | square | square or rounded |

### 2. Generate WiFi QR Code

**POST** `/api/v1/wifi`

**Request Body:**
```json
{
  "ssid": "MyWiFiNetwork",
  "password": "MySecretPassword",
  "encryption": "WPA",
  "color": "#000000",
  "backgroundColor": "#ffffff",
  "width": 400,
  "height": 400
}
```

**Note:** Users scan this to instantly connect to WiFi!

### 3. Generate vCard QR Code

**POST** `/api/v1/vcard`

**Request Body:**
```json
{
  "contact": {
    "name": "John Doe",
    "phone": "+1-555-123-4567",
    "email": "john@example.com",
    "company": "Acme Corp",
    "title": "Software Engineer"
  },
  "color": "#000000",
  "backgroundColor": "#ffffff",
  "width": 400,
  "height": 400
}
```

**Note:** Users scan this to instantly save contact!

### 4. Batch Generate

**POST** `/api/v1/batch`

**Request Body:**
```json
{
  "items": [
    {
      "text": "https://example.com/1",
      "width": 400,
      "height": 400,
      "color": "#ff0000"
    },
    {
      "text": "https://example.com/2",
      "width": 400,
      "height": 400,
      "color": "#00ff00"
    }
  ]
}
```

**Note:** Maximum 100 items per request.

### 5. API Stats

**GET** `/api/v1/stats`

Returns API usage statistics.

## Examples

### cURL - Basic QR Code

```bash
curl -X POST https://your-api.vercel.app/api/v1/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: demo-key-12345" \
  -d '{"text": "https://google.com"}' \
  --output qr.png
```

### cURL - Branded QR with Logo

```bash
curl -X POST https://your-api.vercel.app/api/v1/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: demo-key-12345" \
  -d '{
    "text": "https://mycompany.com",
    "color": "#ff6b6b",
    "backgroundColor": "#f8f9fa",
    "logoUrl": "https://mycompany.com/logo.png",
    "style": "rounded"
  }' \
  --output branded-qr.png
```

### cURL - WiFi QR Code

```bash
curl -X POST https://your-api.vercel.app/api/v1/wifi \
  -H "Content-Type: application/json" \
  -H "x-api-key: demo-key-12345" \
  -d '{
    "ssid": "GuestWiFi",
    "password": "Welcome2024!",
    "encryption": "WPA"
  }' \
  --output wifi-qr.png
```

### JavaScript

```javascript
// Generate WiFi QR code
const response = await fetch('https://your-api.vercel.app/api/v1/wifi', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'x-api-key': 'demo-key-12345'
  },
  body: JSON.stringify({
    ssid: 'MyNetwork',
    password: 'MyPassword',
    color: '#ff6b6b'
  })
});

const blob = await response.blob();
const url = URL.createObjectURL(blob);
```

## Error Correction Levels

- **L** (~7% recovery) - Low
- **M** (~15% recovery) - Medium (default)
- **Q** (~25% recovery) - Quartile
- **H** (~30% recovery) - High

Use **H** when adding a logo overlay for best results.

## Pricing Strategy (RapidAPI)

**All features available on every tier!** Just pay for more requests.

| Tier | Requests/Month | Price | Features |
|------|---------------|-------|----------|
| **Free** | **50** | $0 | **ALL features** - WiFi, vCard, Logo, Batch, Rounded style |
| **Basic** | 2,000 | $5 | Everything + 2,000 requests |
| **Pro** | 20,000 | $25 | Everything + 20,000 requests |
| **Biz** | 100,000 | $50 | Everything + Priority support |

## Why This API is Better

1. **ALL Features on Free Tier** - Try everything before you buy!
2. **WiFi QR Codes** - No one else offers this specifically
3. **vCard Support** - Professional contact cards
4. **Logo Overlay** - Branded QR codes
5. **Rounded Style** - Modern, aesthetic options
6. **Batch Generation** - Save time with bulk operations
7. **Transparent Pricing** - Pay only for requests, not features

## Deployment

### Local Development
```bash
npm install
npm start
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

## Tech Stack

- **Vercel Functions** - Serverless deployment
- **Node.js** - Runtime
- **qrcode** - QR generation
- **Canvas** - Image manipulation

## License

MIT