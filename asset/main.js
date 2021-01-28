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

function togglemenu() {
    navigation.classList.toggle('active');
    toggle.classList.toggle('active');
    if (!navigation.classList.contains('active')) {
        content.style.marginLeft = '60px';
        content.style.width = '96%';
        navigation.innerHTML = "";
        navigation.innerHTML = sidebarEmpty;
        audioEl.setAttribute('class', "active");
    }
    else {
        content.style.marginLeft = '300px';
        content.style.width = '80%';
        navigation.innerHTML = "";
        navigation.innerHTML = sidebarFull;                
        audioEl.setAttribute('class', "hide");
    }
    media()
}

navigation.addEventListener("mouseenter", function (event) {
    content.style.marginLeft = '300px';
    content.style.width = '80%';
    navigation.innerHTML = "";
    navigation.innerHTML = sidebarFull;
    media()
})

navigation.addEventListener("mouseleave", function () {
    content.style.marginLeft = '60px';
    content.style.width = '96%';
    navigation.innerHTML = "";
    navigation.innerHTML = sidebarEmpty;
    media()
});

function media(){
    if(document.querySelector('body').style.width<400){
        content.style.margin = 0;
    }
}

//ARTIST INFO AJAX REQUEST

var query = "tool";
var infoURL = "https://www.theaudiodb.com/api/v1/json/1/search.php?s=" + query;

$.ajax({
    url:infoURL,
    method: "GET"
}).then(function(infoRes){
    console.log(infoRes);
}); 

function displayArtistResults(infoRes) {
    $(artistNameEl).val(JSON.stringify(infoRes.artists[0].strArtist));
    $(artistInfoEl).val(JSON.stringify(infoRes.artists[0].strBiographyEN));
}

displayArtistResults();