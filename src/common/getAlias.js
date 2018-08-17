let getAlias = options => {
  let alias = {};
  let { isPreactMig } = options.app;
  if (isPreactMig) {
    alias.react = 'preact';
    alias['react-dom'] = 'preact-compat';
  }
  return alias;
};

export default getAlias;
