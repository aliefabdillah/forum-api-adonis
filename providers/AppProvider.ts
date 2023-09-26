import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // IoC container is ready
  }

  public async ready () {
    const Event = this.app.container.resolveBinding('Adonis/Core/Event')
    const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
    // App is ready\
    Event.on('db:query', Database.prettyPrint)
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
