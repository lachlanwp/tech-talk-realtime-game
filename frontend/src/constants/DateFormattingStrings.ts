class DateFormattingStrings {
  static readonly humanReadable = 'Do MMM YYYY, h:mm a';
  static readonly humanReadableNoTime = 'Do MMM YYYY';
  static readonly humanReadableNoTimeNoDay = 'MMM YYYY';
  static readonly humanReadableTimeOnly = 'h:mm a';
  static readonly parseable = 'YYYY-MM-DD HH:mm:ss';
  static readonly parseableNoTime = 'YYYY-MM-DD';
  static readonly parseableNoTimeNoDay = 'YYYY-MM';
  static readonly parseableTimeOnly = 'HH:mm:ss';
}

export {DateFormattingStrings};
