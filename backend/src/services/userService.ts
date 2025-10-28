import User from "../database/models/User";

export async function getAllUsers() {
  return User.findAll({
    attributes: ["id", "email", "name", "createdAt", "updatedAt"],
    order: [["createdAt", "DESC"]],
  });
}
