/**
 * Base64 Utility Functions
 * Các hàm tiện ích để xử lý base64 encoding/decoding
 */

/**
 * Decode base64 string thành text
 * @param {string} base64String - Base64 string cần decode
 * @returns {string} - Decoded text
 */
export const decodeBase64 = (base64String) => {
  try {
    return atob(base64String);
  } catch (error) {
    console.error('Error decoding base64:', error);
    return null;
  }
};

/**
 * Encode text thành base64 string
 * @param {string} text - Text cần encode
 * @returns {string} - Base64 encoded string
 */
export const encodeBase64 = (text) => {
  try {
    return btoa(text);
  } catch (error) {
    console.error('Error encoding to base64:', error);
    return null;
  }
};

/**
 * Decode base64 thành Uint8Array (cho binary data)
 * @param {string} base64String - Base64 string
 * @returns {Uint8Array} - Binary data array
 */
export const base64ToArrayBuffer = (base64String) => {
  try {
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (error) {
    console.error('Error converting base64 to array buffer:', error);
    return null;
  }
};

/**
 * Chuyển ArrayBuffer thành base64
 * @param {ArrayBuffer} buffer - Array buffer
 * @returns {string} - Base64 string
 */
export const arrayBufferToBase64 = (buffer) => {
  try {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch (error) {
    console.error('Error converting array buffer to base64:', error);
    return null;
  }
};

/**
 * Kiểm tra xem string có phải base64 hợp lệ không
 * @param {string} str - String cần kiểm tra
 * @returns {boolean} - True nếu là base64 hợp lệ
 */
export const isValidBase64 = (str) => {
  try {
    // Regex pattern cho base64
    const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;
    
    // Kiểm tra pattern và độ dài
    if (!base64Pattern.test(str) || str.length % 4 !== 0) {
      return false;
    }
    
    // Thử decode để kiểm tra
    atob(str);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Tạo data URL từ base64 cho ảnh
 * @param {string} base64String - Base64 string của ảnh
 * @param {string} mimeType - MIME type (default: 'image/jpeg')
 * @returns {string} - Data URL
 */
export const createImageDataUrl = (base64String, mimeType = 'image/jpeg') => {
  // Nếu đã có prefix data URL thì return luôn
  if (base64String.startsWith('data:')) {
    return base64String;
  }
  
  // Tạo data URL
  return `data:${mimeType};base64,${base64String}`;
};

/**
 * Lấy base64 thuần từ data URL
 * @param {string} dataUrl - Data URL
 * @returns {string} - Base64 string thuần
 */
export const extractBase64FromDataUrl = (dataUrl) => {
  if (!dataUrl.startsWith('data:')) {
    return dataUrl; // Đã là base64 thuần
  }
  
  const base64Index = dataUrl.indexOf(',');
  return base64Index !== -1 ? dataUrl.substring(base64Index + 1) : dataUrl;
};

/**
 * Lấy MIME type từ data URL
 * @param {string} dataUrl - Data URL
 * @returns {string} - MIME type
 */
export const getMimeTypeFromDataUrl = (dataUrl) => {
  if (!dataUrl.startsWith('data:')) {
    return 'unknown';
  }
  
  const mimeMatch = dataUrl.match(/data:([^;]+)/);
  return mimeMatch ? mimeMatch[1] : 'unknown';
};

/**
 * Chuyển File object thành base64
 * @param {File} file - File object
 * @returns {Promise<string>} - Promise resolve base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      // Lấy base64 thuần (bỏ data URL prefix)
      const base64 = extractBase64FromDataUrl(result);
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Download base64 thành file
 * @param {string} base64String - Base64 string
 * @param {string} filename - Tên file
 * @param {string} mimeType - MIME type
 */
export const downloadBase64AsFile = (base64String, filename, mimeType = 'application/octet-stream') => {
  try {
    const byteCharacters = atob(extractBase64FromDataUrl(base64String));
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading base64 as file:', error);
  }
};

/**
 * Resize ảnh base64
 * @param {string} base64String - Base64 string của ảnh
 * @param {number} maxWidth - Chiều rộng tối đa
 * @param {number} maxHeight - Chiều cao tối đa
 * @param {number} quality - Chất lượng (0-1)
 * @returns {Promise<string>} - Promise resolve base64 đã resize
 */
export const resizeBase64Image = (base64String, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Tính toán kích thước mới
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Vẽ ảnh đã resize
      ctx.drawImage(img, 0, 0, width, height);
      
      // Lấy base64 mới
      const resizedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(extractBase64FromDataUrl(resizedBase64));
    };
    img.onerror = reject;
    img.src = createImageDataUrl(base64String);
  });
};
