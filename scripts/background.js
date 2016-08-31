var topSitesList = [];
var backgrounds = [];
var bgIndex = 0;
var inited = false;

function init() {
	// get top sites
	chrome.topSites.get(function(mostVisitedURLs) {
		topSitesList = mostVisitedURLs;
	});
	// load saved variables
	chrome.storage.sync.get('bgIndex', function(items) {
		if (!items['bgIndex'])
			bgIndex = 0;
		else {
			bgIndex = items['bgIndex'];
			if (bgIndex >= backgrounds.length)
				bgIndex = 0;
		}
	});
	// load background json file
	$.ajaxSetup( { "async": false } );
	var response = $.getJSON("resources/backgrounds.json");
	backgrounds = response.responseJSON;
	$.ajaxSetup( { "async": true } );
	
	inited = true;
}

function chooseBackground() {
	var bg = backgrounds[bgIndex++];
	chrome.storage.sync.set({'bgIndex': bgIndex});
	return bg;
}

init();
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action == "topSites") {
		sendResponse(topSitesList);
	}
	else if (request.action == "getBackground") {
		sendResponse(chooseBackground());
	}
});