/**
 * CodiceFiscale
 *
 * A javscript object for managing the italian tax code:
 * - create it
 * - check it
 */

/**
 * Interface for classes that represent a tax code
 *
 * @interface
 */
var CodiceFiscale = CodiceFiscale || {};

(function () {
'use strict';

    /** @private */
    /** @type {Number} The number of max chars on italian tax code */
    CodiceFiscale.maxChar = 15;

    /** @private */
    /** @type {Array} The array of month in char */
    CodiceFiscale.monthCodes = [
        /** Jan - Feb - Mar */
        'A', 'B', 'C',
        /** Apr - May - Jun */
        'D', 'E', 'H',
        /** Jul - Aug - Sep */
        'L', 'M', 'P',
        /** Oct - Nov - Dec */
        'R', 'S', 'T'
    ];

    /** @private */
    /** @type {String} Char to control */
    CodiceFiscale.controlChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    /** @private */
    /** @type {Object} Table of association of char to control */
    CodiceFiscale.charsControlValue = {
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
        }
    };

    /** @private */
    /** @type {JSON} Defined in CodiceFiscale.cadastralCodes.js */
    CodiceFiscale.cadastralCodes = {};

    /**
     * Get the tax code
     * This is the main function
     *
     * @protected
     * @param  {String}  name     The name
     * @param  {String}  lastname The lastame
     * @param  {Number}  day      The day of birth
     * @param  {Number}  month    The month of birth
     * @param  {Number}  year     The year of birth
     * @param  {Boolean} isMale   Set true if is male
     * @param  {String}  commune  The commune name
     * @return {String}
     */
    CodiceFiscale.getTaxCode = function (generality) {
        var g = this.generality(generality);

        var lastNameCode = this.getLastnameCode(g.lastname),
            nameCode = this.getNameCode(g.name),
            dateCode = this.getDateCode(g.day, g.month, g.year, g.isMale),
            communeCode = this.getCommuneCode(g.commune),
            taxCode = '';

        taxCode = lastNameCode + nameCode + dateCode + communeCode;
        taxCode += this.getControlChar(taxCode);

        return taxCode;
    };

    /**
     * Get the control char of a defined tax code
     *
     * @protected
     * @param  {String} codiceFiscale The tax code to parse
     * @return {String}
     */
    CodiceFiscale.getControlChar = function (codiceFiscale) {
        var i = 0,
            val = 0,
            indexChar = 0;

        for (i = 0; i < this.getMaxChar(); i++) {
            indexChar = codiceFiscale[i];
            if (i % 2) {
                val += this.getControlValueEven(indexChar);
            }
            else {
                val += this.getControlValueOdd(indexChar);
            }
        }

        val = val % this.getMaxAlphabetChar();

        return this.getControlChars().charAt(val);
    };

    /**
     * Get the lastname code [3 chars in uppercase]
     *
     * @protected
     * @param  {String} lastname The string to parse
     * @return {String}
     */
    CodiceFiscale.getLastnameCode = function (lastname) {
        var lastNameCode = '';

        lastNameCode = this.getConsonants(lastname);
        lastNameCode += this.getVowels(lastname);
        lastNameCode += 'XXX';
        lastNameCode = lastNameCode.substr(0, 3);

        return lastNameCode.toUpperCase();
    };

    /**
     * Get the name code [3 chars in uppercase]
     *
     * @protected
     * @param  {String} name The string to parse
     * @return {String}
     */
    CodiceFiscale.getNameCode = function (name) {
        var nameCode = '';

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
     * @param  {Number}     day    The day of birthday
     * @param  {Number}     month  The month of birthday
     * @param  {Number}     year   The year of birthday
     * @param  {Boolean}    gender Set false if is Female
     * @return {String}
     */
    CodiceFiscale.getDateCode = function (day, month, year, isMale) {
        var date = new Date(),
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
        stringedMonth = this.getMonthCode(date.getMonth());

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
     * @param  {String} communePattern The commune pattern
     * @return {String}
     */
    CodiceFiscale.getCommuneCode = function (communePattern) {
        var stringToMatch = /^[A-Z]\d\d\d$/i;

        if (communePattern.match(stringToMatch)) {
            return communePattern;
        }

        return this.getCommune(communePattern)[0][1];
    };

    /**
     * Get the commune
     *
     * @private
     * @param  {String} communePattern The commune pattern
     * @return {String}
     */
    CodiceFiscale.getCommune = function (communePattern) {
        var code = [],
            commune = [],
            communeCodeToReturn = [],
            stringToReplace = /([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!<\>\|\:])/g,
            quoted = '',
            re = '',
            regex = '';

        quoted = communePattern.replace(stringToReplace, '\\$1');
        regex = new RegExp(quoted, 'i');
        for (code in this.getCadastralCodes()) {
            commune = this.getSingleCadastralCode(code);
            if (commune.match(regex)) {
                communeCodeToReturn.push([commune, code]);
            }
        }

        return communeCodeToReturn;
    };

    /**
     * Return the generality settend on Class call
     * @param  {Object|Array} generality The generality passed
     * @return {Object}
     */
    CodiceFiscale.generality = function (generality) {
        return {
            name: generality.name || generality[0],
            lastname: generality.lastname || generality[1],
            day: generality.day || generality[2],
            month: generality.month || generality[3],
            year: generality.year || generality[4],
            isMale: generality.isMale || generality[5],
            commune: generality.commune || generality[6],
        };
    };

    /**
     * Get the cosonants of a string
     *
     * @protected
     * @param  {String} string The string to parse
     * @return {String}
     */
    CodiceFiscale.getConsonants = function (string) {
        return string.replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/gi,'');
    };

    /**
     * Get the vowels of a string
     *
     * @param  {String} string The string to parse
     * @return {String}
     */
    CodiceFiscale.getVowels = function (string) {
        return string.replace(/[^AEIOU]/gi,'');
    };

    /**
     * Get control value of even char
     *
     * @protected
     * @param  {String} char The char to check
     * @return {Number}
     */
    CodiceFiscale.getControlValueEven = function (char) {
        return this.getControlValue(char, true);
    };

    /**
     * Get control value of odd char
     *
     * @protected
     * @param  {String} char The char to check
     * @return {Number}
     */
    CodiceFiscale.getControlValueOdd = function (char) {
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
    CodiceFiscale.getControlValue = function (char, isEven) {
        var type = (isEven) ? 'even' : 'odd';

        return this.charsControlValue[type][char];
    };

    /**
     * Get the controlChars
     *
     * @protected
     * @return {String}
     */
    CodiceFiscale.getControlChars = function () {
        return this.controlChars;
    };

    /**
     * Get the maxAlphabetChar
     *
     * @protected
     * @return {Number}
     */
    CodiceFiscale.getMaxAlphabetChar = function () {
        return this.getControlChars().length;
    };

    /**
     * Get the maxChar
     *
     * @protected
     * @return {Number}
     */
    CodiceFiscale.getMaxChar = function () {
        return this.maxChar;
    };

    /**
     * Get the month code
     *
     * @protected
     * @param  {Number} month The index of the month
     * @return
     */
    CodiceFiscale.getMonthCode = function (month) {
        return this.monthCodes[month];
    };

    /**
     * Get the cadastralCodes
     *
     * @protected
     * @return {JSON}
     */
    CodiceFiscale.getCadastralCodes = function () {
        return this.cadastralCodes;
    };

    /**
     * Get the cadastralCode selected
     *
     * @protected
     * @return {String}
     */
    CodiceFiscale.getSingleCadastralCode = function (code) {
        return this.cadastralCodes[code];
    };

})();
