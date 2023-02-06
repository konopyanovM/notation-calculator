export enum NotationEnum {
  'binary',
  'octal',
  'decimal',
  'hexadecimal'
}

export enum NotationPatternEnum {
  BINARY_NUMBER = '^[0-1]{1,}$',
  OCTAL_NUMBER = '^[0-7]*$',
  DECIMAL_NUMBER = '^(0|[1-9][0-9]*)$',
  HEXADECIMAL_NUMBER = '[0-9A-F]*$'

}
