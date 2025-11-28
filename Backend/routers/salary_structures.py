from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Annotated
from sqlalchemy.orm import Session
from datetime import datetime
from database import SessionLocal
from models import SalaryStructure, CompensationComponent, CountryEnum, ComponentTypeEnum, RuleTypeEnum

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

#Schemas
class CompensationComponentBase(BaseModel):
    name: str
    type: ComponentTypeEnum
    rule_type: Optional[RuleTypeEnum] = None
    # rule_value: Optional[float] = None

class CompensationComponentCreate(CompensationComponentBase):
    pass

class CompensationComponentResponse(CompensationComponentBase):
    id: int
    structure_id: int
    # created_at: datetime
    # updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class SalaryStructureBase(BaseModel):
    name: str
    country: CountryEnum

class SalaryStructureCreate(SalaryStructureBase):
    components: List[CompensationComponentCreate]

class SalaryStructureCommon(SalaryStructureBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.strftime("%Y-%m-%d %H:%M:%S")
        }

class SalaryStructureResponse(SalaryStructureCommon):
    components: List["CompensationComponentResponse"] = []

class SalaryStructureDetailResponse(SalaryStructureCommon):
    components: List["CompensationComponentResponse"] = []


#Router
router = APIRouter(prefix="/structures", tags=["Salary Structures"])

# Create a new salary structure
@router.post("/", status_code=201)
def create_salary_structure(structure: SalaryStructureCreate, db: db_dependency):
    new_structure = SalaryStructure(
        name = structure.name,
        country = structure.country
    )
    db.add(new_structure)
    db.flush()

    for component in structure.components:
        new_component = CompensationComponent(
            structure_id = new_structure.id,
            name = component.name,
            type = component.type,
            rule_type = component.rule_type,
        )
        db.add(new_component)

    db.commit()
    db.refresh(new_structure)
    return new_structure



# Get a list of all salary structures.
@router.get("/", response_model=List[SalaryStructureResponse])
def get_all_salary_structures(db: db_dependency):
    structures = db.query(SalaryStructure).all()
    if not structures:
        raise HTTPException(status_code=404, detail="No salary structures found")
    return structures



# Get details of one salary structure
@router.get("/{structure_id}", response_model=SalaryStructureDetailResponse, status_code=200)
def get_salary_structure(structure_id: int, db: db_dependency):
    structure = db.query(SalaryStructure).filter(SalaryStructure.id == structure_id).first()
    if not structure:
        raise HTTPException(status_code=404, detail="Salary structure not found")
    return structure



# Update a salary structure
@router.put("/{structure_id}", response_model=SalaryStructureResponse, status_code=200)
def update_salary_structure(structure_id: int, structure: SalaryStructureCreate, db: db_dependency):
    db_structure = db.query(SalaryStructure).filter(SalaryStructure.id == structure_id).first()
    if not db_structure:
        raise HTTPException(status_code=404, detail="Salary structure not found")
    db_structure.name = structure.name
    db_structure.country = structure.country
    db_structure.updated_at = datetime.now()


    db.query(CompensationComponent).filter(CompensationComponent.structure_id == structure_id).delete()

    for component in structure.components:
        new_component = CompensationComponent(
            structure_id = db_structure.id,
            name = component.name,
            type = component.type,
            rule_type = component.rule_type,

        )
        db.add(new_component)

    db.commit()
    db.refresh(db_structure)
    return db_structure



# Delete a salary structure
@router.delete("/{structure_id}", status_code=204)
def delete_salary_structure(structure_id: int, db: db_dependency):
    structure = db.query(SalaryStructure).filter(SalaryStructure.id == structure_id).first()
    if not structure:
        raise HTTPException(status_code=404, detail="Salary structure not found")
    db.delete(structure)
    db.commit()
    return None
