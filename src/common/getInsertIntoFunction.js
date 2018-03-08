let getInsertIntoFunction = styleTarget => {
	return eval(`(styleTarget = ${JSON.stringify(styleTarget)})=>{
        if (styleTarget !== 'false') {
            let element = document.getElementById(styleTarget);
            return element ? element.shadowRoot
                ? element.shadowRoot
                : element : document.head;
        }
        return document.head;
    }`);
};

export default getInsertIntoFunction;
