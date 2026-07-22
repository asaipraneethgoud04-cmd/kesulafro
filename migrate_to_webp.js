import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const srcDir = path.join(process.cwd(), 'src');
const imagesDir = path.join(process.cwd(), 'public', 'images');

// 1. Replace all .jpg and .jpeg references in source code
function replaceInFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInFiles(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;
            
            if (content.includes('.jpg')) {
                content = content.replace(/\.jpg/g, '.webp');
                updated = true;
            }
            if (content.includes('.jpeg')) {
                content = content.replace(/\.jpeg/g, '.webp');
                updated = true;
            }
            
            if (updated) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated references in ${fullPath}`);
            }
        }
    }
}
replaceInFiles(srcDir);

// 2. Convert remaining JPG/JPEGs to WEBP and delete them
async function convertAndDelete() {
    const files = fs.readdirSync(imagesDir);
    for (const file of files) {
        if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
            const ext = file.endsWith('.jpg') ? '.jpg' : '.jpeg';
            const imgPath = path.join(imagesDir, file);
            const webpPath = path.join(imagesDir, file.replace(ext, '.webp'));
            
            try {
                // Convert to webp
                await sharp(imgPath).webp().toFile(webpPath);
                console.log(`Converted ${file} to ${path.basename(webpPath)}`);
                
                // Delete original jpg/jpeg
                fs.unlinkSync(imgPath);
                console.log(`Deleted ${file}`);
            } catch (err) {
                console.error(`Failed to process ${file}:`, err);
            }
        }
    }
}

convertAndDelete().then(() => {
    console.log('All JPG/JPEGs converted and deleted!');
});
