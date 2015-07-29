/*global google, $, window */
/*jslint browser:true, devel:true, this:true */

var MAPRAMBLE = {};

MAPRAMBLE.map = null;

// 使用する変数の準備
MAPRAMBLE.markers = [];

MAPRAMBLE.bounds = new google.maps.LatLngBounds();

// デバッグ情報の表示
MAPRAMBLE.debug = false;
MAPRAMBLE.console = {};
MAPRAMBLE.console.log = function (message) {
    'use strict';

    if (MAPRAMBLE.debug === true) {
        console.log(message);
    }
};

// マップを生成
MAPRAMBLE.createMap = function (initial) {
    'use strict';

    var options;

    options = {
        zoom: initial.zoom,
        center: new google.maps.LatLng(initial.lat, initial.lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.console.log(initial);
    this.console.log(options);

    // マップの生成
    return new google.maps.Map(document.getElementById("map"), options);
};

// マーカー群を追加
MAPRAMBLE.addPlaceMarkers = function () {
    'use strict';

    var that = this;

    $.getJSON("places.json", function (places) {
        places.map(function (place) {
            that.addMarker(place);
        });
        that.fitBounds(places);
    });
};

// 個々のマーカーを追加
MAPRAMBLE.addMarker = function (place) {
    'use strict';

    var marker, options, icon;

    icon = 'images/' + place.icon + '.png';
    console.log(icon);
    options = {
        position: new google.maps.LatLng(place.lat, place.lng),
        map: this.map,
        icon: icon
    };

    marker = new google.maps.Marker(options);

    google.maps.event.addListener(marker, 'click', function () {
        var content, infoWindow;

        content = '<h2>' + place.name + '</h2>';
        content = content + '<div>' + place.description + '</div>';
        infoWindow = new google.maps.InfoWindow({
            content: content
        }).open(marker.getMap(), marker);
    });

    // マーカーを配列に入れる
    this.markers.push(marker);
    this.bounds.extend(options.position);
};

// マップの高さを画面サイズに合わせる
MAPRAMBLE.resizeHeight = function () {
    'use strict';

    var windowInnerHeight, headerHeight, footerHeight, uiContentPadding;

    windowInnerHeight = $(window).innerHeight();
    headerHeight = $("#header").height();
    footerHeight = $("#footer").height();
    uiContentPadding = 90;

    $("#map").css(
        "height",
        windowInnerHeight - headerHeight - footerHeight - uiContentPadding
    );
};

// イベントハンドラの設定
MAPRAMBLE.setEventHandler = function () {
    'use strict';

    $(window).on('resize', function () {
        MAPRAMBLE.resizeHeight();
    });
};

// マップの表示範囲をマーカーに合わせる
MAPRAMBLE.fitBounds = function (places) {
    'use strict';

    if (places.length > 1) {
        this.map.fitBounds(this.bounds);
    } else if (places.length === 1) {
        this.map.setCenter(this.bounds.getCenter());
    }
};

// メイン・プログラム
$(document).ready(function () {
    'use strict';

    $.getJSON('initial.json', function (initial) {
        MAPRAMBLE.map = MAPRAMBLE.createMap({
            zoom: initial.zoom,
            lat: initial.lat,
            lng: initial.lng
        });

        MAPRAMBLE.resizeHeight();
        MAPRAMBLE.setEventHandler();
        MAPRAMBLE.addPlaceMarkers();
    });
});
