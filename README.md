# UmbraVault 🌑🔒

![](https://imgur.com/894foBb.gif)

UmbraVault is a command-line application used to upload images to Imgur's CDN for Umbraeus. This is a DevOps tool used to make my life easier and faster to upload content for my websites. The project is **not** accepting forks or PRs as this is just a public repo to showcase for my [portfolio](https://blog.justincarver.work), in which I use this in conjunction with another full-stack site that I created and manage: [Umbraeus.app](https://umbraeus.app)

It simply asks interactive questions to the user, some data verification, then slides the information into a NoSQL Mongo database.

You can fork this repository if you need a quick and easy way to prompt users custom questions to directly import them into a MongoDB instance. You can simply ignore, remove the Imgur related code blocks, and fix the `yargs` options.

Then again, it may just be quicker for you to spin up your own tools... ^:)

## Core Functionality

UmbraVault was built to interface with and upload cureated wallpaper images. It uses the Imgur CDN to host URLs of these images to offload storage, and then will save custom user inputted information into a MongoDB instance using Mongo's Free Atlas cloud clusters.

### **Important!**

-   Make sure to have the appropriate models set up and configured in the `models/` folder before attempting to save information to the database!
-   Verify you have an appropriate `.env` created with the `MONGO_URI` pointing to the appropriate cluster and a `CLIENT_ID` (if using Imgur) field present.
-   If you do want to upload images to Imgur's CDN, after verifying your `CLIENT_ID`, create an `images/` directory (or appropriate) and throw images in there. Make sure to use the correct command-line arguments.
-   Use the `-h` flag to show information about the input and output flag.

After the image has been successfully uploaded into the MongoDB instance, the image will be moved from the `input` folder to the `output` folder, to make it easier for subsequent uploads.

---

I really wanted this project to be interactive, hence the emojis and using `inquirer`, so updates in the future may affect Quality of Life usage to suit the needs for my personal upload workflow. This may change at anytime or when I feel this needs improvements.

### Changelog (2/20/23)

-   Updated code to allow database object to be re-used.
-   Implemented the use of command-line arguments to make it easier to use.
-   Added more error handling.
-   Updated README to include more information.
