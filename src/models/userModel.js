const firebase = require('../config/firebase') //Acceso a la base de datos
const usersCollection = firebase.firebase().collection('users')

exports.createUser = async (userData) => {
    try {
        await usersCollection.doc(userData.id).set(userData)
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
        if (userFound.exists) { //Si existe, regresa un msj anteriormente soliciado
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

exports.findUserById = async (email) => {
    try {
        const userEmail = await usersCollection.where('email', '==', email).get() //En la colección, con el 'where', busca los campos 'email', va a encontrar un email que sea igual al que se está mandando
    } catch (error) {
        return {
            success: false,
            error: error.message
        }
    }
}