'use client';


import { Button } from '@/components/ui/button';
import { MapPin, MapPinIcon, Pin } from 'lucide-react';
import { useState } from 'react';
import Map, { Marker } from 'react-map-gl';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"

type ICoordinate = {
  longitude: number,
  latitude: number,
}
export function PrintersMap({ coordinates = [{
  longitude: -122.4,
  latitude: 37.8
}], onSelect }: { coordinates: Array<ICoordinate>, onSelect: (coord: ICoordinate) => {} }) {

  const [veiwPort, setviewPort] = useState({
    longitude: -122.4,
    latitude: 37.8,
    zoom: 12
  });

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPS_API_ACCESS_TOKEN}

      initialViewState={veiwPort}
      style={{ height: '400px', overflow: 'hidden' }}
      mapStyle="mapbox://styles/narteysarso/clycq2z4h00l301pne12q2agb"
    >
      {
        coordinates?.map((coordinate, idx) =>
          <Marker
            key={idx}
            longitude={coordinate.longitude} latitude={coordinate.latitude}

          >
            <Popover>
              <PopoverTrigger>
                <div className='flex flex-col items-center text-white '>
                <MapPinIcon className="hover:animate-bounce" />
                <p>Label</p>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Dimensions</h4>
                    <p className="text-sm text-muted-foreground">
                      Set the dimensions for the layer.
                    </p>
                    <Button onClick={() => onSelect(coordinate)}>Print here</Button>
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