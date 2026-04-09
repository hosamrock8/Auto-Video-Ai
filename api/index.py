import os
import sys

# Add current directory to path for Vercel module resolution
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import app, handler
