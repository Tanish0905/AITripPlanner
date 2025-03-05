import * as React from "react"
import { AI_PROMPT, SelectBudgetOptions, SelectTravelsList } from '@/components/constants/options';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { chatSession } from '@/service/AllModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

import { getAuth } from "firebase/auth";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../service/firebaseConfig.jsx' //'@/service/firebaseConfig';
import { useNavigate } from 'react-router-dom';

function CreateTrip() {
  const auth = getAuth();
  const user = auth.currentUser;

  const { toast } = useToast();
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Validate the Google OAuth access token
  const validateToken = async (accessToken) => {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Token is valid:", response.data);
      return true;
    } catch (error) {
      console.error("Token is invalid or expired:", error);
      return false;
    }
  };

  // Refresh the Google OAuth access token
  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      });
      const newAccessToken = response.data.access_token;
      localStorage.setItem('access_token', newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return null;
    }
  };

  const login = useGoogleLogin({
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirectUri: "http://localhost:5173", // Ensure this matches the Google Cloud Console
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => {
      try {
        console.log("Login Error:", error);
      } catch (err) {
        alert("Error logging error.");
      }
    },
  });

const OnGenerateTrip = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  if (!user || !accessToken) {
    setOpenDialog(true); // Prompt user to log in
    return;
  }

  // Validate the access token
  const isTokenValid = await validateToken(accessToken);
  if (!isTokenValid) {
    if (refreshToken) {
      const newAccessToken = await refreshAccessToken(refreshToken);
      if (newAccessToken) {
        localStorage.setItem('access_token', newAccessToken);
      } else {
        setOpenDialog(true);
        return;
      }
    } else {
      setOpenDialog(true);
      return;
    }
  }

  // Ensure all required fields are filled before proceeding
  if (!formData?.location || !formData?.noOfDays || !formData?.budget || !formData?.traveler) {
    toast({
      description: "Please fill all required fields before generating a trip.",
    });
    return;
  }

  setLoading(true);

  const FINAL_PROMPT = AI_PROMPT
    .replace('{location}', formData?.location?.label || 'Unknown Location')
    .replace('{totalDays}', formData?.noOfDays || '0')
    .replace('{traveler}', formData?.traveler || 'Unknown')
    .replace('{budget}', formData?.budget || 'Unknown');

  console.log('FINAL_PROMPT', FINAL_PROMPT);

  try {
    const result = await chatSession.sendMessage(FINAL_PROMPT);
    const tripResponse = result?.response?.text();
    
    if (!tripResponse) {
      toast({
        description: "Failed to generate trip. Please try again.",
      });
      setLoading(false);
      return;
    }

    SaveAiTrip(tripResponse);
  } catch (error) {
    console.error('Error generating trip:', error);
    toast({
      description: "Error generating trip. Please try again.",
    });
  } finally {
    setLoading(false);
  }
};

