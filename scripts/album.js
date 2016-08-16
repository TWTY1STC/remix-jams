var createSongRow = function(songNumber, songName, songLength) {
    var template = 
         '<tr class="album-view-song-item">'
        +'  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        +'  <td class="song-item-title">' + songName + '</td>'
        +'  <td class="song-item-duration">' + songLength + '</td>'
        +'</tr>'
        ;
        
    var $row = $(template);
        
    var clickHandler = function(){
        var songNumber = $(this).attr('data-song-number');
        
        if(currentlyPlayingSongNumber !== null) { 
             //Change play to song number because user started playing new song.
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        
        if(currentlyPlayingSongNumber !== songNumber){
            // Click on non-playing song while another song is already playing. Play to Pause because a new song is playing.
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSongNumber = songNumber;
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            updatePlayerBarSong();
        }else if(currentlyPlayingSongNumber === songNumber) {
            //Click on already playing song, displaying Pause button; Now will display play button.
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton)
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
        }
    };
        
    var onHover = function(event){
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');
        
        if(songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };
    var offHover = function(event){
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');
        
        if(songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
    };
    
    $row.find('.song-item-number').click(clickHandler); //makes $(this) available for clickHandler
    $row.hover(onHover, offHover); //This allows use to use $(this) in the onHover & offHover functions
    return $row;
};

var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year +' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    $albumSongList.empty();
    
    for (var i = 0; i < album.songs.length; i++){
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var nextSong = function(){
    var getLastSongNumber = function(index){
        return index == 0 ? currentAlbum.songs.length : index;
        // if index is = 0, return the last song, else return index
    };
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex ++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    //set a new current song
    
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    //update player bar info
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
    $(".main-controls .play-pause").html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    //$lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function(){
    var getLastSongNumber = function(index){
        return index == (currentAlbum.songs.length -1) ? 1 : index + 2;
        //if index = last song, return first song
    }
    
    
};

var updatePlayerBarSong = function(){
    $(".currently-playing .song-name").text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $(".currently-playing .artist-song-mobile").text(currentSongFromAlbum.title + ' - '+ currentAlbum.artist)
    $(".main-controls .play-pause").html(playerBarPauseButton)
};

//play & pause button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';


var currentAlbum = null; //updated when there is a song playing
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null; 

$( document ).ready(function(){
    setCurrentAlbum(albumPiscasso);
    
});

