import { Router } from "express";
import {
  registerOwner,
  loginOwner,
  ownerRequest,
} from "../../controllers/owner/auth.controller.js";
import {
  validateRegisterInput,
  validateLoginInput,
  validateOwnerRequestInput,
  validateCompleteRegistrationInput,
} from "../../middleware/validators/owner/authValidator.js";

const authRouter = Router();
authRouter.post("/register",validateCompleteRegistrationInput,  registerOwner);
authRouter.post("/login",validateLoginInput, loginOwner);
authRouter.post("/ownerRequest",validateOwnerRequestInput, ownerRequest);

export default authRouter;



