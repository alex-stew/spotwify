let artistNameEl = $("#artistName");
let artistInfoEl = document.querySelector("#artistInfo");
let albumNameEl = document.querySelector("#albumTitle");
let currentAlbumEl = document.querySelector("#currentAlbum");
let navigation = document.querySelector('.navigation');
let toggle = document.querySelector('.toggle');
let content = document.querySelector('.content-wrapper');
let sidebarFull = '<div class="sidebar-menu" style="max-width:86%;height:auto;"><a href="#" class="sidebar-brand"><img id="frontLogo" src="./asset/logo.png">SPOTWIFY</a><div class="sidebar-content"><span><i class="fa fa-search" aria-hidden="true"></i><form method="post" action="index.html" id="spotForm"><input id="spotSearch" type="text" class="form-control" style="z-index: 10;" placeholder="Search..." name="q" value=""/></form></div></span><a href="#twitter"><i class="fa fa-twitter" aria-hidden="true"></i><span class="sidebar-link" id="navLink1">TWITTER</span></a><br /><div class="sidebar-divider"></div><a href="#artistInfoSection"><span class="icon"><i class="fa fa-info-circle" aria-hidden="true"></i></span><span class="sidebar-link" id="navLink2">ARTIST INFO</span></a><br /><div class="sidebar-divider"></div><a href="#album"><span class="icon"><i class="fa fa-circle-o" aria-hidden="true"></i></span><span class="sidebar-link" id="navLink3">ALBUM</span></a><br/><div class="sidebar-divider"></div></div>';
let sidebarEmpty = '<div class="sidebar-menu" style="max-width:86%;height:auto;"><a href="#" class="sidebar-brand"><img id="frontLogo" src="./asset/logo.png"></a><br /><div class="sidebar-divider"></div></div>';
let audioEl = document.querySelector('audio');

let navigationActive = false;
var videoEle = document.getElementById("video");
var songs = [];

function togglemenu() {
  navigationActive = !navigationActive;

  if (!navigationActive) {
    if(window.outerWidth > 400)
      content.style.marginLeft = '60px';
    else
      content.style.marginLeft = '0px';

    content.style.width = '96%';
    navigation.innerHTML = "";
    navigation.innerHTML = sidebarEmpty;

    if (navigation.classList.contains("active"))
      navigation.classList.remove("active");
  }
  else {
    if(window.outerWidth > 400)
      content.style.marginLeft = '300px';
    else
      content.style.marginLeft = '0px';

    content.style.width = '80%';
    navigation.innerHTML = "";
    navigation.innerHTML = sidebarFull;

    if (!navigation.classList.contains("active"))
      navigation.classList.add("active");
  }
}

$("#spotForm").submit(function(event){
  event.preventDefault();
})

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
  }
};

