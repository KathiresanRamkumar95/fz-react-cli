import React from 'react';
import ReactDOM from 'react-dom'
console.log("test")
export class Test extends React.Component{
	render(){
		return <div>Test,{this.props.name}</div>
	}
}
Test.docs={
	componentGroup:"Atom",
	testProps:{
		name:"vimalesan"
	}
}
export { default as React } from 'react';
export { default as ReactDOM } from 'react-dom';