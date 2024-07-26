import React, { useEffect, useRef } from 'react';
import { Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useControls } from 'leva';

interface ArrowProps {
  positions: [number, number][];
  color?: string;
  weight?: number;
  arrowSize?: number;
}

const Arrow: React.FC<ArrowProps> = ({ positions, color = 'black', weight = 2 }) => {
  const map = useMap();
  const arrowHeadRef = useRef<L.Marker | null>(null);

  const { arrowSize } = useControls({
    arrowSize: {
      value: 1.5,
      min: .1,
      max: 5,
    },
  });
  useEffect(() => {
    if (positions.length < 2) return;    

    const lastPosition = positions[positions.length - 1];
    const secondLastPosition = positions[positions.length - 2];

    if (isNaN(lastPosition[0]) || isNaN(lastPosition[1]) || isNaN(secondLastPosition[0]) || isNaN(secondLastPosition[1])) return;


    const angle = Math.atan2(
      lastPosition[1] - secondLastPosition[1],
      lastPosition[0] - secondLastPosition[0]
    ) * (180 / Math.PI);
    const arrowHead = L.marker(lastPosition, {
      icon: L.divIcon({
        html: `<div style="color:${color};transform: rotate(${angle - 90}deg);height:100%;width:100%;display:flex;justify-content:center;align-items:center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width:12px;height:12px;scale:${arrowSize*2}">
            <path fill-rule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
          </svg>
        </div>`,
        className: 'arrow-head',
      }),
    });

    arrowHead.addTo(map);

    if (arrowHeadRef.current) {
      arrowHeadRef.current.remove();
    }

    arrowHeadRef.current = arrowHead;

    return () => {
      if (arrowHeadRef.current) {
        arrowHeadRef.current.remove();
      }
    };
  }, [positions, map, arrowSize]);

  if (isNaN(positions[0][0]) || isNaN(positions[0][1]) || isNaN(positions[1][0]) || isNaN(positions[1][1])) return <></>;
  return <Polyline positions={positions} color={color} weight={weight} />;
};

export default Arrow;
