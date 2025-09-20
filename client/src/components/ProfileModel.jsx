import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Pencil } from 'lucide-react'

const ProfileModel = ({setShowEdit}) => {

    const user = dummyUserData
    const [editForm, setEditForm] = useState({
        username: user.username,
        bio: user.bio,
        location: user.location,
        profile_pictue: null,
        cover_photo: null,
        full_name: user.full_name
    })

    const handleSaveProfile = async(e) =>{
        e.preventDefault()
    } 

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-100 h-screen overflow-y-scroll bg-black/50'>
        <div className='max-w-2xl sm:py-6 mx-auto'>
         <div className='bg-white rounded-lg shadow p-6'>
            <h1 className='text-2xl font-bold text-gray-500 mb-6'>Edit Profile</h1>
            <form className='space-y-4' onSubmit={handleSaveProfile}>
                {/* profile picture */}
                <div className='flex flex-col items-start gap-3'>
                    <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor="profile_picture">
                        Profile Picture
                        <input hidden type="file" accept='image/*'   className='w-full p-3 border border-gray-200 rounded-lg' id="profile_picture" onChange={(e) => setEditForm({...editForm, profile_pictue: e.target.files[0]})} />
                          <div className='group/profile relative'>
                          <img src={editForm.profile_pictue ? URL.createObjectURL(editForm.profile_pictue) : user.profile_picture } alt="" className='w-24 h-24 rounded-full object-cover mt-2' />
                          <div className='absolute hidden group-hover/profile:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-full items-center justify-center'>
                            <Pencil className='w-5 h-5  text-white' />
                          </div>
                         </div>   
                   </label>
                </div>

                {/* cover phot */}
                <div className='flex flex-col items-start gap-3'>
                    <label htmlFor="cover_photo" className='block text-sm font-medium text-gray-700 mb-1'>
                    Cover Photo
                    <input hidden type="file" accept='image/*' className='w-full p-3 border border-gray-200 rounded-lg' id="cover_photo" onChange={(e) => setEditForm({...editForm, cover_photo: e.target.files[0]})} />
                    <div className='group/cover relative'>
                        <img src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : user.cover_photo} alt="" className='w-80 h-40 rounded-lg bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 object-cover mt-2' />

                        <div className='absolute hidden group-hover/cover:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded items-center justify-center'>
                              <Pencil className='w-5 h-5  text-white' />
                        </div>
                    </div>
                    </label>
                </div>

                {/* other  */}
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        name
                    </label>
                    <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' placeholder='plese enter your full name' onChange={(e) => setEditForm({...editForm, full_name: e.target.value})} value={editForm.full_name} />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        username
                    </label>
                    <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' placeholder='plese enter your username' onChange={(e) => setEditForm({...editForm, username: e.target.value})} value={editForm.username} />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        bio
                    </label>
                    <textarea className='w-full p-3 border border-gray-200 rounded-lg' placeholder='plese enter your bio' onChange={(e) => setEditForm({...editForm, bio: e.target.value})} value={editForm.bio} rows={3} />
                </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        location
                    </label>
                    <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' placeholder='plese enter your location' onChange={(e) => setEditForm({...editForm, location: e.target.value})} value={editForm.location} />
                </div>

                <div className='flex justify-end space-x-3 pt-6'>
                    <button  className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors' onClick={() => setShowEdit(false)}>Cancel</button>
                    <button type='submit' className='px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition cursor-pointer'>Save Changes</button>
                </div>
            </form>

         </div>
        </div>

    </div>
  )
}

export default ProfileModel