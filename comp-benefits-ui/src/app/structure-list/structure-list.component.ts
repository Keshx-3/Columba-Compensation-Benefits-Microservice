import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CompensationService, SalaryStructure } from '../services';

@Component({
  selector: 'app-structure-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './structure-list.component.html',
  styleUrl: './structure-list.component.css',
})
export class StructureListComponent implements OnInit {
  structures: SalaryStructure[] = [];

  constructor(
    private compensationService: CompensationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadStructures();
  }

  loadStructures(): void {
    this.compensationService.getSalaryStructures().subscribe({
      next: (data) => {
        this.structures = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching structures:', err);
      }
    });
  }

  deleteStructure(id: number): void {
    if (confirm('Are you sure you want to delete this salary structure?')) {
      this.compensationService.deleteSalaryStructure(id).subscribe({
        next: () => {
          this.loadStructures();
        },
        error: (err) => {
          alert('Cannot delete salary structure. It is assigned to one or more employees.');
        }
      });
    }
  }
}