const SaveAiTrip = async (TripData) => {
  if (!TripData) {
    alert("Trip data is empty. Cannot save.");
    return;
  }

  setLoading(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const accessToken = localStorage.getItem('access_token');

  if (!user || !accessToken) {
    setLoading(false);
    alert("User not found, please log in.");
    return;
  }

  const isTokenValid = await validateToken(accessToken);
  if (!isTokenValid) {
    alert("Session expired. Please log in again.");
    setOpenDialog(true);
    setLoading(false);
    return;
  }

  const docId = Date.now().toString();

  try {
    const tripDataObject = typeof TripData === 'string' ? JSON.parse(TripData) : TripData;
    if (!tripDataObject || Object.keys(tripDataObject).length === 0) {
      throw new Error("Generated trip data is empty.");
    }

    await setDoc(doc(db, 'AITrips', docId), {
      ...tripDataObject,
      userSelection: formData,
      userEmail: user?.email,
      id: docId,
      createdBy: user.id,
      timestamp: new Date(),
    });

    alert("Trip saved successfully!");
    navigate('/view-trip/' + docId);
  } catch (error) {
    console.error("Error saving trip:", error);
    alert("Error saving the trip, please try again.");
  } finally {
    setLoading(false);
  }
};

  // const SaveAiTrip = async (TripData) => {
  // setLoading(true);

  // const user = JSON.parse(localStorage.getItem('user'));
  // const accessToken = localStorage.getItem('access_token');
  // const refreshToken = localStorage.getItem('refresh_token');

  // if (!user || !accessToken) {
  //   setLoading(false);
  //   alert("User not found, please log in.");
  //   return;
  // }

  // // Validate the access token
  // const isTokenValid = await validateToken(accessToken);
  // if (!isTokenValid) {
  //   // If the token is invalid or expired, try refreshing it
  //   if (refreshToken) {
  //     const newAccessToken = await refreshAccessToken(refreshToken);
  //     if (newAccessToken) {
  //       localStorage.setItem('access_token', newAccessToken);
  //     } else {
  //       setLoading(false);
  //       alert("Session expired. Please log in again.");
  //       setOpenDialog( true ); // Prompt the user to log in again
  //       return;
  //     }
  //   } else {
  //     setLoading(false);
  //     alert("Session expired. Please log in again.");
  //     setOpenDialog(true); // Prompt the user to log in again
  //     return;
  //   }
  // }

  // const docId = Date.now().toString();

  // try {
  //   // Parse TripData if it's a string
  //   const tripDataObject = typeof TripData === 'string' ? JSON.parse(TripData) : TripData;

  //   // Ensure the collection name matches the Firestore rules
  //   await setDoc(doc(db,'AITrips',docId), {
  //     ...tripDataObject,
  //     userSelection: formData,
  //     userEmail: user?.email,
  //     id:docId,
  //     createdBy: user.id,
  //     timestamp: new Date()
  //   });
  //   alert("Trip saved successfully!");
  // } catch (error) {
  //   console.error("Error saving trip:", error);
  //   alert("Error saving the trip, please try again.");
  // } finally {
  //   setLoading( false );
  //   navigate('/view-trip/'+docId)
  // }
  // };
  const GetUserProfile = async (tokenInfo) => {
    axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: 'Application/json',
        },
      })
      .then((res) => {
        console.log('response', res);
        localStorage.setItem('user', JSON.stringify(res.data));
        localStorage.setItem('access_token', tokenInfo?.access_token);  // Save the access token
        localStorage.setItem('refresh_token', tokenInfo?.refresh_token);  // Save the refresh token
        setOpenDialog(false);
        OnGenerateTrip();
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const checkSession = async (sid) => {
    const sessionRef = doc(db, "sessions", sid);
    const docSnap = await getDoc(sessionRef);
    if (docSnap.exists()) {
      console.log("Session is valid", docSnap.data());
    } else {
      console.log("Session is invalid.");
    }
  };

  checkSession("2rCcrC6RGuSyd0J3W9AjSg"); // Use the SID here

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your travel preferences</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences🗺️
      </p>
      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">What is the destination of choice?</h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange('location', v);
              },
            }}
          />
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">How many days are you planning your trip?</h2>
          <Input
            className="border border-[#e5e7eb] border-solid"
            placeholder="Ex. 3"
            type="number"
            min="1"
            max="31"
            onChange={(e) => {
              let value = Number(e.target.value);

              if (value < 1 || value > 31) {
                toast({ description: "Trip days must be between 1 and 31" });
                return;
              }

              handleInputChange("noOfDays", value);
            }}
          />
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">What is your budget?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-7 mt-5">
            {SelectBudgetOptions?.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange('budget', item.title)}
                className={`p-5 border cursor-pointer shadow-sm rounded-lg 
                            transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl  
                            ${formData?.budget === item.title ? 'border-black scale-105 bg-white shadow-lg' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">Who do you plan on travelling with on your next adventure?🌊🏨</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-7 mt-5">
            {SelectTravelsList?.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange('traveler', item.people)}
                className={`p-5 border cursor-pointer shadow-sm rounded-lg 
                            transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl  
                            ${formData?.traveler === item.people ? 'border-black scale-105 bg-white shadow-lg' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="my-10 justify-end flex">
        <Button disabled={loading} onClick={OnGenerateTrip}>
          {loading ? <AiOutlineLoading3Quarters className="animate-spin text-2xl" /> : 'Generate trip plan'}
        </Button>
      </div>
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription> Please sign in to generate your trip plan. </DialogDescription>
            <div className="mt-4">
              <Button onClick={() => login()}>
                <FcGoogle className="mr-2 text-xl" />
                Sign in with Google
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;