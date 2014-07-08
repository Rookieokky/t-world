var loadQueue = new Array();
function importScript(file, condition){ loadQueue.push(!condition? file : [file, condition]) }
function loadAllSync(){
	if (loadQueue.length > 0){
		var head=document.getElementsByTagName("head")[0];
		var script, file;

		file= loadQueue.shift(); // FIFO

		//if this file have conditions under which it has to be loaded
		// and they are satisfied, load the file... 
		if (!(file instanceof Array) || eval(file[1])){
			script= document.createElement('script');
			script.src= (file instanceof Array)? file[0] : file;
			script.type='text/javascript';

			try{//console guard
			console.clear();
			console.log("Loading modules... [" + script.src.substr(window.location.origin.length, script.src.length) + "]");}catch(e){
			}

			//real browsers
			script.onload= loadAllSync;
			script.onerror = function () {
				try{console.error("Error: couldn't download this file\n(if your Internet connection is slow, try reloading the page)");}catch(e){}
			}

			//Internet explorer XD
			script.onreadystatechange = function() {
				if (this.readyState == 'complete'){
					loadAllSync();
				}
			}
			head.appendChild(script);
		}else
		//...otherwise skip this file, and try loading the next one
			loadAllSync();
	}else
		try{console.clear();}catch(e){}
}

//-> Importing scripts synchronously
	importScript("./libs/jquery/jquery-1.7.2.min.js");
	importScript("./libs/jquery/jquery.mousewheel.js");
	importScript("./libs/jquery/jquery-ui.min.js");

	importScript("./libs/tworld/solid-auxiliary.js");

	importScript("./libs/tworld/solid-global.js");
	importScript("./libs/tworld/solid-general-settings.js");

	importScript(
		"./libs/util/xml2json.min.js",
		/*provided that the following conditions are satisfied*/
		"_XML_NECESSARY"
	);
	importScript("./libs/util/sprintf.min.js");
	importScript("./libs/util/he.min.js");
	importScript(
		"./libs/tworld/sound/buzz.min.js",
		/*provided that the following condition is satisfied*/
		"_AUDIO_ENABLE"
	);

	importScript("./copperlichtdata/copperlicht.js");

	importScript("./libs/tworld/solid-core.js");
	importScript("./libs/tworld/solid-environment.js");
	importScript("./libs/tworld/solid-graphic.js");
	importScript("./libs/tworld/solid-graphic-rob.js");

	loadAllSync();
//<-