import React from 'react'
import { HotelCardItem } from './HotelCardItem'

function Hotels ( { trip } ) {
  return (
    <div>
      <h2 className='font-bold text-xl mt-5'>Hotel Recommendation</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 mt-10 xl:grid-cols-4 gap-5'>
        { trip?.travelPlan?.hotels?.length !== 0 ?
          trip?.travelPlan?.hotels?.map( ( hotel, index ) => (
          <HotelCardItem hotel={hotel} key={index}/>
          //   <img src="/MainLogo.svg" className='rounded-xl/>
          ) ) :
          <h2>Sorry, we couldn't find any hotels near this location.</h2>
        }
      </div>
    </div>
  )
}

export default Hotels 