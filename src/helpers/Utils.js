export function getStatus(status) {
    var str = "";
    switch (status) {
        case "0":
            str = "pending";
            break;
        case "2":
            str = "confirmed";
            break;
        case "3":
            str = "completed";
            break;
        case "4":
            str = "cancelled";
            break;
        case "canceled":
            str = "cancelled";
            break;
        case "Walk-In":
            str = "Walk-In";
            break;  
    }
    return str;
}
export function getStatusToNumber(status) {
    var str = "";
    switch (status) {
        case 0:
            str = "pending";
            break;
        case 1:
            str = "confirmed";
            break;
        case 2:
            str = "completed";
            break;
        case 3:
            str = "cancelled";
            break;
        case "canceled":
            str = "cancelled";
            break;
        case "Walk-In":
            str = "Walk-In";
            break;  
    }
    return str;
}
export function getStatusColor(status) {
    var str = "";
    switch (status) {
        case "pending":
            str = "#6321CE";
            break;
        case "confirmed":
            str = "#097885";
            break;
        case "completed":
            str = "#BA0A98";
            break;
        case "cancelled":
            str = "#808080";
            break;
        case "canceled":
            str = "#808080";
            break; 
        case "Walk-In":
            str = "#dc0a40";
            break;    
    }
    return str;
}
export function getChannelColor(status) {
    var str = "";
    switch (status) {
        case "checkin-app":
            str = "#097885";
            break;
        case "website":
            str = "#BA0A98";
            break;
    }
    return str;
}
export function getListAppointmentStatus() {
    var arr = [];
    var listPending = {};
    var listConfirmed = {};
    var listCompleted = {};
    var listCancelled = {};
    var listCanceled = {};
    listPending.id = "pending";
    listPending.title = "pending";
    arr.push(listPending);
    listConfirmed.id = "confirmed";
    listConfirmed.title = "confirmed";
    arr.push(listConfirmed);
    listCompleted.id = "completed";
    listCompleted.title = "completed";
    arr.push(listCompleted);
    listCancelled.id = "cancelled";
    listCancelled.title = "cancelled";
    arr.push(listCancelled);

    listCanceled.id = "canceled";
    listCanceled.title = "canceled";
    arr.push(listCanceled);

    return arr;
}

export function getListAppointmentStatusForCreate() {
    var arr = [];
    var listPending = {};
    var listConfirmed = {};
    var listCompleted = {};
    var listCancelled = {};
    var listCanceled = {};
    listPending.id = "pending";
    listPending.title = "pending";
    arr.push(listPending);
    listConfirmed.id = "confirmed";
    listConfirmed.title = "confirmed";
    arr.push(listConfirmed);
    listCompleted.id = "completed";
    listCompleted.title = "completed";
    arr.push(listCompleted);
    listCancelled.id = "cancelled";
    listCancelled.title = "cancelled";
    arr.push(listCancelled);
    return arr;
}

