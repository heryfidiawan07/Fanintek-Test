import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
  constructor (protected ctx: HttpContextContract) {}
  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.maxLength(50),
      rules.minLength(3),
    ]),
    email: schema.string({ trim: true }, [rules.unique({ table: 'users', column: 'email' })]),
    npp: schema.string({ trim: true }, [
      rules.maxLength(5),
      rules.minLength(5),
      rules.unique({ table: 'users', column: 'npp' }),
    ]),
    npp_supervisor: schema.string({ trim: true }, [
      rules.maxLength(5),
    ]),
    password: schema.string({}, [rules.minLength(8)]),
  })
  public messages: CustomMessages = {
    minLength: '{{ field }} must be at least {{ options.minLength }} characters long',
    // maxLength: '{{ field }} must be less then {{ options.maxLength }} characters long',
    // required: '{{ field }} is required',
    // unique: '{{ field }} must be unique, and this value is already taken',
  }
}
