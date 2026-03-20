# QR Studio API

Generate beautiful, branded QR codes with logo overlay, WiFi codes, and vCards.

## 🚀 Live API

**Base URL:** `http://134.199.197.134:3000`

**RapidAPI Listing:** https://rapidapi.com/elaunekc/api/qr-studio-api

---

## ✨ Features

- 🎨 **Custom Colors** - Set foreground & background colors
- 🖼️ **Logo Overlay** - Add your brand logo to QR codes  
- 📶 **WiFi QR Codes** - Generate codes for instant WiFi connection
- 👤 **vCard QR Codes** - Create contact card QR codes
- 🔄 **Batch Generation** - Generate up to 100 codes at once
- 📐 **Multiple Formats** - PNG and SVG output

---

## 🔐 Authentication

Include your API key in the header:
```
x-api-key: your-api-key-here
```

**Test Key:** `demo-key-12345` (50 requests/month limit)

---

## 📊 Pricing

| Plan | Price | Requests/Month |
|------|-------|---------------|
| **Free** | $0 | 50 |
| **Basic** | $5 | 2,000 |
| **Pro** | $25 | 20,000 |
| **Business** | $50 | 100,000 |

**All features included on every plan!**

---

## 📖 Endpoints

### 1. Generate QR Code

Generate a custom QR code with optional logo overlay.

**POST** `/api/v1/generate`

**Request Body:**
```json
{
  "text": "https://example.com",
  "width": 400,
  "height": 400,
  "color": "#000000",
  "backgroundColor": "#ffffff",
  "logoUrl": "https://your-logo.png",
  "logoSize": 60,
  "margin": 2,
  "errorCorrectionLevel": "M",
  "format": "png"
}
```

**Required:** `text`

---

### 2. WiFi QR Code

Generate a QR code that connects users to WiFi.

**POST** `/api/v1/wifi`

**Request Body:**
```json
{
  "ssid": "GuestWiFi",
  "password": "Welcome2024!",
  "encryption": "WPA",
  "color": "#000000",
  "width": 400
}
```

**Required:** `ssid`, `password`

---

### 3. vCard QR Code

Generate a QR code that adds a contact.

**POST** `/api/v1/vcard`

**Request Body:**
```json
{
  "contact": {
    "name": "John Doe",
    "phone": "+1-555-123-4567",
    "email": "john@example.com",
    "company": "Acme Corp",
    "title": "CEO"
  },
  "color": "#000000",
  "width": 400
}
```

**Required:** `contact.name`, `contact.phone`

---

### 4. Batch Generate

Generate multiple QR codes at once.

**POST** `/api/v1/batch`

**Request Body:**
```json
{
  "items": [
    {"text": "https://url1.com", "color": "#ff0000"},
    {"text": "https://url2.com", "color": "#00ff00"}
  ]
}
```

**Required:** `items` (array, max 100)

---

## 💻 Code Examples

### JavaScript
```javascript
const response = await fetch('http://134.199.197.134:3000/api/v1/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key'
  },
  body: JSON.stringify({
    text: 'https://example.com',
    color: '#ff6b6b',
    logoUrl: 'https://your-logo.png'
  })
});

const blob = await response.blob();
const imageUrl = URL.createObjectURL(blob);
```

### Python
```python
import requests

response = requests.post(
    'http://134.199.197.134:3000/api/v1/generate',
    headers={'x-api-key': 'your-api-key'},
    json={
        'text': 'https://example.com',
        'color': '#ff6b6b',
        'logoUrl': 'https://your-logo.png'
    }
)

with open('qr-code.png', 'wb') as f:
    f.write(response.content)
```

### cURL
```bash
curl -X POST http://134.199.197.134:3000/api/v1/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "text": "https://example.com",
    "color": "#ff6b6b"
  }' \
  --output qr.png
```

---

## ⚠️ Error Correction Levels

| Level | Recovery | Use Case |
|-------|----------|----------|
| **L** | ~7% | Simple QR, no logo |
| **M** | ~15% | Default, small logo |
| **Q** | ~25% | Medium logo |
| **H** | ~30% | Large logo |

**Recommendation:** Use **H** for best results with logo overlay.

---

## 🛠️ Tech Stack

- **Node.js** - Runtime
- **Express** - Web framework
- **qrcode** - QR generation
- **Canvas** - Image manipulation with logo overlay

---

## 📄 License

MIT

---

## 🆘 Support

- **RapidAPI:** https://rapidapi.com/elaunekc/api/qr-studio-api
- **Issues:** Open a GitHub issue
- **API Status:** http://134.199.197.134:3000/api/v1/health

**Happy QR coding! 🎉**
