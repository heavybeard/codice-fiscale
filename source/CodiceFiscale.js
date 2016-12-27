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

    this.generality('name', g.name);
    this.generality('lastname', g.lastname);
    this.generality('day', g.day);
    this.generality('month', g.month);
    this.generality('year', g.year);
    this.generality('isMale', g.isMale);
    this.generality('communeName', g.communeName);
}

/** @type {Object} Define the prototype constructor */
CodiceFiscale.prototype.constructor = CodiceFiscale;

/**
 * The generalities infos of person
 *
 * @private
 * @type {Object}
 */
CodiceFiscale.__generalities = {
    /** @type {String} The name */
    name: '',
    /** @type {String} The lastname */
    lastname: '',
    /** @type {String} The day of birth */
    day: '',
    /** @type {String} The month of birth */
    month: '',
    /** @type {String} The year of birth */
    year: '',
    /** @type {Boolean} Set true if is male gender */
    isMale: '',
    /** @type {String} The commun */
    communeName: '',
};

/**
 * All settings variable are here
 *
 * @private
 * @type {Object}
 */
CodiceFiscale.prototype.__settings = {
    /** @type {Number} The number of max chars on italian tax code */
    maxChar: 15,
    /** @type {Array} The array of month in char */
    monthCodes: [
        /** Jan - Feb - Mar */
        'A', 'B', 'C',
        /** Apr - May - Jun */
        'D', 'E', 'H',
        /** Jul - Aug - Sep */
        'L', 'M', 'P',
        /** Oct - Nov - Dec */
        'R', 'S', 'T',
    ],
    /** @type {String} Char to control */
    controlChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    /** @type {Object} Table of association of char to control */
    charsControlValue: {
        'even': {
            0: 0,
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
            6: 6,
            7: 7,
            8: 8,
            9: 9,
            A: 0,
            B: 1,
            C: 2,
            D: 3,
            E: 4,
            F: 5,
            G: 6,
            H: 7,
            I: 8,
            J: 9,
            K: 10,
            L: 11,
            M: 12,
            N: 13,
            O: 14,
            P: 15,
            Q: 16,
            R: 17,
            S: 18,
            T: 19,
            U: 20,
            V: 21,
            W: 22,
            X: 23,
            Y: 24,
            Z: 25
        },
        'odd': {
            0: 1,
            1: 0,
            2: 5,
            3: 7,
            4: 9,
            5: 13,
            6: 15,
            7: 17,
            8: 19,
            9: 21,
            A: 1,
            B: 0,
            C: 5,
            D: 7,
            E: 9,
            F: 13,
            G: 15,
            H: 17,
            I: 19,
            J: 21,
            K: 2,
            L: 4,
            M: 18,
            N: 20,
            O: 11,
            P: 3,
            Q: 6,
            R: 8,
            S: 12,
            T: 14,
            U: 16,
            V: 10,
            W: 22,
            X: 25,
            Y: 24,
            Z: 23
        },
    },
    /** @type {JSON} Defined in CodiceFiscale.cadastralCodes.js */
    cadastralCodes: {},
};

/**
 * Return the tax code
 *
 * @public
 * @return {String}
 */
CodiceFiscale.prototype.taxCode = function () {
    var lastnameCode = this.lastnameCode(),
        nameCode = this.nameCode(),
        dateCode = this.dateCode(),
        communeCode = this.communeCode(),
        taxCode = '';

    taxCode = lastnameCode + nameCode + dateCode + communeCode;
    taxCode += this.controlChar();

    return taxCode;
};

/**
 * Return the lastname code [3 chars in uppercase]
 *
 * @public
 * @return {String}
 */
