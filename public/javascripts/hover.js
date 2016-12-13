/* When hovering over vp we want to display an overlay box with 
statistics information about that specific video */
window.onload = function() {
    // Hide at startup so not displaying a uninitialized div
    $('.videoInfo').hide();

    var updateVideoStatsTimer;
    var statsDiv;
    var stats;
    var videoId;
    var displayStats = false;

    /* hover over vp */ 
    $('.vp').hover(function(){
        /* get video id */
	videoId = $(this).find('video').attr('id');

	/* find div where stats will be displayed */
	statsDiv = $(this).find('.videoInfo');
	statsDiv.show();
	displayStats = true;

	/* updatde stats */
	updateVideoStatsTimer = setInterval(function(){ onTimer() }, 1000);
		
    }, function() {
        displayStats = false;
	statsDiv = $(this).find('.videoInfo');
	statsDiv.hide();
    });

    // Get video stats and add them to html div
    function onTimer(){
        if (displayStats == true)
        {	//Statistics for HLS video not yet available
            if (shakaPlayers[videoId] === undefined) {
                statsDiv.html('<p>No data available</p>');
            } else {

	        stats = shakaPlayers[videoId].getStats();
	        statsDiv.html(  '<table><tr><th>Video id: </th><th>' + videoId + '</th></tr>'+
			    '<tr><th>Decoded frames: </th><th>' + stats.decodedFrames + '</th></tr>'+
			    '<tr><th>Dropped frames: </th><th>' + stats.droppedFrames + '</th></tr>'+
			    '<tr><th>Buffering time: </th><th>' + stats.bufferingTime.toFixed(2) + ' s</th></tr>'+
			    '<tr><th>Playtime: </th><th>' + (stats.playTime.toFixed(1)) + ' s</th></tr>'+	
			    '<tr><th>Stream bandwidth: </th><th>' + (stats.streamBandwidth)/1000 + ' kbps</th></tr>'+
			    '<tr><th>Estimated bandwidth: </th><th>' + stats.estimatedBandWidth + ' kbps</th></tr>'+
			    //'<tr><th>Switch history: </th><th>' + stats.switchHistory + '</th></tr>'+
			    '<tr><th>Width: </th><th>' + stats.width + ' pxls</th></tr>'+
			    '<tr><th>Height: </th><th>' + stats.height + ' pxls</th></tr></table>');
	    }
        }
	else {
	    clearInterval(updateVideoStatsTimer);
	}
    }
    // add audio meter overlay to video divs 
    //$('#audioMeter').html('Audio meter!');
};
