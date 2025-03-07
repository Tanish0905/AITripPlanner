import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IoIosShareAlt } from "react-icons/io";
import { GetPlaceDetails } from "@/service/GlobalApi"; // ✅ Correct Import

const PHOTO_REF_URL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference={PHOTO_REFERENCE}&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;

function InfoSection({ trip }) {
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
        <div>
            <img
                src={photoUrl} // ✅ Use dynamic image
                className="h-[340px] w-full object-cover rounded-xl"
                alt="Place"
            />

            <div className="flex justify-between items-center">
                <div className="my-5 flex flex-col gap-2">
                    <h2 className="font-bold text-2xl">{trip?.userSelection?.location?.label}</h2>
                    <div className="flex gap-5">
                        <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
                            📅 {trip?.userSelection?.noOfDays} Day
                        </h2>
                        <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
                            💰 {trip?.userSelection?.budget} Budget
                        </h2>
                        <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
                            🧳 No. of Travelers: {trip?.userSelection?.traveler}
                        </h2>
                    </div>
                </div>
                <Button>
                    <IoIosShareAlt />
                </Button>
            </div>
        </div>
    );
}

export default InfoSection;
