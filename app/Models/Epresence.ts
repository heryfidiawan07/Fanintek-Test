import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Epresence extends BaseModel {
  // public static table = 'epresences'
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public type: string

  @column()
  public is_approve: boolean

  @column.dateTime()
  public waktu: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>
}
