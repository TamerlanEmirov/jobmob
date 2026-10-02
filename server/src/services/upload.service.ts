import cloudinary from '../lib/cloudinary.js';

export class UploadService {
  // Cloudinary bağlantısını yoxlamaq üçün
  static async testCloudinary() {
    try {
      const result = await cloudinary.api.ping();

      console.log('CLOUDINARY PING:', result);

      return result;
    } catch (error) {
      console.error('CLOUDINARY PING ERROR:', error);
      throw error;
    }
  }

  // Upload-u test etmək üçün
  static async testUpload(buffer: Buffer): Promise<string> {
    try {
      const base64 = buffer.toString('base64');

      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${base64}`,
        {
          folder: 'jobmob/test',
          resource_type: 'image',
        }
      );

      console.log('TEST UPLOAD SUCCESS:', result.secure_url);

      return result.secure_url;
    } catch (error) {
      console.error('TEST UPLOAD ERROR:', error);
      throw error;
    }
  }

  // Sonradan normal photo/resume upload üçün istifadə edəcəyik
  static async uploadToCloudinary(
    buffer: Buffer,
    folder: string,
    resourceType: 'image' | 'raw'
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `jobmob/${folder}`,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) {
            console.error('CLOUDINARY UPLOAD ERROR:', error);
            return reject(error);
          }

          if (!result) {
            return reject(
              new Error('Cloudinary nəticə qaytarmadı')
            );
          }

          console.log(
            'CLOUDINARY RESULT:',
            result.secure_url
          );

          resolve(result.secure_url);
        }
      );

      stream.end(buffer);
    });
  }
}