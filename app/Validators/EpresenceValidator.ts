import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EpresenceValidator {
  constructor (protected ctx: HttpContextContract) {}
  public schema = schema.create({
    type: schema.string({ trim: true }, [
      rules.maxLength(3),
      rules.minLength(2),
    ]),
    waktu: schema.date({format: 'yyyy-MM-dd HH:mm:ss'}),
  })
  public messages: CustomMessages = {
    minLength: '{{ field }} must be at least {{ options.minLength }} characters long',
    // maxLength: '{{ field }} must be less then {{ options.maxLength }} characters long',
    // required: '{{ field }} is required',
    // unique: '{{ field }} must be unique, and this value is already taken',
  }
}
