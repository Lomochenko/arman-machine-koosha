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

  const fullPath = path.join(process.cwd(), 'css', filePath);
  
  // Security check - prevent directory traversal
  if (!fullPath.startsWith(path.join(process.cwd(), 'css'))) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    });
  }

  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    // Set appropriate content type
    setHeader(event, 'Content-Type', 'text/css');
    setHeader(event, 'Cache-Control', 'public, max-age=31536000');
    
    return content;
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File Not Found',
    });
  }
});

