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
    componentsMap: { [key: number]: string } = {};

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
                s.components.forEach(c => {
                    this.componentsMap[c.id] = c.name;
                });
            });
            this.loadCompensation();
        });
    }

    loadCompensation() {
        this.compensationService.getEmployeeCompensation(this.employeeId).subscribe({
            next: (data) => {
                this.compensations = data;
                this.cdr.detectChanges();
            },
            error: (err) => {
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
