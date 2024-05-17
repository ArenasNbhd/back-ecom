const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const { createUser, findUserByEmail } = require('../services/userService')

exports.signup = async (req, res) => { //Solicitamos o exportamos la ruta de authRoutes para registrarnos
    try {
        // Código para registrarse
        const { email, password } = req.body //Nos llegan el email y la contraseña como objetos
        const existing = await findUserByEmail(email) //Método para checar en mi DB si el correo existe o no
        if (existingUser.success) { //Si existe, solicito que retorne un mensaje que diga que ya existe
            return res.status(400).json({
                message: 'El usuario ya está resgitrado'
            })
        }
        //Si el usuario no existe, primero debes hashear(encriptar) su password

        const saltRounds = 10 //Método para hashear
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        //Después, se crea nuestro usuario
        const newUser = { //Creamos un objeto, para mandar los datos en forma de objeto
            email: email,
            password: hashedPassword
            //Agregar más datos 
        }

        const userResult = await createUser(newUser) //Mandamos el objeto
        if (userResult.success) { //Si el usuario fue creado con éxito, solicito un mensaje que lo diga
            res.status(201).json({
                message: 'Usuario Registrado Satisfactoriamente'
            })
        } else { //Si no se registró, mandar un mensaje que lo diga
            res.status(500).json({
                message: 'Error al registrar usuario'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.login = async (req, res) => { //Solicitamos o exportamos la ruta de authRoutes para loggearnos
    try {
        // Código para loggearnos
        const { email, password } = req.body //Recibimos los parámetros del email y pass
        const findEmail = await findUserByEmail(email) //Verificamos si el correo existe (findUserByEmail regresa el usuario completo con tods la info de la DB)

        if (!findEmail.success) { //Si no encuentra el correo, solicito un msj que lo diga
            res.status(401).json({
                message: 'Usuario no encontrado'
            })
        }
        const user = findEmail.user
        const findPassword = await bcrypt.compare(password, user.password) //Compara si el 'password'(el que manda el usuario) es igual al 'user.password'(el pass encriptado en la db)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

