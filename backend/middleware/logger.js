/**
 * Request logging middleware
 */

const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log request
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`
  );

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusColor =
      status >= 400 ? "\x1b[31m" : status >= 300 ? "\x1b[33m" : "\x1b[32m";

    console.log(
      `${new Date().toISOString()} - ${req.method} ${req.path} - ` +
        `${statusColor}${status}\x1b[0m - ${duration}ms`
    );
  });

  next();
};

module.exports = {
  requestLogger,
};
