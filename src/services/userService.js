const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); //Funciones del JsonWebToken
const { createUser, findUserByEmail, getAllUsers, deleteUser, updateUser } = require('../models/userModel'); //El modelo es el constructor de las operaciones, deben estar las que vamos a requerir
require('dotenv').config(); // Cargar variables de entorno

exports.createUser = async (userData) => {
    try {
        const createdUser = await createUser(userData);
        console.log('@@@ service => ', createdUser)
        if (createdUser.success) {
            return {
                success: true,
                message: 'Usuario registrado satisfactoriamente'
            };
        }
        return {
            success: false,
            message: 'Error al registrar'
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

exports.findUserByEmail = async (email) => {
    try {
        const found = await findUserByEmail(email);
        if (found.success) {
            return {
                success: true,
                user: found.user
            };
        }
        return {
            success: false,
            message: 'Usuario no encontrado'
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

exports.comparePasswords = async (plainPassword, hashedPassword) => {
    try {
        const verifyPassword = await bcrypt.compare(plainPassword, hashedPassword);
        return verifyPassword; // Retorna verdadero o falso
    } catch (error) {
        throw new Error('Error al comparar passwords: ' + error.message);
    }
};

exports.generateToken = async (user) => {
    try {
        const token = jwt.sign({
            email: user.email,
            userId: user.id
        },
        process.env.TOP_SECRET,
        { expiresIn: '1h' }
        );
        return token; // Retornar el token generado
    } catch (error) {
        throw new Error('Error al generar el token: ' + error.message);
    }
};

exports.getAllUsers = async () => {
    try {
        const users = await getAllUsers();
        return {
            success: true,
            users
        };
    } catch (error) {
        return {
            success: false,
            error: 'Error Getting Users: ' + error.message
        };
    }
};

exports.deleteUser = async (userId) => {
    try {
        await deleteUser(userId);
        return {
            success: true,
            message: 'Usuario eliminado correctamente'
        };
    } catch (error) {
        return {
            success: false,
            error: 'Error eliminando usuario: ' + error.message
        };
    }
};

exports.updateUser = async (userId, userData) => { // Agregar userData como parámetro
    try {
        await updateUser(userId, userData);
        return {
            success: true,
            message: 'Usuario actualizado correctamente'
        };
    } catch (error) {
        return {
            success: false,
            error: 'Error actualizando usuario: ' + error.message
        };
    }
};
