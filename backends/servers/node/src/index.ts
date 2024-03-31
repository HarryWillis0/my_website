import express, { Express, Request, Response } from "express";

const app: Express = express();

const distPath = `${__dirname}/../dist`;

/**
 * Middleware to serve static files
 */
app.use(express.static(distPath));

/**
 * For all routes serve index.html and pass routing to client
 */
app.get("*", (req, res) => {
    res.sendFile("index.html", { root: "dist" });
});

app.listen(3000, () => {
    console.log(`[server]: Server is running at http://localhost:3000`);
});
