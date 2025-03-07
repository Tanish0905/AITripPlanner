import React, { useState,useEffect } from 'react';
import { Button } from '../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar
import { googleLogout } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function Header() {
  const [ openDialog, setOpenDialog ] = useState( false );
  const [ users, setUsers ] = useState( false );
  
  const getUsers = () => {
    setUsers(JSON.parse(localStorage.getItem('user')))
  }
  useEffect(() => {
    getUsers()
  }, [])
  
  // const users = JSON.parse(localStorage.getItem('user'));

  const login = useGoogleLogin({
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirectUri: "http://localhost:5173", // Ensure this matches the Google Cloud Console
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => {
      console.log("Login Error:", error);
      alert("Error logging in.");
    },
  });

  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: 'application/json',
        },
      });
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('access_token', tokenInfo?.access_token);  // Save the access token
      localStorage.setItem('refresh_token', tokenInfo?.refresh_token);  // Save the refresh token
      setOpenDialog( false );
      getUsers();
    } catch (error) {
      console.error("Error fetching Google Profile:", error);
    }
  };

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-1 sm:px-5'>
      <img src="/MainLogo.svg" width="80px" height="100px" />
      <div>
        {users ? (
          <div className='flex items-center gap-3'>
            <a href='/create-trip'>
              <Button variant='outline' className="rounded-full group-hover:opacity-100 transition-opacity duration-300 text-black bg-gray-200">
                Create Trip
              </Button>
            </a>
            <a href='/my-trips'>
              <Button variant='outline' className="rounded-full group-hover:opacity-100 transition-opacity duration-300 text-black bg-gray-200">
                My Trips
              </Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <Avatar className="h-[35px] w-[35px]">
                  <AvatarImage src={users?.picture} alt={users?.name || "User"} />
                  <AvatarFallback>{users?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent>
                <h2
                  className='cursor-pointer'
                  onClick={() => {
                    googleLogout();
                    setUsers(false);
                    localStorage.clear();
                  }}
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)} variant='outline' className="rounded-full group-hover:opacity-100 transition-opacity duration-300 text-black bg-gray-200">Sign In</Button>
        )}
      </div>
      <Dialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
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

export default Header;
