import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import webpack from 'webpack';

let getUMDComponentPlugins = options => {
  let { isDocs } = options;
  let plugins = [
    new CaseSensitivePathsPlugin(),
    new webpack.DefinePlugin({
      __TEST__: false,
      __DEVELOPMENT__: false,
      __DOCS__: isDocs ? true : false,
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      },
      __SERVER__: false
    })
  ];
  return plugins;
};

export default getUMDComponentPlugins;
