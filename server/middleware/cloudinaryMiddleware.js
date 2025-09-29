import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profile_pictures',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 300, height: 300, crop: 'limit' }]
  },
});

export const upload = multer({ storage });

const getCloudinaryPublicId = (imageUrl) => {
  const regex = /\/profile_pictures\/([^\.\/]+)\./;
  const match = imageUrl.match(regex);
  return match && match[1] ? `profile_pictures/${match[1]}` : null;
};

export const deleteFromCloudinary = async (imageUrl) => {
  const publicId = getCloudinaryPublicId(imageUrl);
  if (!publicId) return false;
  await cloudinary.uploader.destroy(publicId);
  return true;
};


