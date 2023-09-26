import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserService from '@ioc:Service/UserService'

export default class UsersController {
  public async postsByUser({ response, auth }: HttpContextContract ){
    try {
      const result = await UserService.getPostsByUsers(auth)
      return response.ok(result)
    } catch (error) {
      console.error(error)
    }
  }

  public async forumsByUser({ response, auth }: HttpContextContract){
    try {
      const result = await UserService.getForumsByUsers(auth)
      return response.ok(result)
    } catch (error) {
      console.error(error)
    } 
  }
}
