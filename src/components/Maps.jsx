import React, { useEffect, useState } from "react";
import {
    GoogleMap,
    withGoogleMap,
    withScriptjs,
    DirectionsRenderer,
} from "react-google-maps";
const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel");
import { withProps, compose, lifecycle } from "recompose";
import axios from "axios";

const locations = [
    { lat: 25.0438, lng: 55.1348, icon: '/marker.png', strokeColor: '#FE5C36', name: 'James ishola' },
    { lat: 25.0778053, lng: 55.1260686, icon: '/marker.png', strokeColor: '#FE5C36', name: 'Dami Adesina' },
    { lat: 25.0602, lng: 55.2094, icon: '/marker.png', strokeColor: '#FE5C36', name: 'Rashid Ali' },
    { lat: 25.1253, lng: 55.194102, icon: '/marker.png', strokeColor: '#FE5C36', name: 'Bim Gbeile' },
    { lat: 25.199514, lng: 55.277397, icon: '/marker.png', strokeColor: '#FE5C36', name: 'adil Shafique' },
];

const findPlaces = (lng, lat, type, radius, keyword) => {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    var config = {
        method: 'get',
        url: `${proxyurl}https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lng}&radius=${radius}&type=${type}&keyword=${keyword}&key=youGoogleMapsAPIKey`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        crossdomain: true
    };

    return axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}

const midPoint = (coord) => {
    let totalLat = 0
    let totalLng = 0
    coord.map((c, k) => {
        totalLng += c.lng
        totalLat += c.lat
        return <div key={k}></div>
    })
    return { lat: totalLat / coord.length, lng: totalLng / coord.length, icon: '/location.png', strokeColor: '#FE5C36' }
}

const customerMarker = (id = false, coord, icon, labelText, vote = false, onClick) => {
    //coord = { lat: 25.0438, lng: 55.1348 }
    return <MarkerWithLabel
        key={labelText}
        position={coord}
        labelAnchor={new google.maps.Point(0, 0)}
        labelStyle={{
            minWidth: "auto",
            height: "20.7px",
            left: "1293.24px",
            background: "#FFFFFF",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "15px",
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            color: "#434343",
        }}
        icon={icon}
        onClick={() => onClick(id)}
    >
        <div style={{ paddingTop: 5, paddingLeft: 10, paddingRight: 10, }}> <span style={{ paddingRight: 10 }}>{labelText.substr(0, 12)} {labelText.length > 12 && "..."}</span> {vote && <img style={{ float: "right" }} src="/1.png" width={20} />}</div>
    </MarkerWithLabel>
}

const midP = midPoint(locations)
const nearby = findPlaces(midP.lng, midP.lat, "restaurant", 1000, "");


const MapWithADirectionsRenderer = compose(
    withProps({
        googleMapURL:
            "https://maps.googleapis.com/maps/api/js?key=youGoogleMapsAPIKey&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `1000px` }} />,
        mapElement: <div style={{ height: `100%` }} />
    }),
    withScriptjs,
    withGoogleMap,
    lifecycle({
        componentDidMount() {
            this.setState({
                nearby: this.props.nearby
            });
            const DirectionsService = new google.maps.DirectionsService();
            this.props?.locations?.map((l, k) => {
                DirectionsService.route(
                    {
                        origin: new google.maps.LatLng(l.lat, l.lng),
                        destination: new google.maps.LatLng(this.props.destination.lat, this.props.destination.lng),
                        travelMode: google.maps.TravelMode.DRIVING,

                    },
                    (result, status) => {
                        if (status === google.maps.DirectionsStatus.OK) {
                            this.setState({
                                [`directions${k}`]: result
                            });
                        } else {
                            console.error(`error fetching directions ${result}`);
                        }
                    }
                );
                return <div key={k}></div>
            })
        },
        componentDidUpdate() {
            this.setState({
                nearby: this.props.nearby
            });
            const DirectionsService = new google.maps.DirectionsService();
            this.props?.locations?.map((l, k) => {
                DirectionsService.route(
                    {
                        origin: new google.maps.LatLng(l.lat, l.lng),
                        destination: new google.maps.LatLng(this.props.destination.lat, this.props.destination.lng),
                        travelMode: google.maps.TravelMode.DRIVING,

                    },
                    (result, status) => {
                        if (status === google.maps.DirectionsStatus.OK) {
                            this.setState({
                                [`directions${k}`]: result
                            });
                        } else {
                            console.error(`error fetching directions ${result}`);
                        }
                    }
                );
                return <div key={k}></div>
            })
        },
        componentDidUpdate(prevProps, prevState) {
            if (prevProps.destination !== this.props.destination) {
                // this.setState({
                //     nearby: this.props.nearby
                // });
                const DirectionsService = new google.maps.DirectionsService();
                this.props?.locations?.map((l, k) => {
                    DirectionsService.route(
                        {
                            origin: new google.maps.LatLng(l.lat, l.lng),
                            destination: new google.maps.LatLng(this.props.destination.lat, this.props.destination.lng),
                            travelMode: google.maps.TravelMode.DRIVING,

                        },
                        (result, status) => {
                            if (status === google.maps.DirectionsStatus.OK) {
                                this.setState({
                                    [`directions${k}`]: result
                                });
                            } else {
                                console.error(`error fetching directions ${result}`);
                            }
                        }
                    );
                    return <div key={k}></div>
                })

            }
        }
    })
)(props => {
    let multipleDirection = locations.map((l, k) => {
        return <DirectionsRenderer key={k} directions={props[`directions${k}`]}
            options={{
                suppressMarkers: true,
                polylineOptions: {
                    strokeColor: l.strokeColor,
                    strokeOpacity: 0.5,
                    strokeWeight: 4
                },
                markerOptions: { icon: l.icon },
                icon: { scale: 1 }
            }}
        />
    })



    return <GoogleMap
        defaultZoom={10}
    //defaultCenter={new google.maps.LatLng(-37.8136, 144.9631)}
    >
        {multipleDirection}

        {locations.map((l, k) => customerMarker(false, { lat: l.lat, lng: l.lng }, l.icon, l.name, false, props.action))}

        {props.nearby?.results?.map((l) =>
            customerMarker(l.place_id == props.place_id ? false : l.place_id, l?.geometry?.location, l.place_id == props.place_id ? "/location.png" : "/rest.png", l.name, true, props.action)

        )
        }

    </GoogleMap>

});

function Map(props) {

    const [nearbyList, setNearbyList] = useState({});
    const [destination, setDestination] = useState({});
    const [destinationName, setDestinationName] = useState();
    const [destinationId, setDestinationId] = useState();



    //props.nearby?.results?.map((l) => customerMarker(l?.geometry?.location

    const changeDirection = (id) => {
        if (!id) return;
        const newPlace = nearbyList?.results.filter((result) => result.place_id == id);
        setDestination(newPlace[0].geometry?.location)
        setDestinationName(newPlace[0].name)
        setDestinationId(newPlace[0].place_id)
    }


    useEffect(() => {
        setNearbyList(nearby)
    }, [nearby])

    useEffect(() => {
        nearby.then((NearbyData) => {
            setNearbyList(NearbyData)
            setDestination(NearbyData?.results[0].geometry?.location)
            setDestinationName(NearbyData?.results[0].name)
            setDestinationId(NearbyData?.results[0].place_id)
        })

    }, [nearbyList])

    return (
        <MapWithADirectionsRenderer locations={locations} destination={destination} nearby={nearbyList} name={destinationName} place_id={destinationId} action={changeDirection} />
    );

}

export default Map;
