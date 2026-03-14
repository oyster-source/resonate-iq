import os
import json
import logging
from typing import Any, Dict, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_env_vars() -> Dict[str, str]:
    """
    Load environment variables from .env file securely.
    """
    # In a real implementation, use python-dotenv
    # from dotenv import load_dotenv
    # load_dotenv()
    return dict(os.environ)

def save_json(data: Any, filepath: str) -> None:
    """
    Save data to a JSON file safely.
    """
    try:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        logger.info(f"Successfully saved data to {filepath}")
    except Exception as e:
        logger.error(f"Failed to save JSON to {filepath}: {e}")
        raise

def load_json(filepath: str) -> Optional[Any]:
    """
    Load data from a JSON file.
    """
    try:
        if not os.path.exists(filepath):
            logger.warning(f"File not found: {filepath}")
            return None
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Failed to load JSON from {filepath}: {e}")
        raise
