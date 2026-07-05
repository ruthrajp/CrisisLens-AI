import os
import uuid
import base64
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, status, Body

from backend.schemas import IncidentSchema, IncidentCreateSchema, StatusUpdateSchema
from backend.database import load_incidents, save_incidents, UPLOADS_DIR
from backend.services.gemini_service import analyze_incident
from backend.services.routing_service import determine_assigned_department

router = APIRouter(prefix="/incidents", tags=["incidents"])

# Allowed status transitions
STATUS_FLOW = ["New", "Acknowledged", "Team Dispatched", "In Progress", "Resolved"]

@router.get("", response_model=List[IncidentSchema])
def get_incidents():
    try:
        return load_incidents()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve incidents: {str(e)}")

@router.get("/{incident_id}", response_model=IncidentSchema)
def get_incident(incident_id: str):
    incidents = load_incidents()
    incident = next((inc for inc in incidents if inc["id"] == incident_id), None)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

@router.post("", response_model=IncidentSchema, status_code=201)
def create_incident(payload: IncidentCreateSchema):
    try:
        incidents = load_incidents()
        
        # Generate distinct ID
        year = datetime.now().year
        import random
        rand_id = random.randint(100000, 999999)
        incident_id = f"INC-{year}-{rand_id}"

        image_url = ""
        audio_url = ""

        # Save Base64 Image to file if present
        if payload.imageBase64:
            try:
                mime = payload.imageMimeType or "image/png"
                ext = mime.split("/")[-1] if "/" in mime else "png"
                # Strip base64 header
                b64_data = payload.imageBase64
                if "," in b64_data:
                    b64_data = b64_data.split(",")[1]
                
                filename = f"img_{incident_id}.{ext}"
                filepath = os.path.join(UPLOADS_DIR, filename)
                with open(filepath, "wb") as f:
                    f.write(base64.b64decode(b64_data))
                image_url = f"/uploads/{filename}"
            except Exception as e:
                print(f"Error saving image file: {e}")

        # Save Base64 Audio to file if present
        if payload.audioBase64:
            try:
                mime = payload.audioMimeType or "audio/wav"
                ext = mime.split("/")[-1] if "/" in mime else "wav"
                b64_data = payload.audioBase64
                if "," in b64_data:
                    b64_data = b64_data.split(",")[1]

                filename = f"audio_{incident_id}.{ext}"
                filepath = os.path.join(UPLOADS_DIR, filename)
                with open(filepath, "wb") as f:
                    f.write(base64.b64decode(b64_data))
                audio_url = f"/uploads/{filename}"
            except Exception as e:
                print(f"Error saving audio file: {e}")

        # Trigger Gemini AI Multimodal Analysis
        ai_res = analyze_incident(
            description=payload.description,
            location=payload.location,
            image_base64=payload.imageBase64,
            image_mime_type=payload.imageMimeType,
            audio_base64=payload.audioBase64,
            audio_mime_type=payload.audioMimeType
        )

        # Apply department routing
        assigned_dept = determine_assigned_department(
            crisis_type=ai_res.get("crisisType", "Other"),
            recommended_departments=ai_res.get("recommendedDepartments", [])
        )

        now_iso = datetime.utcnow().isoformat() + "Z"
        
        new_incident = {
            "id": incident_id,
            "reporterName": payload.reporterName,
            "phone": payload.phone,
            "description": payload.description or "Report submitted via voice recording. Voice log registered by system.",
            "crisisType": ai_res.get("crisisType", "Other"),
            "severity": ai_res.get("severity", "Medium"),
            "confidence": float(ai_res.get("confidence", 85.0)),
            "summary": ai_res.get("summary", "Emergency incident logged."),
            "location": payload.location or ai_res.get("extractedLocation") or "Identified Sector",
            "latitude": payload.latitude if payload.latitude is not None else 11.0168 + (random.random() - 0.5) * 0.05,
            "longitude": payload.longitude if payload.longitude is not None else 76.9558 + (random.random() - 0.5) * 0.05,
            "recommendedDepartments": ai_res.get("recommendedDepartments", ["Police"]),
            "assignedDepartment": assigned_dept,
            "status": "New",
            "imageUrl": image_url,
            "audioUrl": audio_url,
            "createdAt": now_iso,
            "updatedAt": now_iso,
            "isDemo": False
        }

        incidents.insert(0, new_incident) # Push to front of queue
        save_incidents(incidents)

        return new_incident
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to submit incident: {str(e)}")

# PATCH endpoint matching the exact React frontend requests for updating status or assignedDepartment
@router.patch("/{incident_id}", response_model=IncidentSchema)
def patch_incident(incident_id: str, updates: Dict[str, Any] = Body(...)):
    incidents = load_incidents()
    idx = next((i for i, inc in enumerate(incidents) if inc["id"] == incident_id), -1)
    if idx == -1:
        raise HTTPException(status_code=404, detail="Incident not found")

    incident = incidents[idx]
    
    # Apply partial updates
    if "status" in updates:
        new_status = updates["status"]
        if new_status in STATUS_FLOW:
            incident["status"] = new_status
    if "assignedDepartment" in updates:
        incident["assignedDepartment"] = updates["assignedDepartment"]
        
    incident["updatedAt"] = datetime.utcnow().isoformat() + "Z"
    
    incidents[idx] = incident
    save_incidents(incidents)
    return incident

# PUT status transition validation endpoint (per requirements)
@router.put("/{incident_id}/status", response_model=IncidentSchema)
def update_status(incident_id: str, payload: StatusUpdateSchema):
    incidents = load_incidents()
    idx = next((i for i, inc in enumerate(incidents) if inc["id"] == incident_id), -1)
    if idx == -1:
        raise HTTPException(status_code=404, detail="Incident not found")

    incident = incidents[idx]
    current_status = incident.get("status", "New")
    new_status = payload.status

    if new_status not in STATUS_FLOW:
        raise HTTPException(status_code=400, detail=f"Invalid status value. Allowed: {STATUS_FLOW}")

    # Verify status transition order (only allow sequential progression or staying the same)
    try:
        curr_idx = STATUS_FLOW.index(current_status)
        new_idx = STATUS_FLOW.index(new_status)
        if new_idx < curr_idx:
            raise HTTPException(status_code=400, detail=f"Cannot transition backwards from {current_status} to {new_status}")
    except ValueError:
        pass # If status is custom, allow it

    incident["status"] = new_status
    incident["updatedAt"] = datetime.utcnow().isoformat() + "Z"
    
    incidents[idx] = incident
    save_incidents(incidents)
    return incident

@router.delete("")
def reset_incidents():
    try:
        incidents = load_incidents()
        # Keep only demo incidents
        clean_incidents = [inc for inc in incidents if inc.get("isDemo")]
        save_incidents(clean_incidents)
        return {"message": "Successfully reset incidents to demo seeds", "count": len(clean_incidents)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reset database: {str(e)}")
