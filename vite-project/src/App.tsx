import { MapContainer, TileLayer } from "react-leaflet";
import LocalStations from "./components/LocalStations";
import CenterMarker from "./components/CenterMarker";
import { WeatherDataType } from "./types/types";
import 'leaflet/dist/leaflet.css';
import ArrowGrid from "./components/ArrrowGrid";
import { useControls } from "leva";
import { useEffect, useState } from "react";
import CurrentCard from "./components/CurrentCard";
import { Map } from "leaflet";
import { interpolateWeatherData } from "./lib/Interpolation";
import { useStation } from "./context/StationContext";

function App() {
  const { Wind_Grid , Toggle_Map , Current_Card } = useControls({ Wind_Grid: false , Toggle_Map: true , Current_Card: true });

  const [map, setMap] = useState<Map | null>();
  const station = useStation();

  const [weatherDataAtCenter, setWeatherDataAtCenter] = useState<WeatherDataType>();

  useEffect(() => {
    if (map) {
      map.on("mouseup", () => {
        const center = map.getCenter();
        Current_Card && setWeatherDataAtCenter(interpolateWeatherData([center.lat, center.lng],station.localStationsData));
      });
    }
    return () => {
      if (map) {
        map.off("mouseup");
      }
    }
  }, [map, station.localStationsData]);

  return (
    <>
        <div className="h-screen">
          {Current_Card && <CurrentCard weatherData={weatherDataAtCenter} />}
          <div className="h-full w-full rounded-xl overflow-hidden">
            <MapContainer
              ref={setMap}
              style={{ height: "100%",width:"100%", zIndex: 0 }}
              center={[28.476863, 77.095934]}
              zoom={15}
              scrollWheelZoom={false}
            >
              {Toggle_Map && <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png" />}
              {!Toggle_Map && <TileLayer url="https://media.istockphoto.com/id/1320815200/photo/wall-black-background-for-design-stone-black-texture-background.jpg?s=612x612&w=0&k=20&c=hqcH1pKLCLn_ZQ5vUPUfi3BOqMWoBzbk5-61Xq7UMsU=" />}
              {Current_Card && <CenterMarker />}
              <LocalStations />
              {Wind_Grid && <ArrowGrid />}
            </MapContainer>
          </div>
        </div>
    </>
  );
}
export default App;