import { CommonModule } from '@angular/common';
import { Component , Input } from '@angular/core';

@Component({
  selector: 'app-stepper',
  imports: [CommonModule],
  templateUrl: './stepper.html',
  styleUrl: './stepper.css'
})
export class Stepper {
  @Input() currentStep: number = 1; 

  Step:number = 1;

  continue() {
  if (this.Step < 3) {
    this.Step++;
  }
}
}
