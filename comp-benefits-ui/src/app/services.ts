import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CompensationComponent {
  id: number;
  name: string;
  type: 'earning' | 'deduction' | 'benefit';
  rule_type?: 'fixed' | 'percentage';
  // rule_value?: number;
}

export interface SalaryStructure {
  id?: number;
  name: string;
  country: 'UAE' | 'KSA' | 'India';
  created_at?: string;
  updated_at?: string;
  components: CompensationComponent[];
}

export interface EmployeeComponentValue {
  id?: number;
  component_id: number;
  value: number;
  employee_compensation_id?: number;
}

export interface EmployeeCompensation {
  id: number;
  employee_id: string;
  structure_id: number;
  effective_from: string;
  created_at: string;
  updated_at?: string;
  component_values: EmployeeComponentValue[];
}

export interface EmployeeCompensationCreate {
  employee_id: string;
  structure_id: number;
  effective_from: string;
  component_values: { component_id: number; value: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class CompensationService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getSalaryStructures(): Observable<SalaryStructure[]> {
    return this.http.get<SalaryStructure[]>(`${this.apiUrl}/structures/`);
  }

  getSalaryStructure(id: number): Observable<SalaryStructure> {
    return this.http.get<SalaryStructure>(`${this.apiUrl}/structures/${id}`);
  }

  createSalaryStructure(data: SalaryStructure): Observable<SalaryStructure> {
    return this.http.post<SalaryStructure>(`${this.apiUrl}/structures/`, data);
  }

  updateSalaryStructure(id: number, data: SalaryStructure): Observable<SalaryStructure> {
    return this.http.put<SalaryStructure>(`${this.apiUrl}/structures/${id}`, data);
  }

  deleteSalaryStructure(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/structures/${id}`);
  }

  // Employee Compensation Methods

  getEmployeeCompensation(employeeId: string): Observable<EmployeeCompensation[]> {
    return this.http.get<EmployeeCompensation[]>(`${this.apiUrl}/employees/${employeeId}/compensation`);
  }

  assignEmployeeCompensation(employeeId: string, data: EmployeeCompensationCreate): Observable<EmployeeCompensation> {
    return this.http.post<EmployeeCompensation>(`${this.apiUrl}/employees/${employeeId}/compensation`, data);
  }

  updateEmployeeCompensation(employeeId: string, data: EmployeeCompensationCreate): Observable<EmployeeCompensation> {
    return this.http.put<EmployeeCompensation>(`${this.apiUrl}/employees/${employeeId}/compensation`, data);
  }
}
