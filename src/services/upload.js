const { Storage } = require("@google-cloud/storage");

// Making a Google Cloud Storage Client
const storage = new Storage();
const bucketName = 'cloud-storage-hairapy';

// Function to upload an image to Google Cloud Storage
async function uploadImage(file, destination) {
    try {
        const bucket = storage.bucket(bucketName);

        // Set custom metadata for the uploaded image
        const customMetadata = {
            contentType: 'image/jpeg', 
            metadata: {
                type: "header-logo"
            }
        };

        const optionsUploadObject = {
            destination: 'images/image.jpg',
            metadata: customMetadata
        };

        // Upload the image to the bucket
        const response = await bucket.upload(file.path, optionsUploadObject);
        console.log(`${file.path} uploaded to ${bucketName} bucket`);
        return response;
    } catch (error) {
        console.error(`Failed to upload ${file.path}:`, error);
        throw error;
    }
}

module.exports = { uploadImage };





