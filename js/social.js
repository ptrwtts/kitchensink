function socialInput(username) {
	getFriend(username);
}

var tempPlaylist;

$(function(){

	var drop = document.querySelector('#friend-drop');
	drop.addEventListener('dragenter', handleDragEnter, false);
	drop.addEventListener('dragover', handleDragOver, false);
	drop.addEventListener('dragleave', handleDragLeave, false);
	drop.addEventListener('drop', handleDrop, false);

	function handleDragEnter(e) {
		this.style.background = '#444444';
	}
	
	function handleDragOver(e) {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';  // See the section on the DataTransfer object.
		return false;
	}

	function handleDragLeave(e) {
		this.style.background = '#333333';
	}
	
	function handleDrop(e) {
		this.style.background = '#333333';
		var uri = e.dataTransfer.getData('Text');
		if(uri.split(":")[1]=="user") {
			window.location.href="spotify:app:kitchensink:social:"+uri.split(":")[2]
		}
	}

});

function getFriend(username) {
	var toplist = new models.Toplist();	
	toplist.userName = username;	
	toplist.matchType = models.TOPLISTMATCHES.TRACKS;	// ALBUMS doesn't work!
	toplist.observe(models.EVENT.CHANGE, function() {
		showFriend(username,toplist.results);
	});
	toplist.observe(models.EVENT.LOAD_ERROR, function() {
		$("#friend-title").html(username+"'s Top Tracks");
		$("#friend-tracks").html("What a drag! Looks like "+username+" isn't sharing their music :(");
	});
	toplist.run();
}

function showFriend(username,tracks) {
	$("#friend-title").html(username+"'s Top Tracks");
	$("#friend-tracks").empty();
	tempPlaylist = new models.Playlist();
	$.each(tracks,function(num,track){
		tempPlaylist.add(models.Track.fromURI(track.uri));
	});					
	var playlistList = new views.List(tempPlaylist);
		playlistList.node.classList.add("temporary");
		$("#friend-tracks").append(playlistList.node);
}