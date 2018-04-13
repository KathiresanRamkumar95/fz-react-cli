import webpack from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';

let getProdPlugins = () => {
  let plugins = [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CaseSensitivePathsPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({
      __TEST__: false,
      __DEVELOPMENT__: true,
      __DOCS__: false,
      __SERVER__: true
    })
  ];

  return plugins;
};

export default getProdPlugins;
