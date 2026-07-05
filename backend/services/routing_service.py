from typing import List

def determine_assigned_department(crisis_type: str, recommended_departments: List[str]) -> str:
    """
    Determines the primary assigned department for an incident based on the crisis category
    and Gemini recommended departments, with fallback routing.
    """
    allowed_departments = {
        "Fire and Rescue",
        "Police",
        "Ambulance and Medical",
        "Disaster Management",
        "Electricity Department"
    }

    # Filter and validate recommended departments
    valid_recs = [dept for dept in recommended_departments if dept in allowed_departments]
    if valid_recs:
        return valid_recs[0]

    # Fallback heuristic mapping if no valid recommendation exists
    if crisis_type == "Fire Emergency":
        return "Fire and Rescue"
    elif crisis_type == "Road Accident":
        return "Police"
    elif crisis_type == "Medical Emergency":
        return "Ambulance and Medical"
    elif crisis_type == "Electrical Hazard":
        return "Electricity Department"
    elif crisis_type in ["Flood", "Natural Disaster", "Building Collapse"]:
        return "Disaster Management"
    
    return "Police"
