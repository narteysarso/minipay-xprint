'use client';


import { Button } from '@/components/ui/button';
import { MapPinIcon, } from 'lucide-react';
import { useState } from 'react';
import Map, { Marker } from 'react-map-gl';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import getCenter from "geolib/es/getCenter";
import 'mapbox-gl/dist/mapbox-gl.css';

type ICoordinate = {
  name: string,
  description: string,
  longitude: number,
  latitude: number,
}
export function PrintersMap({ coordinates = [], onSelect }: { coordinates: Array<ICoordinate>, onSelect: (coord: ICoordinate) => {} }) {

  const center = getCenter(coordinates)

  const [veiwPort, setviewPort] = useState({
    longitude: center?.longitude,
    latitude: center?.latitude,
    zoom: 16
  });


  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPS_API_ACCESS_TOKEN}
      initialViewState={veiwPort}
      style={{ height: '400px' , overflow: 'hidden' }}
      mapStyle="mapbox://styles/narteysarso/clycq2z4h00l301pne12q2agb"
    >
      {
        coordinates?.map((coordinate, idx) =>
          <Marker
            key={idx}
            longitude={coordinate.longitude} 
            latitude={coordinate.latitude}
          >
            <Popover>
              <PopoverTrigger>
                <div className='flex flex-col items-center text-white '>
                  <MapPinIcon className="hover:animate-bounce" />
                  <p>{coordinate?.name}</p>
                </div>
              </PopoverTrigger>
              <PopoverContent className="">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium leading-none">{coordinate?.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {coordinate?.description}
                    </p>
                    <Button onClick={() => onSelect(coordinate)}>Select</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

          </Marker>
        )
      }
    </Map>
  );
}