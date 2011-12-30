console.log("Use the Source, Luke");

// Initialize the Spotify objects
var sp = getSpotifyApi(1);
	m = sp.require("sp://import/scripts/api/models"),
	v = sp.require("sp://import/scripts/api/views"); 

// I tend to leave these uncommented for fast access to the API calls
console.log(sp.core);						
console.log(sp.trackPlayer);
console.log(sp.social);


// Handle URI arguments
sp.core.addEventListener("argumentsChanged", handleArgs);
function handleArgs() {
	var args = sp.core.getArguments();
	$(".section").hide();	// Hide all sections
	$("#"+args[0]).show();	// Show current section
	
	// If there are multiple arguments, handle them accordingly
	if(args[1]) {		
		switch(args[0]) {
			case "search":
				searchArgs(args);
				break;
		}
	}
}

// Handle Drag 'n' Drop
sp.core.addEventListener("linksChanged", handleLinks);
function handleLinks() {
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



