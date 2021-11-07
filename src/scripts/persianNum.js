const latinToPersianMap = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰'];
const latinNumbers = [/1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g, /0/g];

function prepareNumber(input) {
  let string;
  if (typeof input === 'number') {
    string = input.toString();
  } else if (typeof input === 'undefined') {
    string = '';
  } else {
    string = input;
  }

  return string;
}

function latinToPersian(string) {
  let result = string;

  for (let index = 0; index < 10; index++) {
    result = result.replace(latinNumbers[index], latinToPersianMap[index]);
  }

  return result;
}

export function priceNum(string){
    console.log(string);
    string = string.toString();
    if(string=="0" || !string){return "0"};
    let temp=[];
    // string = string.split("");
    // string = string.reverse();
    let c=0;
    for(let i=string.length-1; i>=0; i--){
        temp.unshift(string[i]);
        c++;
        if(c==3 && i!=0){c=0; temp.unshift(",")}
    }
    return temp.join("");
}

export function persianNumber(input) {
  return latinToPersian(prepareNumber(input));
}

export function number2Fa(num){

  switch(num){
      case 1:
          return "اول";
      case 2:
          return "دوم";
      case 3:
          return "سوم";
      case 4:
          return "چهارم";
      case 5:
          return "پنجم";
      case 6:
          return "ششم";
      case 7:
          return "هفتم";
      case 8:
          return "هشتم";
      case 9:
          return "نهم";
      case 10:
          return "دهم";
      case 11:
          return "یازدهم";
      case 12:
          return "دوازدهم";
      case 13:
          return "سینزدهم";
      case 14:
          return "چهاردهم";
      case 15:
          return "پانزدهم";
      case 16:
          return "شانزدهم";
      case 17:
          return "هفدهم";
      case 18:
          return "هجدهم";
      case 19:
          return "نوزدهم";
      case 20:
          return "بیستم";
      default:
          return ""
  }
}