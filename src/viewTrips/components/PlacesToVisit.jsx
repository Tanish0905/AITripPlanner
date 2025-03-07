import React from 'react'
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit ( { trip } ) {
    console.log('PlacesToVisit',trip?.Itinerary);
    
    return (
        <div>
            <h2 className='font-bold text-lg'>Places to Visit</h2>    
            <div>
                {trip?.Itinerary?.map( ( item, index ) => (
                    <div>
                        <h2 className='font-medium text-lg' key={ index }>Day { item?.Day } </h2>
                        <div className="grid md:grid-cols-2 gap-5">
                            { item?.Places?.map( ( place,index ) => ( 
                                <div key={index}>
                                    {/* <h2 className='font-medium text-sm text-orange-600'>{place?.Day}</h2> */}
                                    <PlaceCardItem place={ place } />
                                </div>
                            ) ) }
                        </div>
                    </div>
                 ))}
            </div>
        </div>
    )
}

export default PlacesToVisit