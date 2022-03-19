class StringHelperClass {
  private static instance: StringHelperClass;

  private constructor() {
    //
  }

  public static getInstance() {
    if (!StringHelperClass.instance) {
      StringHelperClass.instance = new StringHelperClass();
    }
    return StringHelperClass.instance;
  }

  public generate(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public generateString(min: number, max: number) {
    const random = Math.floor(Math.random() * max - min) + max;
    return this.generate(random);
  }
}

const StringHelper = StringHelperClass.getInstance();
export default StringHelper;
