import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
  {
    id: 'pl',
    title: 'Empire State Building',
    description: 'One of the most famous skyscrapers in the world!',
    imageUrl:
      'https://www.esbnyc.com/sites/default/files/styles/small_feature/public/2019-10/home_banner-min.jpg?itok=uZt-03Vw',
    address: '20 W 34th St, New York, NY 10001, United States',
    location: { lat: 40.7484, lng: -73.9857 },
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'One of the most famous skyscrapers in the world!',
    imageUrl:
      'https://www.esbnyc.com/sites/default/files/styles/small_feature/public/2019-10/home_banner-min.jpg?itok=uZt-03Vw',
    address: '20 W 34th St, New York, NY 10001, United States',
    location: { lat: 40.7484, lng: -73.9857 },
    creator: 'u2',
  },
];

const UserPlaces = () => {
  // hook returns an object with dynamic segments (eg., the colon)
  // since this component's parent route has a dynamic element in the route, it is used here
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter(places => places.creator === userId)
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
