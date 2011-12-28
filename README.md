Introduction
------------

Spotify Kitchen Sink is demo application for the Spotify Apps API. It demonstrates some of the available functionality and is designed to help developers who are getting started. Less time reinventing the wheel, more time reinventing the record player.


Functionality
-------------

* Implement Tabs
* Handle URI Arguments
* Process dropped items (track, user, etc)
* Play single items (track, artist, etc)
* Play in context (album, playlist, etc)
* Control Playback (pause, skip, etc)
* Listen for track changes
* Get tracks from the user’s library
* Share a track using the built-in popup
* Scan friends on Spotify
* Fetch a user’s top tracks
* Create and save temporary playlists
* Output list and album views
* Send tracks to inbox
* Use layouts with Spotify styles
* Search Spotify and Local tracks
* Use advanced search queries
* Fetch metadata in a variety of different methods


Background
----------

The Spotify Apps API is fairly new (as of December 2011), so there’s still a lot of guesswork going on. I was able to a few things out, thanks to the Sample Code and a healthy dose of trial-and-error. Exploring the source code of working applications seemed to be the best way to learn, so when a friend needed help, I whipped together this Kitchen Sink. I’m now putting it up on GitHub in case it helps anyone else.

If you have any questions, or would like to contribute, please get in touch. 


Resources
---------

Here’s a few resources that helped me out along the way:

Docs

* Spotify Apps Docs: http://developer.spotify.com/en/spotify-apps-api/overview/
* Building a Spotify App: http://musicmachinery.com/2011/12/02/building-a-spotify-app/
* PasteBin Examples: http://pastebin.com/u/MrSiir
* StackOverflow Question: http://stackoverflow.com/questions/8353471/spotify-apps-api-any-more-documentation
* My First Spotify Trivia Game: http://onthedll.com/2011/12/07/my-first-spotify-trivia-game/

Read / written something helpful? Let me know and I’ll include it!

Apps

* Tutorial: http://developer.spotify.com/download/spotify-apps-api/tutorial/
* Spotichat: https://github.com/sethmurphy/Spotichat
* Mood Knobs: https://github.com/alexmic/mood-knobs
* Spartify: https://github.com/blixt/spartify
* Repeat-One: https://github.com/fxb/repeat-one
* Guess The Intro: https://github.com/chielkunkels/spotify-guess-the-intro
* SpotifyEchoNestPlaylistDemo: https://gist.github.com/1438262

Building something cool with the API? Let me know and I’ll add it!


Disclaimers
-----------

This is an unofficial application, not sponsored or endorsed by Spotify. If you wish to develop for Spotify Apps, you must sign up for their Developer Program, and abide by their rules.

In the manifest, there is an undocumented parameter called “ApiPermissions”. This is was adapted from the “API” sample application. I would have left it out, but it is required for some calls, such as fetching the current user’s friends. I assume that at some point Spotify will introduce a system, where users will give you permission to access their data, similar to Facebook apps. But until then, bear in mind that some of these features might not be available to production apps (delete the permissions from the manifest to avoid this issue).

This is a work in progress. There’s plenty that I’ve left out and plenty that I don’t know. If you have any suggestions or would like to add something, I would love to hear from you. 

This is a hack. It’s also my first open source project. So go easy!


Contact
-------

pwattsmail at gmail dot com // @ptrwtts


License
-------

Distributed under the MIT license. Copyright (c) 2011 Peter Watts