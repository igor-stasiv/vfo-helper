import { FormControl } from '@angular/forms';

export interface DataForm {
  focus: FormControl<number | null>;
  limit: FormControl<number | null>;
}
