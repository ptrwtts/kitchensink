/**
 *      by @ptrwtts             
 *		https://github.com/ptrwtts/kitchensink
 */

// Initialize the Spotify objects
var sp = getSpotifyApi(1),
	models = sp.require("sp://import/scripts/api/models"),
	views = sp.require("sp://import/scripts/api/views"); 

// Handle URI arguments
models.application.observe(models.EVENT.ARGUMENTSCHANGED, function() {
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
});

// Handle Drag 'n' Drop
models.application.observe(models.EVENT.LINKSCHANGED, function() {
	var links = sp.core.getLinks();
	if(links.length) {
		// Play the given item
		sp.trackPlayer.playTrackFromUri(links[0],{ onSuccess: function() {} });
	} 
}

$(function(){
	
	// Run on application load
	handleArgs();
	handleLinks();
	
});



