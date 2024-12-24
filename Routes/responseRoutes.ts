import { Router, Request, Response } from "express";

const router: Router = Router();

router.get("/", async (req: Request, res: Response): Promise<any> => {
    return res.send("Response routes working!");
});


export default router;
