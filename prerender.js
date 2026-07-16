import puppeteer from 'puppeteer';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = ['/', '/about', '/activities', '/gallery', '/contact', '/privacy-policy', '/terms-conditions'];
const PORT = 3001;

async function prerender() {
  console.log('Starting prerender process...');
  
  const app = express();
  
  // Serve static assets from dist
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Fallback for React Router
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
  
  const server = app.listen(PORT, async () => {
    console.log(`Local server started on port ${PORT} for prerendering...`);
    
    try {
      const browser = await puppeteer.launch({ 
        headless: 'new',
        channel: 'chrome' 
      });
      
      for (const route of routes) {
        console.log(`Prerendering route: ${route}`);
        const page = await browser.newPage();
        
        // Go to the route and wait for network to be idle
        await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle0' });
        
        // Extract fully rendered HTML
        const html = await page.content();
        
        // Determine save path
        const routeDir = path.join(__dirname, 'dist', route);
        if (route !== '/' && !fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true });
        }
        
        const filePath = route === '/' 
          ? path.join(__dirname, 'dist', 'index.html') 
          : path.join(routeDir, 'index.html');
          
        fs.writeFileSync(filePath, html);
        console.log(`Saved: ${filePath}`);
        
        await page.close();
      }
      
      await browser.close();
      console.log('Prerendering completed successfully.');
    } catch (err) {
      console.error('Prerendering failed:', err);
      process.exit(1);
    } finally {
      server.close();
    }
  });
}

prerender();
