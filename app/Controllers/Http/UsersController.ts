import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async postsByUser({ auth }: HttpContextContract ){
    try {
      const user = await auth.authenticate()
      await user.preload('posts')
      const post = user.posts
      return post
    } catch (error) {
      console.error(error)
    }
  }

  public async forumsByUser({ auth }: HttpContextContract){
    try {
      const user = await auth.authenticate()
      await user.preload('posts')
      const forums = user.forums
      return forums
    } catch (error) {
      console.error(error)
    } 
  }
}
