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
                console.log('Structures loaded via AsyncPipe:', data);
                // We still need the data for onStructureChange, so we might need to store it or find it from the array in the template
                // But for now let's just see if it loads.
                // To support the existing logic, we can tap and assign to a local var if needed, 
                // but better to rely on the async pipe result in the template.
                // However, onStructureChange needs the full object.
                // Let's assign to a local variable here as a side effect (not ideal but practical for now)
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

    // Keep this for local access if needed, but try to use observable
    structures: SalaryStructure[] = [];

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.employeeId = params.get('id') || '';
            this.isEditMode = this.router.url.endsWith('edit');
            // loadStructures is no longer needed as we init observable in constructor
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

                // Ensure structures are loaded before triggering change
                if (this.structures.length > 0) {
                    this.onStructureChange(latest.structure_id);
                    this.patchComponentValues(latest);
                } else {
                    // If structures not loaded yet, wait for them (simple retry or check in tap)
                    // Since we load structures in constructor, they should be there or coming.
                    // We can subscribe to structures$ again or just rely on the tap in constructor updating this.structures
                    // A better way is to combineLatest but for now let's just check
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
