import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user.js";

const router = createRouter();

const getHandler = async (req, res) => {
  const username = req.query.username;
  const foundUser = await user.findOneByUsername(username);
  return res.status(200).json(foundUser);
};

const patchHandler = async (req, res) => {
  const username = req.query.username;
  const userInputValues = req.body;

  const updatedUser = await user.update(username, userInputValues);
  return res.status(200).json(updatedUser);
};

router.get(getHandler);
router.patch(patchHandler);

export default router.handler(controller.errorHandlers);
