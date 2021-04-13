## PostgreSQL DB Sync with Firebase Realtime DB

This containing Node JS Script to sync  PostgreSQL DB  with Firebase DB.

## Setup

1. Make sure to install [node and npm](https://nodejs.org/en/download).

2. Run `npm install`

3. On your firebase console, go to your Project Settings page and navigate to Service Accounts.

4. At the bottom, click `Generate New Private Key` button.

5. Move the downloaded json in this folder and rename to `firebase.json`.

6. Change  databaseURL: "https://xx.firebaseio.com" in index.js

7. Chnage your PostgreSQL credentials to index.js.

## Running the application

1. Run `npm start`