export function inputCurrency(value) {
    let opts = {
        delimiter: ",",
        lastOutput: undefined,
        moneyPrecision: 0,
        precision: 0,
        separator: ".",
        suffixUnit: "",
        unit: "$ ",
        zeroCents: false
    };
    let decimalsCheckValue = value.split(".");
    let isDecimal = false;
    let decimalValue = 0;
    if (decimalsCheckValue.length > 1) {
        isDecimal = true;
        decimalValue = decimalsCheckValue[1];
        value = decimalsCheckValue[0];
        if (decimalValue.length > 2) {
            decimalValue = decimalValue.substr(0, 2);
        }
        decimalValue = decimalValue.replace(/\D/g, "");
    }

    if (opts.zeroCents) {
        opts.lastOutput = opts.lastOutput || "";
        //var zeroMatcher = ("("+ opts.separator +"[0]{0,"+ opts.precision +"})"),
        var zeroMatcher = "(" + opts.separator + "[0]{0," + 2 + "})",
            zeroRegExp = new RegExp(zeroMatcher, "g"),
            digitsLength = value.toString().replace(/[\D]/g, "").length || 0,
            lastDigitLength =
                opts.lastOutput.toString().replace(/[\D]/g, "").length || 0;
        value = value.toString().replace(zeroRegExp, "");
        if (digitsLength < lastDigitLength) {
            value = value.slice(0, value.length - 1);
        }
    }

    var number = value.toString().replace(/[\D]/g, ""),
        clearDelimiter = new RegExp("^(0|\\" + opts.delimiter + ")"),
        clearSeparator = new RegExp("(\\" + opts.separator + ")$"),
        money = number.substr(0, number.length - opts.moneyPrecision),
        masked = money.substr(0, money.length % 3),
        cents = new Array(opts.precision + 1).join("0");
    //console.log(number.substr(0, number.length - 2));
    money = money.substr(money.length % 3, money.length);
    for (var i = 0, len = money.length; i < len; i++) {
        if (i % 3 === 0) {
            masked += opts.delimiter;
        }
        masked += money[i];
    }
    masked = masked.replace(clearDelimiter, "");
    masked = masked.length ? masked : "0";
    if (!opts.zeroCents) {
        var beginCents = number.length - opts.precision,
            centsValue = number.substr(beginCents, opts.precision),
            centsLength = centsValue.length,
            centsSliced =
                opts.precision > centsLength ? opts.precision : centsLength;
        cents = (cents + centsValue).slice(-centsSliced);
    }

    var unitToApply =
        opts.unit[opts.unit.length - 1] === " "
            ? opts.unit.substring(0, opts.unit.length - 1)
            : opts.unit;
    //console.log(masked);
    //var output = unitToApply + masked + opts.separator + cents + opts.suffixUnit;
    //return output;
    //console.log(output);
    //return output.replace(clearSeparator, "");
    var output = unitToApply + masked;
    if (isDecimal) {
        output += opts.separator + decimalValue;
    }
    output += opts.suffixUnit;
    if (masked == 0 && decimalValue == 0) {
        output = "";
    }

    return output;
}

export function inputCCNumber(value) {
    return formatCardNumber(value);
}

export function inputCCExpireDate(expiry) {
    var mon, parts, sep, year;
    parts = expiry.match(/^\D*(\d{1,2})(\D+)?(\d{1,2})?/);
    if (!parts) {
        return "";
    }
    mon = parts[1] || "";
    sep = parts[2] || "";
    year = parts[3] || "";
    if (year.length > 0 || (sep.length > 0 && !/\ \/?\ ?/.test(sep))) {
        sep = " / ";
    }
    if (mon.length === 1 && (mon !== "0" && mon !== "1")) {
        mon = "0" + mon;
        sep = " / ";
    }
    return mon + sep + year;
}

export function inputCCCVV(value) {
    value = value.replace(/\D/g, "").slice(0, 4);
    return value;
}

export function validateCardNumber(num) {
    var card, _ref;
    num = (num + "").replace(/\s+|-/g, "");
    if (!/^\d+$/.test(num)) {
        return false;
    }
    card = cardFromNumber(num);
    if (!card) {
        return false;
    }
    return (
        ((_ref = num.length), __indexOf.call(card.length, _ref) >= 0) &&
        (card.luhn === false || luhnCheck(num))
    );
}

export function validateExpireDate(value) {
    var parts = cardExpiryVal(value);
    month = parts.month;
    year = parts.year;
    var currentTime, expiry, _ref;
    if (typeof month === "object" && "month" in month) {
        (_ref = month), (month = _ref.month), (year = _ref.year);
    }
    if (!(month && year)) {
        return false;
    }
    month = String.prototype.trim.call(month);
    year = String.prototype.trim.call(year);
    if (!/^\d+$/.test(month)) {
        return false;
    }
    if (!/^\d+$/.test(year)) {
        return false;
    }
    if (!(1 <= month && month <= 12)) {
        return false;
    }
    if (year.length === 2) {
        if (year < 70) {
            year = "20" + year;
        } else {
            year = "19" + year;
        }
    }
    if (year.length !== 4) {
        return false;
    }
    expiry = new Date(year, month);
    currentTime = new Date();
    expiry.setMonth(expiry.getMonth() - 1);
    expiry.setMonth(expiry.getMonth() + 1, 1);
    return expiry > currentTime;
}

export function validateCVC(cvc) {
    var card, _ref;
    cvc = String.prototype.trim.call(cvc);
    if (!/^\d+$/.test(cvc)) {
        return false;
    }
    card = cardFromType(cardType);
    if (card != null) {
        return (_ref = cvc.length), __indexOf.call(card.cvcLength, _ref) >= 0;
    } else {
        return cvc.length >= 3 && cvc.length <= 4;
    }
}

