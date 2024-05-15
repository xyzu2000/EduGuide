import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC3VoP9GMp3I3Q4k4e0Dz8NjsICgKmO-fg",
    authDomain: "test-project-2b03e.firebaseapp.com",
    projectId: "test-project-2b03e",
    storageBucket: "test-project-2b03e.appspot.com",
    messagingSenderId: "77396752744",
    appId: "1:77396752744:web:7f3b4b683274507d85bedd"
};
// inicjalizacja firebase
initializeApp(firebaseConfig)

// dostep do bazy danych
export const db = getFirestore()


// ------- Jak uzyskac dostep do danych ------- \\
// dostep do danych kolekcji
// export const getBooks = () =>
//     getDocs(colRef)
//         .then((snapshot) => {
//             let books = []
//             snapshot.docs.forEach((doc) => { // elements.docs - uzyskuje wszytskie dokumenty
//                 books.push({ ...doc.data(), id: doc.id })  // doc.data() - uzyskuje dane
//             })
//             return books
//         })
//         .catch(err => {
//             console.log(err.message);
//         })