CodiceFiscale.prototype.lastnameCode = function () {
    var lastname = this.generality('lastname'),
        lastnameCode = '';

    lastnameCode = this.__consonants(lastname);
    lastnameCode += this.__vowels(lastname);
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
    var name = this.generality('name'),
        nameCode = '';

    nameCode = this.__consonants(name);
    if (nameCode.length >= 4) {
        nameCode = nameCode.charAt(0) + nameCode.charAt(2) + nameCode.charAt(3);
    }
    else {
        nameCode += this.__vowels(name);
        nameCode += 'XXX';
        nameCode = nameCode.substr(0, 3);
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
    year = this.generality('year').toString();

    return year.substr(year.length - 2, 2);
};

/**
 * Return the month code
 *
 * @public
 * @param  {Number} month The month
 * @return
 */
CodiceFiscale.prototype.monthCode = function () {
    var month = parseInt(this.generality('month') - 1);

    return this.setting('monthCodes')[month];
};

/**
 * Return the day code
 *
 * @public
 * @param  {Number} day The day
 * @return
 */
CodiceFiscale.prototype.dayCode = function () {
    var day = parseInt(this.generality('day'));

    day = (this.generality('isMale')) ? day : day + 40;
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
    var communeName = this.generality('communeName'),
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
CodiceFiscale.prototype.controlChar = function () {
    var i = 0,
        val = 0,
        indexChar = 0,
        maxChar = this.setting('maxChar'),
        controlChar = this.setting('controlChars'),
        lastnameCode = this.lastnameCode(),
        nameCode = this.nameCode(),
        dateCode = this.dateCode(),
        communeCode = this.communeCode(),
        partialTaxCode = '';

    // Get the partial tax code
    partialTaxCode = lastnameCode + nameCode + dateCode + communeCode;

    for (i = 0; i < maxChar; i++) {
        indexChar = partialTaxCode[i];
        if (i % 2) {
            val += this._controlValue('even', indexChar);
        }
        else {
            val += this._controlValue('odd', indexChar);
        }
    }

    val = val % controlChar.length;

    return controlChar.charAt(val);
};

/**
 * Get or set settings property
 * This is an interface to only settings
 *
 * @public
 * @param {String} propertyPath The property to set or get
 * @param {mixin}  dataToSet    Data to set, if not defined than return
 */
CodiceFiscale.prototype.setting = function (property, dataToSet) {
    return this.__property('__settings.' + property, dataToSet);
};

/**
 * Get or set generalities property
 * This is an interface to only generalities
 *
 * @public
 * @param {String} propertyPath The property to set or get
 * @param {mixin}  dataToSet    Data to set, if not defined than return
 */
CodiceFiscale.prototype.generality = function (property, dataToSet) {
    return this.__property('__generalities.' + property, dataToSet);
};

/**
 * Return the commune name and code
 *
 * @protected
 * @return {Array}
 */
CodiceFiscale.prototype._commune = function () {
    var communeName = this.generality('communeName'),
        code = [],
        commune = [],
        communeCodeToReturn = [],
        stringToReplace = /([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!<\>\|\:])/g,
        quoted = '',
        re = '',
        regex = '';

    quoted = communeName.replace(stringToReplace, '\\$1');
    regex = new RegExp(quoted, 'i');
    for (code in this.setting('cadastralCodes')) {
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
 * @protected
 * @return {String}
 */
CodiceFiscale.prototype._communeCadastralCode = function (code) {
    return this.setting('cadastralCodes')[code];
};

/**
 * Return control value of even/odd char
 *
 * @protected
 * @param  {String} type 'even' or 'odd'
 * @param  {String} char The char to check
 * @return {Number}
 */
CodiceFiscale.prototype._controlValue = function (type, char) {
    return this.setting('charsControlValue')[type][char];
};

/**
 * Return the generality setted on Class call
 *
 * @protected
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

    return options;
};

/**
 * Return the cosonants of a string
 *
 * @private
 * @param  {String} string The string to parse
 * @return {String}
 */
CodiceFiscale.prototype.__consonants = function (string) {
    return string.replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/gi, '');
};

/**
 * Return the vowels of a string
 *
 * @private
 * @param  {String} string The string to parse
 * @return {String}
 */
CodiceFiscale.prototype.__vowels = function (string) {
    return string.replace(/[^AEIOU]/gi, '');
};

/**
 * Get or Set the property
 *
 * @private
 * @param {String} propertyPath The property to set or get
 * @param {mixin}  dataToSet    Data to set, if not defined than return
 */
CodiceFiscale.prototype.__property = function (propertyPath, dataToSet) {
    return (function deepProp(self, path, data) {
        if (typeof path === 'string') {
            path = path.split('.');
        }

        if (path.length > 1) {
            var singlePath = path.shift();

            if (self[singlePath] === null || typeof self[singlePath] !== 'object') {
                self[singlePath] = {};
            }

            return deepProp(self[singlePath], path, data);
        }
        else {
            if (typeof data === 'undefined') {
                // Set global property variable
                return self[path[0]];
            }
            else {
                self[path[0]] = data;
            }
        }
    })(this, propertyPath, dataToSet);
};
