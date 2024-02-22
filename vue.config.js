const CompressionPlugin = require('compression-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    publicPath: isProd ? './' : './',
	lintOnSave: false,
    configureWebpack: config => {
		config.resolveLoader.modules.push('./loader');
        if (isProd) {
            return {
                plugins: [
                    new CompressionPlugin({
                        test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
                        threshold: 10240, // 归档需要进行压缩的文件大小最小值，这个对 10K 以上的进行压缩
                        deleteOriginalAssets: false, // 是否删除原文件
                    }),
                ],
            }
        }
    },
	 chainWebpack: config => {
	        config.module
	        .rule('puk')
	          .test(/\.puk$/)
	          .use('style-px2rem-loader')
	            .loader('style-px2rem-loader')
	            .end()
	    },
}
