import os
import random
import base64
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form

from backend.schemas import IncidentSchema
from backend.database import load_incidents, save_incidents, UPLOADS_DIR
from backend.services.gemini_service import analyze_incident
from backend.services.routing_service import determine_assigned_department

router = APIRouter(prefix="/analyze", tags=["analysis"])

@router.post("", response_model=IncidentSchema, status_code=201)
async def analyze_report_api(
    reporterName: str = Form(...),
    phone: str = Form(...),
    description: Optional[str] = Form(None),
    emergencyType: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    image: Optional[UploadFile] = File(None),
    audio: Optional[UploadFile] = File(None)
):
    try:
        incidents = load_incidents()
        
        # Generate distinct ID
        year = datetime.now().year
        rand_id = random.randint(100000, 999999)
        incident_id = f"INC-{year}-{rand_id}"

        image_url = ""
        audio_url = ""
        image_b64 = None
        image_mime = None
        audio_b64 = None
        audio_mime = None

        # Process image file if uploaded
        if image:
            try:
                contents = await image.read()
                image_mime = image.content_type or "image/png"
                ext = image_mime.split("/")[-1] if "/" in image_mime else "png"
                filename = f"img_{incident_id}.{ext}"
                filepath = os.path.join(UPLOADS_DIR, filename)
                
                with open(filepath, "wb") as f:
                    f.write(contents)
                
                image_url = f"/uploads/{filename}"
                image_b64 = base64.b64encode(contents).decode("utf-8")
            except Exception as e:
                print(f"Error handling multipart image upload: {e}")

        # Process audio file if uploaded
        if audio:
            try:
                contents = await audio.read()
                audio_mime = audio.content_type or "audio/wav"
                ext = audio_mime.split("/")[-1] if "/" in audio_mime else "wav"
                filename = f"audio_{incident_id}.{ext}"
                filepath = os.path.join(UPLOADS_DIR, filename)
                
                with open(filepath, "wb") as f:
                    f.write(contents)
                
                audio_url = f"/uploads/{filename}"
                audio_b64 = base64.b64encode(contents).decode("utf-8")
            except Exception as e:
                print(f"Error handling multipart audio upload: {e}")

        # Trigger Gemini Analysis
        ai_res = analyze_incident(
            description=description or f"Emergency reported with type {emergencyType}",
            location=location,
            image_base64=image_b64,
            image_mime_type=image_mime,
            audio_base64=audio_b64,
            audio_mime_type=audio_mime
        )

        # Apply department routing
        assigned_dept = determine_assigned_department(
            crisis_type=ai_res.get("crisisType", "Other"),
            recommended_departments=ai_res.get("recommendedDepartments", [])
        )

        now_iso = datetime.utcnow().isoformat() + "Z"
        
        new_incident = {
            "id": incident_id,
            "reporterName": reporterName,
            "phone": phone,
            "description": description or f"Report submitted via voice/form. Category selected: {emergencyType}",
            "crisisType": ai_res.get("crisisType", "Other"),
            "severity": ai_res.get("severity", "Medium"),
            "confidence": float(ai_res.get("confidence", 85.0)),
            "summary": ai_res.get("summary", "Emergency incident analyzed and registered."),
            "location": location or ai_res.get("extractedLocation") or "Identified Sector",
            "latitude": latitude if latitude is not None else 11.0168 + (random.random() - 0.5) * 0.05,
            "longitude": longitude if longitude is not None else 76.9558 + (random.random() - 0.5) * 0.05,
            "recommendedDepartments": ai_res.get("recommendedDepartments", ["Police"]),
            "assignedDepartment": assigned_dept,
            "status": "New",
            "imageUrl": image_url,
            "audioUrl": audio_url,
            "createdAt": now_iso,
            "updatedAt": now_iso,
            "isDemo": False
        }

        incidents.insert(0, new_incident)
        save_incidents(incidents)

        return new_incident
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze report: {str(e)}")
