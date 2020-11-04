const fs = require('fs');
const path = require('path');

const ADDITIONAL_ENTRY_POINTS = ['editor', 'standalone', 'polyfills', 'doc-block', 'illustrations', 'live', 'blanks'];

module.exports = {
  type: 'react',
  serve: {
    hot: false
  },
  webpack: config => {
    config.devtool = 'source-map';

    ADDITIONAL_ENTRY_POINTS.forEach(name => {
      config.entry[name] = [config.entry.index[0].replace('index', name)];
    });

    // Stop `import()`-ed chunks from being split into `[name].js` and `vendors~[name].js`
    config.optimization = {
      ...(config.optimization || {}),
      splitChunks: {
        cacheGroups: {
          vendors: false
        }
      }
    };

    return config;
  },
  deploy: [
    {
      to: '/www/res/sites/news-projects/<name>/<id>'
    },
    config => {
      fs.writeFileSync(
        path.join(__dirname, 'redirect', 'index.js'),
        `window.location = String(window.location).replace('/latest/', '/${config.id}/')`
      );

      return {
        ...config,
        from: 'redirect',
        to: '/www/res/sites/news-projects/<name>/latest'
      };
    }
  ]
};
