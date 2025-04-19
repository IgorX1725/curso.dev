import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user.js";

const router = createRouter();

const postHandler = async (req, res) => {
  const userInputValue = req.body;

  const newUser = await user.create(userInputValue);
  return res.status(201).json(newUser);
};

router.post(postHandler);

export default router.handler(controller.errorHandlers);
