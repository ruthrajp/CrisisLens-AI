import os
from dotenv import load_dotenv

# Load environment variables from parent directory or local .env
load_dotenv()

# We can check parent directory or root as well if needed
if not os.getenv("GEMINI_API_KEY"):
    # Try reading from parent directory .env
    parent_env = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
    if os.path.exists(parent_env):
        load_dotenv(parent_env)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "0.0.0.0")
