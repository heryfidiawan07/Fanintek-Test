/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import Route from '@ioc:Adonis/Core/Route'
import AuthController from 'App/Controllers/Http/AuthController'
import EpresencesController from 'App/Controllers/Http/EpresencesController'

Route.get('/', async ({ response }) => {
  const report = await HealthCheck.getReport()
  return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.post('register', async (ctx) => {
  return new AuthController().register(ctx)
})

Route.post('login', async (ctx) => {
  return new AuthController().login(ctx)
})

Route.get('epresence', async (ctx) => {
  await ctx.auth.use('api').authenticate()
  return new EpresencesController().index(ctx)
})

Route.post('epresence', async (ctx) => {
  await ctx.auth.use('api').authenticate()
  return new EpresencesController().store(ctx)
})

Route.put('epresence/:id', async (ctx) => {
  await ctx.auth.use('api').authenticate()
  return new EpresencesController().approve(ctx)
})
