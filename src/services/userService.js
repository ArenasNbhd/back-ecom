const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken') //Funciones del JsonWebToken
const { createUser, findUserByEmail, getAllUsers, deleteUser, updateUser } = require('../models/userModel') //El modelo es el constructor de las operaciones, deben estar las que vamos a requerir
require('dotenv').config()

exports.createUser = async (userData) => { //Recibe un objeto que regresará cierta información
    try {
        const createdUser = await createUser(userData) //Si la variable existe, sí se pudo crear
        if (createdUser.success) { //Si se genera la variable, retorno
            return {
                success: true
            }
        } 
        return {
            success: false,
            message:'Error al registrar'
        }
    } catch (error) { //Aquí solo regresamos el msj que se regresa desde el authController.js (linea 38)
        return {
            success: false,
            error: error.message
        }
    }
}

exports.findUserByEmail = async (email) => { //Recibe un email
    try {
        const found = await findUserByEmail(email) //Si la variable existe, sí se pudo crear
        if (found.success) { //Si se genera la variable, retorno
            return {
                success: true, //Regresa el msj que regresa el authController.js
                user: found.user
            }
        } 
        return {
            success: false,
            message:'Usuario no encontrado'
        }
    } catch (error) { //Aquí solo regresamos el msj que se regresa desde el authController.js (linea 38)
        return {
            success: false,
            error: error.message
        }
    }
}

exports.comparePasswords = async (plainPassword, hashedPassword) => { //Llega el plainPassword(Password que llega del Front), y el hashedPassword(Pass encriptada)
    try {
        const verifyPassword = await bcrypt.compare(plainPassword, hashedPassword) //Comparar el password que me llega con el hashedpassword
        return verifyPassword //Solo me va a regresar 'verdadero' o 'falso'
    } catch (error) {
        throw new Error('Error al comparar passwords') //Error que sale si no se pudo completar la operación
    }
}

exports.generateToken = async (user) => { //Recibe un usuario
    try {
        const token = jwt.sign({  //Generamos el token
            email: user.email, //Información que va a llevar el token
            userId: user.id
        },
        process.env.TOP_SECRET,
        { expiresIn: '1h' } //El token expira en una hora
    )
    } catch (error) {
        throw new Error('Error al generar el token')
    }
}

exports.getAllUsers = async () => {
    try {
        const users = await getAllUsers()
        return users
    } catch (error) {
        return new Error('Error Getting Users: ' + error.message)
    }
}

exports.deleteUser = async (userId) => {
    try {
        await deleteUser(userId)
    } catch (error) {
        throw new Error('Error Deleting user' + error.message)
    }
}

exports.updateUser = async (userId) => { // Recibe ID y userData
    try {
        await updateUser(userId, userData)
    } catch (error) {
        throw new Error('Error updating user' + error.message)
    }
}