function socialArgs(args) {
	getFriend(args[1]);
}

var tempPlaylist;
var friends = [sp.core.user];									// There is an I in friends
var spotifyFriends = sp.social.relations.allSpotifyUsers();		// Returns array of user IDs
var allFriends = sp.social.relations.all();						// Returns full user objects

$(function(){
	// Loop through all friends, and fetch top tracks for any spotify users
	$.each(allFriends,function(index,friendURI){
		if($.inArray(friendURI, spotifyFriends)!=-1) {	// Some users aren't on Spotify
			var friend = sp.social.relations.getUserInfo(index);
			var local = localStorage.getItem(friend.username);
			if(local) {
				processFriend(friend,JSON.parse(local));				
			} else {
				var toplist = sp.social.getToplist("track","user",friend.username,{
					onSuccess: function(response) {
						localStorage.setItem(friend.username,JSON.stringify(response));
						processFriend(friend,response);
					},
					onFailure: function(error) {	// Some users fail (seems to be users who don't share on Facebook)	
						localStorage.setItem(friend.username,JSON.stringify({"error":error}));
						spotifyFriends.splice(spotifyFriends.indexOf(friendURI), 1);
						if(spotifyFriends.length==0){
							showFriends();
						}
					}
				});
			}
		} 		
	});

	$("#artists a").live('click',function(e){
		showFriend($(this).attr('href'));
		e.preventDefault();
	});

	$("#savePlaylist").live('click',function(e){
		sp.core.library.createPlaylist($("#friend h2").text(), tempPlaylist.data.all());
		e.preventDefault();
	});

	$("#rickRoll").live('click',function(e){
		sp.social.sendToInbox(
			$(this).attr("user"), 						// username
			"Just testing!", 							// message
			"spotify:track:0ac0R0wkioYDhzQDbCFokO", 	// track / album / artist / playlist
			{ onSuccess: function(response) {			// callbacks
				$("#rickRoll").text("Done!");
				console.log(response);
			} }				
		);
		e.preventDefault();
	});

});

function processFriend(friend,response) {
	spotifyFriends.splice(spotifyFriends.indexOf(friend.uri), 1);
	if(response.tracks) { 			// Some users have no Top Data
		friends.push(friend);
	}						
	if(spotifyFriends.length==0){	// All friends have been processed
		showFriends();
	}
}

function showFriends() {
	$("#friends").empty();
	$.each(friends,function(index,friend){
		if(friend) {
			if(friend.uri!="") { 
				var image = "sp://import/img/placeholders/28-user-buddy.png";
				if(friend.icon!="") { image = friend.icon; }
				$("#friends").append(
					'<a href="spotify:app:kitchensink:social:'+friend.username+'">'+
						'<div class="image" style="background-image:url('+image+')"></div>'+
						'<span>'+friend.name+'</span>'+
					'</a>'); 
			}
		}
	});
}

function getFriend(username) {
	var local = localStorage.getItem(username);
	if(local) {
		showFriend(username,JSON.parse(local));
	} else {
		var toplist = sp.social.getToplist("track","user",username,{
			onSuccess: function(response) {
				console.log(response);
				localStorage.setItem(username,JSON.stringify(response));
				showFriend(username,response);
			},
			onFailure: function(response) {
				console.log(response);
			}
		});
	}
}

function showFriend(username,response) {
	$("#friend-details").empty();
	$("#friend-tracks").empty();
	tempPlaylist = new m.Playlist();
	$.each(response.tracks,function(num,track){
		tempPlaylist.add(m.Track.fromURI(track.uri));
	});					
	var playlistArt = new v.Player();
		playlistArt.track = tempPlaylist.get(0);
		playlistArt.context = tempPlaylist;
		$("#friend-details").append(playlistArt.node);
	var friendDetails = "<div class='left'>"+
			"<h2>"+username+"'s Weekly Top Tracks</h2>"+
			"<button id='savePlaylist' class='add-playlist button icon'>Save As Playlist</button><br>"+
			"<button id='rickRoll' class='new-button' user='"+username+"'>Rick Roll "+name.split(" ")[0]+"</button> (WARNING - This will actually send a track to their inbox!)";
		"</div>";
		$("#friend-details").append(friendDetails);
		$("#friend-details").append('<div class="clear"></div>');
	var playlistList = new v.List(tempPlaylist);
		playlistList.node.classList.add("temporary");
		$("#friend-tracks").append(playlistList.node);
	sp.social.getUserByUsername(username,{
		onSuccess: function(response) {
			console.log(response);
			$("#friend-details h2").text(response.name+"'s Weekly Top Tracks");
		}
	});
}