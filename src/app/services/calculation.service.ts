import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { EMPTY_SKILLS } from '../constants/empty-skills';
import { Skills } from '../interfaces/skills';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {
  public skills$: Subject<Skills> = new Subject<Skills>();

  public calculate(num: number, limit: number = 6, used: Skills = { ...EMPTY_SKILLS }): boolean {
    if (num === 0) {
      this.skills$.next(used);

      return true;
    }

    if (num < 0) {
      return false;
    }

    const numbers: (keyof Skills)[] = [57, 30, 15, 35, 20, 12];

    for (let i = 0; i < numbers.length; i++) {
      const current = numbers[i];

      if (!used[current]) {
        used[current] = 0;
      }

      if (current === 35 || current === 20 || current === 12) {
        if (used[current] >= limit) {
          continue;
        }

        limit--;
      }

      used[current]++;

      const newNum = num - current;

      if (this.calculate(newNum, limit, { ...used })) {
        return true;
      }

      used[current]--;

      if (current === 35 || current === 20 || current === 12) {
        limit++;
      }
    }

    return false;
  }
}
