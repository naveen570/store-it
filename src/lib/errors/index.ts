export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }
}
export const userNotFoundError = () => {
  throw new UserError("User not found");
};
