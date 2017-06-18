// See http://brunch.io for documentation.
exports.files = {
  javascripts: {
    joinTo: {
      'vendor.js': /^(?!app)/,
      'app.js': /^app/
    }
  },
  stylesheets: {joinTo: 'app.css'}
};

exports.plugins = {
  babel: {presets: ['latest', 'react']},
   sass: {
      options: {
        // Use includePaths to allow sass to load files outside your tree
        // For example, from node_modules
        //includePaths: ['app/css']
      },
    }
};
