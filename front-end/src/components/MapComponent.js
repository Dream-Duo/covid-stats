/// app.js
import React, { Component } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import MapGL, { StaticMap } from 'react-map-gl';
import axios from 'axios'


// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoidGFuaXNocW1pc2hyYSIsImEiOiJja2Nub2NxeDkwZGI0MnFsdmk3OXhmbHVqIn0.D978KZ8t0I6T_crSB_OvBQ';




class Map extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [
            ],
            viewport: {
                ...DeckGL.defaultViewport,
                longitude: -74.006,
                latitude: 40.7128,
                zoom: 2,
                width: '67rem',
                height: '71vh',
            },
        }
    }


    componentDidMount() {

        axios.get('/countries').then(response => {
            this.setState({
                data: response.data
            })
        })
        window.addEventListener('resize', this._resize.bind(this));
        this._resize();
    }

    _resize() {
        this._onViewportChange({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    _onViewportChange(viewport) {
        this.setState({
            viewport: { ...this.state.viewport, ...viewport }
        });
    }



    render() {

        const { viewport } = this.state;
        const layer = new ScatterplotLayer({
            id: 'scatterplot-layer',
            data: this.state.data,
            pickable: true,
            opacity: 0.5,
            filled: true,
            radiusMaxPixels: 100,
            lineWidthMinPixels: 1,
            radiusScale: 10,
            radiusMinPixels: 0.5,
            getPosition: d => { return [d.longitude, d.latitude] },
            getRadius: d => Math.sqrt(d.confirmed * 1000),
            getFillColor: d => d.confirmed < 200000 ? [1, 164, 246] : [253, 62, 88],
            getLineColor: d => [0, 0, 0]
        })



        return (

            <div style={{ position: 'relative' }}>
                <DeckGL
                    {...viewport}
                    initialViewState={viewport}
                    controller={true}
                    layers={layer}
                    height='71vh'
                    width='100rem'
                    getTooltip={({ object }) => {
                        return (
                            object &&
                            `${object.location}
                            Infected - ${object.confirmed - object.dead - object.recovered}
                            Recovered - ${object.recovered}
                            Deaths - ${object.dead}`
                        )
                    }}


                >
                    <StaticMap
                        {...viewport}

                        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                        mapStyle="mapbox://styles/mapbox/dark-v9"
                    />
                </DeckGL>
            </div>
        );
    }
}

export default Map;





