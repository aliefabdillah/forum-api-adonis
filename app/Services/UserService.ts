import { AuthContract } from "@ioc:Adonis/Addons/Auth";

export default class UserService {
  /**
   * name
   */
  public async getPostsByUsers(auth: AuthContract) {
    try {
      const user = await auth.authenticate()
      await user.load('posts')
      const post = user.posts
      
      if (post.length === 0) return { code: 200, message: 'Post Empty'}
      return { code: 200, message: 'Get Posts Successfully', data: post }
    } catch (error) {
      console.error(error)
      throw new Error("USER_SERVICE.GET_POST_BY_USER_ERROR");
    }
  }

  public async getForumsByUsers(auth: AuthContract) {
    try {
      const user = await auth.authenticate()
      await user.load('forums')
      const forums = user.forums
      
      if (forums.length === 0) return { code: 200, message: 'Forum Empty'}
      return { code: 200, message: 'Get Forums Successfully', data: forums }
    } catch (error) {
      console.error(error)
      throw new Error("USER_SERVICE.GET_FORUM_BY_USER_ERROR");
    }
  }
}