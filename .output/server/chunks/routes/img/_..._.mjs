import { c as defineEventHandler, g as getRouterParam, e as createError, f as setHeader } from '../../_/nitro.mjs';
import fs from 'fs';
import path from 'path';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue';
import 'node:url';
import 'consola';

const _____ = defineEventHandler(async (event) => {
  const filePath = getRouterParam(event, "_");
  if (!filePath) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found"
    });
  }
  const fullPath = path.join(process.cwd(), "img", filePath);
  if (!fullPath.startsWith(path.join(process.cwd(), "img"))) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden"
    });
  }
  try {
    const buffer = fs.readFileSync(fullPath);
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".webp": "image/webp",
      ".ico": "image/x-icon"
    };
    const contentType = contentTypes[ext] || "application/octet-stream";
    setHeader(event, "Content-Type", contentType);
    setHeader(event, "Cache-Control", "public, max-age=31536000");
    return buffer;
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: "File Not Found"
    });
  }
});

export { _____ as default };
//# sourceMappingURL=_..._.mjs.map
