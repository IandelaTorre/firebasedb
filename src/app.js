import { initializeApp } from 'firebase/app'
import { getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup  } from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyAfu4zjsl_g-ZL1Ztsx-1-NIW_KprTEhwY",
    authDomain: "todo-61525.firebaseapp.com",
    projectId: "todo-61525",
    storageBucket: "todo-61525.appspot.com",
    messagingSenderId: "425034503432",
    appId: "1:425034503432:web:46007dc1c238136e4f08bd"
  }
//init firebase app
initializeApp(firebaseConfig);

//init services
const db = getFirestore()
const auth = getAuth()
//googleAuth
const provider = new GoogleAuthProvider();

//collection ref
const colRef = collection(db, 'proof')//base de datos y nombre de la coleccion. 

// queries
//para obtenerlos en orden se pone el primer atributo  que se le puso al index en el where y el otro atributo del index en el orderBy
const q = query(colRef, orderBy('createdAt'))


//get collection data
/*getDocs(colRef)
  .then(snapshot => {
    // console.log(snapshot.docs)
    let books = []
    snapshot.docs.forEach(doc => {
      books.push({ ...doc.data(), id: doc.id })
    })
    console.log(books)
  })
  .catch(err => {
    console.log(err.message)
  })//importar getDocs */ 

//real time collection data  
const unsubCol = onSnapshot(q, (snapshot) => {
  let books = []
    snapshot.docs.forEach((doc) => {
      books.push({ ...doc.data(), id: doc.id })
    })
    console.log(books)
})  



  //adding documents
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault() 

  addDoc(colRef, {
    //properties and values
    nombre: addBookForm.nombre.value,
    sexo: addBookForm.sexo.value,
    createdAt: serverTimestamp()
  })
  .then(() => {
    addBookForm.reset()
  })
})

//deleting documents
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'proof', deleteBookForm.id.value)

  deleteDoc(docRef)
    .then(() => {
      deleteBookForm.reset()
    })

})

//get a single document o busqueda de un documento
//los parametros son: basededatos, el libro, referencia
/*const docRef = doc(db, 'proof', 'vsneGII46WBumjGB8Yf9')
const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id)
})*/

//updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const docRef = doc(db, 'proof', updateForm.id.value)
  updateDoc(docRef, {
    nombre: 'updated title',
  })
  .then(() => {
    updateForm.reset()
  })
})

//sigin users up
const singupForm = document.querySelector('.signup')
singupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = singupForm.email.value
  const password = singupForm.password.value
  const nombre = singupForm.nombre.value
  const telefono = "5583962820"
  if(singupForm.password.length < 6){
    console.log('contraseña corta')
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      cred.user.displayName = nombre;
      cred.user.phoneNumber = telefono;
      //console.log('user created: ', cred.user)
      singupForm.reset()
    })
    .catch((err) => {
      console.log(err.message)
    })
})

//datos usuario



//loggin out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      //console.log('the user signed out')
    })
    .catch((err) => {
      console.log(err.message)
    })
})

//loggin in 
const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      //console.log('user loggin in: ', cred.user)
      loginForm.reset()
    })
    .catch((err) => {
      console.log(err.message)
    })
})

//subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log('user status changed: ', user)
  if(user == null){
    document.getElementById('e').innerHTML = "indefinido jaja";
    document.getElementById('n').innerHTML = "indefinido jaja";
    document.getElementById('s').innerHTML = "indefinido jaja";
  }else{
    document.getElementById('e').innerHTML = user.email;
    document.getElementById('n').innerHTML = user.displayName;
    //document.getElementById('s').innerHTML = user.sexo;
  }

    
  
})

//unsubcribing changes (auth & db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
  console.log('unsubscribing')
  unsubCol()
  unsubDoc()
  unsubAuth()
})

const Glogin = document.querySelector('.glogin')
Glogin.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((re) => {
      console.log(re)
    })
    .catch((err) => {
      console.log(err)
    })
})