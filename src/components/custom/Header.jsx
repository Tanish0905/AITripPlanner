import React, { useState, useEffect } from 'react'; 
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from '../../redux/authSlice';

function Header() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [openDialog, setOpenDialog] = useState(false);
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      dispatch(loginSuccess(storedUser));
    }
  }, [dispatch]);

  const login = useGoogleLogin({
    onSuccess: async (tokenInfo) => {
      try {
        const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: 'application/json',
          },
        });

        const userData = {
          name: response.data.name,
          picture: response.data.picture,
          email: response.data.email,
          accessToken: tokenInfo?.access_token,
        };

        dispatch(loginSuccess(userData));
        setOpenDialog(false);
      } catch (error) {
        console.error("Error fetching Google Profile:", error);
      }
    },
    onError: (error) => {
      console.log("Login Error:", error);
    },
  });

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-1 sm:px-5'>
      <img src="/MainLogo.svg" width="80px" height="100px" />
      <div>
        {user ? (
          <div className='flex items-center gap-3'>
            <a href='/create-trip'>
              <Button variant='outline' className="rounded-full text-black bg-gray-200">
                Create Trip
              </Button>
            </a>
            <a href='/my-trips'>
              <Button variant='outline' className="rounded-full text-black bg-gray-200">
                My Trips
              </Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <Avatar className="h-[35px] w-[35px]">
                  <AvatarImage src={user.picture} alt={user.name || "User"} />
                  <AvatarFallback>{user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent>
                <h2
                  className='cursor-pointer'
                  onClick={() => {
                    googleLogout();
                    dispatch(logout());
                  }}
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)} variant='outline' className="rounded-full text-black bg-gray-200">
            Sign In
          </Button>
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
// import React, { useState, useEffect } from 'react'; 
// import { Button } from '../ui/button';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader
// } from "@/components/ui/dialog";
// import { FcGoogle } from "react-icons/fc";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { googleLogout, useGoogleLogin } from '@react-oauth/google';
// import axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginSuccess, logout } from '../../redux/authSlice';

// function Header() {
//   const dispatch = useDispatch();
//   const users = useSelector(state => state.auth.user); // Ensure correct state path
//   const [openDialog, setOpenDialog] = useState(false);
  
//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user'));
//     if (storedUser) {
//       dispatch(loginSuccess({ user: storedUser }));
//     }
//   }, [dispatch]);

//   const login = useGoogleLogin({
//     clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
//     redirectUri: "https://ai-trip-planner-woad-six.vercel.app",
//     onSuccess: (codeResp) => GetUserProfile(codeResp),
//     onError: (error) => {
//       console.log("Login Error:", error);
//       alert("Error logging in.");
//     },
//   });

//   const GetUserProfile = async (tokenInfo) => {
//     try {
//       const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
//         headers: {
//           Authorization: `Bearer ${tokenInfo?.access_token}`,
//           Accept: 'application/json',
//         },
//       });

//       const userData = {
//         user: response.data,
//         accessToken: tokenInfo?.access_token,
//         refreshToken: tokenInfo?.refresh_token
//       };

//       // Store in Redux and LocalStorage
//       dispatch(loginSuccess(userData));
//       setOpenDialog(false);
//     } catch (error) {
//       console.error("Error fetching Google Profile:", error);
//     }
//   };

//   return (
//     <div className='p-3 shadow-sm flex justify-between items-center px-1 sm:px-5'>
//       <img src="/MainLogo.svg" width="80px" height="100px" />
//       <div>
//         {users ? (
//           <div className='flex items-center gap-3'>
//             <a href='/create-trip'>
//               <Button variant='outline' className="rounded-full group-hover:opacity-100 transition-opacity duration-300 text-black bg-gray-200">
//                 Create Trip
//               </Button>
//             </a>
//             <a href='/my-trips'>
//               <Button variant='outline' className="rounded-full group-hover:opacity-100 transition-opacity duration-300 text-black bg-gray-200">
//                 My Trips
//               </Button>
//             </a>
//             <Popover>
//               <PopoverTrigger>
//                 <Avatar className="h-[35px] w-[35px]">
//                   <AvatarImage src={users?.picture} alt={users?.name || "User"} />
//                   <AvatarFallback>{users?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
//                 </Avatar>
//               </PopoverTrigger>
//               <PopoverContent>
//                 <h2
//                   className='cursor-pointer'
//                   onClick={() => {
//                     googleLogout();
//                     dispatch(logout()); // Corrected function
//                   }}
//                 >
//                   Logout
//                 </h2>
//               </PopoverContent>
//             </Popover>
//           </div>
//         ) : (
//           <Button onClick={() => setOpenDialog(true)} variant='outline' className="rounded-full group-hover:opacity-100 transition-opacity duration-300 text-black bg-gray-200">
//             Sign In
//           </Button>
//         )}
//       </div>
//       <Dialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogDescription> Please sign in to generate your trip plan. </DialogDescription>
//             <div className="mt-4">
//               <Button onClick={() => login()}>
//                 <FcGoogle className="mr-2 text-xl" />
//                 Sign in with Google
//               </Button>
//             </div>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export default Header;
