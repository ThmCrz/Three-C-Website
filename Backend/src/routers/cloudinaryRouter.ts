import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

dotenv.config();

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const saveImageRouter = express.Router();

saveImageRouter.post('/saveImage', async (req: Request, res: Response) => {
    try {
        // Upload an image
        const uploadResult = await cloudinary.uploader.upload(
            req.body.img_URL, 
            { public_id: req.body.img_ID }
        );
        
        console.log(uploadResult);
        
        // Optimize delivery by resizing and applying auto-format and auto-quality
        const optimizeUrl = cloudinary.url( req.body.img_ID, {
            fetch_format: 'auto',
            quality: 'auto'
        });
        
        console.log(optimizeUrl);
        
        // Transform the image: auto-crop to square aspect_ratio
        const autoCropUrl = cloudinary.url( req.body.img_ID, {
            crop: 'auto',
            gravity: 'auto',
            width: 500,
            height: 500
        });
        
        console.log(autoCropUrl);
        
        res.status(200).json({ message: 'Image saved', optimizeUrl, autoCropUrl });
    } catch (error) {
        console.error('Error Saving Image:', error);
        res.status(500).json({ message: 'Failed to Save Image' });
    }
});

export default saveImageRouter;