$(document).ready(function () {
  var search = getUrlParameter('q');

  if(search == null || search == undefined) search = 'Tool';

  
  if(window.outerWidth > 400)
    content.style.marginLeft = '60px';
  else
    content.style.marginLeft = '0px';

  content.style.width = '96%';
  navigation.innerHTML = "";
  navigation.innerHTML = sidebarEmpty;

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
      if(res.mvids != null)
      {
        for (var i = 0; i < res.mvids.length; i++) {
          var song = new Song(
            res.mvids[i].strMusicVid,
            res.mvids[i].strTrackThumb,
            res.mvids[i].strTrack,
            res.mvids[i].strDescriptionEN
          );
          songs.push(song);
        }
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
      tr.on("click", songInfo);
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
    url = url.replace("http://", "https://");
    if (temp.length === 0) {
      video.attr("src", url);
      $("#youtube").append(video);
    } else {
      temp.attr("src", url);
    }
  }
  function songInfo() {
    //alert("songinfo");
    var popup = $("#popup");
    var index = jQuery(this).children("th").text();
    var str = songs[index].description
    var wordCount = str.match(/(\w+)/g).length;

    if (songs[index].description === "") {
      popup.text("NUll");
    }
    else if (wordCount > 20) {
      var dotSpan = document.createElement('span');
      dotSpan.innerHTML = '...';
      var moreBtn = document.createElement('button');
      moreBtn.innerHTML = 'Read more';
      dotSpan.setAttribute("id", "dots");
      moreBtn.setAttribute("id", "moreBtn");
      moreBtn.setAttribute("class", "btn btn-link");

      var limit = str.slice(0, 150);
      popup.empty();
      popup.append(limit, dotSpan, moreBtn);
      moreBtn.onclick = function () {
        var lessBtn = document.createElement('button');
        lessBtn.innerHTML = 'Show less';
        lessBtn.setAttribute("class", "btn btn-link");
        popup.empty();
        popup.append(str,lessBtn);
        lessBtn.onclick = function () {
          popup.empty();
          popup.append(limit, dotSpan, moreBtn);
        }
        return;
      }
    }


    $("#description").show();
  }

  if (navigation.classList.contains("active"))
    navigation.classList.remove("active");

  navigation.addEventListener("mouseenter", function (event) {
    event.stopPropagation();

    if (!navigation.classList.contains("active")) {
      navigationActive = true;

    if(window.outerWidth > 400)
      content.style.marginLeft = '300px';
    else
      content.style.marginLeft = '0px';

      content.style.width = '80%';
      navigation.innerHTML = sidebarFull;
    }
  });

  navigation.addEventListener("mouseleave", function (event) {
    event.stopPropagation();

    if (!navigation.classList.contains("active")) {
      navigationActive = false;

      
    if(window.outerWidth > 400)
      content.style.marginLeft = '60px';
    else
      content.style.marginLeft = '0px';

      content.style.width = '96%';
      navigation.innerHTML = sidebarEmpty;
    }
  });

  //ARTIST INFO AJAX REQUEST
  var infoURL = "https://www.theaudiodb.com/api/v1/json/1/search.php?s=" + search;

  $.ajax({
    url: infoURL,
    method: "GET"
  }).then(function (infoRes) {
    displayArtistResults(infoRes);
  });

  function displayArtistResults(infoRes) {
    artistNameEl.text(infoRes.artists[0].strArtist);
    $(artistInfoEl).text(infoRes.artists[0].strBiographyEN);
    id = infoRes.artists[0].idArtist;
    getSongs(id);
  }



  //TWITTER AJAX CALL
  const bearerToken = 'AAAAAAAAAAAAAAAAAAAAAPSsLwEAAAAAfmGkC5w40GXnulvQILRwRWbNnH8%3DWZ6GrB5H83CPvjFLyBfTzKvdTXFgHaikXFyesyHeJ4yTkaEWpD';
  $.ajax({
    url: "https://cors-anywhere.herokuapp.com/https://api.twitter.com/2/users/by/username/" + search,
    method: "GET",
    timeout: 0,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'bearer ' + bearerToken);
    },
    success: function (response) {
      if (response.data != undefined) {
        $('#twitter').html('');
        getTweets(response.data.id);
        getMentions(response.data.id);
      } else {
        console.log("Could not find user!");
      }
    }
  });

  var getTweets = function (id) {
    $.ajax({
      url: "https://cors-anywhere.herokuapp.com/https://api.twitter.com/2/users/" + id + "/tweets",
      method: "GET",
      timeout: 0,
      data: "expansions=author_id",
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'bearer ' + bearerToken);
      },
      success: function (response) {
        if (response.data != undefined) {
          $('#twitter').append('<h3>TWEETS: </h3><br />');
          var ul = $("<ul>");

          var index = 0;

          response.data.forEach(function (data) {
            if (++index < 5) {
              $.ajax({
                url: "https://cors-anywhere.herokuapp.com/https://api.twitter.com/2/users/" + data.author_id,
                method: "GET",
                timeout: 0,

                beforeSend: function (xhr) {
                  xhr.setRequestHeader('Authorization', 'bearer ' + bearerToken);
                },
                success: function (response) {
                  ul.append("<p style='padding: 20px; border-radius: 5px; background-color: aliceblue; margin-bottom: 5px;'>" + data.text + "</p><h4 style='margin-bottom: 25px;'>" + response.data.username + "</h4>");
                }
              });
            }
          });
          ul.appendTo($('#twitter'));
        }
      }
    });
  }

  var getMentions = function (id) {
    $.ajax({
      url: "https://cors-anywhere.herokuapp.com/https://api.twitter.com/2/users/" + id + "/mentions",
      method: "GET",
      timeout: 0,
      data: 'expansions=author_id',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'bearer ' + bearerToken);
      },
      success: function (response) {
        if (response.data != undefined) {
          var ul = $("<ul>");
          $('#twitter').append('<h3>MENTIONS: </h3><br />');

          var index = 0;

          response.data.forEach(function (data) {
            if (++index < 5)
              $.ajax({
                url: "https://cors-anywhere.herokuapp.com/https://api.twitter.com/2/users/" + data.author_id,
                method: "GET",
                timeout: 0,

                beforeSend: function (xhr) {
                  xhr.setRequestHeader('Authorization', 'bearer ' + bearerToken);
                },
                success: function (response) {
                  ul.append("<p style='padding: 20px; border-radius: 5px; background-color: aliceblue; margin-bottom: 5px;'>" + data.text + "</p><h4 style='margin-bottom: 25px;'>" + response.data.username + "</h4>");
                }
              });
          });
          ul.appendTo($('#twitter'));
        }
      }
    });
  }
});