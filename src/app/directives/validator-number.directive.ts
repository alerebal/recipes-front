import { Directive } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appValidatorNumber]'
})
export class ValidatorNumberDirective {

  constructor() { }

}

export function validatorNumber(numberRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any } | null => {
    const inputNumber = numberRe.test(control.value);
    return inputNumber ? {notNumber: {value: control.value}} : null;
  };
}
