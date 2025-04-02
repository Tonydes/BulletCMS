import { Component, Input, forwardRef, OnInit, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { CommonModule } from '@angular/common';

export const BCMS_DATEPICKER_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BcmsDatepickerComponent),
  multi: true
};

@Component({
  selector: 'bcms-datepicker',
  templateUrl: './bcms-datepicker.component.html',
  styleUrls: ['./bcms-datepicker.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerModule],
  providers: [BCMS_DATEPICKER_CONTROL_VALUE_ACCESSOR]
})
export class BcmsDatepickerComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() inputId: string = '';
  @Input() placeholder: string = 'Seleziona data';
  @Input() dateFormat: string = 'dd/mm/yy';
  @Input() showIcon: boolean = true;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() showTime: boolean = false;
  @Input('hourFormat') _hourFormat: '12' | '24' = '24';
  @Input() readonlyInput: boolean = false;
  @Input() styleClass: string = '';
  @Input() inputStyleClass: string = '';
  @Input() appendTo: any = null;
  @Input() selectionMode: 'single' | 'multiple' | 'range' = 'single';
  @Input() touchUI: boolean = false;

  // --- Proprietà interne per ControlValueAccessor (rimangono invariate) ---
  internalValue: Date | Date[] | null = null; // Può essere Date[] per range/multiple
  isDisabled: boolean = false;
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {}

  ngOnInit(): void {
    // Potrebbe essere necessario adattare il valore iniziale se selectionMode è 'range' o 'multiple'
    if (
      (this.selectionMode === 'range' || this.selectionMode === 'multiple') &&
      this.internalValue &&
      !(this.internalValue instanceof Array)
    ) {
      console.warn('CustomDatepickerComponent: Initial value should be an array for range/multiple selection mode.');
      // Potresti voler resettare o gestire questo caso
      this.internalValue = null; // o [this.internalValue] se appropriato
    } else if (this.selectionMode === 'single' && this.internalValue instanceof Array) {
      console.warn('CustomDatepickerComponent: Initial value should be a single Date for single selection mode.');
      // Potresti voler resettare o gestire questo caso
      this.internalValue = null; // o this.internalValue[0] se appropriato
    }
  }

  writeValue(value: any): void {
    // Gestione più robusta per i vari tipi di valore (single, range, multiple)
    if (this.selectionMode === 'single') {
      if (value instanceof Date) {
        this.internalValue = value;
      } else if (typeof value === 'string') {
        const date = new Date(value);
        this.internalValue = !isNaN(date.getTime()) ? date : null;
      } else {
        this.internalValue = null;
      }
    } else {
      // range or multiple
      if (Array.isArray(value) && value.every((item) => item instanceof Date || item === null)) {
        this.internalValue = value;
      } else {
        // Potresti voler gestire la conversione da stringhe qui se necessario
        this.internalValue = null; // O un array vuoto [] a seconda della logica desiderata
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onValueChange(value: Date | Date[] | null): void {
    this.internalValue = value;
    this.onChange(this.internalValue);
  }

  onBlur(): void {
    this.onTouched();
  }
}
