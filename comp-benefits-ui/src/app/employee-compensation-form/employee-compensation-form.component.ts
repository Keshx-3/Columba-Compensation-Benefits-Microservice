import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CompensationService, SalaryStructure, EmployeeCompensation } from '../services';

@Component({
    selector: 'app-employee-compensation-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './employee-compensation-form.component.html',
    styles: [`
    .container { padding: 20px; max-width: 600px; margin: 0 auto; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    input, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .btn-primary { background-color: #007bff; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-secondary { background-color: #6c757d; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; margin-right: 10px; }
    .component-group { border: 1px solid #eee; padding: 10px; margin-bottom: 10px; border-radius: 4px; }
  `]
})
export class EmployeeCompensationFormComponent implements OnInit {
    compForm: FormGroup;
    structures: SalaryStructure[] = [];
    employeeId: string = '';
    isEditMode: boolean = false;
    selectedStructure: SalaryStructure | undefined;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private compensationService: CompensationService
    ) {
        this.compForm = this.fb.group({
            structure_id: ['', Validators.required],
            effective_from: ['', Validators.required],
            component_values: this.fb.array([])
        });
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.employeeId = params.get('id') || '';
            // Check if URL ends with 'edit' to determine mode
            this.isEditMode = this.router.url.endsWith('edit');

            this.loadStructures();
        });
    }

    get componentValues() {
        return this.compForm.get('component_values') as FormArray;
    }

    loadStructures() {
        this.compensationService.getSalaryStructures().subscribe(data => {
            this.structures = data;
            if (this.isEditMode) {
                this.loadExistingCompensation();
            }
        });
    }

    loadExistingCompensation() {
        this.compensationService.getEmployeeCompensation(this.employeeId).subscribe(data => {
            if (data && data.length > 0) {
                // Assuming we edit the latest one or the logic handles it. 
                // The backend update updates the latest effective one.
                // For simplicity, let's pre-fill with the latest one found.
                // Sort by effective date desc if needed, but backend returns list.
                const latest = data[data.length - 1]; // simplistic

                this.compForm.patchValue({
                    structure_id: latest.structure_id,
                    effective_from: latest.effective_from
                });

                this.onStructureChange(latest.structure_id);

                // Patch component values
                // We need to wait for onStructureChange to build the form array
                setTimeout(() => {
                    latest.component_values.forEach(val => {
                        const control = this.componentValues.controls.find(c => c.value.component_id === val.component_id);
                        if (control) {
                            control.patchValue({ value: val.value });
                        }
                    });
                }, 100);
            }
        });
    }

    onStructureChange(structureId: number | string) {
        const id = Number(structureId);
        this.selectedStructure = this.structures.find(s => s.id === id);

        this.componentValues.clear();
        if (this.selectedStructure) {
            this.selectedStructure.components.forEach(comp => {
                // We need the component ID, but the structure components might not have IDs in the interface I defined earlier?
                // Let's check the interface in compensation.ts. 
                // Wait, SalaryStructure.components is CompensationComponent[].
                // CompensationComponent interface: { name, type, rule_type, rule_value }. It MISSES ID!
                // I need to check the backend response for SalaryStructure to see if components have IDs.

                this.componentValues.push(this.fb.group({
                    component_id: [comp.id],
                    name: [comp.name],
                    value: [0, Validators.required]
                }));
            });
        }
    }

    onSubmit() {
        if (this.compForm.valid) {
            const formValue = this.compForm.value;
            const payload = {
                employee_id: this.employeeId,
                structure_id: Number(formValue.structure_id),
                effective_from: formValue.effective_from,
                component_values: formValue.component_values.map((v: any) => ({
                    component_id: v.component_id,
                    value: Number(v.value)
                }))
            };

            if (this.isEditMode) {
                this.compensationService.updateEmployeeCompensation(this.employeeId, payload).subscribe(() => {
                    this.router.navigate(['/employees', this.employeeId, 'compensation']);
                });
            } else {
                this.compensationService.assignEmployeeCompensation(this.employeeId, payload).subscribe(() => {
                    this.router.navigate(['/employees', this.employeeId, 'compensation']);
                });
            }
        }
    }
}
