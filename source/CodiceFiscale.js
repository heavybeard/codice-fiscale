/**
 * CodiceFiscale
 *
 * A javscript object for managing the italian tax code:
 * - create it
 * - check it
 */
function CodiceFiscale(generality) {
    if (!(this instanceof CodiceFiscale)) {
        return new CodiceFiscale(generality);
    }

    // Get the generality options
    var g = this._options(generality);

    this.name = g.name;
    this.lastname = g.lastname;
    this.day = g.day;
    this.month = g.month;
    this.year = g.year;
    this.isMale = g.isMale;
    this.communeName = g.communeName;

    return this;
}

/** @type {Object} Define the prototype constructor */
CodiceFiscale.prototype.constructor = CodiceFiscale;

/** @private */
/** @type {Number} The number of max chars on italian tax code */
CodiceFiscale.prototype._maxChar = 15;

/** @private */
/** @type {Array} The array of month in char */
CodiceFiscale.prototype._monthCodes = [
    /** Jan - Feb - Mar */
    'A', 'B', 'C',
    /** Apr - May - Jun */
    'D', 'E', 'H',
    /** Jul - Aug - Sep */
    'L', 'M', 'P',
    /** Oct - Nov - Dec */
    'R', 'S', 'T',
];

/** @private */
/** @type {String} Char to control */
CodiceFiscale.prototype._controlChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** @private */
/** @type {Object} Table of association of char to control */
CodiceFiscale.prototype._charsControlValue = {
    'even': {
        0:0,  1:1,   2:2,  3:3,   4:4,  5:5,  6:6,  7:7,  8:8,
        9:9,  A:0,   B:1,  C:2,   D:3,  E:4,  F:5,  G:6,  H:7,
        I:8,  J:9,   K:10, L:11,  M:12, N:13, O:14, P:15, Q:16,
        R:17, S:18,  T:19, U:20,  V:21, W:22, X:23, Y:24, Z:25
    },
    'odd': {
        0:1,  1:0,  2:5,  3:7,  4:9,  5:13, 6:15, 7:17, 8:19,
        9:21, A:1,  B:0,  C:5,  D:7,  E:9,  F:13, G:15, H:17,
        I:19, J:21, K:2,  L:4,  M:18, N:20, O:11, P:3,  Q:6,
        R:8,  S:12, T:14, U:16, V:10, W:22, X:25, Y:24, Z:23
    },
};

/** @private */
/** @type {JSON} Defined in CodiceFiscale.cadastralCodes.js */
CodiceFiscale.prototype._cadastralCodes = {};

/**
 * Return the generality settend on Class call
 *
 * @private
 * @param  {Object|Array} generality The generality passed
 * @return {Object}
 */
CodiceFiscale.prototype._options = function (generality) {
    var options = {
        name: generality.name || generality[0],
        lastname: generality.lastname || generality[1],
        day: generality.day || generality[2],
        month: generality.month || generality[3],
        year: generality.year || generality[4],
        isMale: generality.isMale || generality[5] || false,
        communeName: generality.communeName || generality[6],
    };

    this._checkUndefined(options);

    return options;
};

/**
 * Console warn message for undefined properties
 *
 * @private
 * @param  {Object} object The object to check
 */
CodiceFiscale.prototype._checkUndefined = function (object) {
    for (var property in object) {
        if (typeof object[property] === 'undefined') {
            console.warn('The ' + property + ' property is not defined');
        }
    }
};

/**
 * Get the cosonants of a string
 *
 * @private
 * @param  {String} string The string to parse
 * @return {String}
 */
CodiceFiscale.prototype._consonants = function (string) {
    return string.replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/gi,'');
};

/**
 * Get the vowels of a string
 *
 * @private
 * @param  {String} string The string to parse
 * @return {String}
 */
CodiceFiscale.prototype._vowels = function (string) {
    return string.replace(/[^AEIOU]/gi,'');
};

/**
 * Get the tax code
 *
 * @public
 * @return {String}
 */
CodiceFiscale.prototype.taxCode = function () {
    var lastnameCode = this.lastnameCode(this.lastname),
        nameCode = this.nameCode(this.name),
        dateCode = this.dateCode(this.day, this.month, this.year, this.isMale),
        communeCode = this.communeCode(this.commune),
        taxCode = '';

    taxCode = lastnameCode + nameCode + dateCode + communeCode;
    taxCode += this.controlChar(taxCode);

    return taxCode;
};

/**
 * Get the control char of a defined tax code
 *
 * @public
 * @return {String}
 */
CodiceFiscale.prototype.controlChar = function () {
    var i = 0,
        val = 0,
        indexChar = 0,
        taxCode = this.taxCode();

    for (i = 0; i < this.maxChar(); i++) {
        indexChar = taxCode[i];
        if (i % 2) {
            val += this.controlValueEven(indexChar);
        }
        else {
            val += this.controlValueOdd(indexChar);
        }
    }

    val = val % this.maxAlphabetChar();

    return this.controlChars().charAt(val);
};

