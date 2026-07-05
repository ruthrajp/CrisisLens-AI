import re

def adjust_severity_and_crisis(text: str, is_crisis: bool, crisis_type: str, severity: str) -> tuple[bool, str, str]:
    """
    Context-aware severity and crisis validator.
    Prevents false positives (e.g., movie reviews) and elevates true emergencies (e.g., factory fires with trapped people).
    """
    if not text:
        return is_crisis, crisis_type, severity

    text_lower = text.lower()

    # 1. False positive check (e.g. "The fire movie was amazing")
    entertainment_words = ["movie", "film", "show", "game", "song", "play", "theatre", "flick"]
    positive_words = ["amazing", "excellent", "awesome", "great", "cool", "fantastic", "wonderful", "love"]
    
    has_entertainment = any(word in text_lower for word in entertainment_words)
    has_positive = any(word in text_lower for word in positive_words)
    
    if has_entertainment and has_positive and "fire" in text_lower:
        # Most likely a movie or game review, not an active fire crisis
        return False, "Other", "Low"

    # 2. Critical emergency check (e.g. "Fire is spreading through a textile shop and two workers are trapped.")
    is_fire = "fire" in text_lower or "smoke" in text_lower
    is_serious = any(w in text_lower for w in ["spread", "trapped", "workers", "trapped", "locked", "people inside", "burning"])
    is_commercial = any(w in text_lower for w in ["textile", "shop", "factory", "warehouse", "store", "mall"])

    if is_fire and is_serious and is_commercial:
        return True, "Fire Emergency", "Critical"

    # Normalize severity to allowed values: Critical, High, Medium, Low
    severity_map = {
        "critical": "Critical",
        "high": "High",
        "medium": "Medium",
        "low": "Low"
    }
    normalized_severity = severity_map.get(severity.lower(), "Medium")

    return is_crisis, crisis_type, normalized_severity
