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

    var g = this._options(generality);

    /** @type {String} The name */
    this.name = g.name;
    /** @type {String} The lastname */
    this.lastname = g.lastname;
    /** @type {String} The day of birth */
    this.day = g.day;
    /** @type {String} The month of birth */
    this.month = g.month;
    /** @type {String} The year of birth */
    this.year = g.year;
    /** @type {Boolean} Set true if is male gender */
    this.isMale = g.isMale;
    /** @type {String} The commun */
    this.communeName = g.communeName;
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
 * Return the tax code
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
 * Return the lastname code [3 chars in uppercase]
 *
 * @public
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
 * Return the name code [3 chars in uppercase]
 *
 * @public
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
 * Return the date code
 *
 * @public
 * @return {String}
 */
CodiceFiscale.prototype.dateCode = function () {
    var stringedYear = this.yearCode(),
        stringedMonth = this.monthCode(),
        stringedDay = this.dayCode();

    return '' + stringedYear + stringedMonth + stringedDay;
};

/**
 * Return the year code
 *
 * @public
 * @param  {Number} month The year
 * @return
 */
CodiceFiscale.prototype.yearCode = function () {
    year = this.year.toString().substr(this.year.length - 2, 2);

    return year;
};

/**
 * Return the month code
 *
 * @public
 * @param  {Number} month The month
 * @return
 */
CodiceFiscale.prototype.monthCode = function () {
    var month = parseInt(this.month - 1);

    return this._monthCodes[month];
};

/**
 * Return the day code
 *
 * @public
 * @param  {Number} day The day
 * @return
 */
CodiceFiscale.prototype.dayCode = function () {
    var day = parseInt(this.day);

    day = (this.isMale) ? day : day + 40;
    day = day.toString().substr(day.length - 2, 2);

    return day;
};

/**
 * Return the commune code
 *
 * @public
 * @return {String}
 */
CodiceFiscale.prototype.communeCode = function () {
    var communeName = this.communeName,
        stringToMatch = /^[A-Z]\d\d\d$/i;

    if (communeName.match(stringToMatch)) {
        return communeName;
    }

    return this._commune()[0][1];
};

/**
 * Return the control char of a taxcode
 *
 * @public
 * @return {String}
 */
CodiceFiscale.prototype.controlChar = function (partialTaxCode) {
    // Return the control char
    if (typeof partialTaxCode === 'undefined') {
        return this.taxCode()[this._maxChar];
    }

    var i = 0,
        val = 0,
        indexChar = 0;

    for (i = 0; i < this._maxChar; i++) {
        indexChar = partialTaxCode[i];
        if (i % 2) {
            val += this._controlValue('even', indexChar);
        }
        else {
            val += this._controlValue('odd', indexChar);
        }
    }

    val = val % this._controlChars.length;

    return this._controlChars.charAt(val);
};

/**
 * Return the commune name and code
 *
 * @private
 * @return {Array}
 */
CodiceFiscale.prototype._commune = function () {
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
    for (code in this._cadastralCodes) {
        commune = this._communeCadastralCode(code);
        if (commune.match(regex)) {
            communeCodeToReturn.push([commune, code]);
        }
    }

    return communeCodeToReturn;
};

/**
 * Return the cadastralCode selected
 *
 * @private
 * @return {String}
 */
CodiceFiscale.prototype._communeCadastralCode = function (code) {
    return this._cadastralCodes[code];
};

/**
 * Return control value of even/odd char
 *
 * @private
 * @param  {String} type 'even' or 'odd'
 * @param  {String} char The char to check
 * @return {Number}
 */
CodiceFiscale.prototype._controlValue = function (type, char) {
    return this._charsControlValue[type][char];
};

/**
 * Return the generality setted on Class call
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
 * Return the cosonants of a string
 *
 * @private
 * @param  {String} string The string to parse
 * @return {String}
 */
CodiceFiscale.prototype._consonants = function (string) {
    return string.replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/gi,'');
};

/**
 * Return the vowels of a string
 *
 * @private
 * @param  {String} string The string to parse
 * @return {String}
 */
CodiceFiscale.prototype._vowels = function (string) {
    return string.replace(/[^AEIOU]/gi,'');
};
