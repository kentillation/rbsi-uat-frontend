const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        // Define the feature flag to eliminate the warning
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
      })
    ]
  }
})
