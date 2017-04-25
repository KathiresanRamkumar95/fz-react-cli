function ModuleStatsPlugin(options) {
  options = options || {};
  this.options ={};
  this.options.filename = options.filename || "moduleStats.js"
}

ModuleStatsPlugin.prototype = {
  constructor: ModuleStatsPlugin,

  apply: function (compiler) {
  	var self = this;
    compiler.plugin("emit", function (compilation, callback) {
      
     var stats = compilation.getStats().toJson();

     var modules = stats.modules;
	 var moduleName = "";
	 var rModuleName = "";
	 var rReferencesArray = [];
	 var rReferencedByArray = [];
	 var data ={results:[]};
	 var moduleDetails ={};
	 var references = "";
	 var referencedBy = "";
	 var normalizedData="";
	
     for(var i in modules)
     {
     	moduleName = modules[i].name;
     	if(moduleName.startsWith("./src") && !(((moduleName).indexOf("index.js"))>-1) && !(moduleName.endsWith("css")))
     	{	     	
	     	rModuleName = moduleName.substring(moduleName.lastIndexOf("/")+1,moduleName.lastIndexOf("."));
	     	if(rModuleName.endsWith("docs"))
	     	{
	     		rModuleName=rModuleName.substring(0,rModuleName.lastIndexOf("."));
	     	}

	     	if(modules[i].reasons.length>0)
	     	{
	     	   for(var l in modules[i].reasons)
	     		{
	     		    referencedBy = modules[i].reasons[l].moduleName;
	     		    if(!referencedBy.endsWith("index.js"))
	     		    {	var referencedby = referencedBy.substring(referencedBy.lastIndexOf("/")+1,referencedBy.lastIndexOf("."));
	     		    	if(referencedby.endsWith("docs"))
	     		    	{
	     		    		rReferencedByArray.push(referencedby.substring(0,referencedby.lastIndexOf(".")))
	     		    	}
	     		    	else{
	     		    		rReferencedByArray.push(referencedBy.substring(referencedBy.lastIndexOf("/")+1,referencedBy.lastIndexOf(".")));
	     		    	}	     		    	
	     		    }		     				     		
	     		}
		    }
	     	else
	     	{
	     		console.log("This module is no were used!!!");
	     	}

	     	for (var module in modules)
	     	{
	     		for(var reason in modules[module].reasons)
	     		{
	     			if(moduleName === modules[module].reasons[reason].moduleName && !(((modules[module].name).indexOf("css"))>-1))
	     			{
	     				if(!((modules[module].name).endsWith("react.js")) && !(((modules[module].name).indexOf("react-dom"))>-1) && !(modules[module].name.endsWith(".png")))
	     				{	
	     					references =  modules[module].name;					
	     				    rReferencesArray.push(references.substring(references.lastIndexOf("/")+1,references.lastIndexOf(".")));	     				    
	     				}	     				
	     			}	     			
	     		}	     	
	     	}
	     	
	     	rReferencesArray = rReferencesArray.filter( function( item, index, inputArray ) {
           return inputArray.indexOf(item) == index;
    		});

	     	moduleDetails = {
	     		"name":rModuleName,
	     		"references":rReferencesArray,
	     		"referencedby":rReferencedByArray
	     	};

        	var dre ="";

	     	data.results.push(moduleDetails);  	
	     	moduleDetails = {};
	     	rReferencesArray=[];
	     	rReferencedByArray=[];
	     	referencedBy="";
	     	references="";

	     	data.results.forEach((mod)=>{
          dre += "'"+mod.name+"':"+JSON.stringify(mod)+","
        }); 
     	}   	
     }

     var dataResult = "{"+dre+"}";
     var mResult = "var mdata = "+dataResult;

      compilation.assets[self.options.filename] = {
        source: function () {
          return mResult;
        },
        size: function () {
         return mResult.length;
        }
      };
      console.log("\nThe "+self.options.filename+" has pushed\n");
      callback();
    });
  }
};

module.exports = ModuleStatsPlugin;