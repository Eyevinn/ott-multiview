

$(document).ready(function(){
  $("#vp10stats-view").toggle();
  $("#vp11stats-view").toggle();
  $("#vp12stats-view").toggle();
  $("#vp13stats-view").toggle();

  var arr = ["vp10", "vp11", "vp12", "vp13"];
  for (var i=0; i<arr.length; i++) {
    var id = "#" + arr[i];
    $(id).mouseenter(function () {
      console.log("in enter");
    //  console.log(id);
      //console.log($(this).attr("id")+"stats-view")
      id = "#"+$(this).attr("id")
      $(id+"stats-view").toggle();
      console.log(id);
      //console.log($(this));
      //console.log(shakaPlayers[$(this).attr("id")].getStats()["playTime"]);
      var stats = shakaPlayers[$(this).attr("id")].getStats();
      console.log(stats);

      $(id+"playTime").text(stats["playTime"]);
      $(id+"streamBandwidth").text(stats["streamBandwidth"]);
      $(id+"decodedFrames").text(stats["decodedFrames"]);
    });
    $(id).mouseleave(function(){
      console.log("in leave");
      $("#"+$(this).attr("id")+"stats-view").toggle();
    })

  }



});
