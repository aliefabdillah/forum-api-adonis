import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User';
import { randomUUID } from 'crypto' 

export default class AuthService {

  public async login(payload: any, auth: AuthContract){
    try {
      const {email, password} = payload

      console.log(email);
      
      const user = await User.query().where('email', email).limit(1)

      if (user.length === 0) 
        return { code: 400, messsage: 'User Not Found' }
      
      if (!(await Hash.verify(user[0].password, password)))
        return { code: 400, messsage: 'Password Incorect' }

      const token = await auth.use("api").attempt(email, password, {
        expiresIn: "10 days",
      });

      return { code: 200, token: token }
    } catch (error) {
      console.log(error)
      throw new Error("AUTH_SERVICE.LOGIN_FAILED" + error.message);
    } 
  }

  public async register(payload: any, auth: AuthContract){
    try {
      const newUser = new User()
      const { email, password, name } = payload
      

      const user = await User.query().where('email', email).limit(1)

      if (user.length !== 0) return { code: 400, messsage: "Email already Registered" }

      newUser.id = randomUUID()
      newUser.email = email
      newUser.password = password
      newUser.name = name
      await newUser.save()

      /* const token = await auth.use("api").attempt(email, password, {
        expiresIn: "10 days",
      }); */

      let response = {
        code : 200,
        message : "Register Successfully"
      }

      return response
    } catch (error) {
      console.log(error)
      throw new Error('USER_SERVICE.DATA_NOT_CREATED : ' + error.message)
    }
  }
}