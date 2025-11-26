import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CompensationService, SalaryStructure } from '../services';

@Component({
  selector: 'app-structure-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './structure-form.component.html',
  styleUrl: './structure-form.component.css',
})
export class StructureFormComponent implements OnInit {
  structureForm: FormGroup;
  isEditMode = false;
  structureId: number | null = null;
  countries = ['UAE', 'KSA', 'India'];
  componentTypes = ['earning', 'deduction', 'benefit'];
  ruleTypes = ['fixed', 'percentage'];

  constructor(
    private fb: FormBuilder,
    private compensationService: CompensationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.structureForm = this.fb.group({
      name: ['', Validators.required],
      country: ['UAE', Validators.required],
      components: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.structureId = +id;
        this.loadStructure(this.structureId);
      } else {
        this.addComponent(); // Add one empty component by default
      }
    });
  }

  get components(): FormArray {
    return this.structureForm.get('components') as FormArray;
  }

  newComponent(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      type: ['earning', Validators.required],
      rule_type: ['fixed']
    });
  }

  addComponent(): void {
    this.components.push(this.newComponent());
  }

  removeComponent(index: number): void {
    this.components.removeAt(index);
  }

  loadStructure(id: number): void {
    this.compensationService.getSalaryStructure(id).subscribe(structure => {
      this.structureForm.patchValue({
        name: structure.name,
        country: structure.country
      });

      this.components.clear();
      structure.components.forEach(comp => {
        const compGroup = this.newComponent();
        compGroup.patchValue(comp);
        this.components.push(compGroup);
      });
    });
  }

  onSubmit(): void {
    if (this.structureForm.invalid) return;

    const formValue = this.structureForm.value;

    if (this.isEditMode && this.structureId) {
      this.compensationService.updateSalaryStructure(this.structureId, formValue).subscribe(() => {
        this.router.navigate(['/structures']);
      });
    } else {
      this.compensationService.createSalaryStructure(formValue).subscribe(() => {
        this.router.navigate(['/structures']);
      });
    }
  }
}
