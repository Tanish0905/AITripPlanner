import React from 'react'
import { HotelCardItem } from './HotelCardItem'

function Hotels ( { trip } ) {
  return (
    <div>
      <h2 className='font-bold text-xl mt-5'>Hotel Recommendation</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5'>
        {trip?.travelPlan?.hotels?.map( ( hotel ) => (
          <HotelCardItem hotel={hotel}/>
          //   <img src="/MainLogo.svg" className='rounded-xl/>
        ))}
      </div>
    </div>
  )
}

export default Hotels 