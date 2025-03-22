const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { uploadMiddleware, handleFileUpload } = require('./middleware/upload');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB with improved options
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Wait 5 seconds before retrying
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Security middlewares
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' }
});

// Apply rate limiting to all routes
app.use('/api/', limiter);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// File upload middleware
app.use(uploadMiddleware);

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static files in both production and development
app.use(express.static(path.join(__dirname, 'frontend')));

// Serve admin static files (both in production and development)
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/carousel', require('./routes/carousel'));
app.use('/api/domestic-tours', require('./routes/domesticTours'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/content', require('./routes/pageContent'));

// File upload route
app.post('/api/upload', uploadMiddleware, handleFileUpload);

// Serve static files for production
if (process.env.NODE_ENV === 'production') {
  // Redirect all non-API requests to index.html
  app.get('*', (req, res) => {
    if (req.path.startsWith('/admin') && !req.path.includes('.')) {
      res.sendFile(path.resolve(__dirname, 'admin', 'index.html'));
    } else {
      res.sendFile(path.resolve(__dirname, 'frontend/templates', 'index.html'));
    }
  });
} else {
  // Handle specific template requests in development
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend/templates', 'index.html'));
  });
  
  // Handle other HTML template requests - with or without .html extension
  app.get('/:template', (req, res) => {
    let templateName = req.params.template;
    
    // Remove .html extension if present
    if (templateName.endsWith('.html')) {
      templateName = templateName.substring(0, templateName.length - 5);
    }
    
    // Check for exact match first
    const exactPath = path.resolve(__dirname, 'frontend/templates', `${templateName}.html`);
    
    // Then try case-insensitive match for files with spaces
    fs.readdir(path.resolve(__dirname, 'frontend/templates'), (err, files) => {
      if (err) {
        console.error('Error reading templates directory:', err);
        return res.sendFile(path.resolve(__dirname, 'frontend/templates', 'index.html'));
      }
      
      // Find a matching file (case insensitive)
      const matchingFile = files.find(file => 
        file.toLowerCase().replace(/ /g, '%20') === (templateName + '.html').toLowerCase() ||
        file.toLowerCase() === (templateName + '.html').toLowerCase() ||
        file.toLowerCase().replace(/ /g, '') === (templateName + '.html').toLowerCase()
      );
      
      if (matchingFile) {
        res.sendFile(path.resolve(__dirname, 'frontend/templates', matchingFile));
      } else if (fs.existsSync(exactPath)) {
        res.sendFile(exactPath);
      } else {
        console.log(`Template not found: ${templateName}.html, redirecting to index.html`);
        res.sendFile(path.resolve(__dirname, 'frontend/templates', 'index.html'));
      }
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error'
  });
});

// Process-wide error handlers to prevent crashes
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
  console.error(err.name, err.message, err.stack);
  // Give the server time to finish current requests before exiting
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥', err);
  console.error(err.name, err.message, err.stack);
  // Don't exit the process, just log the error
});

// Graceful shutdown for SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  process.exit(0);
});

const PORT = process.env.PORT || 7777;

// Create server with port fallback mechanism
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is busy, trying ${PORT + 1}...`);
      // Try the next port
      server.close();
      app.listen(PORT + 1, () => console.log(`Server running on port ${PORT + 1}`));
    } else {
      console.error('Server error:', err);
    }
  }); 