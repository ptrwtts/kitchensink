/**
 *      by @ptrwtts             
 *		https://github.com/ptrwtts/kitchensink
 */

// Initialize the Spotify objects
var sp = getSpotifyApi(1),
	models = sp.require("sp://import/scripts/api/models"),
	views = sp.require("sp://import/scripts/api/views"), 
	player = models.player,
	library = models.library,
	application = models.application;


// Handle URI arguments
//application.observe(models.EVENT.ARGUMENTSCHANGED, handleArgs);
sp.core.addEventListener("argumentsChanged", handleArgs);
	
function handleArgs() {
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
//application.observe(models.EVENT.LINKSCHANGED, handleLinks);
sp.core.addEventListener("linksChanged", handleLinks);

function handleLinks() {
	var links = sp.core.getLinks();
	if(links.length) {
		// Play the given item
		console.log(links);
		player.play(models.Track.fromURI(links[0]));
	} 
}

$(function(){
	
	console.log('Loaded');
	
	// Run on application load
	handleArgs();
	//handleLinks();
	
});



