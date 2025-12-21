// Middleware to handle static assets
export default defineEventHandler((event) => {
  const path = getHeader(event, 'x-forwarded-path') || event.node.req.url || '';
  
  // Allow static assets to be served without Vue Router interference
  if (path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i)) {
    // Let Nitro serve these files
    return;
  }
});

