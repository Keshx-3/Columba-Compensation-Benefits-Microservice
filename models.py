from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime, ForeignKey, Enum, func
from sqlalchemy.orm import relationship
from database import Base
import enum


# ENUMS
class CountryEnum(str, enum.Enum):
    UAE = "UAE"
    KSA = "KSA"
    INDIA = "India"


class ComponentTypeEnum(str, enum.Enum):
    earning = "earning"
    deduction = "deduction"
    benefit = "benefit"


class RuleTypeEnum(str, enum.Enum):
    fixed = "fixed"
    percentage = "percentage"



# SALARY STRUCTURES
class SalaryStructure(Base):
    __tablename__ = "salary_structures"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    country = Column(Enum(CountryEnum), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    components = relationship("CompensationComponent", back_populates="structure", cascade="all, delete")



# COMPONENTS
class CompensationComponent(Base):
    __tablename__ = "compensation_components"

    id = Column(Integer, primary_key=True, index=True)
    structure_id = Column(Integer, ForeignKey("salary_structures.id"), nullable=False)
    name = Column(String, nullable=False)
    type = Column(Enum(ComponentTypeEnum), nullable=False)
    rule_type = Column(Enum(RuleTypeEnum), nullable=True)
    rule_value = Column(Numeric, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    structure = relationship("SalaryStructure", back_populates="components")



# EMPLOYEE COMPENSATION
class EmployeeCompensation(Base):
    __tablename__ = "employees_compensation"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, nullable=False)
    structure_id = Column(Integer, ForeignKey("salary_structures.id"), nullable=False)
    effective_from = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    structure = relationship("SalaryStructure")
    component_values = relationship("EmployeeComponentValue", back_populates="employee_compensation", cascade="all, delete")



# EMPLOYEE COMPONENT VALUES
class EmployeeComponentValue(Base):
    __tablename__ = "employee_component_values"

    id = Column(Integer, primary_key=True, index=True)
    employee_compensation_id = Column(Integer, ForeignKey("employees_compensation.id"), nullable=False)
    component_id = Column(Integer, ForeignKey("compensation_components.id"), nullable=False)
    value = Column(Numeric, nullable=False)

    # Relationships
    employee_compensation = relationship("EmployeeCompensation", back_populates="component_values")
    component = relationship("CompensationComponent")
