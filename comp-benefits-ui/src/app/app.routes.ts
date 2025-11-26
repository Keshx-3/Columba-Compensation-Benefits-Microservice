import { Routes } from '@angular/router';
import { StructureListComponent } from './structure-list/structure-list.component';
import { StructureDetailComponent } from './structure-detail/structure-detail.component';
import { StructureFormComponent } from './structure-form/structure-form.component';
import { EmployeeCompensationListComponent } from './employee-compensation-list/employee-compensation-list.component';
import { EmployeeCompensationFormComponent } from './employee-compensation-form/employee-compensation-form.component';

export const routes: Routes = [
    { path: '', redirectTo: '/structures', pathMatch: 'full' },
    { path: 'structures', component: StructureListComponent },
    { path: 'structures/new', component: StructureFormComponent },
    { path: 'structures/:id', component: StructureDetailComponent },
    { path: 'structures/:id/edit', component: StructureFormComponent },
    { path: 'employees/:id/compensation', component: EmployeeCompensationListComponent },
    { path: 'employees/:id/compensation/new', component: EmployeeCompensationFormComponent },
    { path: 'employees/:id/compensation/edit', component: EmployeeCompensationFormComponent }
];
