const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	app.use(
		'/api',
		createProxyMiddleware({
			target: 'https://bolsointeligente.onrender.com',
			changeOrigin: true
		})
	);
};
