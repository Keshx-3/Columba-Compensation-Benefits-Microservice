import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CompensationService, EmployeeCompensation } from '../services';

@Component({
    selector: 'app-employee-compensation-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './employee-compensation-list.component.html',
    styles: [`
    .container { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-bottom: 15px; background: white; }
    .btn-primary { background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; }
    .btn-secondary { background-color: #6c757d; color: white; padding: 5px 10px; text-decoration: none; border-radius: 4px; margin-right: 10px; }
  `]
})
export class EmployeeCompensationListComponent implements OnInit {
    compensations: EmployeeCompensation[] = [];
    employeeId: string = '';

    constructor(
        private route: ActivatedRoute,
        private compensationService: CompensationService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.employeeId = params.get('id') || '';
            if (this.employeeId) {
                this.loadCompensation();
            }
        });
    }

    loadCompensation() {
        this.compensationService.getEmployeeCompensation(this.employeeId).subscribe(data => {
            this.compensations = data;
        });
    }
}
