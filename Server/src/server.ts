import express, { Application } from "express";
import cors from "cors";
import { createServer, Server } from "http";
import cookieParser from "cookie-parser";

const app: Application = express();
const httpServer: Server = createServer(app);

// Middleware
app.use(
    cors({
        origin: ["http://localhost:5173",],
        credentials: true,
    })
);

app.use(cookieParser());

app.use(
    express.json({
        verify: (req, res, buf, encoding) => {
            try {
                JSON.parse(buf.toString());
            } catch (err) {
                console.error("Invalid JSON received:", buf.toString(), err);
                throw new Error("Invalid JSON format");
            }
        },
    })
);

app.use((req, res, next) => {
    // res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    // res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});

app.use("/", (req, res) => {
    res.send("Hello, world!");
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    const status = err.status ?? 500;
    const message = err.message ?? "Internal server error";
    res.status(status).json({ error: message });
});

const PORT: number = Number(process.env.PORT) || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
