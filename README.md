## CSE 136 HW 3

Project located @ https://x-marx-the-spot.ml/ (for HTTPS) and http://x-marx-the-spot.ml/ (for HTTP)

### Things each Team Member Worked On
- Anthony Wang
  - Anthony worked on most of the front end development and design for the Bookmarx app as well as porting the web app over to React and EJS. After the first iteration, he also made the app responsive and mobile friendly. Anthony also helped out with the development of the server's APIs, endpoints, and the SQL queries for the postback and AJAX versions. Anthony also migrated most of the app to the AJAX version when porting it over to React. Anthony tried implementing the service worker, but had issues caching the main page; thus, he added the service worker to the login and signup page. For the last iteration, Anthony helped fix some bugs on the front end and polished some of the UI and interaction.
- Leo Wong
  - Worked on error logging, 404 pages, robots.txt, and general bug fixes for both client and server-side. On iteration 1, started the     AWS server, robots.txt, error logging. On iteration 2, worked on 404 page and general bug fixes. On iteration 3, did Mixpanel    tracking and fixed some of the things that we needed to polish up from the 2nd iteration feedback (i.e. auto-login from register).
- Hui Chen
  -Worked on some of back-end functionality in first two iteration,including routing and sql queries etc.Helped with bug fixing and testing all around.

### Revision 3

#### Optimizations
- Analytics
  - Use of Mixpanel client-side scripts to track usage of the app
  - Tracking unique users by their id in the accounts table.
  - Information tracked: Favoriting Bookmarks, Deleting bookmarks, Opening links (+the URL link), etc.
  - Example analytics information:
      - https://github.com/ajw029/X-Marx-The-Spot-Server/blob/master/MixpanelSegmentationInfo.PNG
      - https://github.com/ajw029/X-Marx-The-Spot-Server/blob/master/MixpanelPeopleInfo.PNG
- Indexing
  - 3 of the tables have indices on them in order to speed up some queries.
- Service Worker
  - /login and /signup have been cached via service worker.
  - To get service workers to work on the AWS server, we'd need HTTPS/certification, which we were able to do in time (edit).
  - Once you visit the site (https://x-marx-the-spot.ml/), we log to the console whether or not the service worker is online and working.
  - We believe a bookmarking application wouldn't be very useful offline  (i.e. we can't go to bookmark links if we are offline), so
    we implemented service workers but did not see any need to go beyond the login/signup page to display bookmark information.
    Thus, to show that we can implement service worker, we cache only the login and signup pages in offline mode.
    - Proof of implementation locally can be seen in the following images:     
      - https://github.com/ajw029/X-Marx-The-Spot-Server/blob/master/ServiceWorkerActive.PNG
      - https://github.com/ajw029/X-Marx-The-Spot-Server/blob/master/ServiceWorkerActiveOffline.PNG
      - https://github.com/ajw029/X-Marx-The-Spot-Server/blob/master/ServiceWorkerLocal.PNG
- bundle.js Minification
  - We have a packager that bundles all the React components into one js file.
    Initially it was 4mb, but we minified it.

### Main Features

- Create an account
  - going to https://x-marx-the-spot.ml/ prompts you to either login or go to signup page
- Login
  - Going to https://x-marx-the-spot.ml/ (home)
- Logout
  - top right (door with right arrow icon)
- Change a password
  - https://x-marx-the-spot.ml/bookmarx/settings
- Add a Bookmark
  - use Floating Action Button (FAB) (Circle with plus icon) in bottom right
- Edit a Bookmark
  - Edit button in each bookmark card
- Delete a Bookmark
  - x in top right of each bookmark card
- List your Bookmarks
  - in home, select a folder, which will list the bookmarks in that folder
- Visit a Bookmark
  - Click anywhere in a bookmark card (besides, edit, x, or star)
- Sort your Bookmarks
  - Use dropdown in search bar
- Search your Bookmarks
  - Search bar on top of page
  - can search using name, description, url, or keyword
- Categorize your bookmarks (Folder and/or Tag Style)
  - When making a bookmark, user must provide folder and tag
  - bookmarks used to organize view (Default provided on fresh account)
  - tags can be searched
- Star/Unstar a bookmark
  - star icon in bottom right of each bookmark card
- Import/Export list of bookmarks (optional for phase #1)
  - https://x-marx-the-spot.ml/bookmarx/settings
  - export saves a JSON file (backup_<datestamp>.json)
  - to import copy paste JSON file contents into provided input area
    - error messages if user modifies backup in a way that breaks json structure or content integrity
- Speed
  - caching
  - minification
  - compression
- Security
  - HTTPS/SSL encryption
