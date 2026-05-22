import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const inputDir = './public/og';
const outputDir = './public/og'; // Overwrite existing files for simplicity, consider a backup strategy for production

async function optimizeImages() {
    try {
        const files = await fs.readdir(inputDir);

        for (const file of files) {
            const inputFile = path.join(inputDir, file);
            const fileName = path.parse(file).name;
            const ext = path.parse(file).ext.toLowerCase();

            // Only process JPG files for now, as per initial assessment
            if (ext === '.jpg') {
                const outputFile = path.join(outputDir, `${fileName}.webp`);

                console.log(`Optimizing ${inputFile} to ${outputFile}...`);

                await sharp(inputFile)
                    .resize(1200, 630, { fit: 'cover' }) // Common OG image size
                    .webp({ quality: 80 }) // Convert to WebP with 80% quality
                    .toFile(outputFile);

                // Optionally remove the original JPG file after successful conversion
                // await fs.unlink(inputFile); 
                // console.log(`Removed original file: ${inputFile}`);

                console.log(`Successfully optimized ${inputFile}`);
            }
        }
        console.log('All OG images optimized!');
    } catch (error) {
        console.error('Error optimizing images:', error);
    }
}

optimizeImages();