export const emailRegx = /^([A-Za-z0-9_\-.])+@([A-Za-z_\-])+\.([A-Za-z]{2,4})$/;

export const isEmpty = _str => {
    return _str.trim().length === 0;
  };

var __slice = [].slice;
var __indexOf =
    [].indexOf ||
    function(item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item) return i;
        }
        return -1;
    };
var defaultFormat = /(\d{1,4})/g;
var cards = [
    {
        type: "visaelectron",
        pattern: /^4(026|17500|405|508|844|91[37])/,
        format: defaultFormat,
        length: [16],
        cvcLength: [3],
        luhn: true
    },
    {
        type: "maestro",
        pattern: /^(5(018|0[23]|[68])|6(39|7))/,
        format: defaultFormat,
        length: [12, 13, 14, 15, 16, 17, 18, 19],
        cvcLength: [3],
        luhn: true
    },
    {
        type: "forbrugsforeningen",
        pattern: /^600/,
        format: defaultFormat,
        length: [16],
        cvcLength: [3],
        luhn: true
    },
    {
        type: "dankort",
        pattern: /^5019/,
        format: defaultFormat,
        length: [16],
        cvcLength: [3],
        luhn: true
    },
    {
        type: "visa",
        pattern: /^4/,
        format: defaultFormat,
        length: [13, 16],
        cvcLength: [3],
        luhn: true
    },
    {
        type: "mastercard",
        pattern: /^5[0-5]/,
        format: defaultFormat,
        length: [16],
        cvcLength: [3],
        luhn: true
    },
    {
        type: "amex",
        pattern: /^3[47]/,
        format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
        length: [15],
        cvcLength: [3, 4],
        luhn: true
    },
    {
        type: "dinersclub",
        pattern: /^3[0689]/,
        format: defaultFormat,
        length: [14],
        cvcLength: [3],
        luhn: true
    },
    {
        type: "discover",
        pattern: /^6([045]|22)/,
        format: defaultFormat,
        length: [16],
        cvcLength: [3],
        luhn: true
    },
    {
        type: "unionpay",
        pattern: /^(62|88)/,
        format: defaultFormat,
        length: [16, 17, 18, 19],
        cvcLength: [3],
        luhn: false
    },
    {
        type: "jcb",
        pattern: /^35/,
        format: defaultFormat,
        length: [16],
        cvcLength: [3],
        luhn: true
    }
];

var cardType = function(num) {
    var _ref;
    if (!num) {
        return null;
    }
    return ((_ref = cardFromNumber(num)) != null ? _ref.type : void 0) || null;
};

var cardFromType = function(type) {
    var card, _i, _len;
    for (_i = 0, _len = cards.length; _i < _len; _i++) {
        card = cards[_i];
        if (card.type === type) {
            return card;
        }
    }
};

var luhnCheck = function(num) {
    var digit, digits, odd, sum, _i, _len;
    odd = true;
    sum = 0;
    digits = (num + "").split("").reverse();
    for (_i = 0, _len = digits.length; _i < _len; _i++) {
        digit = digits[_i];
        digit = parseInt(digit, 10);
        if ((odd = !odd)) {
            digit *= 2;
        }
        if (digit > 9) {
            digit -= 9;
        }
        sum += digit;
    }
    return sum % 10 === 0;
};

var cardFromNumber = function(num) {
    var card, _i, _len;
    num = (num + "").replace(/\D/g, "");
    for (_i = 0, _len = cards.length; _i < _len; _i++) {
        card = cards[_i];
        if (card.pattern.test(num)) {
            return card;
        }
    }
};

var cardExpiryVal = function(value) {
    var month, prefix, year, _ref;
    value = value.replace(/\s/g, "");
    (_ref = value.split("/", 2)), (month = _ref[0]), (year = _ref[1]);
    if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
        prefix = new Date().getFullYear();
        prefix = prefix.toString().slice(0, 2);
        year = prefix + year;
    }
    month = parseInt(month, 10);
    year = parseInt(year, 10);
    return {
        month: month,
        year: year
    };
};

