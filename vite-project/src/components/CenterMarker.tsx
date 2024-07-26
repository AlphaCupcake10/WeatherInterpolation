import { useEffect, useRef } from 'react'
import { Marker, Popup, useMap } from 'react-leaflet'

function CenterMarker()
{
    const map = useMap();
    const markerRef = useRef<any>(null);//TODO CHANGE ANY HOW?????
   

    useEffect(()=>{
        map.on("move",()=>{
            markerRef.current.setLatLng(map.getCenter())
        })

        return ()=>{
            map.off("move");
        }
    },[])

    return (
    <>
        <Marker ref={markerRef} position={map.getCenter()}>
            <Popup>
                <p>Zomato wale bhaiya</p>
            </Popup>
        </Marker>
    </>
    )
}

export default CenterMarker