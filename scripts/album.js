var setSong = function(songNumber) {
    if(currentSoundFile){
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber, 10);
    lastPlayedSong = currentlyPlayingSongNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl,{
        formats: ['mp3'],
        preload: true
    });
    
    setVolume(currentVolume);
    
};

var setSongNumberCell = function(number) {
    return('.song-item-number[data-song-number="' + number + '"]');
};

var setVolume = function(volume){
    if(currentSoundFile){
        currentSoundFile.setVolume(volume);
    }
};

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
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        if(currentlyPlayingSongNumber !== null) { 
             //Change play to song number because user started playing new song.
            setSongNumberCell(songNumber);
        }
        
        if(currentlyPlayingSongNumber !== songNumber){
            // Click on non-playing song while another song is already playing. Play to Pause because a new song is playing.
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            currentSoundFile.play();
            updatePlayerBarSong();
        }else if(currentlyPlayingSongNumber === songNumber) {
            //Click on already playing song, displaying Pause button; Now will display play button.
            if(currentSoundFile.isPaused()){
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
            }else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
            }
        }
    };
        
    var onHover = function(event){
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'), 10);
        
        if(songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };
    var offHover = function(event){
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'),10);
        
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
    
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    //update player bar info
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    console.log(lastSongNumber);
    setSongNumberCell(currentlyPlayingSongNumber);
    setSongNumberCell(lastSongNumber);
    $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]').html(pauseButtonTemplate);
    $('.song-item-number[data-song-number="' + lastSongNumber + '"]').html(lastSongNumber);
};

var previousSong = function(){
    console.log("previousSong was played")
    var getLastSongNumber = function(index){
        console.log(index);
        return index == (currentAlbum.songs.length-1) ? 1 : index + 2;
        //Why return 1 and not 0 & why + 2 and not +1?
        //if index = last song, return first song
        
    };
   
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    console.log(currentSongIndex);
    
    if (currentSongIndex < 0){
        currentSongIndex = currentAlbum.songs.length -1;
    }
    setSong(currentSongIndex + 1);
    console.log(currentSongIndex);
    currentSoundFile.play();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    updatePlayerBarSong();

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    console.log(lastSongNumber);
    setSongNumberCell(currentlyPlayingSongNumber);
    setSongNumberCell(lastSongNumber);
    $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]').html(pauseButtonTemplate);
    $('.song-item-number[data-song-number="' + lastSongNumber + '"]').html(lastSongNumber);
    
    
};

var playerBarPlayControl = function(){
    
    var getLastSongNumber = function(index){
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var getFirstSongNumber = function(index){
        console.log(index);
        return index == (currentAlbum.songs.length-1) ? 1 : index + 2;
    };  
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
        
    switch (event.target){
        case $nextButton:
            currentSongIndex ++;
            if(currentSongIndex >= currentAlbum.songs.length ){
                currentSongIndex = 0;
            }
            break;
        case $previousButton:
            currentSongIndex --;
            if(currentSongIndex < 0){
                currentSongIndex  = currentAlbum.songs.length -1;
            }
            break;
        default:
    }
    
    setSong(currentSongIndex + 1);
    console.log(currentSongIndex);
    currentSoundFile.play();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    updatePlayerBarSong();

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    console.log(lastSongNumber);
    setSongNumberCell(currentlyPlayingSongNumber);
    setSongNumberCell(lastSongNumber);
    $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]').html(pauseButtonTemplate);
    $('.song-item-number[data-song-number="' + lastSongNumber + '"]').html(lastSongNumber);
    
 /*   if (lastPlayedSong == null){
        setSong(1);
    }else if(lastPlayedSong => 1){
        if(event.target = $nextButton){
            setSong(lastPlayedSong + 1);
        }else {
            setSong(currentAlbum.songs.length);
        }
    }else if(lastPlayedSong == currentAlbum.songs.length){
        if(event.target = $previousButton){
            setSong(1);
        }else {
            setSong(lastPlayedSong -1);
        }
    }   
    */
};

var updatePlayerBarSong = function(){
    $(".currently-playing .song-name").text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $(".currently-playing .artist-song-mobile").text(currentSongFromAlbum.title + ' - '+ currentAlbum.artist);
    $(".main-controls .play-pause").html(playerBarPauseButton) //how to change this in diff stats?
};

var togglePlayFromPlayerBar = function(){
    if(playing == false){
        //(Pause to Play) if playing = false;
        if(lastPlayedSong == null){
            setSong(1);//check if lastPlayedSong = null; 
                //setSong to zero
        }else {
            setSong(lastPlayedSong);
            // else, 
                //setSong to last played song
        }
        currentSoundFile.play();
        playing = true;
        $(this).html(playerBarPlayButton);
        $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]').html(playButtonTemplate);
            
            //play currentSoundFile.play();
            //playing = true;
            //change template states
    }else {
        //If playing is true;
        currentSoundFile.pause();
            //currentSoundFile.pause();
        playing = false;
            //playing = false;
        $(this).html(playerBarPauseButton);
        $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]').html(pauseButtonTemplate);
            
            //change templates back
    }
          
        
};


//play & pause button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';


var currentAlbum = null; //updated when there is a song playing
var currentlyPlayingSongNumber = null;
var lastPlayedSong = null;
var playing = false;
var currentSongFromAlbum = null; 
var currentSoundFile = null;
var currentVolume = 80;


var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseControl = $('.main-controls .play-pause');


$( document ).ready(function(){
    setCurrentAlbum(albumPiscasso);
    $previousButton.click(playerBarPlayControl);
    $nextButton.click(playerBarPlayControl);
    $playPauseControl.click(togglePlayFromPlayerBar);
});

