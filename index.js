const express = require('express');
const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'QR Code API - Generate branded QR codes',
    endpoints: {
      '/api/v1/generate': 'POST - Generate QR code with customization',
      '/api/v1/health': 'GET - Health check'
    }
  });
});

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/v1/generate', async (req, res) => {
  try {
    const {
      text,
      width = 400,
      height = 400,
      color = '#000000',
      backgroundColor = '#ffffff',
      logoUrl = null,
      logoSize = 60,
      margin = 2,
      errorCorrectionLevel = 'M',
      format = 'png'
    } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const qrOptions = {
      width: width,
      height: height,
      margin: margin,
      color: {
        dark: color,
        light: backgroundColor
      },
      errorCorrectionLevel: errorCorrectionLevel
    };

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    await QRCode.toCanvas(canvas, text, qrOptions);

    if (logoUrl) {
      try {
        const logo = await loadImage(logoUrl);
        const logoX = (width - logoSize) / 2;
        const logoY = (height - logoSize) / 2;
        
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
        
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
      } catch (logoError) {
        console.warn('Failed to load logo:', logoError.message);
      }
    }

    const buffer = canvas.toBuffer(`image/${format}`);
    
    res.set('Content-Type', `image/${format}`);
    res.send(buffer);

  } catch (error) {
    console.error('QR Code generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code', details: error.message });
  }
});

app.post('/api/v1/generate-svg', async (req, res) => {
  try {
    const {
      text,
      color = '#000000',
      backgroundColor = '#ffffff',
      margin = 2,
      errorCorrectionLevel = 'M'
    } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const qrOptions = {
      margin: margin,
      color: {
        dark: color,
        light: backgroundColor
      },
      errorCorrectionLevel: errorCorrectionLevel
    };

    const svgString = await QRCode.toString(text, { ...qrOptions, type: 'svg' });
    
    res.set('Content-Type', 'image/svg+xml');
    res.send(svgString);

  } catch (error) {
    console.error('QR Code generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code', details: error.message });
  }
});

app.post('/api/v1/batch', async (req, res) => {
  try {
    const { items } = req.body;

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
            height = 400,
            color = '#000000',
            backgroundColor = '#ffffff',
            margin = 2,
            errorCorrectionLevel = 'M'
          } = item;

          const qrOptions = {
            width: width,
            height: height,
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

    res.json({
      success: true,
      generated: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    });

  } catch (error) {
    console.error('Batch generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR codes', details: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 QR Code API running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

module.exports = app;