function formatCardNumber(num) {
    var card, groups, upperLength, _ref;
    num = num.replace(/\D/g, "");
    card = cardFromNumber(num);
    if (!card) {
        return num;
    }
    upperLength = card.length[card.length.length - 1];
    num = num.slice(0, upperLength);
    if (card.format.global) {
        return (_ref = num.match(card.format)) != null
            ? _ref.join(" ")
            : void 0;
    }
}

function phoneMask(value) {
    return '(999) 999-9999';    
}

function monthMask(value) {
    return '99';    
}
function percentMask(value) {
    return '999';    
}
function removeNotNumbers(text) {
    return text.replace(/[^0-9]+/g, "");
}
function PriceNumbers(text) {
    return text.replace(/[^0-9^.]+/g, "");
}
export function formatnumber(value) {
    let mask = removeNotNumbers(value);  
    return mask;
}
export function formatprice(value) {
    let mask = PriceNumbers(value);  
    return mask;
}
export function formatPhone(value) {
    let mask = phoneMask(value);  
    let formattedValue = toPattern(value, mask);
    return formattedValue;
}

export function formatMonth(value) {
    let mask = monthMask(value);  
    let formattedValue = toPattern(value, mask);
    return formattedValue;
}
export function formatpercent(value) {
    let mask = percentMask(value);  
    let formattedValue = toPattern(value, mask);
    return formattedValue;
}
export function timestamp(get_as_float) {
    var now = new Date().getTime() / 1000;
    var s = parseInt(now, 10);

    return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
}

function toPattern(value, opts) {
    var DIGIT = "9",
        ALPHA = "A",
        ALPHANUM = "S";
    var pattern = typeof opts === "object" ? opts.pattern : opts,
        patternChars = pattern.replace(/\W/g, ""),
        output = pattern.split(""),
        values = value.toString().replace(/\W/g, ""),
        charsValues = values.replace(/\W/g, ""),
        index = 0,
        i,
        outputLength = output.length,
        placeholder = typeof opts === "object" ? opts.placeholder : undefined;

    for (i = 0; i < outputLength; i++) {
        // Reached the end of input
        if (index >= values.length) {
            if (patternChars.length == charsValues.length) {
                return output.join("");
            } else if (
                placeholder !== undefined &&
                patternChars.length > charsValues.length
            ) {
                return addPlaceholdersToOutput(output, i, placeholder).join("");
            } else {
                break;
            }
        } else {
            // Remaining chars in input
            if (
                (output[i] === DIGIT && values[index].match(/[0-9]/)) ||
                (output[i] === ALPHA && values[index].match(/[a-zA-Z]/)) ||
                (output[i] === ALPHANUM && values[index].match(/[0-9a-zA-Z]/))
            ) {
                output[i] = values[index++];
            } else if (
                output[i] === DIGIT ||
                output[i] === ALPHA ||
                output[i] === ALPHANUM
            ) {
                if (placeholder !== undefined) {
                    return addPlaceholdersToOutput(output, i, placeholder).join(
                        ""
                    );
                } else {
                    return output.slice(0, i).join("");
                }
            }
        }
    }
    return output.join("").substr(0, i);
}

