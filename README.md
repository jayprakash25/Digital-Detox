## **YouTube Detoxify**

Youtube Detoxify is a web-app that curates YouTube feed based on the 
user choice. User's will see what they want to see having full control over their content.

## **What does this project do?**

YouTube Detoxify allows users to:
 - Select their topics of videos they want in their feed.
 - View a customized feed based on these topics.
 - Avoid potentially negative or distracting content ultimately providing a more focused enironment for user.

## **Why is this project useful?**

In this digital era, content overload is a real issue and the majority of content is in videos. YouTube detoxify helps by:

 - Avoiding exposure to distracting content.
 - Saving time by presenting only relevant videos.
 - Preventing burn-outs by removing unwanted content from the feed.

## **How do I get Started?**

**Installation**

 **1. **Clone the repository****

    git clone https://github.com/jayprakash25/Digital-Detox.git

**2. Navigate to directory**

    cd Digital-Detox


**3. Install dependencies**

    npm install


**4. Set up environment variables**

## Setting Up the `.env.local` File

To run **YouTube Detoxify** locally, you need to set up environment variables. Here's how to obtain and set the required API keys and tokens.

### 1. **DB_URI**: MongoDB URI
If you're using MongoDB locally, the default URI can be:
  ```
DB_URI="mongodb://localhost:27017"
```
### 2. **GOOGLE_CLIENT_ID** and **GOOGLE_CLIENT_SECRET**: Google OAuth Keys
To enable Google Sign-In:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project.
3. Navigate to **APIs & Services** > **Credentials**.
4. Click **Create Credentials** > **OAuth 2.0 Client IDs**.
5. Choose **Web Application** and add the following redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. Copy the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` and add them to your `.env.local` file:


### 3. Vercel KV Setup
1. Go to the [Vercel dashboard](https://vercel.com/dashboard).
2. Set up **Vercel KV** under **Storage**.
3. Copy the following values from your Vercel KV instance:
   - `KV_REST_API_TOKEN`: Token for read and write access.
   - `KV_REST_API_READ_ONLY_TOKEN`: Token for read-only access.
   - `KV_REST_API_URL`: URL for accessing the KV database.
   - `KV_URL`: Direct URL to your KV store.

Add them to your `.env.local`:


### 4. **NEXTAUTH_SECRET**: NextAuth Secret
Generate a secure random string for NextAuth using the following command:
```bash
openssl rand -base64 32
```

### 5. **YOUTUBE_API_KEY**: YouTube Data API
To get a YouTube API key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **YouTube Data API v3**.
3. Go to **Credentials** > **Create Credentials** > **API Key**.
4. Copy the `YOUTUBE_API_KEY` and add it to your `.env.local`:

---
**5. Start the Development server**

    npm run dev

**Where can I get more help?**

 - if you need more help, you can email us at jpnreddy25@gmail.com

## Contribute

We welcome contributors. Please see our [Contributor Guide](CONTRIBUTING.md) for more details on how to get started.


## Goals of the project

 1. Provide a more productive YouTube environment.
 2. Reduce time wasted on distracting content.
 

## Plan

 - [x] Initial release with basic interest selection and feed curation.
 - [ ] Implement Machine Learning for better content recommendation.
 - [ ] Develop a chrome extension.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Made with ❤ by JP and you all.

 
