import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostService from '@ioc:Service/PostService'

export default class PostsController {
  public async index({ response }: HttpContextContract)
  {
    try {
      const result = await PostService.getAllPost()
      return response.ok(result)
    } catch (error) {
      throw error
    }
  }

  public async show({ response, params }: HttpContextContract){
    try {
      const { id } = params
      const result = await PostService.getPostById(id)

      if (result.code === 404) return response.notFound(result)
      return response.send(result);

    } catch (error) {
      console.log(error);
      throw error
    }
  }

  public async update({ response, request, params }: HttpContextContract){
    try {
      const payload: any = request.body()
      const { id } = params

      const result = await PostService.updatePost(payload, id)

      if (result.code === 401) return response.notFound(result)
      if (result.code === 422) return response.unprocessableEntity(result)
      return response.send(result)
    } catch (error) {
      throw error
    }
  }

  public async store({ auth, request, response}: HttpContextContract)
  {
    try {
      const payload: any = request.body()
      const result = await PostService.createPost(payload, auth)

      if (result.code === 400) return response.badRequest(result)
      return response.ok(result)
    } catch (error) {
      throw error
    }
  }

  public async destroy({response, auth, params}: HttpContextContract)
  {
    try {
      const user = await auth.authenticate();
      const result = await PostService.deletePost(user.id, params.id)
      
      if (result.code === 404) return response.notFound(result)
      return response.ok(result)
    } catch (error) {
      throw error
    }
  }
}
