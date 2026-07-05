from typing import List
from fastapi import APIRouter, HTTPException
from backend.schemas import IncidentSchema
from backend.database import load_incidents

router = APIRouter(prefix="/departments", tags=["departments"])

DEPARTMENTS = [
    "Fire and Rescue",
    "Police",
    "Ambulance and Medical",
    "Disaster Management",
    "Electricity Department"
]

@router.get("", response_model=List[str])
def get_departments():
    return DEPARTMENTS

@router.get("/{department_name}/incidents", response_model=List[IncidentSchema])
def get_department_incidents(department_name: str):
    if department_name not in DEPARTMENTS:
        # Check if URL encoded spacing or exact match works
        import urllib.parse
        decoded = urllib.parse.unquote(department_name)
        if decoded in DEPARTMENTS:
            department_name = decoded
        else:
            raise HTTPException(status_code=404, detail=f"Department '{department_name}' not found. Supported: {DEPARTMENTS}")

    incidents = load_incidents()
    filtered = [
        inc for inc in incidents 
        if inc.get("assignedDepartment") == department_name or 
        department_name in inc.get("recommendedDepartments", [])
    ]
    return filtered
