function socialInput(username) {
	getFriend(username);
}

var tempPlaylist;

$(function(){

	$("#artists a").live('click',function(e){
		showFriend($(this).attr('href'));
		e.preventDefault();
	});

	$("#savePlaylist").live('click',function(e){
		sp.core.library.createPlaylist($("#friend h2").text(), tempPlaylist.data.all());
		e.preventDefault();
	});
	
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
	console.log(username);
	var local = localStorage.getItem(username);
	if(local) {
		showFriend(username,JSON.parse(local));
	} else {
		var toplist = new models.Toplist();
		toplist.user = username;						// According to Docs, should actually be toplist.userName
		toplist.matchType = models.TOPLISTMATCHES.TRACKS;	// Album doesn't work!
		toplist.region = "user";
		toplist.observe(models.EVENT.CHANGE, function() {
			localStorage.setItem(username,JSON.stringify(toplist.results));
			showFriend(username,toplist.results);
		});
		toplist.observe(models.EVENT.LOAD_ERROR, function() {
			$("#friend-title").html(username+"'s Top Tracks");
			$("#friend-tracks").html("What a drag! Looks like "+username+" isn't sharing their music :(");
		});
		toplist.run();
		/*
		var toplist = sp.social.getToplist("track","user",username,{
			onSuccess: function(response) {
				localStorage.setItem(username,JSON.stringify(response));
				showFriend(username,response);
			},
			onFailure: function(response) {
				console.log(response);
			}
		});
		*/
	}
}

function showFriend(username,response) {
	console.log(response);
	$("#friend-title").html(username+"'s Top Tracks");
	$("#friend-tracks").empty();
	tempPlaylist = new models.Playlist();
	$.each(response.tracks,function(num,track){
		tempPlaylist.add(models.Track.fromURI(track.uri));
	});					
	var playlistList = new views.List(tempPlaylist);
		playlistList.node.classList.add("temporary");
		$("#friend-tracks").append(playlistList.node);
}