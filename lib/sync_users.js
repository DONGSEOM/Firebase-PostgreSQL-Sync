const firebase = require("firebase-admin");
const utility = require("./utility.js");

function deconstructFirebaseUser(id, user, useDefaultValue) {
  const set = utility.enterIfValid;
  const val = (x) => useDefaultValue?x:undefined;

  let dbUser = {};

  dbUser = set(dbUser, "id", id);
  dbUser = set(dbUser, "imageURL", user["imageURL"] || val(""));
  dbUser = set(dbUser, "username", user["username"] || val(""));
  dbUser = set(dbUser, "x", user["x"] || val(""));
  dbUser = set(dbUser, "y", user["y"] || val(""));

  const names = utility.deconstructFirebaseName(user["name"] || val(""));
  dbUser = set(dbUser, "username", user["username"] || val(""));

  console.log(dbUser);

  return dbUser;
}

function insertUser(client, id, user) {
  const dbUser = deconstructFirebaseUser(id, user, true);

                //Change query!
  client.query("INSERT INTO public.user (id,username,geom) VALUES ($id, $username, ST_SetSRID(ST_MakePoint($x,$y),4326))", dbUser, (error, results, fields) => {
    if (error !== null) console.error(error);
  });
}

function updateUser(client, id, user) {
  const dbUser = deconstructFirebaseUser(id, user);

  client.query("UPDATE public.user SET ? WHERE user_id = ?", [dbUser, id], (error, results, fields) => {
    if (error !== null) console.error(error);
  });
}

function deleteUser(client, id) {
  client.query("DELETE FROM public.user WHERE user_id = ?", id, (error, results, fields) => {
    if (error !== null) console.error(error);
  });
}

function setup(firebaseDb, client) {
  // Clear users.
  console.log("Resetting table user...");
  client.query("TRUNCATE TABLE public.user", (error, results, fields) => {
    if (error !== null) console.error(error);
  });


  console.log("connecting to firebase...");
  const userRef = firebaseDb.ref("Users");

  userRef.on("child_added", (snapshot) => {
    const key = snapshot.key;
    const user = snapshot.val();

    console.log("inserting user: " + user.name);
    insertUser(client, key, user);

    console.log("done");
  });

  userRef.on("child_changed", (snapshot) => {
    const key = snapshot.key;
    const user = snapshot.val();

    console.log("updating user: " + user.name);
    updateUser(client, key, user);

    console.log("done");
  });

  userRef.on("child_removed", (snapshot) => {
    const key = snapshot.key;

    console.log("deleting user of key: " + key);
    deleteUser(client, key);

    console.log("done");
  });

}

exports.setup = setup;
