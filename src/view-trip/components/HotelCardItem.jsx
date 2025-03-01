import React, { useState, useEffect } from 'react'; 
import { GetPlaceDetails } from '@/service/GlobalApi';
import { Link } from 'react-router-dom';

export const HotelCardItem = ({ hotel }) => {
  const [photoUrl, setPhotoUrl] = useState(null); // Store the image URL
  
  const PHOTO_REF_URL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference={PHOTO_REFERENCE}&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;

  console.log('hotel', hotel);
  
  const GetPlacePhoto = async () => {
  const data = { textQuery: hotel?.hotelName };

  try {
    const resp = await GetPlaceDetails(data);
    console.log('API Response:', resp.data);

    const places = resp?.data?.places;
    if (places && places.length > 0) {
      const photos = places[0]?.photos;
      
      console.log('Photos:', photos);

      if (photos && photos.length > 0) {
        const fullPhotoName = photos[0]?.name;
        const photoReference = fullPhotoName.split("/photos/")[1]; // Extract proper reference

        console.log('photoReference:', photoReference);

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
    if (hotel) {
      GetPlacePhoto();
    }
  }, [hotel]);

  // Encoding hotel name and address for URL safety
  const encodedHotelName = encodeURIComponent(hotel?.hotelName);
  const encodedHotelAddress = encodeURIComponent(hotel?.hotelAddress);

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${encodedHotelName},${encodedHotelAddress}`}
      target="_blank"
    >
      <div className="hover:scale-105 transition-all cursor-pointer">
        {/* Use a fallback image or placeholder if photoUrl is not available */}
        <img
          src={photoUrl || 'path/to/placeholder-image.jpg'} // Add a default placeholder image
          className="rounded-xl"
          alt="Hotel Image"
        />
        <div className="my-2 flex flex-col gap-2">
          <h2 className="font-medium">{hotel?.hotelName}</h2>
          <h2 className="text-xs text-gray-500">📍{hotel?.hotelAddress}</h2>
          <h2 className="text-sm">💰{hotel?.price}</h2>
          <h2 className="text-sm">⭐{hotel?.rating}</h2>
        </div>
      </div>
    </Link>
  );
};


// import React, { useState, useEffect } from 'react';
// import { GetPlaceDetails } from '@/service/GlobalApi';
// import { Link } from 'react-router-dom';

// export const HotelCardItem = ( { hotel } ) => {
//   const [ photoUrl, setPhotoUrl ] = useState( null ); // Store the image URL
  
//   const PHOTO_REF_URL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference={PHOTO_REFERENCE}&key=${ import.meta.env.VITE_GOOGLE_PLACE_API_KEY }`;

//   const GetPlacePhoto = async () => {
//     const data = { textQuery: hotel?.hotelName }

//     const result = await GetPlaceDetails( data ).then( resp => {
//       const PhotoUrl = PHOTO_REF_URL.replace( '{PHOTO_REFERENCE}', resp?.data?.places[0]?.photos[3]?.name );
//       setPhotoUrl( PhotoUrl );
//     } )
//   };
//   useEffect(() => {
//     hotel && GetPlacePhoto();
//   }, [ hotel ] )
//   console.log('PhotoUrl',photoUrl);
  
//   // Encoding hotel name and address for URL safety
//   const encodedHotelName = encodeURIComponent(hotel?.hotelName);
//   const encodedHotelAddress = encodeURIComponent(hotel?.hotelAddress);

//   return (
//     <Link
//       to={`https://www.google.com/maps/search/?api=1&query=${encodedHotelName},${encodedHotelAddress}`}
//       target="_blank"
//     >
//       <div className="hover:scale-105 transition-all cursor-pointer">
//         {/* Use a fallback image or placeholder if photoUrl is not available */}
//         <img
//           src={photoUrl || 'path/to/placeholder-image.jpg'} // Add a default placeholder image
//           className="rounded-xl"
//           alt="Hotel Image"
//         />
//         <div className="my-2 flex flex-col gap-2">
//           <h2 className="font-medium">{hotel?.hotelName}</h2>
//           <h2 className="text-xs text-gray-500">📍{hotel?.hotelAddress}</h2>
//           <h2 className="text-sm">💰{hotel?.price}</h2>
//           <h2 className="text-sm">⭐{hotel?.rating}</h2>
//         </div>
//       </div>
//     </Link>
//   );
// };
