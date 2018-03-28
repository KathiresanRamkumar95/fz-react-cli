import React from 'react';
import ReactDOM from 'react-dom';
import Text from './components/Text/Text';
ReactDOM.render(
  <Text content="vimalesan" onClick={v => {}} />,
  document.getElementById('react')
);
if (!__DEVELOPMENT__) {
  global.publicPath = function(chunkId) {
    __webpack_public_path__ = `https://static${chunkId %
      3}.tsi.zohocorpin.com:9090/app/`;
  };
}
