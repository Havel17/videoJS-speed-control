// ==UserScript==
// @name         videoJS speed control
// @namespace    http://tampermonkey.net/
// @version      1.18
// @description  SPEED ETO SMESHNO
// @author       Havel
// @match        https://*.tiktok.com/*
// @match        https://*jut.su/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        none
// ==/UserScript==


var addSpeedInput = function(parents) {
    parents.forEach(p => {
        var html = `<button class="speed_up_input" type="text" />`;
        p.insertAdjacentHTML('afterbegin', html);
        var btn = p.getElementsByClassName("speed_up_input")[0];
        btn.innerHTML = 1;
        btn.addEventListener("mousedown", (e) => {
            document.oncontextmenu = test;
            function test() {return false}
            var btn = document.getElementsByClassName("speed_up_input")[0];
            var rate = document.querySelector('video').playbackRate;
            var save_index = 0
            for (var i =0;i<selected_speed.length;i++){
                if(event.button == 0){
                    if ( selected_speed[i] > rate ){
                        save_index = i
                        break;
                    }else if(selected_speed[i] == rate && selected_speed.length == i+1 ){
                        save_index = 0
                        break;
                    }
                }
                else if(event.button == 2){
                    var j = selected_speed.length -1 -i;
                    if ( selected_speed[j] < rate ){
                        save_index = j
                        break;
                    }else if(selected_speed[j] == rate && selected_speed.length == i+1 ){
                        save_index = selected_speed.length-1
                        break;
                    }
                }
            }
            rate = selected_speed[save_index]
            document.querySelector('video').playbackRate = rate
            btn.innerHTML = rate

        });

    })
}

var checkButtons = function() {


    var parents = [];
    var uniqueParents = [];

    var addParentToList = function(item) {

        parents.push(item)

    }

    Array.from(document.getElementsByTagName("body")).forEach(item => addParentToList(item));

    uniqueParents = [...new Set(parents)];
    return uniqueParents;
}



var addCSStoDOM = function(styles) {
    var styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.insertBefore(styleSheet,document.head.firstChild)
}

var addSpeedToParent = function() {

    var buttonsParents = checkButtons();

    if(buttonsParents.length != 0) {
        if(document.getElementsByClassName("speed_up_input").length == 0) {
            var styles = `.speed_up_input {
               width: 38px;
    height: 38px;
    margin: 2px;
    align-self: center;
    border-radius: 25px;
    -moz-border-radius: 25px;
    -webkit-border-radius: 25px;
    text-align: center;
    font-weight: bolder;
    position: fixed;
    right: 1%;
    top:90%;
    background: rgba(84, 84, 84, 0.5);
    color: #fff;
    z-index: 999999;
              }
              `;
            addCSStoDOM(styles);
        }

        addSpeedInput(buttonsParents);
    }
}

var checkAudioSpeed = function () {
    var p = document.querySelector('video')
    if (p && p.playbackRate != 1) {
        p.playbackRate = 1;
    }

    if (p.getAttribute("mediatype")==null) {
        p.ontimeupdate = () => {
            //if (!window.is_skip) return;
            if (p.currentTime > window.video_intro_start && p.currentTime < window.video_intro_end && p.currentTime > 5) p.currentTime = window.video_intro_end;
            //if (p.currentTime > window.video_outro_start && p.currentTime > 5) end_episode();
        }
    }
    addSpeedToParent();

}
var style = `
.header{
    display:none
}
.sidebar{
    display:none
}
.notice_top2{
    display:none
}
.info_panel{
    display:none
}
.social_links{
    display:none !important
}
.top_player_line{
    width:100% !important
}
.content{
    width:100% !important
}
.border_around_video{
    max-width:100% !important
}
`
addCSStoDOM(style);
var selected_speed = [0.25,0.5,1,1.25,1.4,1.5,1.75,2,3];
checkAudioSpeed();