function addPlaceholdersToOutput(output, index, placeholder) {
    for (; index < output.length; index++) {
        if (
            output[index] === DIGIT ||
            output[index] === ALPHA ||
            output[index] === ALPHANUM
        ) {
            output[index] = placeholder;
        }
    }
    return output;
}
export function inputBirthDate(expiry) {
    var mon, parts, sep, year;
    parts = expiry.match(/^\D*(\d{1,2})(\D+)?(\d{1,2})?/);
    if (!parts) {
        return "";
    }
    mon = parts[1] || "";
    sep = parts[2] || "";
    year = parts[3] || "";
    if (year.length > 0 || (sep.length > 0 && !/\ \/?\ ?/.test(sep))) {
        sep = "/";
    }
    if (mon.length === 1 && (mon !== "0" && mon !== "1")) {
        mon = "0" + mon;
        sep = "/";
    }

    if (year.length > 0 && parseInt(year) > 31) {
        year = "30";
    }

    return mon + sep + year;
}
export function getUSState2Digit($state){
    
     if(String.prototype.trim.call($state) == ''){
         return '';
     }
     
     if(String.prototype.trim.call($state).length == 2){
         return String.prototype.trim.call($state);
     }
 
     $states = {
         'Alabama':'AL',
         'Alaska':'AK',
         'Arizona':'AZ',
         'Arkansas':'AR',
         'California':'CA',
         'Colorado':'CO',
         'Connecticut':'CT',
         'Delaware':'DE',
         'Florida':'FL',
         'Georgia':'GA',
         'Hawaii':'HI',
         'Idaho':'ID',
         'Illinois':'IL',
         'Indiana':'IN',
         'Iowa':'IA',
         'Kansas':'KS',
         'Kentucky':'KY',
         'Louisiana':'LA',
         'Maine':'ME',
         'Maryland':'MD',
         'Massachusetts':'MA',
         'Michigan':'MI',
         'Minnesota':'MN',
         'Mississippi':'MS',
         'Missouri':'MO',
         'Montana':'MT',
         'Nebraska':'NE',
         'Nevada':'NV',
         'New Hampshire':'NH',
         'New Jersey':'NJ',
         'New Mexico':'NM',
         'New York':'NY',
         'North Carolina':'NC',
         'North Dakota':'ND',
         'Ohio':'OH',
         'Oklahoma':'OK',
         'Oregon':'OR',
         'Pennsylvania':'PA',
         'Rhode Island':'RI',
         'South Carolina':'SC',
         'South Dakota':'SD',
         'Tennessee':'TN',
         'Texas':'TX',
         'Utah':'UT',
         'Vermont':'VT',
         'Virginia':'VA',
         'Washington':'WA',
         'West Virginia':'WV',
         'Wisconsin':'WI',
         'Wyoming':'WY',
         'Vitran':'vitran',
         //canada go here
         'British Columbia':'BC'
     };
     return $states[ucwords($state)];
 }
 
 export function get_time_zone($country, $region){
     //console.log($country);
     //console.log($region);
     $timezone = '';
     switch ($country){
         case "US":
             switch ($region) {
                 case "vitran":
                     $timezone = "Asia/Ho_Chi_Minh";
                     break;
                 case "AK":
                     $timezone = "America/Anchorage";
                     break;
                 case "AL":
                     $timezone = "America/Chicago";
                     break;
                 case "AR":
                     $timezone = "America/Chicago";
                     break;
                 case "AZ":
                     $timezone = "America/Phoenix";
                     break;
                 case "CA":
                     $timezone = "America/Los_Angeles";
                     break;
                 case "CO":
                     $timezone = "America/Denver";
                     break;
                 case "CT":
                     $timezone = "America/New_York";
                     break;
                 case "DC":
                     $timezone = "America/New_York";
                     break;
                 case "DE":
                     $timezone = "America/New_York";
                     break;
                 case "FL":
                     $timezone = "America/New_York";
                     break;
                 case "GA":
                     $timezone = "America/New_York";
                     break;
                 case "HI":
                     $timezone = "Pacific/Honolulu";
                     break;
                 case "IA":
                     $timezone = "America/Chicago";
                     break;
                 case "ID":
                     $timezone = "America/Denver";
                     break;
                 case "IL":
                     $timezone = "America/Chicago";
                     break;
                 case "IN":
                     $timezone = "America/Indiana/Indianapolis";
                     break;
                 case "KS":
                     $timezone = "America/Chicago";
                     break;
                 case "KY":
                     $timezone = "America/New_York";
                     break;
                 case "LA":
                     $timezone = "America/Chicago";
                     break;
                 case "MA":
                     $timezone = "America/New_York";
                     break;
                 case "MD":
                     $timezone = "America/New_York";
                     break;
                 case "ME":
                     $timezone = "America/New_York";
                     break;
                 case "MI":
                     $timezone = "America/New_York";
                     break;
                 case "MN":
                     $timezone = "America/Chicago";
                     break;
                 case "MO":
                     $timezone = "America/Chicago";
                     break;
                 case "MS":
                     $timezone = "America/Chicago";
                     break;
                 case "MT":
                     $timezone = "America/Denver";
                     break;
                 case "NC":
                     $timezone = "America/New_York";
                     break;
                 case "ND":
                     $timezone = "America/Chicago";
                     break;
                 case "NE":
                     $timezone = "America/Chicago";
                     break;
                 case "NH":
                     $timezone = "America/New_York";
                     break;
                 case "NJ":
                     $timezone = "America/New_York";
                     break;
                 case "NM":
                     $timezone = "America/Denver";
                     break;
                 case "NV":
                     $timezone = "America/Los_Angeles";
                     break;
                 case "NY":
                     $timezone = "America/New_York";
                     break;
                 case "OH":
                     $timezone = "America/New_York";
                     break;
                 case "OK":
                     $timezone = "America/Chicago";
                     break;
                 case "OR":
                     $timezone = "America/Los_Angeles";
                     break;
                 case "PA":
                     $timezone = "America/New_York";
                     break;
                 case "RI":
                     $timezone = "America/New_York";
                     break;
                 case "SC":
                     $timezone = "America/New_York";
                     break;
                 case "SD":
                     $timezone = "America/Chicago";
                     break;
                 case "TN":
                     $timezone = "America/Chicago";
                     break;
                 case "TX":
                     $timezone = "America/Chicago";
                     break;
                 case "UT":
                     $timezone = "America/Denver";
                     break;
                 case "VA":
                     $timezone = "America/New_York";
                     break;
                 case "VT":
                     $timezone = "America/New_York";
                     break;
                 case "WA":
                     $timezone = "America/Los_Angeles";
                     break;
                 case "WI":
                     $timezone = "America/Chicago";
                     break;
                 case "WV":
                     $timezone = "America/New_York";
                     break;
                 case "WY":
                     $timezone = "America/Denver";
                     break;
                //Canada timezone go here
                case "BC":
                    $timezone = "America/Vancouver";
                    break;     
             }
             break;
         case "CA":
             switch ($region) {
                 case "AB":
                     $timezone = "America/Edmonton";
                     break;
                 case "BC":
                     $timezone = "America/Vancouver";
                     break;
                 case "MB":
                     $timezone = "America/Winnipeg";
                     break;
                 case "NB":
                     $timezone = "America/Halifax";
                     break;
                 case "NL":
                     $timezone = "America/St_Johns";
                     break;
                 case "NS":
                     $timezone = "America/Halifax";
                     break;
                 case "NT":
                     $timezone = "America/Yellowknife";
                     break;
                 case "NU":
                     $timezone = "America/Rankin_Inlet";
                     break;
                 case "ON":
                     $timezone = "America/Toronto";
                     break;
                 case "PE":
                     $timezone = "America/Halifax";
                     break;
                 case "QC":
                     $timezone = "America/Montreal";
                     break;
                 case "SK":
                     $timezone = "America/Regina";
                     break;
                 case "YT":
                     $timezone = "America/Whitehorse";
                     break;
             }
             break;
         case "AU":
             switch ($region) {
                 case "01":
                     $timezone = "Australia/Sydney";
                     break;
                 case "02":
                     $timezone = "Australia/Sydney";
                     break;
                 case "03":
                     $timezone = "Australia/Darwin";
                     break;
                 case "04":
                     $timezone = "Australia/Brisbane";
                     break;
                 case "05":
                     $timezone = "Australia/Adelaide";
                     break;
                 case "06":
                     $timezone = "Australia/Hobart";
                     break;
                 case "07":
                     $timezone = "Australia/Melbourne";
                     break;
                 case "08":
                     $timezone = "Australia/Perth";
                     break;
             }
             break;
     }
     return $timezone;
 }
 
 function ucwords (str) {
     return (str + '').replace(/^(.)|\s+(.)/g, function ($1) {
         return $1.toUpperCase()
     })
 }
export function getCountry2Digit($country){
        
    if(String.prototype.trim.call($country) == ''){
        return 'US';
    }
    
    if(String.prototype.trim.call($country).length == 2){
        return String.prototype.trim.call($country);
    }
    let $text = '';
    switch ($country){
        case "United States":
            $text = "US";
            break;
        case "USA":
            $text = "US";
            break;
        case "Hoa Kỳ":
            $text = "US";
            break;
        case "Canada":
            $text = "CA";
            break;
        case "canada":
            $text = "CA";
            break;
        case  "Ca-na-đa":
            $text = "CA";
            break;
        default:
            $text = "US";
    }
    return $text;
}
