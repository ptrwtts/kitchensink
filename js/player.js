$(function(){
	
	// Update the page when the app loads
	nowPlaying();
	
	// Listen for track changes and update the page
	sp.trackPlayer.addEventListener("playerStateChanged", function (event) {

		if (event.data.curtrack == true) {
			var playerTrackInfo = sp.trackPlayer.getNowPlayingTrack();
			var track = playerTrackInfo.track;
			$("#play-history").append('<div>Track changed to: '+track.name+' by '+track.album.artist.name+'</div>');
		}
		nowPlaying();
		
	});
	
	$("#commands a").click(function(e){
		switch($(this).attr('command')) {
			case "togglePause":
				// Check isPlaying and reverse it
				sp.trackPlayer.setIsPlaying(!(sp.trackPlayer.getIsPlaying()),{
					onSuccess: function(response) {
						console.log(response);
					}
				});
				e.preventDefault();
				break;
			case "skip":
				// skip to next track
				sp.trackPlayer.skipToNextTrack();
				e.preventDefault();
				break;				
			case "playTrackFromUri":
				// Grab a random track from your library (cause it's more fun)
				var tracks = sp.core.library.getTracks();
				var track = tracks[Math.floor(Math.random()*tracks.length)]
				sp.trackPlayer.playTrackFromUri(track.uri,{ onSuccess: function() {} });
				e.preventDefault();
				break;
			case "playTrackFromContext":
				// Play an item (artist, album, playlist) from a particular position
				sp.trackPlayer.playTrackFromContext(
					$(this).attr('href'),
					parseInt($(this).attr('pos')),
					"",
					{ onSuccess: function() {} }
				);
				e.preventDefault();
				break;
			case "showSharePopup":
				// skip to next track
				console.log(e);
				var currentTrack = sp.trackPlayer.getNowPlayingTrack();
				sp.social.showSharePopup(e.pageX,e.pageY,currentTrack.track.uri);
				e.preventDefault();
				break;
		}
	});
	
});

function nowPlaying() {

	// This will be null if nothing is playing.
	var playerTrackInfo = sp.trackPlayer.getNowPlayingTrack();

	if (playerTrackInfo == null) {
		$("#now-playing").html("Painful silence!");
	} else {
		var track = playerTrackInfo.track;
		var song = '<a href="'+track.uri+'">'+track.name+'</a>';
		var album = '<a href="'+track.album.uri+'">'+track.album.name+'</a>';
		var artist = '<a href="'+track.album.artist.uri+'">'+track.album.artist.name+'</a>';
		$("#now-playing").html(song+" by "+artist+" off "+album);
	}
	
}