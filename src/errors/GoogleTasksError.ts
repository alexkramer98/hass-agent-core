export default class GoogleTasksError extends Error {
  public readonly name: string = "GoogleTasksError";

  public constructor(message?: string) {
    super(message);
  }
}
