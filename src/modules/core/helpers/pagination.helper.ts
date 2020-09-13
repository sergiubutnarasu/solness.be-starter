class PaginationHelperClass {
  private static instance: PaginationHelperClass;

  private constructor() {
    //
  }

  public static getInstance() {
    if (!PaginationHelperClass.instance) {
      PaginationHelperClass.instance = new PaginationHelperClass();
    }
    return PaginationHelperClass.instance;
  }

  public calculateOffset(page: number, pageSize: number) {
    const result = page - 1 * pageSize;
    return result < 0 ? 0 : result;
  }
}

const PaginationHelper = PaginationHelperClass.getInstance();
export default PaginationHelper;
