import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class LoadServiceProvider {
  public static needsApplication = true

  constructor(protected app: ApplicationContract) {}

  public async register() {
    // Register your own bindings
    const { default: AuthService } = await import('../app/Services/AuthService')
    this.app.container.singleton('Service/AuthService', () => {
      return new AuthService()
    })
    
    /* const { default: UserService } = await import('../app/Services/UserService')
    this.app.container.singleton('Service/UserService', () => {
      return new UserService()
    })

    const { default: AdminService } = await import('../app/Services/AdminService')
    this.app.container.singleton('Service/AdminService', () => {
      return new AdminService()
    })

    const { default: AuthAdminService } = await import('../app/Services/AuthAdminService')
    this.app.container.singleton('Service/AuthAdminService', () => {
      return new AuthAdminService()
    })

    const { default: AuthUserService } = await import('../app/Services/AuthUserService')
    this.app.container.singleton('Service/AuthUserService', () => {
      return new AuthUserService()
    })

    const { default: BookService } = await import('../app/Services/BookService')
    this.app.container.singleton('Service/BookService', () => {
      return new BookService()
    })

    const { default: PeminjamanService } = await import('../app/Services/PeminjamanService')
    this.app.container.singleton('Service/PeminjamanService', () => {
      return new PeminjamanService()
    }) */

    // !!DONT REMOVE THIS LINE !! #Save ioc files#
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
