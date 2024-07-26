import { Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import stations from "../assets/oye.json";
import { StationDataType } from "../types/types";
// import Arrow from "./Arrow";
import { useControls } from "leva";
import L from "leaflet";
import { useStation } from "../context/StationContext";

const markerHtmlStyles = `
  width: 2rem;
  height: 2rem;
  display: block;
  left: -1rem;
  top: -1rem;
  position: relative;
  border-radius: 3rem 3rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF;
`;

function LocalStations() {
  const { RangeKM } = useControls({ RangeKM: 2 });

  const map = useMap();
  const station = useStation();

  useEffect(() => {
    getLocalStationsFromCenter(RangeKM);
    map.on("moveend", () => {
      getLocalStationsFromCenter(RangeKM);
    });

    return () => {
      map.off("moveend");
    };
  }, [RangeKM]);

  function getLocalStationsFromCenter(thresholdDistanceKM: number) {
    //Find points within 1km of the center point
    let local: StationDataType[] = [];
    const center = map.getCenter();
    const thresholdAngle = thresholdDistanceKM / 111;
    stations.forEach((val) => {
      if (
        Math.pow(val.latitude - center.lat, 2) +
          Math.pow(val.longitude - center.lng, 2) <
        thresholdAngle * thresholdAngle
      ) {
        local.push(val);
      }
    });

    station.setLocalStationsData(local);
  }

  return (
    <>
      {station.localStationsData.map((val, index) => {
        const icon = new L.DivIcon({
          className: "my-custom-pin",
          iconAnchor: [0, 24],
          popupAnchor: [0, -36],
          html: `<span style="pointer-events: none;background-color: ${
            val.locality_weather_data ? "red" : "grey"
          };${markerHtmlStyles}" />`,
        });
        // const angle = (val.locality_weather_data?.wind_direction || 0) * (Math.PI / 180);
        //arrow length based on wind speed
        // const arrowLength = (val.locality_weather_data?.wind_speed || 0) * 0.0001;
        return (
          <Marker
            icon={icon}
            key={index}
            position={[val.latitude, val.longitude]}
          >
            {/* {val.locality_weather_data && <Arrow weight={3} color="black" positions={[[val.latitude, val.longitude], [val.latitude + arrowLength * Math.cos(angle), val.longitude + arrowLength * Math.sin(angle)]]} />  } */}
            {val.locality_weather_data && (
              <Popup autoPan={false}>
                <p>{val.label}</p>
                <div className="flex justify-between">
                  <p>Humidity</p>
                  <p>{val.locality_weather_data?.humidity}</p>
                </div>
                <div className="flex justify-between">
                  <p>Temperature</p>
                  <p>{val.locality_weather_data?.temperature}</p>
                </div>
                <div className="flex justify-between">
                  <p>Wind Speed</p>
                  <p>{val.locality_weather_data?.wind_speed}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p>Wind Direction</p>
                  <svg
                    style={{
                      rotate: `${
                        val.locality_weather_data?.wind_direction - 90
                      }deg`,
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </div>
                <div className="flex justify-between">
                  <p>Rain Intensity</p>
                  <p>{val.locality_weather_data?.rain_intensity}</p>
                </div>
                <div className="flex justify-between">
                  <p>Rain Accumulation</p>
                  <p>{val.locality_weather_data?.rain_accumulation}</p>
                </div>
              </Popup>
            )}
          </Marker>
        );
      })}
    </>
  );
}

export default LocalStations;
