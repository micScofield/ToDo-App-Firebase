import firebase from 'firebase'; //using this syntax as we are in development mode. Not ideal for production.
import 'firebase/firestore' 

const firebaseConfig = {
    apiKey: "AIzaSyCvCjILVNGzlVN6jT8jgRy6WS3RG3Zpijw",
    authDomain: "wowlabz-todo.firebaseapp.com",
    projectId: "wowlabz-todo",
    storageBucket: "wowlabz-todo.appspot.com",
    messagingSenderId: "1064551379068",
    appId: "1:1064551379068:web:00aee0e95a8c3880a999f9"
};

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth
export const firestore = firebase.firestore

export const createTodoDocument = async (obj, todoId) => {
    if (!obj) { return }

    try {
        firestore().collection('todos').doc(`${todoId}`).set(obj)
    } catch (error) {
        console.log(error)
    }
}

export const getTodos = async (uid) => {
    const todos = []
    await firestore().collection("todos").where("uid", "==", `${uid}`)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                todos.push(doc.data())
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    return todos
}

export const updateTodo = async (obj, todoId) => {
    try {
        await firestore().collection('todos').doc(`${todoId}`).set(obj, { merge: true });        
    } catch (error) {
        console.log(error)
    }
}

export const deleteTodo = async (todoId) => {
    console.log(todoId)
    try {
        await firestore().collection('todos').doc(`${todoId}`).delete()        
    } catch (error) {
        console.log(error)
    }
}

export const completeTodo = async (todoId) => {
    try {
        await firestore().collection("todos").doc(`${todoId}`).update({
            // completedAt: firestore.FieldValue.serverTimestamp()
            completedAt: new Date()
        });   
    } catch (error) {
        console.log(error)
    }
}

export const incompleteTodo = async (todoId) => {
    try {
        await firestore().collection("todos").doc(`${todoId}`).update({
            completedAt: null
        });
    } catch (error) {
        console.log(error)
    }
}

export const deleteMultiple = async (todoIdArr) => {

    // if (todoIdArr.length === 1) {
    //     await firestore().collection('todos').doc(`${todoIdArr[0]}`).delete()
    // } else {
    //     await todoIdArr.forEach(async (todoId) => {
    //         await firestore().collection('todos').doc(`${todoId}`).delete()
    //     })
    // }

    try {
        await todoIdArr.forEach(async (todoId) => {
            console.log(todoId)
            await firestore().collection('todos').doc(`${todoId}`).delete()
        })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}