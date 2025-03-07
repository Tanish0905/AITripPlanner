import { db } from '../service/firebaseConfig.jsx' //'@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTripCardItem from './components/UserTripCardItem.jsx';

const MyTrips = () => {
    const navigate = useNavigate();
    const [ userTrips, setUserTrips ] = useState( [] );
    const [ loadtingTrips, setLoadingTrips ] = useState( true );

    const GetUserTrips = async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
        navigate('/');
        return;
    }

    setUserTrips( [] );
    const user = JSON.parse(storedUser);
    if (!user?.email) {
        navigate('/');
        return;
    }

    try {
        setLoadingTrips( true );    
        const q = query(collection(db, 'AITrips'), where('userEmail', '==', user.email));
        const querySnapshot = await getDocs( q );
        
        const tripsSet = new Set(); // Use a Set to prevent duplicates
        const uniqueTrips = [];

        querySnapshot.forEach((doc) => {
            const tripData = { id: doc.id, ...doc.data() }; // Include the document ID for uniqueness
            if (!tripsSet.has(tripData.id)) {
                tripsSet.add(tripData.id);
                uniqueTrips.push(tripData);
            }
        });

        setUserTrips( uniqueTrips );
        console.log('uniqueTrips',uniqueTrips);
        setLoadingTrips(false)
    } catch (error) {
        console.error('Error fetching trips:', error);
    }
    };

    useEffect(() => {
        GetUserTrips();
    }, [] );

    return (
        <div className="sm:px-10 md:px-32 lg:px-56 px-5 mt-10">
            <h2 className='font-bold text-3xl'>My Trips</h2>
            <div className='grid grid-cols-2 mt-10 md:grid-cols-3 gap-5'>
                { loadtingTrips ? [ 1, 2, 3, 4, 5, 6 ].map( ( item, index ) => (
                    <div key={ index } className='h-[220px] w-full bg-slate-200 animate-pulse rounded-xl'>
                        
                    </div>
                ) ) :
                    <>
                        {userTrips?.length == 0 ? <h1>No Trips Found</h1>  : userTrips?.map( ( trip, index ) => (
                            <UserTripCardItem trip={ trip } key={ index } />
                        ) ) }
                    </>
                }
            </div>
        </div>
    )
};

export default MyTrips;
