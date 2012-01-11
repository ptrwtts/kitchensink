function searchArgs(args) {	
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
					sp.core.search(query, true, false, {		// using "true, false" will include local results if available. no idea what the values represent!
						onSuccess: function(response) {
							if(response.artists.length) {
								$.each(response.artists,function(index,artist){
									if(index<5) {
										$("#search-results").append('<div><a href="'+artist.uri+'">'+artist.name+'</a></div>');
									}
								});
							} else {
								$("#search-results").append('<div>No artists in results</div>');
							}
							$("#search-results").append("<h2>Albums</h2>");
							if(response.albums.length) {
								$.each(response.albums,function(index,album){
									if(index<5) {
										$("#search-results").append('<div><a href="'+album.uri+'">'+album.name+'</a></div>');
									}
								});
							} else {
								$("#search-results").append('<div>No albums in results</div>');
							}
							$("#search-results").append("<h2>Tracks</h2>");
							if(response.tracks.length) {
								tempPlaylist = new models.Playlist();
								$.each(response.tracks,function(index,track){
									if(track.uri.split(":")[1]!="local") {					// Need to exclude local tracks or the artwork fails....
										tempPlaylist.add(m.Track.fromURI(track.uri));
									}
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
						} 
					});
					break;
				case "search-play":
					sp.core.search(query, true, false, {
						onSuccess: function(response) {
							if(response.tracks[0]) {
								sp.trackPlayer.playTrackFromUri(response.tracks[0].uri, { onSuccess: function() {} });
							}
						}
					});
				break;
				case "search-explore":
					$("#search-results").html('Check the console (right-click > show inspector) to see data');
					console.log("** This is a demo to show the different ways to get info on artists / albums / tracks **");
					console.log("** It scans the first artist / album / track found in a search request **");
					console.log("** It is also a demonstration of handling asynchronous calls **");
					console.log("** All results will be placed in the object below as they come back **");
					var results = {}
					console.log(results);
					asyncCalls = []; 	//prepare for async calls
					sp.core.search(query, true, true, {		// using "true, true" excludes local results
						onSuccess: function(response) {
							// ARTIST
							if(response.artists.length) {
								results.artist = {};
								var artist = response.artists[0];
								// Artist Object		
									results.artist["Create an Artist Object"] = models.Artist.fromURI(artist.uri);
								// Browse URI
									asyncCalls.push("artistBrowseUri");
									sp.core.browseUri(artist.uri, {
										onSuccess: function(response) {
											asyncComplete("artistBrowseUri");
											results.artist["Browse an Artist URI"] = response;
											// Artist Tracks
											asyncCalls.push("artistTracks");
											sp.core.getMetadata(response.playlist.all(), {
												onSuccess: function(tracks) {
													asyncComplete("artistTracks");
													results.artist["Get all tracks for an Artist"] = {"tracks":tracks};
												}
											});
										}
									});
								// Get Metadata (local)
									asyncCalls.push("artistLocalMetadata");
									sp.core.getMetadata(artist.uri, {
										onSuccess: function(response) {
											asyncComplete("artistLocalMetadata");
											results.artist["Get Local Metadata for an Artist"] = response;
										}
									});
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
							if(response.albums.length) {
								results.album = {};
								var album = response.albums[0];
								// Album Object					
									results.album["Create an Album Object"] = models.Album.fromURI(album.uri);
								// Browse URI
									asyncCalls.push("albumBrowseUri");
									sp.core.browseUri(album.uri, {
										onSuccess: function(response) {
											asyncComplete("albumBrowseUri");
											results.album["Browse an Album URI"] = response;
										}
									});
								// Get Metadata (local)
									asyncCalls.push("albumLocalMetadata");
									sp.core.getMetadata(album.uri, {
										onSuccess: function(response) {
											asyncComplete("albumLocalMetadata");
											results.album["Get Local Metadata for an Album"] = response;
										}
									});
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
							if(response.tracks.length) {
								results.track = {};
								var track = response.tracks[0];
								// Track Object					
									results.track["Create a Track Object"] = models.Track.fromURI(track.uri);
								// Get Metadata (local)
									asyncCalls.push("trackLocalMetadata");
									sp.core.getMetadata(track.uri, {
										onSuccess: function(response) {
											asyncComplete("trackLocalMetadata");
											results.track["Get Local Metadata for a Track"] = response;
										}
									});
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
						}
					});
				break;
			}
		}
	});
	$("#search-examples a").click(function(e){
		$("#search-term").val($(this).text());
		e.preventDefault();
	});
	$("#savePlaylist").live('click',function(e){
		sp.core.library.createPlaylist($("#search-term").val()+" Tracks", tempPlaylist.data.all());
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