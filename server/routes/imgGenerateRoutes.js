import express from "express";
import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const router = express.Router();

router.route("/").get((req, res) => {
    res.send("Hello from Hugging Face");
});

router.route("/").post(async (req, res) => {
    try {
        const { prompt } = req.body;
        const stabilityaiApiKey = process.env.STABILITY_AI_TOKEN;

        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                headers: {
                    Authorization: `Bearer ${stabilityaiApiKey}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Hugging Face API error: ${errorText}`);
        }

        const buffer = await response.buffer();
        const image = buffer.toString("base64");

        res.status(200).json({ photo: image });
    } catch (error) {
        console.error("Error generating image:", error.message);
        res.status(500).send("Something went wrong");
    }
});

export default router;
