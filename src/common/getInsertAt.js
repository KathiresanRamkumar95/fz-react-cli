function getInsertAt() {
  let flag = 'npm_package_react_cli_insertAt';

  if (process.env[flag]) {
    return process.env[flag];
  }
  let insertAt;

  let userOption = Object.keys(process.env).filter(
    key => key.indexOf(flag) >= 0
  );

  let [option] = userOption;
  if (!option) {
    throw new Error(
      'You have used insertAt flag but you didn\'t provided a valid position to insert style tags; To get more info about insertAt option please refer following link https://github.com/webpack-contrib/style-loader#insertat'
    );
  }

  insertAt = process.env[option];
  let position = option.split('_');
  insertAt = {
    [position[position.length - 1]]: insertAt
  };
  return insertAt;
}

export default getInsertAt;
