import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-employee-lookup',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './employee-lookup.component.html',
    styleUrl: './employee-lookup.component.css'
})
export class EmployeeLookupComponent {
    employeeId: string = '';

    constructor(private router: Router) { }

    onSearch() {
        if (this.employeeId) {
            this.router.navigate(['/employees', this.employeeId, 'compensation']);
        }
    }
}
