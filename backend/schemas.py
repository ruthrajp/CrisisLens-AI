from pydantic import BaseModel
from typing import List, Optional

class IncidentSchema(BaseModel):
    id: str
    reporterName: str
    phone: str
    description: str
    crisisType: str
    severity: str  # "Critical", "High", "Medium", "Low"
    confidence: float
    summary: str
    location: str
    latitude: float
    longitude: float
    recommendedDepartments: List[str]
    assignedDepartment: str
    status: str  # "New", "Acknowledged", "Team Dispatched", "In Progress", "Resolved"
    imageUrl: Optional[str] = ""
    audioUrl: Optional[str] = ""
    createdAt: str
    updatedAt: str
    isDemo: Optional[bool] = False

class IncidentCreateSchema(BaseModel):
    reporterName: str
    phone: str
    description: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    imageBase64: Optional[str] = None
    imageMimeType: Optional[str] = None
    audioBase64: Optional[str] = None
    audioMimeType: Optional[str] = None

class StatusUpdateSchema(BaseModel):
    status: str
    notes: Optional[str] = None
