import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RegisterValidator from 'App/Validators/RegisterValidator'
import LoginValidator from 'App/Validators/LoginValidator'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'

export default class AuthController {
  public async register ({request, response}: HttpContextContract) {
    const valid = await request.validate(RegisterValidator)
    try {
      // console.log('valid',valid)
      const user = await User.create(valid)
      return response.json({status: true, message: 'ok', data: user})
    } catch (error) {
      return response.json({status: false, message: error.message, data: null})
    }
  }

  public async login ({auth, request, response}: HttpContextContract) {
    const valid = await request.validate(LoginValidator)
    try {
      const user = await User.findBy('email', request.input('email'))
      if(!user) {
        throw new Error('Data not found !')
      }

      if (!(await Hash.verify(user.password, valid.password))) {
        throw new Error('Invalid credentials !')
      }
      // const token = await auth.use('api').attempt(email, password)
      const token = await auth.use('api').generate(user, {
        name: 'api-login',
        expiresIn: '30 mins',
      })
      // console.log('auth.user?.$original.name',auth.user?.$original.name)
      // console.log('auth.user?.$original.id',auth.user?.$original.id)
      return response.json({status: true, message: 'ok', data: token})
    } catch (error) {
      return response.json({status: false, message: error.message, data: null})
    }
  }

  public async logout ({ auth }: HttpContextContract) {
    await auth.use('api').revoke()
    return {
      revoked: true,
    }
  }
}
