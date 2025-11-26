from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Annotated
from sqlalchemy.orm import Session
from datetime import datetime, date
from database import SessionLocal
from models import EmployeeCompensation, EmployeeComponentValue, SalaryStructure, CompensationComponent

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]


class EmployeeComponentValueBase(BaseModel):
    component_id: int
    value: float

class EmployeeComponentValueCreate(EmployeeComponentValueBase):
    pass

class EmployeeComponentValueResponse(EmployeeComponentValueBase):
    id: int
    employee_compensation_id: int

    class Config:
        orm_mode = True

class EmployeeCompensationBase(BaseModel):
    employee_id: str
    structure_id: int
    effective_from: date

class EmployeeCompensationCreate(EmployeeCompensationBase):
    component_values: List[EmployeeComponentValueCreate]

class EmployeeCompensationResponse(EmployeeCompensationBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    component_values: List[EmployeeComponentValueResponse] = []

    class Config:
        orm_mode = True


router = APIRouter(prefix="/employees", tags=["Employee Compensation"])


@router.post("/{employee_id}/compensation", response_model=EmployeeCompensationResponse, status_code=201)
def assign_employee_compensation(
        employee_id: str,
        data: EmployeeCompensationCreate,
        db: Session = Depends(get_db)
):
    structure = db.query(SalaryStructure).filter(SalaryStructure.id == data.structure_id).first()
    if not structure:
        raise HTTPException(status_code=404, detail="Salary structure not found")

    # Check if employee ID in path matches body (optional validation)
    if employee_id != data.employee_id:
        raise HTTPException(status_code=400, detail="Employee ID mismatch")

    new_compensation = EmployeeCompensation(
        employee_id=data.employee_id,
        structure_id=data.structure_id,
        effective_from=data.effective_from
    )
    db.add(new_compensation)
    db.commit()
    db.refresh(new_compensation)

    # Validate Component Exists and belongs to structure
    valid_component_ids = {c.id for c in structure.components}

    for val_data in data.component_values:
        if val_data.component_id not in valid_component_ids:
            raise HTTPException(status_code=400,
                                detail=f"Component ID {val_data.component_id} does not belong to Structure ID {data.structure_id}")

        new_value = EmployeeComponentValue(
            employee_compensation_id=new_compensation.id,
            component_id=val_data.component_id,
            value=val_data.value
        )
        db.add(new_value)

    db.commit()
    db.refresh(new_compensation)
    return new_compensation


@router.get("/{employee_id}/compensation", response_model=List[EmployeeCompensationResponse])
def get_employee_compensation(employee_id: str, db: Session = Depends(get_db)):
    comp_records = db.query(EmployeeCompensation).filter(EmployeeCompensation.employee_id == employee_id).all()
    if not comp_records:
        raise HTTPException(status_code=404, detail="Compensation details not found for this employee")
    return comp_records


@router.put("/{employee_id}/compensation", response_model=EmployeeCompensationResponse)
def update_employee_compensation(
        employee_id: str,
        data: EmployeeCompensationCreate,
        db: Session = Depends(get_db)
):
    # Find the latest compensation record
    # This is a simplification. In reality, you'd likely update a specific compensation ID or create a new effective dated record.
    latest_comp = db.query(EmployeeCompensation) \
        .filter(EmployeeCompensation.employee_id == employee_id) \
        .order_by(EmployeeCompensation.effective_from.desc()) \
        .first()

    if not latest_comp:
        raise HTTPException(status_code=404, detail="No existing compensation record found to update")

    # Update fields
    latest_comp.structure_id = data.structure_id
    latest_comp.effective_from = data.effective_from

    # Validate new structure and components
    structure = db.query(SalaryStructure).filter(SalaryStructure.id == data.structure_id).first()
    if not structure:
        raise HTTPException(status_code=404, detail="Salary structure not found")

    valid_component_ids = {c.id for c in structure.components}
    for val_data in data.component_values:
        if val_data.component_id not in valid_component_ids:
            raise HTTPException(status_code=400, detail=f"Component ID {val_data.component_id} does not belong to Structure ID {data.structure_id}")

    # Update Values (Full Replacement)
    db.query(EmployeeComponentValue).filter(EmployeeComponentValue.employee_compensation_id == latest_comp.id).delete()

    for val_data in data.component_values:
        new_value = EmployeeComponentValue(
            employee_compensation_id=latest_comp.id,
            component_id=val_data.component_id,
            value=val_data.value
        )
        db.add(new_value)

    db.commit()
    db.refresh(latest_comp)
    return latest_comp


