export class TestServer {
  async setup(modules: any[]) {
    await this.startContainers();
    await this.init(modules);
  }
}