/**
 * Get the lastname code [3 chars in uppercase]
 *
 * @protected
 * @return {String}
 */
CodiceFiscale.prototype.lastnameCode = function () {
    var lastname = this.lastname,
        lastnameCode = '';

    lastnameCode = this._consonants(lastname);
    lastnameCode += this._vowels(lastname);
    lastnameCode += 'XXX';
    lastnameCode = lastnameCode.substr(0, 3);

    return lastnameCode.toUpperCase();
};

/**
 * Get the name code [3 chars in uppercase]
 *
 * @protected
 * @return {String}
 */
CodiceFiscale.prototype.nameCode = function () {
    var name = this.name,
        nameCode = '';

    nameCode = this._consonants(name);
    if (nameCode.length >= 4) {
        nameCode = nameCode.charAt(0) + nameCode.charAt(2) + nameCode.charAt(3);
    }
    else {
        nameCode += this._vowels(name);
        nameCode += 'XXX';
        nameCode = nameCode.substr(0,3);
    }

    return nameCode.toUpperCase();
};

/**
 * Get the date code
 *
 * @protected
 * @return {String}
 */
CodiceFiscale.prototype.dateCode = function () {
    var day = this.day,
        month = this.month,
        year = this.year,
        isMale = this.isMale,
        date = new Date(),
        stringedDay = 0,
        stringedMonth = 0,
        stringedYear = 0;

    /** Set the JS Date */
    date.setYear(year);
    date.setMonth(month - 1);
    date.setDate(day);

    /** @type {String} Set the stringed Year */
    stringedYear = date.getFullYear().toString().substr(year.length - 2, 2);

    /** @type {String} Set the stringed Month */
    stringedMonth = this.monthCode(date.getMonth());

    /** @type {String} Set the stringed Day with gender */
    stringedDay = date.getDate();
    stringedDay = (isMale) ? stringedDay : stringedDay + 40;
    stringedDay = stringedDay.toString().substr(stringedDay.length - 2, 2);

    return '' + stringedYear + stringedMonth + stringedDay;
};

/**
 * Get the commune code
 *
 * @protected
 * @return {String}
 */
CodiceFiscale.prototype.communeCode = function () {
    var communeName = this.communeName,
        stringToMatch = /^[A-Z]\d\d\d$/i;

    if (communeName.match(stringToMatch)) {
        return communeName;
    }

    return this.communeName()[0][1];
};

/**
 * Get the commune name
 *
 * @private
 * @return {String}
 */
CodiceFiscale.prototype.communeName = function () {
    var communeName = this.communeName,
        code = [],
        commune = [],
        communeCodeToReturn = [],
        stringToReplace = /([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!<\>\|\:])/g,
        quoted = '',
        re = '',
        regex = '';

    quoted = communeName.replace(stringToReplace, '\\$1');
    regex = new RegExp(quoted, 'i');
    for (code in this.cadastralCodes()) {
        commune = this.singleCadastralCode(code);
        if (commune.match(regex)) {
            communeCodeToReturn.push([commune, code]);
        }
    }

    return communeCodeToReturn;
};

/**
 * Get control value of even char
 *
 * @protected
 * @param  {String} char The char to check
 * @return {Number}
 */
CodiceFiscale.prototype.controlValueEven = function (char) {
    return this.controlValue(char, true);
};

/**
 * Get control value of odd char
 *
 * @protected
 * @param  {String} char The char to check
 * @return {Number}
 */
CodiceFiscale.prototype.controlValueOdd = function (char) {
    return this.getControlValue(char, false);
};

/**
 * Get control value of char
 *
 * @private
 * @param  {String}     char    The char to check
 * @param  {Boolean}    isEvent Set true if is even char
 * @return {Number}
 */
CodiceFiscale.prototype.controlValue = function (char, isEven) {
    var type = (isEven) ? 'even' : 'odd';

    return this._charsControlValue[type][char];
};

/**
 * Get the controlChars
 *
 * @protected
 * @return {String}
 */
CodiceFiscale.prototype.controlChars = function () {
    return this._controlChars;
};

/**
 * Get the maxAlphabetChar
 *
 * @protected
 * @return {Number}
 */
CodiceFiscale.prototype.maxAlphabetChar = function () {
    return this.controlChars().length;
};

/**
 * Get the maxChar
 *
 * @protected
 * @return {Number}
 */
CodiceFiscale.prototype.maxChar = function () {
    return this._maxChar;
};

/**
 * Get the month code
 *
 * @protected
 * @param  {Number} month The index of the month
 * @return
 */
CodiceFiscale.prototype.monthCode = function (month) {
    return this._monthCodes[month];
};

/**
 * Get the cadastralCodes
 *
 * @protected
 * @return {JSON}
 */
CodiceFiscale.prototype.cadastralCodes = function () {
    return this._cadastralCodes;
};

/**
 * Get the cadastralCode selected
 *
 * @protected
 * @return {String}
 */
CodiceFiscale.prototype.singleCadastralCode = function (code) {
    return this.cadastralCodes()[code];
};
