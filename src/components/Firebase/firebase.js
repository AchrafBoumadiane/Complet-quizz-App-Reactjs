import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

class Firebase {
    constructor(){
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.firestore();
    }

    // inscription
    signUpUser = (email, password) => 
        this.auth.createUserWithEmailAndPassword(email, password);
    

    // Connexion
    loginUser = (email, password) => 
        this.auth.signInWithEmailAndPassword(email, password);
    

    // Déconnexion
    signOutUser = () => 
        this.auth.signOut();

    // Récupération de mot de passe
    passwordReset = email =>
        this.auth.sendPasswordResetEmail(email);
    
    user = uid => this.db.doc(`users/${uid}`);
}

export default Firebase;