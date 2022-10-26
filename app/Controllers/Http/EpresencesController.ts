import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import EpresenceValidator from 'App/Validators/EpresenceValidator'
import User from 'App/Models/User'
import Epresence from 'App/Models/Epresence'

export default class EpresencesController {
  public async index ({response}: HttpContextContract) {
    try {
      const epresence = await Epresence.query().preload('user')
      const data = await this.newEpresence(epresence)

      return response.json({status: true, message: 'ok', data: Object.values(data)})
    } catch (error) {
      return response.json({status: false, message: error.message, data: null})
    }
  }

  public async store ({auth, request, response}: HttpContextContract) {
    const valid = await request.validate(EpresenceValidator)
    try {
      const user = await User.find(auth.user?.$original.id)
      if(!user) {
        throw new Error('Data not found !')
      }
      const check = await this.uniqueEpresence({user_id:user.id, type:valid.type, waktu:valid.waktu})
      if(check > 0) {
        throw new Error('You have done absent !')
      }
      await user.related('epresences').create(valid)

      return response.json({status: true, message: 'ok', data: user})
    } catch (error) {
      return response.json({status: false, message: error.message, data: null})
    }
  }

  public async approve ({auth, params, response}: HttpContextContract) {
    try {
      const epresence = await Epresence.query().where('id', params.id).preload('user').firstOrFail()
      if(epresence.user.npp_supervisor !== auth.user?.$original.npp) {
        // response.abort('Not authenticated', 401)
        throw new Error(`Sorry, Your account can't approve the user: ${epresence.user.name} !`)
      }
      epresence.is_approve = true
      await epresence.save()

      return response.json({status: true, message: 'ok', data: epresence})
    } catch (error) {
      return response.json({status: false, message: error.message, data: null})
    }
  }

  private async uniqueEpresence ({user_id, type, waktu}) {
    const newDate = `${waktu.year}-${waktu.month}-${waktu.day}`
    const data = await Database
      .rawQuery(
        'SELECT * FROM epresences WHERE user_id = ? AND type = ? AND TO_CHAR(waktu::DATE, \'yyyy-mm-dd\') = ? LIMIT 1',
        [user_id, type, newDate]
      )

    // console.log('date',date.year)
    // console.log('newDate',newDate)
    // console.log('data.rowCount',data.rowCount)
    return data.rowCount
  }

  private async newEpresence (model:any) {
    const data:any = {}
    const temp:any = []
    model.map(async (val: Epresence) => {
      let identifier = `${val.user_id}-${val.waktu.year}${val.waktu.month}${val.waktu.day}`
      // 
      if(!temp.includes(`${identifier}`)) {
        temp.push(`${identifier}`)
        data[`${identifier}`] = {
          id_user:'',
          nama_user:'',
          tanggal:'',
          waktu_masuk:'',
          status_masuk:'',
          waktu_pulang:'',
          status_pulang:'',
        }
      }
      data[`${identifier}`]['id_user'] = val.user_id
      data[`${identifier}`]['nama_user'] = val.user.name
      data[`${identifier}`]['tanggal'] = val.waktu.toFormat('yyyy-MM-dd')

      if(val.type === 'IN') {
        data[`${identifier}`]['waktu_masuk'] = val.waktu.toFormat('HH:mm:ss')
        data[`${identifier}`]['status_masuk'] = val.type === 'IN' && val.is_approve ? 'APPROVE' : 'REJECT'
      }else {
        data[`${identifier}`]['waktu_pulang'] = val.waktu.toFormat('HH:mm:ss')
        data[`${identifier}`]['status_pulang'] = val.type === 'OUT' && val.is_approve ? 'APPROVE' : 'REJECT'
      }
    })
    return data
  }
}
