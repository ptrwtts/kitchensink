/**
 *      by @ptrwtts             
 *		https://github.com/ptrwtts/kitchensink
 *		Free to distribute under MIT and all that jazz
 */

// Initialize the Spotify objects
var sp = getSpotifyApi(1),
	models = sp.require("sp://import/scripts/api/models"),
	views = sp.require("sp://import/scripts/api/views"),
	ui = sp.require("sp://import/scripts/ui");
	player = models.player,
	library = models.library,
	application = models.application,
	playerImage = new views.Player();

// Handle URI arguments
application.observe(models.EVENT.ARGUMENTSCHANGED, handleArgs);
	
function handleArgs() {
	var args = models.application.arguments;
	$(".section").hide();	// Hide all sections
	$("#"+args[0]).show();	// Show current section
	console.log(args);
	
	// If there are multiple arguments, handle them accordingly
	if(args[1]) {		
		switch(args[0]) {
			case "search":
				searchInput(args);
				break;
			case "social":
				socialInput(args[1]);
				break;
		}
	}
}

// Handle items 'dropped' on your icon
application.observe(models.EVENT.LINKSCHANGED, handleLinks);

function handleLinks() {
	var links = models.application.links;
	if(links.length) {
		switch(links[0].split(":")[1]) {
			case "user":
				socialInput(links[0].split(":")[2]);
				break;
			default:
				// Play the given item
				player.play(models.Track.fromURI(links[0]));
				break;
		}		
	} 
}

$(function(){
	
	console.log('Loaded.');
	
	// Run on application load
	handleArgs();
	handleLinks();
	
});



