# Columba Compensation & Benefits Microservice

## Short Description
The Columba Compensation & Benefits Microservice is a comprehensive solution for managing organization-wide salary structures and employee compensation plans. It allows HR administrators to define flexible salary structures tailored to different regions (UAE, KSA, India) and assign them to employees, ensuring accurate and compliant compensation management.

## Deployment
The application is live and hosted on AWS:
- **Frontend**: [https://columba-compensation-benefits-microservice.d2eg01ttcumfu2.amplifyapp.com/](https://columba-compensation-benefits-microservice.d2eg01ttcumfu2.amplifyapp.com/)
- **Backend API**: [https://16-24-114-189.nip.io](https://16-24-114-189.nip.io)
- **Swagger Documentation**: [https://16-24-114-189.nip.io/docs](https://16-24-114-189.nip.io/docs)

## Tech Stack
- **Backend**: FastAPI (Python), SQLAlchemy, PostgreSQL, Pydantic, Alembic
- **Frontend**: Angular (TypeScript), HTML, CSS
- **Database**: PostgreSQL

## Features
- **Salary Structure Management**:
  - Create, view, update, and delete salary structures.
  - Define custom compensation components (e.g., Basic, Housing, Transport).
  - Support for different rule types (Fixed, Formula-based).
  - Country-specific configurations.
- **Employee Compensation**:
  - Assign salary structures to employees.
  - Manage effective dates for compensation plans.
  - View compensation history for employees.
  - Update existing compensation records.

## Setup Instructions

### Backend
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd comp-benefits-ui
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200`.

## How to Run
1. Ensure the Backend server is running on port `8000`.
2. Ensure the Frontend application is running on port `4200`.
3. Open your browser and navigate to `http://localhost:4200` to use the application.

## API Endpoints
### Salary Structures
- `GET /structures/`: Retrieve a list of all salary structures.
- `POST /structures/`: Create a new salary structure.
- `GET /structures/{structure_id}`: Retrieve details of a specific salary structure.
- `PUT /structures/{structure_id}`: Update an existing salary structure.
- `DELETE /structures/{structure_id}`: Delete a salary structure.

### Employee Compensation
- `GET /employees/{employee_id}/compensation`: Retrieve compensation history for an employee.
- `POST /employees/{employee_id}/compensation`: Assign a new compensation plan to an employee.
- `PUT /employees/{employee_id}/compensation`: Update the latest compensation record for an employee.

## Screenshots/Demo
Create Salary Structure
<img width="1892" height="903" alt="comp-benefits-structure-create" src="https://github.com/user-attachments/assets/946297fb-1d5e-47af-a286-893424b654e6" />

Salary Structure CRUD
<img width="1895" height="906" alt="comp-benefits-structure-CRUD" src="https://github.com/user-attachments/assets/2a4385bb-9e37-4f1b-a75e-d1ed70722a01" />

Salary Structure Details
<img width="1897" height="906" alt="comp-benefits-structure-details" src="https://github.com/user-attachments/assets/c2c0d924-21bb-4a85-95e9-f19ecb7f21a4" />

Employee Compensation
<img width="1895" height="905" alt="comp-benefits-employee-compensation" src="https://github.com/user-attachments/assets/7110d7e6-70ba-4633-aa03-604ac2b462c0" />

Employee Compensation Value
<img width="1896" height="905" alt="comp-benefits-employee-comp-value" src="https://github.com/user-attachments/assets/135471a0-777d-4501-8fac-54eef27a65ca" />



<br>
<br>
