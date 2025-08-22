export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    const level = statusCode >= 400 ? 'ERROR' : 'INFO';
    
    console.log(
      `[${new Date().toISOString()}] ${level}: ${method} ${url} ${statusCode} ${duration}ms - ${ip}`
    );
  });

  next();
};