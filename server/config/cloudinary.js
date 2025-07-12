const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "your-cloud-name",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload image
const uploadImage = async (file, folder = "rewear") => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: "auto",
      quality: "auto",
      fetch_format: "auto",
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    throw new Error("Image upload failed");
  }
};

// Helper function to delete image
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("❌ Cloudinary delete error:", error);
    throw new Error("Image deletion failed");
  }
};

// Helper function to upload multiple images
const uploadMultipleImages = async (files, folder = "rewear") => {
  try {
    const uploadPromises = files.map((file) => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("❌ Multiple images upload error:", error);
    throw new Error("Multiple images upload failed");
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage,
  uploadMultipleImages,
};
