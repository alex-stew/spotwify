let artistNameEl = $("#artistName");
let artistInfoEl = document.querySelector("#artistInfo");
let albumNameEl = document.querySelector("#albumTitle");
let currentAlbumEl = document.querySelector("#currentAlbum");
let navigation = document.querySelector('.navigation');
let toggle = document.querySelector('.toggle');
let content = document.querySelector('.content-wrapper');
let sidebarFull = '<div class="sidebar-menu" style="max-width:86%;height:auto;"><a href="#" class="sidebar-brand"><img id="frontLogo" src="./asset/logo.png">Spotwify</a><div class="sidebar-content"><span><i class="fa fa-search" aria-hidden="true"></i></span><input type="text" class="form-control" style="z-index: 10;" placeholder="Artist" /></div><a href="#twitter"><i class="fa fa-twitter" aria-hidden="true"></i><span class="sidebar-link" id="navLink1">Twitter</span></a><br /><div class="sidebar-divider"></div><a href="#artistInfoSection"><span class="icon"><i class="fa fa-info-circle" aria-hidden="true"></i></span><span class="sidebar-link" id="navLink2">Artist Information</span></a><br /><div class="sidebar-divider"></div><a href="#album"><span class="icon"><i class="fa fa-circle-o" aria-hidden="true"></i></span><span class="sidebar-link" id="navLink3">Album</span></a><br/><div class="sidebar-divider"></div></div>';
let sidebarEmpty = '<div class="sidebar-menu" style="max-width:86%;height:auto;"><a href="#" class="sidebar-brand"><img id="frontLogo" src="./asset/logo.png"></a><br /><div class="sidebar-divider"></div></div>';
let audioEl = document.querySelector('audio');

let navigationActive = false;

function togglemenu() {
  navigationActive = !navigationActive;

  if (!navigationActive) {
    content.style.marginLeft = '60px';
    content.style.width = '96%';
    navigation.innerHTML = "";
    navigation.innerHTML = sidebarEmpty;

    if(navigation.classList.contains("active"))
      navigation.classList.remove("active");  
  }
  else {
    content.style.marginLeft = '300px';
    content.style.width = '80%';
    navigation.innerHTML = "";
    navigation.innerHTML = sidebarFull;   

    if(!navigation.classList.contains("active"))
      navigation.classList.add("active");
  }
}

$(document).ready(function() {
  content.style.marginLeft = '60px';
  content.style.width = '96%';
  navigation.innerHTML = "";
  navigation.innerHTML = sidebarEmpty;
  
  if(navigation.classList.contains("active"))
    navigation.classList.remove("active");  

  navigation.addEventListener("mouseenter", function (event) {
    event.stopPropagation();

    if(!navigation.classList.contains("active")) {
      navigationActive = true;
      content.style.marginLeft = '300px';

      content.style.width = '80%';
      navigation.innerHTML = sidebarFull;  
    }
  });

  navigation.addEventListener("mouseleave", function (event) {
    event.stopPropagation();

    if(!navigation.classList.contains("active")) {
      navigationActive = false;
      content.style.marginLeft = '60px';

      content.style.width = '96%';
      navigation.innerHTML = sidebarEmpty;
    }
  });

  //ARTIST INFO AJAX REQUEST
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
      artistNameEl.text(JSON.stringify(infoRes.artists[0].strArtist));
      artistNameEl.val().toUpperCase();
      $(artistInfoEl).text(JSON.stringify(infoRes.artists[0].strBiographyEN));
      id = infoRes.artists[0].idArtist;
      console.log(id);
      getSongs(id);
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
  const bearerToken = 'AAAAAAAAAAAAAAAAAAAAAPSsLwEAAAAAfmGkC5w40GXnulvQILRwRWbNnH8%3DWZ6GrB5H83CPvjFLyBfTzKvdTXFgHaikXFyesyHeJ4yTkaEWpD';
  var twitterHandle = "Tool";
    $.ajax({
      url: "http://cors-anywhere.herokuapp.com/https://api.twitter.com/2/users/by/username/" + twitterHandle,
      method: "GET",
      timeout: 0,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'bearer ' + bearerToken);
      },
      success: function(response)
      {
        if(response.data != undefined) {
          $('#twitter').html('');
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
        data: "expansions=author_id",
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'bearer ' + bearerToken);
        },
        success: function(response)
        {
          if(response.data != undefined) {
            $('#twitter').append('<h1>Tweets: </h1><br />');
            var ul = $("<ul>");

            var index = 0;

            response.data.forEach(function(data) {
              if(++index < 5) {
                $.ajax({
                  url: "http://cors-anywhere.herokuapp.com/https://api.twitter.com/2/users/"+data.author_id,
                  method: "GET",
                  timeout: 0,
          
                  beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'bearer ' + bearerToken);
                  },
                  success: function(response)
                  {
                    ul.append("<p style='padding: 20px; border-radius: 5px; background-color: aliceblue; margin-bottom: 5px;'>"+ data.text +"</p><p style='margin-bottom: 25px;'>"+ response.data.username+"</p>");
                  }
                });
              }
            });
          ul.appendTo($('#twitter'));
          }
        }
      });
    }

    var getMentions = function(id) {
      $.ajax({
        url: "http://cors-anywhere.herokuapp.com/https://api.twitter.com/2/users/"+id+"/mentions",
        method: "GET",
        timeout: 0,
        data: 'expansions=author_id',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'bearer ' + bearerToken);
        },
        success: function(response)
        {
          if(response.data != undefined) {
            var ul = $("<ul>");
            $('#twitter').append('<h1>Mentions: </h1><br />');

            var index = 0;

            response.data.forEach(function(data) {
              if(++index < 5)
                $.ajax({
                  url: "http://cors-anywhere.herokuapp.com/https://api.twitter.com/2/users/"+data.author_id,
                  method: "GET",
                  timeout: 0,
          
                  beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'bearer ' + bearerToken);
                  },
                  success: function(response)
                  {
                    ul.append("<p style='padding: 20px; border-radius: 5px; background-color: aliceblue; margin-bottom: 5px;'>"+ data.text +"</p><p style='margin-bottom: 25px;'>"+ response.data.username+"</p>");
                  }
                });            
            });
            ul.appendTo($('#twitter'));
          }
        }
      });
    }
  });