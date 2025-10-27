import { defineEventHandler, getRouterParam, createError, setHeader } from 'file://C:/Users/Asus/Desktop/arman-machine-koosha/node_modules/h3/dist/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const _____ = defineEventHandler(async (event) => {
  const filePath = getRouterParam(event, "_");
  if (!filePath) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found"
    });
  }
  const fullPath = path.join(process.cwd(), "js", filePath);
  if (!fullPath.startsWith(path.join(process.cwd(), "js"))) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden"
    });
  }
  try {
    const content = fs.readFileSync(fullPath, "utf-8");
    setHeader(event, "Content-Type", "application/javascript");
    setHeader(event, "Cache-Control", "public, max-age=31536000");
    return content;
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: "File Not Found"
    });
  }
});

export { _____ as default };
//# sourceMappingURL=_..._.mjs.map
