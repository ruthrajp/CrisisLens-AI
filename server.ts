import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { spawn } from "child_process";
import { request } from "http";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Spawn Python FastAPI backend on port 8000
function startPythonBackend() {
  console.log("Spawning Python FastAPI Backend on port 8000...");
  
  // Try running inside virtual environment or system Python
  const isWindows = process.platform === "win32";
  const pythonCmd = isWindows ? "backend\\venv\\Scripts\\python" : "backend/venv/bin/python";
  
  let child;
  if (require("fs").existsSync(path.join(process.cwd(), pythonCmd + (isWindows ? ".exe" : "")))) {
    console.log(`Found virtual environment at ${pythonCmd}. Booting backend...`);
    child = spawn(pythonCmd, ["-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000"], {
      stdio: "inherit"
    });
  } else {
    console.log("Virtual environment not created or active yet. Falling back to system python3/python...");
    child = spawn("python3", ["-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000"], {
      stdio: "inherit"
    });
  }

  child.on("error", (err) => {
    console.warn("Failed to start Python backend via default paths. Retrying with system python...", err.message);
    const fallbackChild = spawn("python", ["-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000"], {
      stdio: "inherit"
    });
    fallbackChild.on("error", (e) => {
      console.error("CRITICAL: Failed to start Python FastAPI backend. Ensure uvicorn is installed in python path.", e.message);
    });
  });
}

// Start Python backend process
startPythonBackend();

// Native HTTP Proxy for routing /api and /uploads requests to the FastAPI backend on port 8000
const proxyToPython = (prefix: string) => {
  return (req: any, res: any) => {
    const targetPath = `${prefix}${req.url}`;
    const connector = request(
      {
        host: "127.0.0.1",
        port: 8000,
        path: targetPath,
        method: req.method,
        headers: req.headers,
      },
      (targetResponse) => {
        res.writeHead(targetResponse.statusCode || 200, targetResponse.headers);
        targetResponse.pipe(res);
      }
    );
    
    req.pipe(connector);
    
    connector.on("error", (err) => {
      console.error(`Proxy Error connecting to FastAPI for ${targetPath}:`, err.message);
      res.status(502).json({ 
        error: "Failed to connect to Python FastAPI backend", 
        details: err.message,
        suggestion: "Please wait a moment while the Python backend starts up, or ensure the Python virtualenv and dependencies have been installed."
      });
    });
  };
};

// Route API and upload requests to Python FastAPI
app.use("/api", proxyToPython("/api"));
app.use("/uploads", proxyToPython("/uploads"));

// Setup Vite or Production Static Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware on port 3000...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode on port 3000...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CrisisLens AI Frontend Proxy running at http://localhost:${PORT}`);
  });
}

startServer();
