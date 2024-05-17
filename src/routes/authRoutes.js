const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/signup', authController.signup) //Ruta para registrarse
router.post('/login', authController.login) //Ruta para ingresar/loggearse

module.exports = router //Exportar las rutas para poder utilizarlas en otros lugares