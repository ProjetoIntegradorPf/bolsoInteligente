const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    if (!app) {
        throw new Error('app is required');
    }

    const proxyOptions = {
        target: 'https://bolsointeligente-api.onrender.com',
        changeOrigin: true
    };

    app.use('/api', createProxyMiddleware(proxyOptions));
};
