## CSE 136 HW 3

Project located @ https://x-marx-the-spot.ml/ (for HTTPS) and http://54.218.36.167/

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
  - /login and /signup have been cached via service worker. It works locally but not on server because of secure-origins issue (i.e. Need HTTPS on AWS server).
  - To get service workers to work on the AWS server, we'd need HTTPS/certification, which we couldn't obtain given our current constraints.
  - We believe a bookmarking application wouldn't be very useful offline  (i.e. we can't go to bookmark links if we are offline), so
    we implemented service workers but did not see any need to go beyond the login/signup page to display bookmark information. 
    Thus, to show that we can implement service worker, we cache only the login and signup pages in offline mode. 
    - Proof of implementation can be seen in the following images:     
      - https://github.com/ajw029/X-Marx-The-Spot-Server/blob/master/ServiceWorkerActive.PNG
      - https://github.com/ajw029/X-Marx-The-Spot-Server/blob/master/ServiceWorkerActiveOffline.PNG
      - https://github.com/ajw029/X-Marx-The-Spot-Server/blob/master/ServiceWorkerLocal.PNG
- bundle.js Minification
  - We have a packager that bundles all the React components into one js file.
    Initially it was 4mb, but we minified it. 

### Main Features

- Create an account
  - going to http://54.218.36.167/ prompts you to either login or go to signup page
- Login
  - Going to http://54.218.36.167/ (home)
- Logout
  - top right (door with right arrow icon)
- Change a password
  - http://54.218.36.167/bookmarx/settings
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
  - http://54.218.36.167/bookmarx/settings
  - export saves a JSON file (backup_<datestamp>.json)
  - to import copy paste JSON file contents into provided input area
    - error messages if user modifies backup in a way that breaks json structure or content integrity
- Speed
  - caching
  - minification
  - compression
