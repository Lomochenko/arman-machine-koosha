import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const filePath = getRouterParam(event, '_');
  
  if (!filePath) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    });
  }

  const fullPath = path.join(process.cwd(), 'img', filePath);
  
  // Security check - prevent directory traversal
  if (!fullPath.startsWith(path.join(process.cwd(), 'img'))) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    });
  }

  try {
    const buffer = fs.readFileSync(fullPath);
    
    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes: { [key: string]: string } = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
      '.ico': 'image/x-icon',
    };
    
    const contentType = contentTypes[ext] || 'application/octet-stream';
    
    setHeader(event, 'Content-Type', contentType);
    setHeader(event, 'Cache-Control', 'public, max-age=31536000');
    
    return buffer;
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File Not Found',
    });
  }
});

