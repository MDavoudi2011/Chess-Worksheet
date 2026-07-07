const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export const toPersianNumber = (num: number | string | undefined | null): string => {
  // اگر مقدار فرستاده شده خالی بود، یک رشته خالی برگردان تا برنامه کرش نکند
  if (num === undefined || num === null) return '';
  
  return num.toString().replace(/[0-9]/g, (char) => persianNumbers[parseInt(char, 10)]);
};