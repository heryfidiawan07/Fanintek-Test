import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginValidator {
  constructor (protected ctx: HttpContextContract) {}
  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.minLength(3),
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
