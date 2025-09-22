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
        // let username = email_addresses[0].email_address.split('@')[0]
        //  console.log("Incoming event:", JSON.stringify(event.data, null, 2));


        // check availvilty for user name
        // const user = await User.findOne({username})

        // if(user) {
        //     username = username + Math.floor(Math.random() + 1000)
        // }

        const userData = {
            _id: id,
            // email: email_addresses[0].email_address,
            email: email_addresses,
            full_name : first_name + " " + last_name,
            profile_picture: image_url,
            username: "ali"
        }

        await User.create(userData)
    }
)



const syncUserCreationn = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      // Normalize event data
      const data = event?.data ?? {};
      console.log("Incoming user.created data:", JSON.stringify(data, null, 2));

      const id = data.id;
      const first_name = data.first_name ?? "";
      const last_name = data.last_name ?? "";
      const email_addresses = data.email_addresses ?? [];
      const image_url = data.image_url ?? "";

      if (!id || !email_addresses.length) {
        throw new Error("Missing required fields in Clerk event");
      }

      // Generate initial username from email
      let baseUsername = email_addresses[0].email_address.split("@")[0].replace(/\W/g, "").toLowerCase();
      let username = baseUsername;

      // Ensure username is unique
      let attempt = 0;
      while (await User.findOne({ username })) {
        attempt++;
        username = `${baseUsername}${Math.floor(Math.random() * 1000)}${attempt}`;
        if (attempt > 10) break; // fail-safe to avoid infinite loop
      }

      const userData = {
        _id: id,
        email: email_addresses[0].email_address,
        full_name: `${first_name} ${last_name}`.trim(),
        username,
        profile_picture: image_url,
      };

      await User.create(userData);
      console.log("User successfully created:", userData);
    } catch (err) {
      console.error("syncUserCreation error:", err);
      throw err;
    }
  }
);

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
         
        await User.findByIdAndDelete(id)

    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreationn,
    syncUserUpdatetion,
    syncUserDelation
];