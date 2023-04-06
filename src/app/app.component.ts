import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, ReplaySubject, takeUntil } from 'rxjs';

import { EMPTY_SKILLS } from './constants/empty-skills';
import { DataForm } from './interfaces/data-form';
import { Skills } from './interfaces/skills';
import { CalculationService } from './services/calculation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public form: FormGroup<DataForm> = new FormGroup<DataForm>({
    focus: new FormControl(null, Validators.required),
    limit: new FormControl(null),
  });
  public result: boolean = true;
  public skills: Skills = EMPTY_SKILLS;
  public skillsOrder: (keyof Skills)[] = [12, 20, 35, 57, 30, 15];

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private calculationService: CalculationService) { }

  public ngOnInit(): void {
    this.subscribeOnFocusValue();
    this.subscribeOnLimitValue();
    this.subscribeOnSkills();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public validateInput(event: KeyboardEvent, pattern: string): void {
    const NUMBERS_PATTERN = new RegExp(pattern);
    const allowedSymbols = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ControlLeft', 'Tab', 'Enter'];

    if (!event.key?.match(NUMBERS_PATTERN) && !allowedSymbols.includes(event.code) && !event.ctrlKey) {
      event.preventDefault();
    }
  }

  public clear(): void {
    this.form.reset();
    this.skills = EMPTY_SKILLS;
  }

  public calculate(): void {
    if (!this.form.controls.focus.value) {
      return;
    }

    this.result = this.calculationService.calculate(
      this.form.controls.focus.value,
      this.form.controls.limit.value || 6
    );
  }

  private subscribeOnFocusValue(): void {
    this.form.controls.focus.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        filter(val => Boolean(val && val > 9999))
      )
      .subscribe(() => this.form.controls.focus.setValue(9999));
  }

  private subscribeOnLimitValue(): void {
    this.form.controls.limit.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        filter(val => !!val)
      )
      .subscribe(val => {
        const valStr = val!.toString();

        if (valStr.length > 1) {
          this.form.controls.limit.setValue(+valStr.slice(1));
        }
      });
  }

  private subscribeOnSkills(): void {
    this.calculationService.skills$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(skills => {
        this.skills = skills;
      });
  }
}
