declare module "serverless-http" {
  type IServerless = (a: any) => any;

  let serverless: IServerless;

  export = serverless;
}
