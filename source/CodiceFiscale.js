/**
 * CodiceFiscale
 *
 * A javscript object for managing the italian tax code:
 * - create it
 * - check it
 */
function CodiceFiscale(generality) {
    // Get the generality options
    console.log(this);
    var g = this._options(generality);

    this.name = g.name;
    this.lastname = g.lastname;
    this.day = g.day;
    this.month = g.month;
    this.year = g.year;
    this.isMale = g.isMale;
    this.communeName = g.communeName;

    return this.taxCode();
}

/**
 * Get the tax code
 *
 * @public
 * @return {String}
 */
CodiceFiscale.taxCode = function () {
    var lastnameCode = this.getLastnameCode(this.lastname),
        nameCode = this.getNameCode(this.name),
        dateCode = this.getDateCode(this.day, this.month, this.year, this.isMale),
        communeCode = this.getCommuneCode(this.commune),
        taxCode = '';

    taxCode = lastnameCode + nameCode + dateCode + communeCode;
    taxCode += this.getControlChar(taxCode);

    return taxCode;
};

/**
 * Get the control char of a defined tax code
 *
 * @public
 * @return {String}
 */
CodiceFiscale.controlChar = function () {
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
CodiceFiscale.lastnameCode = function () {
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
CodiceFiscale.nameCode = function () {
    var name = this.name,
        nameCode = '';

    nameCode = this.getConsonants(name);
    if (nameCode.length >= 4) {
        nameCode = nameCode.charAt(0) + nameCode.charAt(2) + nameCode.charAt(3);
    }
    else {
        nameCode += this.getVowels(name);
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
CodiceFiscale.dateCode = function () {
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
CodiceFiscale.communeCode = function () {
    var communeName = this.communeName,
        stringToMatch = /^[A-Z]\d\d\d$/i;

    if (communeName.match(stringToMatch)) {
        return communeName;
    }

    return this.communeName(communeName)[0][1];
};

/**
 * Get the commune name
 *
 * @private
 * @return {String}
 */
CodiceFiscale.communeName = function () {
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
 * Define encapsulated properties and methods
 * @type {Object}
 */
CodiceFiscale.prototype = {
    /** @type {Object} Define the prototype constructor */
    constructor: CodiceFiscale,

    /** @private */
    /** @type {Number} The number of max chars on italian tax code */
    _maxChar: 15,

    /** @private */
    /** @type {Array} The array of month in char */
    _monthCodes: [
        /** Jan - Feb - Mar */
        'A', 'B', 'C',
        /** Apr - May - Jun */
        'D', 'E', 'H',
        /** Jul - Aug - Sep */
        'L', 'M', 'P',
        /** Oct - Nov - Dec */
        'R', 'S', 'T',
    ],

    /** @private */
    /** @type {String} Char to control */
    _controlChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',

    /** @private */
    /** @type {Object} Table of association of char to control */
    _charsControlValue: {
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
    },

    /** @private */
    /** @type {JSON} Defined in CodiceFiscale.cadastralCodes.js */
    _cadastralCodes: {},

    /**
     * Return the generality settend on Class call
     *
     * @private
     * @param  {Object|Array} generality The generality passed
     * @return {Object}
     */
    _options: function (generality) {
        return {
            name: generality.name || generality[0],
            lastname: generality.lastname || generality[1],
            day: generality.day || generality[2],
            month: generality.month || generality[3],
            year: generality.year || generality[4],
            isMale: generality.isMale || generality[5],
            communeName: generality.communeName || generality[6],
        };
    },

    /**
     * Get the cosonants of a string
     *
     * @private
     * @param  {String} string The string to parse
     * @return {String}
     */
    _consonants: function (string) {
        return string.replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/gi,'');
    },

    /**
     * Get the vowels of a string
     *
     * @private
     * @param  {String} string The string to parse
     * @return {String}
     */
    _vowels: function (string) {
        return string.replace(/[^AEIOU]/gi,'');
    },
};

/**
 * Get control value of even char
 *
 * @protected
 * @param  {String} char The char to check
 * @return {Number}
 */
CodiceFiscale.controlValueEven = function (char) {
    return this.controlValue(char, true);
};

/**
 * Get control value of odd char
 *
 * @protected
 * @param  {String} char The char to check
 * @return {Number}
 */
CodiceFiscale.controlValueOdd = function (char) {
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
CodiceFiscale.controlValue = function (char, isEven) {
    var type = (isEven) ? 'even' : 'odd';

    return this._charsControlValue[type][char];
};

/**
 * Get the controlChars
 *
 * @protected
 * @return {String}
 */
CodiceFiscale.controlChars = function () {
    return this._controlChars;
};

/**
 * Get the maxAlphabetChar
 *
 * @protected
 * @return {Number}
 */
CodiceFiscale.maxAlphabetChar = function () {
    return this.controlChars().length;
};

/**
 * Get the maxChar
 *
 * @protected
 * @return {Number}
 */
CodiceFiscale.maxChar = function () {
    return this._maxChar;
};

/**
 * Get the month code
 *
 * @protected
 * @param  {Number} month The index of the month
 * @return
 */
CodiceFiscale.monthCode = function (month) {
    return this._monthCodes[month];
};

/**
 * Get the cadastralCodes
 *
 * @protected
 * @return {JSON}
 */
CodiceFiscale.cadastralCodes = function () {
    return this._cadastralCodes;
};

/**
 * Get the cadastralCode selected
 *
 * @protected
 * @return {String}
 */
CodiceFiscale.singleCadastralCode = function (code) {
    return this.cadastralCodes()[code];
};
