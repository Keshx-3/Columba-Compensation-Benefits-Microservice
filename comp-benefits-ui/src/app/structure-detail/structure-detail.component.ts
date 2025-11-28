import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CompensationService, SalaryStructure } from '../services';

@Component({
  selector: 'app-structure-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './structure-detail.component.html',
  styleUrl: './structure-detail.component.css',
})
export class StructureDetailComponent implements OnInit {
  structure: SalaryStructure | null = null;

  constructor(
    private route: ActivatedRoute,
    private compensationService: CompensationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.compensationService.getSalaryStructure(+id).subscribe({
        next: (data) => {
          this.structure = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching structure details:', err);
        }
      });
    }
  }
}
