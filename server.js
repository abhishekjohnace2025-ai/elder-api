const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Directories where images are stored
const DIRS = {
  banner: path.join(__dirname, 'banner'),
  images: path.join(__dirname, 'images'),
  logos: path.join(__dirname, 'logos')
};

// Ensure directories exist
Object.values(DIRS).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Middleware to enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// GET /api/:category - List all images in a category
app.get('/api/:category', (req, res) => {
  const category = req.params.category;
  const dir = DIRS[category];

  if (!dir) {
    return res.status(404).json({ error: 'Invalid category' });
  }

  fs.readdir(dir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: `Unable to read ${category} directory` });
    }
    
    // Filter only image files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
    });
    
    const images = imageFiles.map(file => ({
      name: file,
      url: `/api/${category}/${file}`
    }));
    
    res.json({ count: images.length, images });
  });
});

// GET /api/:category/:filename - Get specific image from a category
app.get('/api/:category/:filename', (req, res) => {
  const { category, filename } = req.params;
  const dir = DIRS[category];
  
  if (!dir) {
    return res.status(404).json({ error: 'Invalid category' });
  }

  const filepath = path.join(dir, filename);
  
  // Security check - prevent directory traversal
  if (!filepath.startsWith(dir)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  // Check if file exists
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'Image not found' });
  }
  
  // Send the image file
  res.sendFile(filepath);
});

// GET /api/:category/search/:query - Search images by name in a category
app.get('/api/:category/search/:query', (req, res) => {
  const { category, query } = req.params;
  const dir = DIRS[category];
  
  if (!dir) {
    return res.status(404).json({ error: 'Invalid category' });
  }

  const lowerQuery = query.toLowerCase();
  
  fs.readdir(dir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: `Unable to read ${category} directory` });
    }
    
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
      return isImage && file.toLowerCase().includes(lowerQuery);
    });
    
    const images = imageFiles.map(file => ({
      name: file,
      url: `/api/${category}/${file}`
    }));
    
    res.json({ count: images.length, images });
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Image API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Image API server running on http://localhost:${PORT}`);
  console.log(`Images directory: ${IMAGES_DIR}`);
});