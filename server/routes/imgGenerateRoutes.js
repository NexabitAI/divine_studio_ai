import express from "express";
import fetch from "node-fetch";

const router = express.Router();

const HUGGINGFACE_TOKEN = "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";
const MODEL_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

router.route("/").get((req, res) => {
    res.send("Hello from Hugging Face Image API");
});

router.route("/").post(async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Missing prompt" });
        }

        const response = await fetch(MODEL_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HUGGINGFACE_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: prompt }),
        });

        const contentType = response.headers.get("content-type");

        // If Hugging Face returned an error in JSON
        if (contentType && contentType.includes("application/json")) {
            const errorJson = await response.json();
            console.error("Hugging Face JSON error:", errorJson);
            return res.status(500).json(errorJson);
        }

        // Otherwise assume image bytes
        const buffer = await response.buffer();
        const base64Image = buffer.toString("base64");
        res.status(200).json({ photo: base64Image });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
