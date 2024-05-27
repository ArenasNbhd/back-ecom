const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/signup', authController.signup) //Ruta para registrarse
router.post('/login', authController.login) //Ruta para ingresar/loggearse
router.get('/get-allusers', authMiddleware, authController.getAllUsers) //El 'authMiddleware valida el token', si sí, ejecuta 'authController.getAllUsers'
router.delete('/:id', authMiddleware, authController.deleteUser) //Ruta para eliminar usuario
router.put('/:id', authMiddleware, authController.updateUser) // Ruta para Actualizar

module.exports = router //Exportar las rutas para poder utilizarlas en otros lugares
