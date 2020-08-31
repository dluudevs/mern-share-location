import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      name: 'Delvv',
      image:
        'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      places: 3,
    },
  ];

  return <UsersList items={USERS} />;
};

export default Users;
