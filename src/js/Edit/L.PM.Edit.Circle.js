
//TODO connect to library, using geojson-utils for now
//const LatLonSpherical = require('geodesy').LatLonSpherical;


L.PM.Edit.Circle = L.PM.Edit.Line.extend({

    initialize(layer) {
        this._layer = layer;
        this._enabled = false;
        console.log('super edit initialize ', layer)

    },

    _initMarkers() {
        const map = this._layer._map;

        // cleanup old ones first
        if(this._markerGroup) {
            this._markerGroup.clearLayers();
        }

        // add markerGroup to map, markerGroup includes regular and middle markers
        this._markerGroup = new L.LayerGroup();
        map.addLayer(this._markerGroup);

        // create marker for each coordinate
        const coords = [this._layer._latlng];

        console.log(gju);
        //using gju utils / conventions
        const handleBearing = 90;
        const gjuStart = {coordinates:[coords[0].lng, coords[0].lat]};
        const gjuEnd = gju.destinationPoint(gjuStart, handleBearing, this._layer._mRadius/1000);

        const latLngEnd = L.latLng(gjuEnd.coordinates[1],gjuEnd.coordinates[0]);

        coords.push(latLngEnd);
        console.log(coords, gjuStart, gjuEnd);

        // the marker array, it includes only the markers that're associated with the coordinates
        this._markers = coords.map(this._createMarker, this);


        if(this.options.snappable) {
            this._initSnappableMarkers();
        }
    },

    _onMarkerDrag(e) {
        // dragged marker
        const marker = e.target;

        //console.log(marker, this._markers);

        //resize by handles != drag
        const dist = marker._map.distance(this._markers[0]._latlng, this._markers[1]._latlng);
        //console.log(dist);

        this._layer.setRadius(dist);

        // update marker coordinates which will update polygon coordinates
        L.extend(marker._origLatLng, marker._latlng);
        this._layer.redraw();



    },
});
