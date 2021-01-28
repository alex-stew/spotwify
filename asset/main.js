let artistNameEl = document.querySelector("#artistName");
let artistInfoEl = document.querySelector("#artistInfo");
let albumNameEl = document.querySelector("#albumTitle");
let currentAlbumEl = document.querySelector("#currentAlbum");
let navigation = document.querySelector('.navigation');
let toggle = document.querySelector('.toggle');
let content = document.querySelector('.content-wrapper');
// let sidebarFull = '<div class="sidebar-menu" style="max-width:86%;height:auto;"><ul><a href="#" class="sidebar-brand"><img id="frontLogo" src="./asset/logo.png">Spotwify</a></li><div class="sidebar-content"><span><i class="fa fa-search" aria-hidden="true"></i></span><input type="text" class="form-control" placeholder="Artist"></div><li><a href="#twitter"><i class="fa fa-twitter" aria-hidden="true"></i><span class="sidebar-link" id="navLink1">Twitter</span></a></li><br /><div class="sidebar-divider"></div><li><a href="#artistInfoSection"><span class="icon"><i class="fa fa-info-circle" aria-hidden="true"></i></span><span class="sidebar-link" id="navLink2">Artist Infomation</span></a></li><br /><div class="sidebar-divider"></div><li><a href="#albrum"><span class="icon"><i class="fa fa-circle-o" aria-hidden="true"></i></span><span class="sidebar-link" id="navLink3">Albrum</span></a></li><br/><div class="sidebar-divider"></div><li><audio controls id="music"><span><i class="fa fa-play-circle-o" aria-hidden="true"></i></span><source src="https://open.spotify.com/track/0E4Y1XIbs8GrAT1YqVy6dq" type="audio/ogg"></audio></li></ul></div>';
// let sidebarEmpty = '<div class="sidebar-menu" style="max-width:86%;height:auto;"><ul><a href="#" class="sidebar-brand"><img id="frontLogo" src="./asset/logo.png"></a></li><div class="sidebar-content"><input type="text" class="form-control"></div><li><a href="#twitter"><i class="fa fa-twitter" aria-hidden="true"></i></a></li><br /><div class="sidebar-divider"></div><li><a href="#artistInfoSection"><span class="icon"><i class="fa fa-info-circle" aria-hidden="true"></i></span></a></li><br /><div class="sidebar-divider"></div><li><a href="#albrum"><span class="icon"><i class="fa fa-circle-o" aria-hidden="true"></i></span></a></li><br /><div class="sidebar-divider"></div><li><audio controls id="music"><span><i class="fa fa-play-circle-o" aria-hidden="true"></i></span><source src="https://open.spotify.com/track/0E4Y1XIbs8GrAT1YqVy6dq" type="audio/ogg"></audio></li></ul></div>';
let audioEl = document.querySelector('audio')

// function togglemenu() {
//     navigation.classList.toggle('active');
//     toggle.classList.toggle('active');
//     if (!navigation.classList.contains('active')) {
//         content.style.marginLeft = '60px';
//         content.style.width = '96%';
//         navigation.innerHTML = "";
//         navigation.innerHTML = sidebarEmpty;
//         audioEl.setAttribute('class', "active");
//     }
//     else {
//         content.style.marginLeft = '300px';
//         content.style.width = '80%';
//         navigation.innerHTML = "";
//         navigation.innerHTML = sidebarFull;                
//         audioEl.setAttribute('class', "hide");
//     }
//     media()
// }

// navigation.addEventListener("mouseenter", function (event) {
//     content.style.marginLeft = '300px';
//     content.style.width = '80%';
//     navigation.innerHTML = "";
//     navigation.innerHTML = sidebarFull;
//     media()
// })

// navigation.addEventListener("mouseleave", function () {
//     content.style.marginLeft = '60px';
//     content.style.width = '96%';
//     navigation.innerHTML = "";
//     navigation.innerHTML = sidebarEmpty;
//     media()
// });

// function media(){
//     if(document.querySelector('body').style.width<400){
//         content.style.margin = 0;
//     }
// }

//ARTIST INFO AJAX REQUEST
var id = "";
var query = "tool";
var infoURL = "https://www.theaudiodb.com/api/v1/json/1/search.php?s=" + query;

$.ajax({
    url:infoURL,
    method: "GET"
}).then(function(infoRes){
    console.log(infoRes);
    displayArtistResults(infoRes);
}); 

