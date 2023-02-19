# UmbraVault 🌑🔒

UmbraVault is a command-line application used to upload images to Imgur's CDN for Umbraeus. This is a DevOps tool used to make my life easier and faster to upload content for my websites. The project is **not** accepting forks or PRs as this is just a public repo to showcase for my [portfolio](https://blog.justincarver.work), in which I use this in conjunction with another full-stack site that I created and manage: [Umbraeus.app](https://umbraeus.app)

It simply asks interactive questions to the user, some data verification, then slides the information into a NoSQL Mongo database.

You can fork this repository if you need a quick and easy way to prompt users custom questions to directly import them into a MongoDB instance. You can simply ignore and remove the Imgur related code blocks.

## Core Functionality

UmbraVault was built to interface with and upload cureated wallpaper images. It uses the Imgur CDN to host URLs of these images to offload storage, and then will save custom user inputted information into a MongoDB instance using Mongo's Free Atlas cloud clusters.

### **Important!**

-   Make sure to have the appropriate models set up and configured in the `models/` folder before attempting to save information to the database!
-   Verify you have an appropriate `.env` created with the `MONGO_URI` pointing to the appropriate cluster and a `CLIENT_ID` (if using Imgur) field present.
-   If you do want to upload images to Imgur's CDN, after verifying your `CLIENT_ID`, create an `images/` directory and throw images in there.

---

I really wanted this project to be interactive, hence the emojis and using `inquirer`, so updates in the future may affect Quality of Life usage to suit the needs for my personal upload workflow. This may change at anytime or when I feel this needs improvements.
