$(function(){
	
	// Update the page when the app loads
	nowPlaying();
	
	// Listen for track changes and update the page
	player.observe(models.EVENT.CHANGE, function (event) {
		if (event.data.curtrack == true) {
			var track = player.track;
			$("#play-history").append('<div>Track changed to: '+track.name+' by '+track.album.artist.name+'</div>');
		}
		nowPlaying();
		
	}); 
	
	$("#commands a").click(function(e){
		switch($(this).attr('command')) {
			case "togglePause":
				// Check if playing and reverse it
				player.playing = !(player.playing);
				e.preventDefault();
				break;
			case "skip":
				// skip to next track
				player.next();
				e.preventDefault();
				break;				
			case "playTrackFromUri":
				// Grab a random track from your library (cause it's more fun)
				var tracks = library.tracks;
				var track = tracks[Math.floor(Math.random()*tracks.length)]
				player.play(track.uri);
				e.preventDefault();
				break;
			case "playTrackFromContext":
				// Play an item (artist, album, playlist) from a particular position
				player.play(
					$(this).attr('href'),				// ????
					$(this).attr('href'),				// Item to play
					parseInt($(this).attr('pos'))		// Position to play from
				);
				e.preventDefault();
				break;
			case "showSharePopup":
				// skip to next track
				application.showSharePopup(document.getElementById($(this).attr('id')),player.track.uri); // This will fail if you're listening to a local track :(
				e.preventDefault();
				break;
		}
	});
	
});

function nowPlaying() {

	// This will be null if nothing is playing.
	var track = player.track;

	if (track == null) {
		$("#now-playing").html("Painful silence!");
	} else {
		var song = '<a href="'+track.uri+'">'+track.name+'</a>';
		var album = '<a href="'+track.album.uri+'">'+track.album.name+'</a>';
		var artist = '<a href="'+track.album.artist.uri+'">'+track.album.artist.name+'</a>';
		var context = player.context, extra ="";
		if(context) { extra = ' from <a href="'+context+'">here</a>'; } // too lazy to fetch the actual context name
		$("#now-playing").html(song+" by "+artist+" off "+album+extra);
	}
	
}