function displayArtistResults(infoRes) {
    $(artistNameEl).text(JSON.stringify(infoRes.artists[0].strArtist));
    $(artistInfoEl).text(JSON.stringify(infoRes.artists[0].strBiographyEN));
    id = infoRes.artists[0].idArtist;
    console.log(id);
}


//YOUTUBE AJAX CALL
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
    //console.log("res: "+res.mvids[0].idTrack);
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
    if(songs[i].image !== null){
      image.attr("src", songs[i].image);
    }
    tdImage.append(image);
    tdName.html(songs[i].songNmae);
    tr.append(th);
    tr.append(tdImage);
    tr.append(tdName);
    tr.on("click", play);
    tr.mouseover(songInfo);
    $("#songList").append(tr);
  }
}
function play() {
  //event.preventDefault();
  var index = jQuery(this).children("th").text();
  var url = songs[index].vid;
  url = url.replace("watch?v=", "embed/");
  console.log(url);
  $("#video").attr("src", url);
}
function songInfo() {
  //alert("songinfo");
  console.log("songinfo");
  var popup = $("<div id = 'popup'style='display: none'>");
  var index = jQuery(this).children("th").text();
  console.log(songs[index].description);
  popup.text(songs[index].description);
  $('#popup').show();
  jQuery(this).append(popup);
}

//TWITTER AJAX CALL
const apiKey = "7uTzV5ptxFiignCy7aCXDljW8";
const apiSecret = "kmPE0L4pB2tnKVSBFAlQBVyfToOdj2muPZodSeIWweeRBeiUnz";
const accessToken = "1279288512232058880-LkddxWlnga0LrJFhNwJp6rDo9PWK0r";
const accessSecret = "h1ZFlJesD6ijaftS1benKNW0ADJe5vZH7N3Vr4coVw5aw";
var twitterHandle = "Tool";
$(document).ready(function() {
  $.ajax({
    url: "http://cors-anywhere.herokuapp.com/https://api.twitter.com/2/users/by/username/" + twitterHandle,
    method: "GET",
    timeout: 0,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'bearer AAAAAAAAAAAAAAAAAAAAAPSsLwEAAAAAfmGkC5w40GXnulvQILRwRWbNnH8%3DWZ6GrB5H83CPvjFLyBfTzKvdTXFgHaikXFyesyHeJ4yTkaEWpD');
    },
    success: function(response)
    {
      if(response.data != undefined) {
        $('body').html('');
        getTweets(response.data.id);
        getMentions(response.data.id);
      } else {
        console.log("Could not find user!");
      }
    }
  });
  var getTweets = function(id) {
    $.ajax({
      url: "http://cors-anywhere.herokuapp.com/https://api.twitter.com/2/users/"+id+"/tweets",
      method: "GET",
      timeout: 0,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'bearer AAAAAAAAAAAAAAAAAAAAAPSsLwEAAAAAfmGkC5w40GXnulvQILRwRWbNnH8%3DWZ6GrB5H83CPvjFLyBfTzKvdTXFgHaikXFyesyHeJ4yTkaEWpD');
      },
      success: function(response)
      {
        if(response.data != undefined) {
          console.log(response);
          $('body').append('<h1>Tweets: </h1><br />');
          var ul = $("<ul>");
          response.data.forEach(function(data) {
            ul.append("<p>"+ data.text +"</p>");
          });
          ul.appendTo($('body'));
        }
      }
    });
  }
  var getMentions = function(id) {
    $.ajax({
      url: "http://cors-anywhere.herokuapp.com/https://api.twitter.com/2/users/"+id+"/mentions",
      method: "GET",
      timeout: 0,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'bearer AAAAAAAAAAAAAAAAAAAAAPSsLwEAAAAAfmGkC5w40GXnulvQILRwRWbNnH8%3DWZ6GrB5H83CPvjFLyBfTzKvdTXFgHaikXFyesyHeJ4yTkaEWpD');
      },
      success: function(response)
      {
        if(response.data != undefined) {
          console.log(response);
          var ul = $("<ul>");
          $('body').append('<h1>Mentions: </h1><br />');
          response.data.forEach(function(data) {
            ul.append("<p>"+ data.text +"</p>");
          });
          ul.appendTo($('body'));
        }
      }
    });
  }
});