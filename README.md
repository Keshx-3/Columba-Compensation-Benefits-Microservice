# Columba Compensation & Benefits Microservice

## Short Description
The Columba Compensation & Benefits Microservice is a comprehensive solution for managing organization-wide salary structures and employee compensation plans. It allows HR administrators to define flexible salary structures tailored to different regions (UAE, KSA, India) and assign them to employees, ensuring accurate and compliant compensation management.

## Tech Stack
- **Backend**: FastAPI (Python), SQLAlchemy, PostgreSQL, Pydantic
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
*(Placeholder for screenshots or demo videos)*

<br>
<br>
