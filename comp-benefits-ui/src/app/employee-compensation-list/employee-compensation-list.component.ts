import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CompensationService, EmployeeCompensation } from '../services';

@Component({
    selector: 'app-employee-compensation-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './employee-compensation-list.component.html',
    styleUrl: './employee-compensation-list.component.css'
})
export class EmployeeCompensationListComponent implements OnInit {
    compensations: EmployeeCompensation[] = [];
    employeeId: string = '';

    constructor(
        private route: ActivatedRoute,
        private compensationService: CompensationService,
        private cdr: ChangeDetectorRef
    ) { }

    structuresMap: { [key: number]: string } = {};

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.employeeId = params.get('id') || '';
            if (this.employeeId) {
                this.loadData();
            }
        });
    }

    loadData() {
        // Load structures first to map names
        this.compensationService.getSalaryStructures().subscribe(structures => {
            structures.forEach(s => {
                if (s.id) this.structuresMap[s.id] = s.name;
            });
            this.loadCompensation();
        });
    }

    loadCompensation() {
        console.log('Loading compensation for employee:', this.employeeId);
        console.log('Current compensations before API call:', this.compensations);
        this.compensationService.getEmployeeCompensation(this.employeeId).subscribe({
            next: (data) => {
                console.log('Received compensation data:', data);
                console.log('Data length:', data.length);
                console.log('Data is array?', Array.isArray(data));
                this.compensations = data;
                console.log('After assignment, this.compensations:', this.compensations);
                console.log('After assignment, this.compensations.length:', this.compensations.length);
                this.cdr.detectChanges();
                console.log('Change detection triggered');
            },
            error: (err) => {
                console.error('Error loading compensation:', err);
                if (err.status === 404) {
                    console.log('404 error - setting compensations to empty array');
                    this.compensations = [];
                } else {
                    console.error('Other error:', err);
                }
            }
        });
    }
}
