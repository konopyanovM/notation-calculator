import { NotationPatternEnum } from './types/enums';
import { Injectable } from '@angular/core';
import { NotationType } from './types';

@Injectable({
  providedIn: 'root'
})
export class ConverterService {
  public HEXADECIMAL_NUMBERS: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']

  constructor() { }

  private getHexadecimalSymbol(value: number | string): string | null {
    if(typeof value === 'string') {
      switch (value) {
        case 'A':
          return '10';
        case 'B':
          return '11';
        case 'C':
          return '12';
        case 'D':
          return '13';
        case 'E':
          return '14';
        case 'F':
          return '15';
        default:
          throw Error('There is no such symbol in hexadecimal system notation')
          return null
      }
    }
    if(value < 17 && value >= 0) {
      switch (value) {
        case 10:
          return 'A';
        case 11:
          return 'B';
        case 12:
          return 'C';
        case 13:
          return 'D';
        case 14:
          return 'E';
        case 15:
          return 'F';
        default:
          return value.toString();
      }
    }
    return null
  }

  public getNumbers(notationType: NotationType): string[] {
    switch (notationType) {
      case 'binary':
        return this.HEXADECIMAL_NUMBERS.slice(0, 2)
      case 'octal':
        return this.HEXADECIMAL_NUMBERS.slice(0, 8)
      case 'decimal':
        return this.HEXADECIMAL_NUMBERS.slice(0, 10)
      case 'hexadecimal':
        return this.HEXADECIMAL_NUMBERS.slice(0, 16)
      default:
        return []
    }
  }

  public getPattern(notationType: NotationType): string {
    switch (notationType) {
      case 'binary':
        return NotationPatternEnum.BINARY_NUMBER
      case 'octal':
        return NotationPatternEnum.OCTAL_NUMBER
      case 'decimal':
        return NotationPatternEnum.DECIMAL_NUMBER
      case 'hexadecimal':
        return NotationPatternEnum.HEXADECIMAL_NUMBER
      default:
        throw Error('There is no such pattern')
    }
  }


  private getBinary(number: number, accumulatorArray: number[] = []): string {
    // Calculate the remainder and push it into the accumulator array

    // If our sum is zero we convert accumulator array to number and return it
    if(number === 0) return accumulatorArray.reverse().join('')

    const remainder = number % 2
    accumulatorArray.push(remainder)

    const nextNumber = Math.floor(number / 2)

    // Recursion
    return this.getBinary(nextNumber, accumulatorArray)
  }
  private getOctal(number: number, accumulatorArray: number[] = []): string {
    // Calculate the remainder and push it into the accumulator array

    // If our sum is zero we convert accumulator array to number and return it
    if(number === 0) return accumulatorArray.reverse().join('')

    const remainder = number % 8
    accumulatorArray.push(remainder)

    const nextNumber = Math.floor(number / 8)

    // Recursion
    return this.getOctal(nextNumber, accumulatorArray)
  }
  private getDecimal(number: string, notation: NotationType, ): string {
    const notationMultiplier = this.getNumbers(notation).length

    let numberArray: string[] = number.split('').reverse()

    if(notation === 'hexadecimal') numberArray = numberArray.map((num) => {
      if(isNaN(+num)) return this.getHexadecimalSymbol(num) as string
      else return num
    })

    const result = numberArray.reduce((acc, curr, index) => {
        return acc + (+curr * Math.pow(notationMultiplier, index))
    }, 0)

    return result.toString()
  }
  private getHexadecimal(number: number, accumulatorArray: string[] = []): string {
    // Calculate the remainder and push it into the accumulator array

    // If our sum is zero we convert accumulator array to number and return it
    if(number === 0) return accumulatorArray.reverse().join('')

    const remainder = number % 16

    if(remainder > 9) accumulatorArray.push(this.getHexadecimalSymbol(remainder)!)
    else accumulatorArray.push(remainder.toString())

    const nextNumber = Math.floor(number / 16)

    // Recursion
    return this.getHexadecimal(nextNumber, accumulatorArray)
  }

  public convertValue(value: string | number | null, from: NotationType, to: NotationType): string | null {
    if(value === null) return '0'

    if(from === 'decimal' && to === 'binary') return this.getBinary(+value)
    if(from === 'decimal' && to === 'octal') return this.getOctal(+value)
    if(from === 'decimal' && to === 'hexadecimal') return this.getHexadecimal(+value)
    if(from === 'decimal' && to === 'decimal') return value.toString()

    if(from === 'binary' && to === 'decimal') return this.getDecimal(value.toString(), from)
    if(from === 'octal' && to === 'decimal') return this.getDecimal(value.toString(), from)
    if(from === 'hexadecimal' && to === 'decimal') return this.getDecimal(value.toString(), from)
    return null
  }
}
