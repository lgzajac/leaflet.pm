L.PM.Draw.Circle =  L.PM.Draw.Line.extend({
    initialize(map) {
        this._map = map;
        this._shape = 'Circle';
        this.toolbarButtonName = 'drawCircle';
    },
    enable(shape, options) {
        L.PM.Draw.Line.prototype.enable.call(this, shape, options);
    },

    _createMarker(latlng, first) {

        if (!first) {
            console.log('second clik')

            this._finishShape();
        } else {
            console.log('first clik')
            this._hintcircle = L.circle(latlng, this.options.hintlineStyle);
            this._hintcircle._pmTempLayer = true;
            this._layerGroup.addLayer(this._hintcircle);
        }

        //ops. ES6 not working.
        //super._createMarker(latlng, first);
        return L.PM.Draw.Line.prototype._createMarker.call(this, latlng, first);

    },

    _syncHintLine(e) {

        const polyPoints = this._polyline.getLatLngs();

        if(polyPoints.length > 0) {
            const lastPolygonPoint = polyPoints[polyPoints.length - 1];
            this._hintline.setLatLngs([lastPolygonPoint, e.latlng]);

            const dist = this._map.distance(lastPolygonPoint, e.latlng);
            //console.log(dist);

            //this._hintcircle.setLatLng(lastPolygonPoint);
            this._hintcircle.setRadius(dist);
        }

    },


    _finishShape() {

        // disable drawing
        this.disable();

        // get coordinates, create the leaflet shape and add it to the map
        const coords = this._polyline.getLatLngs();

        if (coords.length != 2) return;

        const dist = this._map.distance(coords[0], coords[1]);

        const circleOptions = Object.assign({}, this.options.pathOptions, {radius:dist});

        const circleLayer = L.circle(coords[0], circleOptions).addTo(this._map);

        console.log(circleOptions);

        // fire the pm:create event and pass shape and layer
        this._map.fire('pm:create', {
            shape: this._shape,
            layer: circleLayer,
        });
    }
});
