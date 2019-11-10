var basemap = new L.TileLayer(baseUrl, {maxZoom: 17, attribution: baseAttribution, subdomains: subdomains, opacity: opacity});

var center = new L.LatLng(0, 0);

var map = new L.Map('map', {center: center, zoom: 2, maxZoom: maxZoom, layers: [basemap]});

var popupOpts = {
    autoPanPadding: new L.Point(5, 50),
    autoPan: true
};

var points = L.geoCsv (null, {
    firstLineTitles: true,
    fieldSeparator: fieldSeparator,
    onEachFeature: function (feature, layer) {
        var popup = '<div class="popup-content"><table class="table table-striped table-bordered table-condensed">';
        for (var clave in feature.properties) {
            var title = points.getPropertyTitle(clave).strip();
            var attr = feature.properties[clave];
            if (title == labelColumn) {
                layer.bindLabel(feature.properties[clave], {className: 'map-label'});
            }
            if (attr.indexOf('http') === 0) {
                attr = '<a target="_blank" href="' + attr + '">'+ attr + '</a>';
            }
            if (attr) {
                popup += '<tr><th>'+title+'</th><td>'+ attr +'</td></tr>';
            }
        }
        popup += "</table></popup-content>";
        layer.bindPopup(popup, popupOpts);
    },
    filter: function(feature, layer) {
        total += 1;
        if (!filterString) {
            hits += 1;
            return true;
        }
        var hit = false;
        var lowerFilterString = filterString.toLowerCase().strip();
        $.each(feature.properties, function(k, v) {
            var value = v.toLowerCase();
            if (value.indexOf(lowerFilterString) !== -1) {
                hit = true;
                hits += 1;
                return false;
            }
        });
        return hit;
    }
});

var hits = 0;
var total = 0;
var filterString;
var markers = new L.MarkerClusterGroup();
var dataCsv;

var addCsvMarkers = function() {
    hits = 0;
    total = 0;
    filterString = document.getElementById('filter-string').value;

    if (filterString) {
        $("#clear").fadeIn();
    } else {
        $("#clear").fadeOut();
    }

    map.removeLayer(markers);
    points.clearLayers();

    markers = new L.MarkerClusterGroup(clusterOptions);
    points.addData(dataCsv);
    markers.addLayer(points);

    map.addLayer(markers);    /*Add the markets to the map. Remove  */
    try {
        var bounds = markers.getBounds();
        if (bounds) {
            map.fitBounds(bounds);
        }
    } catch(err) {
        // pass
    }
    if (total > 0) {
        $('#search-results').html("Showing " + hits + " of " + total);
    }
    return false;
};

var typeAheadSource = [];

function ArrayToSet(a) {
    var temp = {};
    for (var i = 0; i < a.length; i++)
        temp[a[i]] = true;
    var r = [];
    for (var k in temp)
        r.push(k);
    return r;
}

function populateTypeAhead(csv, delimiter) {
    var lines = csv.split("\n");
    for (var i = lines.length - 1; i >= 1; i--) {
        var items = lines[i].split(delimiter);
        for (var j = items.length - 1; j >= 0; j--) {
            var item = items[j].strip();
            item = item.replace(/"/g,'');
            if (item.indexOf("http") !== 0 && isNaN(parseFloat(item))) {
                typeAheadSource.push(item);
                var words = item.split(/\W+/);
                for (var k = words.length - 1; k >= 0; k--) {
                    typeAheadSource.push(words[k]);
                }
            }
        }
    }
}

if(typeof(String.prototype.strip) === "undefined") {
    String.prototype.strip = function() {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

map.addLayer(markers);



$(document).ready( function() {
    $.ajax ({
        type:'GET',
        dataType:'text',
        url: dataUrl,
        contentType: "text/csv; charset=utf-8",
        error: function() {
            alert('Error retrieving csv file');
        },
        success: function(csv) {
            dataCsv = csv;
            populateTypeAhead(csv, fieldSeparator);
            typeAheadSource = ArrayToSet(typeAheadSource);
            $('#filter-string').typeahead({source: typeAheadSource});
            addCsvMarkers();
        }
    });

    $("#clear").click(function(evt){
        evt.preventDefault();
        $("#filter-string").val("").focus();
        addCsvMarkers();
    });

});

/*New code */


function AddDescPoint(e) {
  country =    document.getElementById("country").value ;
  city =    document.getElementById("city").value ;
  image=      document.getElementById("marker_url").value ;

  addMarker(e , country ,city, image);
}

function onMapClick(e) {
  var  customPopup =     '<form action="#"> Country:<br> <input type="text" id="country" name="country" value="Type the name country"><br>City:<br> <input type="text" id="city" name="city" value="Type the name city"><br>Image Url:<br> <input type="text" id="marker_url" name="marker_url" value="Type the image url"><input id="btn-add-desc" type="button" value="Submit"></form>';
var customOptions =
        {
        'maxWidth': '500',
        'className' : 'custom'
        }
    
   // var popup = L.popup();
   //click : e.latlng
   if(e.latlng==undefined)
        e.latlng = e;
var cur_marker=   L.marker(e.latlng).addTo(map);

      cur_marker.bindPopup(customPopup , customOptions)
    .openPopup();
    document.getElementById("btn-add-desc").onclick = function() {AddDescPoint(e)};
    $(".leaflet-popup-close-button").click(function(){
     map.removeLayer(cur_marker);

});


/*popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);*/
}

map.on('click', onMapClick);
$("#mylocation").click(function(){
   if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
        alert ("Geolocation is not supported by this browser.");
  }

});


function showPosition(position) {
    console.log(position.coords);
 var latlng = L.latLng(position.coords.latitude ,  position.coords.longitude);
  onMapClick(latlng);
}

function addMarker (e , country, city , image) {

      if(e.latlng==undefined)
        e.latlng = e;
 console.log(  e.latlng  );
 map.closePopup();
//map.removeLayer(markers);
  //  points.clearLayers();

  //  markers = new L.MarkerClusterGroup(clusterOptions);

   datacvs_new = "Country|Name|lat|lng\n"+country+"|"+city+"|"+e.latlng.lat+"|"+e.latlng.lng;
    points.addData(datacvs_new);
    markers.addLayer(points);

    var imageUrl = image;
   imageBounds = [ e.latlng,  e.latlng ];
 
L.imageOverlay(imageUrl, imageBounds).addTo(map);
L.imageOverlay(imageUrl, imageBounds).bringToFront();

    map.addLayer(markers);    /*Add the markets to the map. Remove  */
    try {
        var bounds = markers.getBounds();
        if (bounds) {
            map.fitBounds(bounds);
        }
    } catch(err) {
        // pass
    }
  
};