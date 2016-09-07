var setSong = function(songNumber) {
    if(currentSoundFile){
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber, 10);
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

var setCurrentTimeInPlayerBar = function(currentTime){
    $('.current-time').text(filterTimeCode(currentTime));
};

var setTotalTimeInPlayerBar = function(totalTime){
    $('.total-time').text(filterTimeCode(totalTime));
};

var filterTimeCode = function(timeInSeconds){
    var mins = Math.floor(parseFloat(timeInSeconds/ 60));
    var secs = Math.floor((parseFloat(timeInSeconds /60) - mins) * 60);
    return mins +":"+secs;
}
var seek = function(time) {
    if(currentSoundFile) {
        currentSoundFile.setTime(time);
    }
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
        +'  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
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
            setSong(songNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            currentSongFromAlbum = currentAlbum.songs[songNumber-1];
            
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});
            
            $(this).html(pauseButtonTemplate);
            updatePlayerBarSong();
        }else if(currentlyPlayingSongNumber === songNumber) {
            //Click on already playing song, displaying Pause button; Now will display play button.
            if(currentSoundFile.isPaused()){
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
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

var updateSeekBarWhileSongPlays = function(){
    if(currentSoundFile){
        currentSoundFile.bind('timeupdate', function(event){
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            setCurrentTimeInPlayerBar(this.getTime());
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio){
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');
    
    $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;
        
        if($(this).parent().attr('class') == 'seek-control'){
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        }else {
            setVolume(seekBarFillRatio *100);
        }
        
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    
    $seekBars.find('.thumb').mousedown(function(event) {
        var $seekBar = $(this).parent();
        
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX /barWidth;
            
            if($seekBar.parent().attr('class') == 'seek-control'){
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            }else {
                setVolume(seekBarFillRatio);
            }
             
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
     
        $(document).bind('mouseup.thumb', function(){
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
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
    updateSeekBarWhileSongPlays();
    //update player bar info
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    setSongNumberCell(currentlyPlayingSongNumber);
    setSongNumberCell(lastSongNumber);
};

var previousSong = function(){
    var getLastSongNumber = function(index){
        return index == (currentAlbum.songs.length -1) ? 1 : index + 2;
        //Why return 1 and not 0 & why + 2 and not +1?
        //if index = last song, return first song
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    
    if (currentSongIndex < 0){
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    setSongNumberCell(currentlyPlayingSongNumber);
    setSongNumberCell(lastSongNumber);
    
};

var updatePlayerBarSong = function(){
    $(".currently-playing .song-name").text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $(".currently-playing .artist-song-mobile").text(currentSongFromAlbum.title + ' - '+ currentAlbum.artist);
    $(".main-controls .play-pause").html(playerBarPauseButton)
    setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
};

//play & pause button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';


var currentAlbum = null; //updated when there is a song playing
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null; 
var currentSoundFile = null;
var currentVolume = 80;


var $previousButton = $('main-controls .previous');
var $nextButton = $('.main-controls .next');



$( document ).ready(function(){
    setCurrentAlbum(albumPiscasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});

