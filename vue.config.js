const webpack = require('webpack');

module.exports = {
  transpileDependencies: [
    // Add dependencies here that need to be transpiled by Babel
    'vuetify'
  ],

  pluginOptions: {
    vuetify: {
      // Additional Vuetify-specific configurations can go here
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
}
