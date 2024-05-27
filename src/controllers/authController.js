const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const { createUser, findUserByEmail, getAllUsers, deleteUser, updateUser } = require('../services/userService')

exports.signup = async (req, res) => { //Solicitamos o exportamos la ruta de authRoutes para registrarnos
    try {
        // Código para registrarse
        const { email, password, id, name, secname, adress, numero, city, cp, province, country } = req.body //Nos llegan el email y la contraseña y más información como objetos
        const existingUser = await findUserByEmail(email) //Método para checar en mi DB si el correo existe o no
        if (existingUser.success) { //Si existe, solicito que retorne un mensaje que diga que ya existe
            return res.status(400).json({
                message: 'El usuario ya está registrado'
            })
        }
        //Si el usuario no existe, primero debes hashear(encriptar) su password

        const saltRounds = 10 //Método para hashear
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        //Después, se crea nuestro usuario
        const newUser = { //Creamos un objeto, para mandar los datos en forma de objeto
            email: email,
            password: hashedPassword,
            id: id,
            name: name,
            secname: secname,
            adress: adress,
            numero: numero,
            city: city,
            cp: cp,
            province: province,
            country: country
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
        const { email, password, numero } = req.body //Recibimos los parámetros del email, pass y numero
        const findEmail = await findUserByEmail(email) //Verificamos si el correo existe (findUserByEmail regresa el usuario completo con tods la info de la DB)

        if (!findEmail.success) { //Si no encuentra el correo, solicito un msj que lo diga
            return res.status(401).json({
                message: 'Usuario no encontrado'
            })
        }
        const user = findEmail.user
        const findPassword = await bcrypt.compare(password, user.password) //Compara si el 'password'(el que manda el usuario, sin encriptar) es igual al 'user.password'(el pass encriptado en la db)
        
        if (!findPassword) { //Si los password no son iguales, mando un msj que lo diga
            res.status(401).json({
                message: 'Password incorrecto'
            })
        }

        const token = jsonwebtoken.sign({ //Si son correctas y coinciden, generamos nuestro token
            email: user.email, //Ponemos la información que va a llevar el token dentro
            userId: user.Id
        }, process.env.TOP_SECRET, { //Palabra secreta utilizada para generar el token
            expiresIn: '1h' //Duración del token
        }) 

        res.status(200).json({ 
            token: token //Regresamos el token, el cual contiene los datos del usuario
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getAllUsers = async (req, res) => { //Solicitamos o exportamos la ruta para obtener todos los usuarios
    try {
        const users = await getAllUsers() //Función para obtenerlos, si se obtienen, mando un mensaje
        res.status(200).json({
            message: 'Success',
            users
        })
    } catch (error) {
        res.status(500).json({ //Si no se obtienen, mando un mensaje
            message: 'Server Error Getting All Users',
            error: error.message
        })
    }
}

exports.updateUser = async (req, res) => { //Solicitamos o exportamos la ruta para actualizar usuarios
    try {
        const userId = req.params.id
        const userData = req.body
        await updateUser(userId, userData)
        res.status(200).json({
            message: 'User update successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error updating user'
        })
    }
}

exports.deleteUser = async (req, res) => { //Solicitamos o exportamos la ruta para Elimar usuarios 
    try {
        const userId = req.params.id //Funciona para elimiar usuarios, solo necesitamos el ID 
        await deleteUser(userId)
        res.status(200).json({
            message: 'User delate successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting user'
        })
    }
}
