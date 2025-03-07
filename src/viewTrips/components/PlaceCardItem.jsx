import { Button } from '@/components/ui/button';
import { GetPlaceDetails } from '@/service/GlobalApi';
import React,{useState,useEffect} from 'react'
import { FaMapLocation } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function PlaceCardItem ( { place } ) {
    const [photoUrl, setPhotoUrl] = useState(null); // Store the image URL
    console.log('place',place);
    
    const PHOTO_REF_URL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference={PHOTO_REFERENCE}&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;
  
    const GetPlacePhoto = async () => {
        const data = { textQuery: place?.PlaceName };
        try {
          const resp = await GetPlaceDetails(data);
          const places = resp?.data?.places;
          if (places && places.length > 0) {
            const photos = places[0]?.photos;
            if (photos && photos.length > 0) {
              const fullPhotoName = photos[0]?.name;
              const photoReference = fullPhotoName.split("/photos/")[1]; // Extract proper reference
              if (photoReference) {
                const photoUrl = PHOTO_REF_URL.replace('{PHOTO_REFERENCE}', photoReference);
                setPhotoUrl(photoUrl);
              } else {
                console.warn("No valid photo reference found.");
              }
            } else {
              console.warn("No photos available for this place.");
            }
          } else {
            console.warn("No places returned.");
          }
        } catch (error) {
          console.error("Error fetching place details:", error);
        }
    };

    useEffect(() => {
      if (place) {
        GetPlacePhoto();
      }
    }, [place]);    
    return (
        // <Link to={'https://www.google.com/maps/search/?api=1&query='+place?.geoCoordinates?.latitude+","+place?.geoCoordinates?.longitude} target='_blank' >
        <Link to={'https://www.google.com/maps/search/?api=1&query='+place?.placeName} target='_blank' >
            <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'> 
              <img src={photoUrl} className='w-[130px] h-[130px] rounded-xl object-cover' />
              {/* src={ place?.PlaceImageUrl }  */}
                  <div>
                  <h2 className='font-bold ext-lg'>{ place?.placeName }</h2>
                  <p className='text-sm text-gray-400'>{ place?.placeDetails }</p>
                  {/* <h2 className='mt-2'>{place?.timeToTravel}</h2> */ }
                  <Button size><FaMapLocation /></Button>
              </div>
            </div>
        </Link>
  )
}

export default PlaceCardItem