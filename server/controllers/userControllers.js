import imagekit from "../config/imagekit.js"
import User from "../models/user.js"
import fs from "fs"

// get user data 
// export const getUserData = async (req, res) => {
//     try {
//         const { userId } = req.auth()
//         const user = await User.findById(userId)

//         if (!user) {
//             return res.json({ success: false, message: "user not found" })
//         }
//         res.json({ message: true, user })
//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.userId)

    if (!user) {
      return res.json({ success: false, message: "User not found" })
    }

    res.json({ success: true, user })
  } catch (error) {
    console.error(error)
    res.json({ success: false, message: error.message })
  }
}


// update user data

export const updateUserData = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { username, bio, location, full_name } = req.body

        const tempUser = await User.findById(userId)

        !username && (username = tempUser.username)

        if (tempUser.username !== username) {
            const user = User.findOne({ username })
            if (user) {
                // we all not change the usrname if is already taken
                username = tempUser.username
            }
        }

        const updatedData = {
            username,
            bio,
            location,
            full_name
        }
        const profile = req.files.profile && req.files.profile[0]
        const cover = req.files.cover && req.files.cover[0]


        // (for profile_picture) this is for uploaded the image on the iamgekit and get the image url ot save the iamge url in the mongodb database
        if (profile) {
            const buffer = fs.readFileSync(profile.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: profile.orginalname,
            })
            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: auto },
                    { format: "webp" },
                    { width: '512' }
                ]
            })
            updateUserData.profile_picture = url
        }


        // for cover photo
        if (cover) {
            const buffer = fs.readFileSync(cover.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: profile.orginalname,
            })
            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: auto },
                    { format: "webp" },
                    { width: '1280' }
                ]
            })
            updateUserData.cover_photo = url
        }

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true })
        res.json({ success: true, user, message: "Profile updated successfully " })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// find users using usernae

export const discoverUser = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { input } = req.body

        const allUsers = await User.find(
            {
                $or: [
                    { username: new RegExp(input, "i") },
                    { email: new RegExp(input, "i") },
                    { full_name: new RegExp(input, "i") },
                    { location: new RegExp(input, "i") },

                ]
            }
        )

        const filterUsers = allUsers.filter(user => user.id !== userId)

        res.json({ success: true, users: filterUsers })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// follow user 

export const followUser = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { id } = req.body

        const user = await User.findById(userId)

        // ceck taht the man you want to follow is that you already follow or not
        if (user.following.includes(id)) {
            return res.json({ success: false, message: "You are already following this user" })
        }

        // in user schema following will be get the suer id by push
        user.following().push(id)
        await user.save()

        // also update the followrs array whome you are follwing
        const toUser = await User.findById(id)
        toUser.followers.push(userId)
        await toUser.save()

        res.json({ success: true, message: "you are follwoing this user" })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// unfollow user
export const unfollowUser = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { id } = req.body

        const user = await User.findById(userId)
        // then remove the id that you want to unfollow
        user.following = user.following.filter(user => user !== id)
        // and then save
        await user.save()


        //  also has to remove the person following array taht you want unfollw, like if he had 10 followrs before, after you unfollow him his followrs will be 9
        const toUser = await User.findById(userId)
        toUser.followers = toUser.followers.filter(user => user !== userId)
        // and then save
        await toUser.save()

        res.json({ success: true, message: "you no longet following user" })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}