import React from 'react'

import PlaceList from '../components/PlaceList'

const DUMMY_PLACES = [
  {
    id: 'pl',
    title: 'Empire State Building',
    description: 'One of the most famous skyscrapers in the world!',
    imageUrl: 'https://www.esbnyc.com/sites/default/files/styles/small_feature/public/2019-10/home_banner-min.jpg?itok=uZt-03Vw',
    address: '20 W 34th St, New York, NY 10001, United States',
    location: { lat: 40.7484, lng: -73.9857},
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'One of the most famous skyscrapers in the world!',
    imageUrl: 'https://www.esbnyc.com/sites/default/files/styles/small_feature/public/2019-10/home_banner-min.jpg?itok=uZt-03Vw',
    address: '20 W 34th St, New York, NY 10001, United States',
    location: { lat: 40.7484, lng: -73.9857},
    creator: 'u2'
  }
]

const UserPlaces = () => {
  return (
    <PlaceList items={DUMMY_PLACES}/>
  )
}

export default UserPlaces