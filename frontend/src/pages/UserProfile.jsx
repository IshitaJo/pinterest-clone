import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { set } from 'mongoose';
import { PinData } from '../context/PinContext';
import PinCard from '../components/PinCard';
import { UserData } from '../context/UserContext';

const UserProfile = ({ user: loggedInUser }) => {
  const params = useParams();
  // Initialize user as null to indicate data is not fetched yet.
  const [user, setUser] = useState([]);

  async function fetchUser() {
    try {
      const { data } = await axios.get(`/api/user/${params.id}`);
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  }

  const [isFollow, setIsFollow] = useState(false);
  const {followUser} = UserData();

  const followHandler = () =>{
    setIsFollow(!isFollow);
    followUser(user._id, fetchUser);
  }

  const followers = user.followers ;
  useEffect(()=>{
    if(followers && followers.includes(loggedInUser._id)){
      setIsFollow(true);
    }
  },[user]);

  const {pins} = PinData();
  let userPins;
  if(pins){
      userPins = pins.filter((pin) => pin.owner === user._id);
  }

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  return (
    <div>
      {user ? (
        <div className="flex flex-col items-center justify-center">
          <div className="p-6 w-full">
            <div className="flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-3xl text-gray-700">
                  {user.name && user.name.slice(0, 1)}
                </span>
              </div>
            </div>
            <h1 className="text-center text-2xl font-bold mt-4">{user.name}</h1>
            <p className="text-center text-gray-600 mt-2">{user.email}</p>
            <div className="flex justify-center items-center text-center gap-3 text-gray-600 mt-2">
              {user.followers && <p>{user.followers.length} followers</p>}
              {user.following && <p>{user.following.length} following</p>}
            </div>
            <div className="flex justify-center mt-4 space-x-2">
              <button 
                onClick={followHandler}
                className='bg-gray-200 px-4 py-2 rounded hover:cursor-pointer'
              >
              {isFollow ? "Unfollow" : "Follow"}
              </button>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {userPins && userPins.length > 0 ? (
                userPins.map((e)=> <PinCard key={e._id} pin={e} />)
              ):(
                <p className='text-gray-600'>No Pins Found</p>
              )
              }
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;