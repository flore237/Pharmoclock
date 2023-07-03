import { createContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const lastConnexionDate = Timestamp.fromDate(
    new Date("December 25, 2022 23:15:30")
  );
  // console.log(lastConnexionDate.toDate());
  const signup = (email, password, firstName, name, phoneNumber, isAdmin) =>
    createUserWithEmailAndPassword(auth, email, password).then(
      async (userCredential) => {
        // console.log(lastConnexionDate.toDate());
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          firstName: firstName,
          lastName: name,
          phoneNumber: phoneNumber,
          lastConnexion: lastConnexionDate,
          isAdmin: isAdmin,
          firstConnexion: true,
        });
        // console.log(lastConnexionDate.toDate());
        await signOut(auth);
      }
    );

  const signin = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  useEffect(() => {
    if (user) {
      let today = new Date();
      let lastConnexion = null;
      today = today.toDateString();
      const getUser = async (userId) => {
        const docSnap = await getDoc(doc(db, "users", userId));
        const firstConnexion = docSnap.data().firstConnexion;
        lastConnexion = docSnap
          .data()
          .lastConnexion.toDate()
          .toDateString("en-GB");
        // console.log(lastConnexion);
        // console.log(today);
        if (today === lastConnexion || firstConnexion) {
          // console.log(
          //   "L'utilisateur s'est déja connecté aujourd'hui ne rien faire"
          // );
          if (firstConnexion) {
            await updateDoc(doc(db, "users", userId), {
              firstConnexion: false,
            });
            // console.log("changement de la valeur firstconnexion");
          }
        } else {
          // console.log("Il faut mettre à jour la date de derniere connexion");
          await updateDoc(doc(db, "users", userId), {
            lastConnexion: serverTimestamp(),
          });
          const docRef = await addDoc(collection(db, "presences"), {
            heureArrivee: serverTimestamp(),
            uid: user.uid,
          });
          // console.log(docRef.id);
          await updateDoc(doc(db, "users", userId), {
            todayPresenceId: docRef.id,
          });
          console.log(
            "Il faut créer la présence avec l'uid de l'utilisateur,la date d'aujourd'hui et l'heure d'arrivee"
          );
        }
        // console.log(
        //   docSnap.data().lastConnexion.toDate().toDateString("en-GB")
        // );
        // console.log(today.toDateString());
        setUserData(docSnap.data());
      };
      getUser(user.uid);
      // console.log(today)
      // console.log(lastConnexion)
    }
  }, [user]);

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingData(false);
    });

    return unsuscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signup, signin, userData, setUserData }}
    >
      {!loadingData && children}
    </AuthContext.Provider>
  );
}
