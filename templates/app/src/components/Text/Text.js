import React from 'react';
import PropTypes from 'prop-types';
export default class Text extends React.Component {
  render() {
    return (
      <div
        data-testid="data"
        onClick={this.props.onClick.bind(this, this.props.content)}
      >
        {this.props.content}
      </div>
    );
  }
}
Text.propTypes = {
  content: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};
if (__DOCS__) {
  Text.docs = {
    componentGroup: 'Atom'
  };
}
