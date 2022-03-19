import { AppConfigKey, Environment } from '../objects';

class AppHelperClass {
  private static instance: AppHelperClass;

  private constructor() {
    //
  }

  public static getInstance() {
    if (!AppHelperClass.instance) {
      AppHelperClass.instance = new AppHelperClass();
    }
    return AppHelperClass.instance;
  }

  public getConfig(key: string): string {
    return process.env[key];
  }

  public getEnvironment(): string {
    return process.env[AppConfigKey.Environment];
  }

  public checkEnvironment(environment: Environment): boolean {
    return this.getEnvironment() === environment;
  }
}

const AppHelper = AppHelperClass.getInstance();
export default AppHelper;
