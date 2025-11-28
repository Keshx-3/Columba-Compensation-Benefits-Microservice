import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CompensationService, SalaryStructure, EmployeeCompensation } from '../services';

@Component({
    selector: 'app-employee-compensation-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './employee-compensation-form.component.html',
    styleUrl: './employee-compensation-form.component.css'
})
export class EmployeeCompensationFormComponent implements OnInit {
    compForm: FormGroup;
    structures$: Observable<SalaryStructure[]>;
    errorMessage: string = '';
    employeeId: string = '';
    isEditMode: boolean = false;
    selectedStructure: SalaryStructure | undefined;

    get componentValues(): FormArray {
        return this.compForm.get('component_values') as FormArray;
    }

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

        this.structures$ = this.compensationService.getSalaryStructures().pipe(
            tap(data => {
                this.structures = data;
                if (this.isEditMode) {
                    this.loadExistingCompensation();
                }
            }),
            catchError(err => {
                console.error('Error in AsyncPipe:', err);
                this.errorMessage = 'Error loading structures: ' + JSON.stringify(err);
                return of([]);
            })
        );
    }

    structures: SalaryStructure[] = [];

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.employeeId = params.get('id') || '';
            this.isEditMode = this.router.url.endsWith('edit');
        });
    }

    loadExistingCompensation() {
        this.compensationService.getEmployeeCompensation(this.employeeId).subscribe(data => {
            if (data && data.length > 0) {
                const latest = data[data.length - 1];

                this.compForm.patchValue({
                    structure_id: latest.structure_id,
                    effective_from: latest.effective_from
                });
                if (this.structures.length > 0) {
                    this.onStructureChange(latest.structure_id);
                    this.patchComponentValues(latest);
                } else {
                    const checkInterval = setInterval(() => {
                        if (this.structures.length > 0) {
                            clearInterval(checkInterval);
                            this.onStructureChange(latest.structure_id);
                            this.patchComponentValues(latest);
                        }
                    }, 100);
                }
            }
        });
    }

    patchComponentValues(latest: EmployeeCompensation) {
        latest.component_values.forEach(val => {
            const control = this.componentValues.controls.find(c => c.value.component_id === val.component_id);
            if (control) {
                control.patchValue({ value: val.value });
            }
        });
    }

    onStructureChange(structureId: number | string) {
        const id = Number(structureId);
        this.selectedStructure = this.structures.find(s => s.id === id);

        this.componentValues.clear();
        if (this.selectedStructure) {
            this.selectedStructure.components.forEach(comp => {
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
