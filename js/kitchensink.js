/**
 *      by @ptrwtts             
 *		https://github.com/ptrwtts/kitchensink
 */

// Initialize the Spotify objects
var sp = getSpotifyApi(1),
	models = sp.require("sp://import/scripts/api/models"),
	views = sp.require("sp://import/scripts/api/views"); 

// Handle URI arguments
models.application.observe(models.EVENT.ARGUMENTSCHANGED, handleArgs);
	
var handleArgs = function() {
	var args = models.application.arguments;
	$(".section").hide();	// Hide all sections
	$("#"+args[0]).show();	// Show current section
	
	// If there are multiple arguments, handle them accordingly
	if(args[1]) {		
		switch(args[0]) {
			case "search":
				searchArgs(args);
				break;
			case "social":
				socialArgs(args);
				break;
		}
	}
}

// Handle items 'dropped' on your icon
models.application.observe(models.EVENT.LINKSCHANGED, handleLinks);

var handleLinks = function() {
	var links = sp.core.getLinks();
	if(links.length) {
		// Play the given item
		sp.trackPlayer.playTrackFromUri(links[0],{ onSuccess: function() {} });
	} 
}

$(function(){
	
	console.log('Loaded');
	
	// Run on application load
	handleArgs();
	handleLinks();
	
});



