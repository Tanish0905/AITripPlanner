import { GetPlaceDetails } from '@/service/GlobalApi';
import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom';

const PHOTO_REF_URL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference={PHOTO_REFERENCE}&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;

function UserTripCardItem ( { trip } ) {
    const [photoUrl, setPhotoUrl] = useState(null); // Store the image URL
    
    const GetPlacePhoto = async () => {
        const textQuery = trip?.userSelection?.location?.label;
        if (!textQuery) {
            console.error("Error: textQuery is missing!");
            return;
        }

        const data = { textQuery };
        try {
            const resp = await GetPlaceDetails(data);

            const photos = resp?.data?.places?.[0]?.photos;
            if (photos && photos.length > 0) {
                const photoReference = photos[0]?.name?.split("/").pop(); // ✅ Extract last part
                if (photoReference) {
                    const generatedUrl = PHOTO_REF_URL.replace("{PHOTO_REFERENCE}", photoReference);
                    setPhotoUrl(generatedUrl);
                } else {
                    console.warn("No valid photo reference found.");
                }
            } else {
                console.warn("No photos available for this place.");
            }
        } catch (error) {
            console.error("Error fetching place details:", error);
        }
    };

    useEffect(() => {
        if (trip?.userSelection?.location?.label) {
            GetPlacePhoto();
        }
    }, [trip]);
    return (
        <Link to={`/view-trip/`+trip?.id}>
            <div className='hover:scale-105 transition-all '>
                <img src={photoUrl} className='object-cover rounded-xl h-[220px] w-full bg-slate-200 animate-pulse' />
                <div>
                    <h2 className='font-bold text-lg'>{ trip?.userSelection?.location?.label }</h2>
                    <h2 className='text-sm text-gray-500'>{trip?.userSelection?.noOfDays} Days trip with {trip?.userSelection?.budget} Budget</h2>
                </div>
            </div>
        </Link>
  )
}

export default UserTripCardItem