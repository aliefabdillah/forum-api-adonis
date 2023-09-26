import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Logger from "@ioc:Adonis/Core/Logger";
import ForumService from "@ioc:Service/ForumService";

export default class ForumsController {
  public async test({}: HttpContextContract) {
    Logger.info("Forums retrieved successfully");

    return {
      hello: "world",
    };
  }

  public async index({ response }: HttpContextContract) {
    try {
      const result = await ForumService.getAllForums()
      response.send(result);
    } catch (error) {
      throw(error)
    }
  }

  /* public async indexWithoutCache({}: HttpContextContract) {
    await Cache.flush();
    return await Forum.query().preload("user").preload("posts");
  } */

  public async show({ params, response }: HttpContextContract) {
    try {
      const { id } = params
      const result = await ForumService.getForumById(id)

      if (result.code === 404) return response.notFound(result)
      return response.send(result);

    } catch (error) {
      Logger.error({ err: new Error(error) }, "Get Single Forum");
      console.log(error);
      throw error
    }
  }

  public async update({ response, request, params }: HttpContextContract) {

    try {
      const payload: any = request.body()
      const { id } = params

      const result = await ForumService.updateForum(payload, id)

      if (result.code === 401) return response.notFound(result)
      if (result.code === 422) return response.unprocessableEntity(result)
      return response.send(result)
    } catch (error) {
      throw error
    }
  }

  public async store({ auth, request, response}: HttpContextContract) {
    try {
      const payload: any = request.body()
      const result = await ForumService.createForum(payload, auth)

      if (result.code === 400) return response.badRequest(result)
      return response.ok(result)
    } catch (error) {
      throw error
    }
  }

  public async destroy({ auth, params, response}: HttpContextContract) {
    try {
      const user = await auth.authenticate();
      const result = await ForumService.deleteForum(user.id, params.id)
      
      if (result.code === 404) return response.notFound(result)
      return response.ok(result)
    } catch (error) {
      throw error
    }
  }
}