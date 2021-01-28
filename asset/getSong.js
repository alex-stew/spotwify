var videoEle = document.getElementById("video");
var songs = [];
class Song {
  constructor(vid, image, songNmae, description) {
    this.vid = vid;
    this.image = image;
    this.songNmae = songNmae;
    this.description = description;
  }
}
function getSongs(id) {
  var songUrl = "https://theaudiodb.com/api/v1/json/1/mvid.php?i=" + id;
  $.ajax({
    url: songUrl,
    method: "GET",
  }).then(function (res) {
    console.log("res: " + res.mvids[0].idTrack);
    for (var i = 0; i < res.mvids.length; i++) {
      var song = new Song(
        res.mvids[i].strMusicVid,
        res.mvids[i].strTrackThumb,
        res.mvids[i].strTrack,
        res.mvids[i].strDescriptionEN
      );
      songs.push(song);
    }
    addToList();
  });
}
function addToList() {
  for (var i = 0; i < songs.length; i++) {
    var tr = $("<tr>");
    var th = $("<th>");
    var tdImage = $("<td>");
    var tdName = $("<td>");
    var image = $("<img style='width:40px; height:40px;'> ");
    th.html(i);
    if (songs[i].image !== null) {
      image.attr("src", songs[i].image);
    }
    tdImage.append(image);
    tdName.html(songs[i].songNmae);
    tr.append(th);
    tr.append(tdImage);
    tr.append(tdName);
    tr.on("click", play);
    tr.on("click",songInfo);
    $("#songList").append(tr);
  }
}
function play() {
  //event.preventDefault();
  var temp = $("#video");
  var video = $("<iframe id='video' width='500' height='300' src=''></iframe>");
  var index = jQuery(this).children("th").text();
  var url = songs[index].vid;
  url = url.replace("watch?v=", "embed/");
  console.log(temp);
  if (temp.length === 0) {
    video.attr("src", url);
    $("#youtube").append(video);
  } else {
    temp.attr("src", url);
  }
}
function songInfo() {
  //alert("songinfo");
  console.log("songinfo");
  var popup = $("#popup");
  var index = jQuery(this).children("th").text();
  console.log(songs[index].description);
  if(songs[index].description === ""){
    popup.text("NUll");
  }else{
    popup.text(songs[index].description);
  }
  
  $("#description").show();
  
}

getSongs("111247");
