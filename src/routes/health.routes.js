import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Weather API is running."
    });
});

export default router;