import { FormBuilder, Validators } from '@angular/forms';
import { NotationType } from '../../shared/types/types';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ConverterService } from 'src/app/shared/converter.service';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>()
  public NOTATION_SYSTEMS: NotationType[] = ['binary', 'octal', 'decimal', 'hexadecimal']
  public output: string | null = ''

  public formGroup = this._formBuilder.group({
    from: ['decimal'],
    to: ['binary'],
    input: [''],
  })

  public currentNumbers: string[] = this._converterService.getNumbers(this.formGroup.value.from as NotationType)

  public get getFromValue(): NotationType {
    return this.formGroup.controls.from.value as NotationType
  }
  public get getToValue(): NotationType {
    return this.formGroup.controls.to.value as NotationType
  }
  public get getInput() {
    return this.formGroup.controls.input
  }

  constructor(private _formBuilder: FormBuilder, private _converterService: ConverterService) { }

  public getPattern(notation: NotationType) {
    return this._converterService.getPattern(notation)
  }

  /**
   * On init
   */
  ngOnInit(): void {
    this.formGroup.controls['input'].valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((value) => {
        if(this.getInput.status === 'VALID') this.output = this._converterService.convertValue(value, this.getFromValue, this.getToValue)
        else this.output = 'Invalid input'
      });

    this.formGroup.controls['from'].valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(value => {
        this.formGroup.controls.input.reset()
        this.currentNumbers = this._converterService.getNumbers(value as NotationType)
      });

    this.formGroup.controls['to'].valueChanges
    .pipe(
      takeUntil(this._unsubscribeAll)
    )
    .subscribe(() => {
      if(this.getInput.status === 'VALID') this.output = this._converterService.convertValue(this.getInput.value, this.getFromValue, this.getToValue)
      else this.output = 'Invalid input'
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null)
    this._unsubscribeAll.complete()
  }
}
