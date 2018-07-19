import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import ExtractTextPlugin  from 'extract-text-webpack-plugin';
import webpack from 'webpack';

let getUMDCSSPlugins = () => {
  let plugins = [
    new CaseSensitivePathsPlugin(),
    new webpack.DefinePlugin({
      __TEST__: false,
      __DEVELOPMENT__: false,
      __DOCS__: false,
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      },
      __SERVER__: false
    }),
    new ExtractTextPlugin()
  ];
  return plugins;
};

export default getUMDCSSPlugins;
