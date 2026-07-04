/**
 * Not Found Handler Middleware
 * Handles 404 errors for undefined routes
 */

const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        path: req.originalUrl,
        method: req.method
    });
};

export default notFoundHandler;