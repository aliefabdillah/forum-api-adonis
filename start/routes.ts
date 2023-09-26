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

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('/register', 'Authcontroller.register')
  Route.post('/login', 'Authcontroller.login')

  Route.group(() => {
    Route.resource('/post', 'PostsController').apiOnly()
    Route.resource('/forum', 'ForumsController').apiOnly()
    Route.get('users/post', 'UsersController.postsByUser')
    Route.get('users/forum', 'UsersController.forumsByUser')
  }).middleware('auth:api')
}).prefix('api/v1')
