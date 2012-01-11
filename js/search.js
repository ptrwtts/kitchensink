function searchInput(args) {	
	// args[0] = page,  args[1] = command, args[2] = value 
	// e.g. spotify:app:kitchensink:search:play:the+cure+close+to+me
	var query = unescape(args[2].replace(/\+/g, " ")); //clean up the search query
	console.log(query);
	$("#search-term").val(query);
	$("#search-"+args[1]).trigger('click');
}

var asyncCalls = [],  // Initiate for later
	tempPlaylist = new models.Playlist();

$(function(){
	
	$("#search button").click(function(e){
		var query = $("#search-term").val();
		var type = $(this).attr("id");
		if(query!="") {
			switch(type){
				case "search-basic":
					$("#search-results").empty();
					$("#search-results").append("<h2>Artists</h2>");
					var search = new models.Search(query);
					search.localResults = models.LOCALSEARCHRESULTS.APPEND;		// Local files last
					search.observe(models.EVENT.CHANGE, function() {
						if(search.artists.length) {
							$.each(search.artists,function(index,artist){
								if(index<5) {
									$("#search-results").append('<div><a href="'+artist.uri+'">'+artist.name+'</a></div>');
								}
							});
						} else {
							$("#search-results").append('<div>No artists in results</div>');
						}
						$("#search-results").append("<h2>Albums</h2>");
						if(search.albums.length) {
							$.each(search.albums,function(index,album){
								if(index<5) {
									$("#search-results").append('<div><a href="'+album.uri+'">'+album.name+'</a></div>');
								}
							});
						} else {
							$("#search-results").append('<div>No albums in results</div>');
						}
						$("#search-results").append("<h2>Tracks</h2>");
						if(search.tracks.length) {
							tempPlaylist = new models.Playlist();
							$.each(search.tracks,function(index,track){
								tempPlaylist.add(models.Track.fromURI(track.uri));				// Note: artwork is compiled from first few tracks. if any are local it will fail to generate....
							});				
							var playlistArt = new views.Player();
								playlistArt.track = tempPlaylist.get(0);
								playlistArt.context = tempPlaylist;
								$("#search-results").append(playlistArt.node);
							var saveButton = "<button id='savePlaylist' class='add-playlist button icon'>Save As Playlist</button>";
								$("#search-results .sp-player").append(saveButton);
							var playlistList = new views.List(tempPlaylist);
								playlistList.node.classList.add("temporary");
								$("#search-results").append(playlistList.node);
						} else {
							$("#search-results").append('<div>No tracks in results</div>');
						}
					});
					search.appendNext();
					break;
				case "search-play":
					var search = new models.Search(query);
					search.localResults = models.LOCALSEARCHRESULTS.PREPEND;		// Local files first
					search.observe(models.EVENT.CHANGE, function() {
						if(search.tracks.length) {
							player.play(search.tracks[0].uri);
						}
					});
					search.appendNext();
				break;
				case "search-explore":
					$("#search-results").html('Check the console (right-click > show inspector) to see data');
					console.log("** This compares local / remote information returned for artists / albums / tracks **");
					console.log("** It scans the first artist / album / track found in a search request **");
					console.log("** It is also a demonstration of handling asynchronous calls **");
					console.log("** All results will be placed in the object below as they come back **");
					var results = {}
					console.log(results);
					asyncCalls = []; 	//prepare for async calls
					var search = new models.Search(query);
					search.observe(models.EVENT.CHANGE, function() {
						// ARTIST
						if(search.artists.length) {
							results.artist = {};
							var artist = search.artists[0];
							// Artist Object (local)	
								results.artist["Create an Artist Object"] = models.Artist.fromURI(artist.uri);
							// Get Metadata (remote)
								asyncCalls.push("artistRemoteMetadata");
								$.ajax({
									url: "http://ws.spotify.com/lookup/1/.json?uri="+artist.uri+"&extras=albumdetail",
									success: function(response) {
										asyncComplete("artistRemoteMetadata");
										results.artist["Get Remote Metadata for an Artist"] = response;
									}
							  	});								
						}
						// ALBUM
						if(search.albums.length) {
							results.album = {};
							var album = search.albums[0];
							// Album Object (local)		
								results.album["Create an Album Object"] = models.Album.fromURI(album.uri);
							// Get Metadata (remote)
								asyncCalls.push("albumRemoteMetadata");
								$.ajax({
									url: "http://ws.spotify.com/lookup/1/.json?uri="+album.uri+"&extras=trackdetail",
									success: function(response) {
										asyncComplete("albumRemoteMetadata");
										results.album["Get Remote Metadata for an Album"] = response;
									}
							  	});								
						}		
						// TRACK
						if(search.tracks.length) {
							results.track = {};
							var track = search.tracks[0];
							// Track Object	 (local)				
								results.track["Create a Track Object"] = models.Track.fromURI(track.uri);
							// Get Metadata (remote)
								asyncCalls.push("trackRemoteMetadata");
								$.ajax({
									url: "http://ws.spotify.com/lookup/1/.json?uri="+track.uri,
									success: function(response) {
										asyncComplete("trackRemoteMetadata");
										results.track["Get Remote Metadata for a Track"] = response;
									}
							  	});								
						}
					});					
					search.appendNext();
				break;
			}
		}
	});
	$("#search-examples a").click(function(e){
		$("#search-term").val($(this).text());
		e.preventDefault();
	});
	$("#savePlaylist").live('click',function(e){
		var myAwesomePlaylist = new models.Playlist($("#search-term").val()+" Tracks");
		$.each(tempPlaylist.data.all(),function(i,track){
			myAwesomePlaylist.add(track);
		});
		e.preventDefault();
	});
	
});

function asyncComplete(key) {
	asyncCalls.splice(asyncCalls.indexOf(key), 1);
	if(asyncCalls.length==0) {
		console.log('All async calls home safely'); // <insert action that requires all async calls>
	} else {
		console.log(asyncCalls.length+" aysnc calls remaining");
	}
	// Obviously in production you would want a more robust solution that can handle calls that fail!
}