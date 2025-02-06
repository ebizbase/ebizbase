import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class MessageableValidators {
  static required(errorMessage = 'This field is required'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = control.value !== null && control.value !== undefined && control.value !== '';
      return isValid ? null : { required: { message: errorMessage } };
    };
  }

  static pattern(pattern: RegExp, errorMessage = 'Invalid format'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isValid = pattern.test(value);
      return isValid ? null : { pattern: { message: errorMessage, pattern, value } };
    };
  }

  static minLength(
    minLength: number,
    errorMessage = `Minimum length is ${minLength}`
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = control.value && control.value.length >= minLength;
      return isValid ? null : { minLength: { message: errorMessage, minLength } };
    };
  }

  static maxLength(
    maxLength: number,
    errorMessage = `Maximum length is ${maxLength}`
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = control.value && control.value.length <= maxLength;
      return isValid ? null : { maxLength: { message: errorMessage, maxLength } };
    };
  }

  static min(min: number, errorMessage = `Minimum value is ${min}`): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isValid = value !== null && value !== undefined && value >= min;
      return isValid ? null : { min: { message: errorMessage, min, value } };
    };
  }

  static max(max: number, errorMessage = `Maximum value is ${max}`): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isValid = value !== null && value !== undefined && value <= max;
      return isValid ? null : { max: { message: errorMessage } };
    };
  }

  static email(errorMessage = 'Invalid email address'): ValidatorFn {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isValid = emailPattern.test(value);
      return isValid ? null : { email: { message: errorMessage, value } };
    };
  }
}
