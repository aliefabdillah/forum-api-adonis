import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthService from '@ioc:Service/AuthService';

export default class AuthController {
  public async login({ request, auth, response }: HttpContextContract) {
    try {
      const payload = request.body()

      const result = await AuthService.login(payload, auth)
      
      if (result.code == 400) response.badRequest(result)
      
      response.send(result);
    } catch (error) {
      throw error
    }
    
  }

  public async register({ response, request, auth }: HttpContextContract) {
    try {
      const payload = request.body();

      const result = await AuthService.register(payload, auth)

      if (result.code == 400) response.badRequest(result)

      response.send(result);
    } catch (error) {
      throw error
    }
  }
}
