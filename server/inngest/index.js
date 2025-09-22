import { Inngest } from "inngest";
import User from "../models/user.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "ali-book" });


// inngest function to save user data to a database
const syncUserCreation = inngest.createFunction(
    {id: `sync-user-from-clerk`},
    {event: 'clerk/user.created'},
    async ({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        let username = email_addresses[0].email_address.split('@')[0]
        //  console.log("Incoming event:", JSON.stringify(event.data, null, 2));


        // check availvilty for user name
        const user = await User.findOne({username})

        if(user) {
            username = username + Math.floor(Math.random() + 10000)
        }

        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            full_name : first_name + " " + last_name,
            profile_picture: image_url,
            username
        }

        await User.create(userData)
    }
)


// inngest function to update user data in database

const syncUserUpdatetion = inngest.createFunction(
    {id: `update-user-from-clerk`},
    {event: 'clerk/user.updated'},
    async ({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
         

        // 
        const updateUserData = {
            email: email_addresses[0].email_address,
            full_name: first_name + " " + last_name,
            profile_picture: image_url
        }

        await User.findByIdAndUpdate(id, updateUserData)


    }
)

// inngest function to delate user data in database

const syncUserDelation = inngest.createFunction(
    {id: `delete-user-from-clerk`},
    {event: 'clerk/user.deleted'},
    async ({event}) => {
        const {id} = event.data
         console.log("user delted", id)
        await User.findByIdAndDelete(id)
        console.log("user delted")

    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdatetion,
    syncUserDelation
];