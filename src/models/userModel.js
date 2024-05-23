const firebase = require('../config/firebase') //Acceso a la base de datos
const usersCollection = firebase.firestore().collection('users')

exports.createUser = async (userData) => {
    try {
        const user = await usersCollection.doc(userData.id).set(userData)
        console.log('@@ modelo => ', user)
        return {
            success: true
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        }
    }
}

exports.findUserById = async (userId) => {
    try { //Buscar si dentro de la colección, encontramos un doc con el mismo ID
        const userFound = await usersCollection.doc(userId).get()
        if (userFound.exists) { //Si existe, regresa un msj anteriormente solicitado
            return {
                success: true,
                user: userDoc.data()
            }
        } else { //Si no existe, regresa un msj que lo diga
            return {
                success: false,
                error: 'User not found'
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        }
    }
}

exports.findUserByEmail = async (email) => {
    try {
        const userEmail = await usersCollection.where('email', '==', email).get() //En la colección, con el 'where', busca los campos 'email', va a encontrar un email que sea igual al que se está mandando
        if(!userEmail.empty) { //Si no está vacía esta variable, entonces sí encontró un usuario
            const userFound = userEmail.docs[0]
            return {
                success: true,
                user: userFound.data()
            }
        } else {
            return {
                success: false,
                error: 'User not Found'
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        }
    }
}

exports.getAllUsers = async () => {
    try {
        const allUsers = await usersCollection.get() //Obtiene los usuarios y los guarda en forma de arreglo
        const users = []
        allUsers.forEach((doc) => {
            users.push(doc.data())
        })
        return users
    } catch (error) {
        throw new Error('Error Getting Users: ' + error.message)
    }
}

exports.deleteUSer = async (userId) => {
    try {
        await usersCollection.doc(userId).delete() // Busca el UserId y lo borra
    } catch (error) {
        throw new Error('Error deleting user' + error.message)
    }
}

exports.updateUSer = async (userId, userData) => {
    try {
        await usersCollection.doc(userId).update(userData)
    } catch (error) {
        throw new Error('Error updating user' + error.message)
    }
}