import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import Post from "App/Models/Post";
import { randomUUID } from 'crypto'

export default class PostService {
  public async getAllPost(){
    try {
      const posts = await Post.query()
        .select('id', 'title', 'content', 'userId', 'forumId')
        .preload('user', (queryBuilder) => {
          queryBuilder.select('id', 'email', 'name')
        })
        .preload('forum', (queryBuilder) => {
          queryBuilder.select('id', 'title', 'description')
        });
        
      // const posts = await Post.query().preload('user').preload('forum');
      
      if (posts.length === 0) return { code: 200, message: 'Post Empty'}
      return { code: 200, message: 'Get Posts Successfully', data: posts}
      
    } catch (error) {
      console.log(error)
      throw new Error("POST_SERVICES.GET_POST_FAILED");
    }
  }

  public async getPostById(id: string) {
    try {
      const post = await Post.query().where('id', id)
        .select('id', 'title', 'content', 'userId', 'forumId')
        .preload('user', (queryBuilder) => {
          queryBuilder.select('id', 'email', 'name')
        })
        .preload('forum', (queryBuilder) => {
          queryBuilder.select('id', 'title', 'description')
        })
        .first();

      if (post) {
        
        if (!post.$attributes) return { code: 200, message: "Post empty"}

        return { code: 200, message: "Successfully loaded", data: post }
      }
      return { code: 404, message: "Post Not Found" }
    } catch (error) {
      console.log(error)
      throw new Error("POST_SERVICE.FAILED_LOAD_POST")
    } 
  }

  public async updatePost(payload: { title: string, content: string}, id: string){
    try {
      const post = await Post.find(id);

      if (post) {
        post.title = payload.title;
        post.content = payload.content
        if (await post.save()) {
          await post.load("user")
          await post.load("forum")

          return { code: 200, message: "Update Successfully", data: post }
        }
        
        return { code : 422, message: "Failed Update Forums"} // 422
      }
      return { code: 401, message: "No forums found"}; // 401
    } catch (error) {
      console.log(error)
      throw new Error("FORUM_SERVICE.FAILED_UPDATE_FORUMS");
    }
  }

  public async createPost(payload: {title: string, content: string, forumId: string}, auth: AuthContract) {
    try {
      const user = await auth.authenticate();
      const post = new Post();

      post.id = randomUUID();
      post.title = payload.title
      post.content = payload.content
      post.forumId = payload.forumId
      
      await user.related("posts").save(post);

      if (post) {
        return { code: 200, message: "Created Successfully", data: post }
      }
      return { code: 400, message: "Failed Create Post"}

    } catch (error) {
      console.log(error)
      throw new Error("POST_SERVICE.FAILED_CREATE_POST");
    }
  }

  public async deletePost(userId: string, postId: string){
    try {
      
      const forum = await Post.query()
        .where("user_id", userId)
        .where("id", postId)
        .delete();
      
      if (forum) return { code : 200, message : 'Delete Post Success'}
      return { code: 404, message: 'Post Not Found'};
    } catch (error) {
      console.log(error)
      throw new Error("POST_SERVICE.FAILED_DELETE_POST");
    }
  }

}