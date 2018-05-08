import { ref, firebaseAuth } from '../constants/constants'


export function auth (email, pw, renter) {
  return (
    firebaseAuth().createUserWithEmailAndPassword(email, pw)
    .then(saveUser));
}

export function logout () {
  return firebaseAuth().signOut()
}

export function login (email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw)
}

export function resetPassword (email) {
  return firebaseAuth().sendPasswordResetEmail(email)
}

export function saveUser (user) {
  //console.log("renter: "+ renter)
  //console.log("user.renter: "+ user.renter)
  
  return ref.child(`users/${user.uid}/info`)
    .set({
      email: user.email,
      uid: user.uid
    })
    .then(() => user)
}
