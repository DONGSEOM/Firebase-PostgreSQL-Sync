const firebase = require("firebase-admin");
const named = require('node-postgres-named');


const syncUsers = require("./lib/sync_users.js");


function firebaseInit() {
  const serviceAccount = require("./firebase.json");

  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "firebase_realtime_url"
  });

  return firebase;
}

function main() {
  const firebaseDb = firebaseInit().database();

  const { Client } = require('pg');

  const client = new Client({
    user: 'postgressql id',
    host: 'postgresql host url',
    database: 'database name',
    password: 'postgresql pw',
    port: '5432'
  })

  named.patch(client);
  client.connect();

  syncUsers.setup(firebaseDb, client);



}

main();
