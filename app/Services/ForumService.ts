import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import Forum from "App/Models/Forum";
import { randomUUID } from 'crypto'
import Cache from "@ioc:Kaperskyguru/Adonis-Cache";

export default class ForumServices{
  public async getAllForums(){
    try {
      const forums = await Cache.remember('forums', 3, async function() {
        return await Forum.query().preload("user").preload("posts")
      }) 

      console.log(JSON.parse(forums));
      
      if (forums.length === 0) return { code: 200, message: "Forums Empty"}

      return { code: 200, message: "Successfully loaded", data: JSON.parse(forums) }
      /* await Cache.flush()
      return true */

    } catch (error) {
      console.log(error)
      throw new Error("FORUM_SERVICE.FAILED_LOAD_FORUMS");
    }
  }

  public async getForumById(id: string) {
    try {
      const forum = await Forum.query().where('id', id)
        .select('id', 'title', 'description', 'userId')
        .preload('user', (query) => {
          query.select('id', 'email', 'name')
        })
        .preload('posts', (query) => {
          query.select('id', 'title', 'content')
        })
        .first();

      if (forum) {
        
        if (!forum.$attributes) return { code: 200, message: "Forum empty"}

        return { code: 200, message: "Successfully loaded", data: forum }
      }
      return { code: 404, message: "Forum Not Found" }
    } catch (error) {
      console.log(error)
      throw new Error("FORUM_SERVICE.FAILED_LOAD_FORUMS")
    } 
  }

  public async updateForum(payload: { title: string, description: string}, id: string){
    try {
      const forum = await Forum.find(id) 

      if (forum) {

        forum.title = payload.title;
        forum.description = payload.description
        if (await forum.save()) {
          await forum.load("user")
          await forum.load("posts")

          // ketika berhasil update data di db, lalu update ke cache server
          await Cache.update('forum_id' + id, forum, 60)

          return { code: 200, message: "Update Successfully", data: forum }
        }
        
        return { code : 422, message: "Failed Update Forums"} // 422
      }
      return { code: 401, message: "No forums found"}; // 401
    } catch (error) {
      console.log(error)
      throw new Error("FORUM_SERVICE.FAILED_UPDATE_FORUMS");
    }
  }

  public async createForum(payload: {title: string, description: string}, auth: AuthContract) {
    try {
      const user = await auth.authenticate();
      const forum = new Forum();

      forum.id = randomUUID();
      forum.title = payload.title
      forum.description = payload.description

      await user.related("forums").save(forum);

      //store new forum to cache
      await Cache.set('forum_id' + forum.id, forum, 60)

      if (forum) {
        return { code: 200, message: "Created Successfully", data: forum }
      }
      return { code: 400, message: "Failed Create Forum"}

    } catch (error) {
      console.log(error)
      throw new Error("FORUM_SERVICE.FAILED_CREATE_FORUMS");
    }
  }

  public async deleteForum(userId: string, forumId: string){
    try {
      
      const forum = await Forum.query()
        .where("user_id", userId)
        .where("id", forumId)
        .delete();
      
      if (forum) return { code : 200, message : 'Delete Forum Success'}
      return { code: 404, message: 'Forum Not Found'};
    } catch (error) {
      console.log(error)
      throw new Error("FORUM_SERVICE.FAILED_DELETE_FORUMS");
    }
  }
}