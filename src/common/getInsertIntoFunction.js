let getInsertIntoFunction = styleTarget =>
	// eslint-disable-next-line no-eval
	eval(`function insertIntoFunction (){
		var styleTarget = ${JSON.stringify(styleTarget)};
        if (styleTarget !== 'false') {
            var element = document.getElementById(styleTarget);
            return element ? element.shadowRoot
                ? element.shadowRoot
                : element : document.head;
        }
        return document.head;
    }`);

export default getInsertIntoFunction;
