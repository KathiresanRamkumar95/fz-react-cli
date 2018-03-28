import React from 'react';
import Text from '../Text';

describe('Text component specification', () => {
  it('should display text content', () => {
    var renderedDOM = TestUtils.renderIntoDocument(
      <Text content="vimal" onClick={() => {}} />
    );
    expect(
      TestUtils.findRenderedComponentsWithTestid(
        renderedDOM,
        'data'
      ).textContent.contains('vimal')
    ).toBe(true);
  });

  it('should call onClick ', () => {
    var mockfn = jest.fn();
    var renderedDOM = TestUtils.renderIntoDocument(
      <Text content="vimal" onClick={mockfn} />
    );
    var textEle = TestUtils.findRenderedComponentsWithTestid(
      renderedDOM,
      'data'
    );
    TestUtils.Simulate.click(textEle);
    expect(mockfn.mock.calls.length).toBe(1);
    expect(mockfn.mock.calls[0][0]).toBe('vimal1');
  });
});
