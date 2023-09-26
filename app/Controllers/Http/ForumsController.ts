import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Forum from "App/Models/Forum";
import Logger from "@ioc:Adonis/Core/Logger";
import {v4, uuid} from 'uuid'

export default class ForumsController {
  public async test({}: HttpContextContract) {
    Logger.info("Forums retrieved successfully");

    return {
      hello: "world",
    };
  }

  public async index({ logger }: HttpContextContract) {
    const forums = await Forum.query().preload("user").preload("posts");
    logger.info("Forums retrieved successfully");
    return forums;
  }

  /* public async indexWithoutCache({}: HttpContextContract) {
    await Cache.flush();
    return await Forum.query().preload("user").preload("posts");
  } */

  public async show({ params }: HttpContextContract) {
    try {
      const forum = await Forum.find(params.id);

      if (forum) {
        await forum.preload("user");
        await forum.preload("posts");
        Logger.info({ ForumId: params.id }, `Forum retrieved successfully`);
        return forum;
      }
    } catch (error) {
      Logger.error({ err: new Error(error) }, "Get Single Forum");
      console.log(error);
    }
  }

  public async update({ request, params }: HttpContextContract) {

    const forum = await Forum.find(params.id);
    Logger.info({ ForumId: params.id }, `Forum retrieved successfully`);

    if (forum) {
      forum.title = request.input("title");
      forum.description = request.input("description");
      if (await forum.save()) {
        await forum.preload("user");
        await forum.preload("posts");
        Logger.info({ ForumId: params.id }, `Forum updated successfully`);
        return forum;
      }
      Logger.error({ ForumId: params.id }, `Forum failed to update`);
      return; // 422
    }
    Logger.error({ ForumId: params.id }, `Forum not found`);
    return; // 401
  }

  public async store({ auth, request }: HttpContextContract) {
    const user = await auth.authenticate();
    const forum = new Forum();
    forum.id = uuid();
    forum.title = request.input("title");
    forum.description = request.input("description");
    await user.related("forums").save(forum);
    if (forum) {
      Logger.info({ ForumId: forum.id }, `Forum created successfully`);
      return forum;
    }
    Logger.info({ Forum: forum }, `Forum not created`);
    return;
  }

  public async destroy({ auth, params }: HttpContextContract) {
    const user = await auth.authenticate();
    Logger.info({ UserId: user.id }, `User auth successfully`);
    const forum = await Forum.query()
      .where("user_id", user.id)
      .where("id", params.id)
      .delete();
    Logger.info({ UserID: user.id }, `Forum deleted: ${forum}`);
    return 404;
  }
}