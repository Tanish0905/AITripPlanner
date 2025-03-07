"use client";
import { StrictMode, startTransition } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import * as React from "react"
import App from './App.jsx';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Header from './components/custom/Header.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from './components/ui/toaster.jsx';

import Viewtrip from './viewTrips/[tridId]';
import CreateTrip from './createTrip';
import MyTrips from './myTrips';

// ✅ Layout Component to ensure Header is always inside Router context
const Layout = () => (
  <>
    <Header />
    <Outlet /> {/* This will render the child routes */}
  </>
);

// ✅ Define Routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Wrap all pages inside Layout
    children: [
      { path: '', element: <App /> },
      { path: 'create-trip', element: <CreateTrip /> },
      { path: 'view-trip/:tripId', element: <Viewtrip /> },
      { path: 'my-trips', element: <MyTrips /> },
      { path: '/create-trip', element: <CreateTrip /> },
      { path: '/view-trip/:tripId', element: <Viewtrip /> },
      { path: '/my-trips', element: <MyTrips /> },
    ],
  }
], {
  future: {
    v7_startTransition: true, // ✅ Ensure this flag is set
  },
});

const root = createRoot(document.getElementById('root'));

startTransition(() => {
  root.render(
    <StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
        <Toaster />
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </StrictMode>
  );
});
// import { StrictMode, startTransition } from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import { Toaster } from "@/components/ui/toaster";
// import App from './App.jsx';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import CreateTrip from './create-trip';
// import Header from './components/custom/Header';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import Viewtrip from './view-trip/[tridId]';
// import MyTrips from './my-trips';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />
//   },
//   {
//     path: '/create-trip',
//     element: <CreateTrip />
//   }, {
//     path: '/view-trip/:tripId',
//     element:<Viewtrip/>
//   },
//   {
//     path: '/my-trips',
//     element:<MyTrips/>
//   }
// ], {
//   future: {
//     v7_startTransition: true, // ✅ Ensure this flag is set
//   },
// });

// const root = createRoot(document.getElementById('root'));

// startTransition(() => {
//   root.render(
//     <StrictMode>
//       <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
//         <Header />
//         <Toaster />
//         <RouterProvider router={router} />
//       </GoogleOAuthProvider>
//     </StrictMode>
//   );
// });
