import os
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any

# Ensure directories exist
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(BASE_DIR), "data")
UPLOADS_DIR = os.path.join(os.path.dirname(BASE_DIR), "uploads") # Shared upload directory with frontend or node server

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)

INCIDENTS_FILE = os.path.join(DATA_DIR, "incidents.json")

def get_now_iso(offset_hours: float = 0) -> str:
    dt = datetime.utcnow() + timedelta(hours=offset_hours)
    return dt.isoformat() + "Z"

initial_demo_incidents = [
    {
        "id": "INC-2026-001",
        "reporterName": "Meera Nair",
        "phone": "+91 98451 23456",
        "description": "Huge fire broke out in the local textile warehouse. Thick black smoke everywhere. Looks like a major electrical short circuit. Some workers might be on the upper floors.",
        "crisisType": "Fire Emergency",
        "severity": "Critical",
        "confidence": 98.0,
        "summary": "Critical warehouse fire with smoke spread and potential trapped casualties, suspected electrical hazard origins.",
        "location": "Gandhipuram Industrial Zone",
        "latitude": 11.0168,
        "longitude": 76.9558,
        "recommendedDepartments": ["Fire and Rescue", "Ambulance and Medical"],
        "assignedDepartment": "Fire and Rescue",
        "status": "In Progress",
        "imageUrl": "",
        "audioUrl": "",
        "createdAt": get_now_iso(-4),
        "updatedAt": get_now_iso(-3),
        "isDemo": True
    },
    {
        "id": "INC-2026-002",
        "reporterName": "Rajesh Kumar",
        "phone": "+91 94432 98765",
        "description": "Two-car high-speed collision on the highway near the flyover. One car flipped over. Passengers are injured and unable to get out of the car. Urgent medical attention required.",
        "crisisType": "Road Accident",
        "severity": "Critical",
        "confidence": 96.0,
        "summary": "High-severity traffic collision involving vehicular rollover and multiple trapped/injured occupants.",
        "location": "National Highway 47, near Flyover",
        "latitude": 11.0250,
        "longitude": 76.9650,
        "recommendedDepartments": ["Ambulance and Medical", "Police"],
        "assignedDepartment": "Ambulance and Medical",
        "status": "Team Dispatched",
        "imageUrl": "",
        "audioUrl": "",
        "createdAt": get_now_iso(-2),
        "updatedAt": get_now_iso(-1.5),
        "isDemo": True
    },
    {
        "id": "INC-2026-003",
        "reporterName": "Sarah Thomas",
        "phone": "+91 97890 12345",
        "description": "The main high-voltage electric transformer pole in our street is sparking heavily after the storm. Sparks are flying onto nearby dry trees. Fear of secondary fire.",
        "crisisType": "Electrical Hazard",
        "severity": "High",
        "confidence": 94.0,
        "summary": "Transformer arcing following a storm posing secondary brush fire hazards and electrical network risks.",
        "location": "Ramanathapuram, 4th Street",
        "latitude": 10.9980,
        "longitude": 76.9820,
        "recommendedDepartments": ["Electricity Department", "Fire and Rescue"],
        "assignedDepartment": "Electricity Department",
        "status": "Acknowledged",
        "imageUrl": "",
        "audioUrl": "",
        "createdAt": get_now_iso(-6),
        "updatedAt": get_now_iso(-5),
        "isDemo": True
    },
    {
        "id": "INC-2026-004",
        "reporterName": "Anil Sharma",
        "phone": "+91 98940 55667",
        "description": "Heavy rain has caused major street flooding. Water is entering the ground floor houses in our low-lying area. Seniors are stuck and need transport assistance to relief camps.",
        "crisisType": "Flood",
        "severity": "High",
        "confidence": 92.0,
        "summary": "Monsoon street flooding inundating residential ground floors, requiring active evacuations for elderly citizens.",
        "location": "Sungam Lake View Road",
        "latitude": 10.9920,
        "longitude": 76.9730,
        "recommendedDepartments": ["Disaster Management"],
        "assignedDepartment": "Disaster Management",
        "status": "New",
        "imageUrl": "",
        "audioUrl": "",
        "createdAt": get_now_iso(-0.5),
        "updatedAt": get_now_iso(-0.5),
        "isDemo": True
    },
    {
        "id": "INC-2026-005",
        "reporterName": "Priya Sundar",
        "phone": "+91 96554 11223",
        "description": "Elderly gentleman collapsed at the park while jogging. He is unconscious and breathing very shallowly. We have called for help, starting bystander CPR.",
        "crisisType": "Medical Emergency",
        "severity": "Critical",
        "confidence": 95.0,
        "summary": "Sudden cardiac arrest / unconscious state in public park, active bystander CPR being performed.",
        "location": "Race Course Park",
        "latitude": 10.9992,
        "longitude": 76.9612,
        "recommendedDepartments": ["Ambulance and Medical"],
        "assignedDepartment": "Ambulance and Medical",
        "status": "Resolved",
        "imageUrl": "",
        "audioUrl": "",
        "createdAt": get_now_iso(-8),
        "updatedAt": get_now_iso(-7.2),
        "isDemo": True
    }
]

def load_incidents() -> List[Dict[str, Any]]:
    try:
        if os.path.exists(INCIDENTS_FILE):
            with open(INCIDENTS_FILE, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if content:
                    return json.loads(content)
    except Exception as e:
        print(f"Error loading incidents JSON: {e}")
    
    # If file doesn't exist or is invalid/empty, seed and save
    save_incidents(initial_demo_incidents)
    return initial_demo_incidents

def save_incidents(incidents: List[Dict[str, Any]]) -> None:
    try:
        with open(INCIDENTS_FILE, "w", encoding="utf-8") as f:
            json.dump(incidents, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error saving incidents JSON: {e}")
