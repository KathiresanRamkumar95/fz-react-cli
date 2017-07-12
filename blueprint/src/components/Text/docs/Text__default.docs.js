import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Text from '../Text';
export default class Text__default extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Text
        text="vimal"
        onClick={val => {
          console.log('value', val);
        }}
      />
    );
  }
}
if (__DOCS__) {
  Text__default.docs = {
    componentGroup: 'Atom'
  };
}
