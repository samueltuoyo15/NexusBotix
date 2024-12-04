import express from "express";
import {upload, createAgent} from "../controllers/createAgentController.js";

const router = express.Router();

router.post("/create_agent", upload.single('file'), async (req, res) => {
 await createAgent(req, res);
})

export default router;