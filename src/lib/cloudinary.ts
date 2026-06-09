import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

/**
 * Alleen waar wanneer alle benodigde server-side credentials aanwezig zijn.
 * cloud_name en api_key mogen client-side bekend zijn; api_secret nooit.
 */
export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

/** Vaste doelmap zodat alle productafbeeldingen netjes bij elkaar staan. */
export const CLOUDINARY_PRODUCTS_FOLDER = 'telfixer/products';

export { cloudinary };
