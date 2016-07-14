# codice-fiscale

Javascript object for managing the italian tax code.

## How To Use

Add the Object file

```html
<script src="./CodiceFiscale.min.js" type="text/javascript"></script>
```

Use the function to calculate the tax code

```javascript
var person = new CodiceFiscale({
    name: 'Mario',
    lastname: 'Rossi',
    day: '25',
    month: '04',
    year: '1945',
    isMale: true,
    communeName: 'Milano'
});
```
Use the public function for getting specific taxcode part

```javascript
person.taxCode();       // RSSMRA45D25F205N
person.lastnameCode();  // RSS
person.nameCode();      //    MRA

person.dateCode();      //       45D25
person.yearCode();      //       45
person.monthCode();     //         D
person.dayCode();       //          25

person.communeCode();   //            F205

person.controlChar();   //                N
```

## Known issues

### ~~Calculation of control char~~

~~The control char calculation don't work properly, so the last tax code's char is not always right~~

## Versions

### Version 1.0.0

* Complete refactoring of the code
* CodiceFiscale is an Object with a constructor
* Create public function for specific taxcode part
* Fixed control char calculation

### Version 0.0.1

* Initialize the code
* CodiceFiscale is an Object without constructor
* Used the original logic code

## Credits

The code is freely taken from [zingus.altervista.org](http://zingus.altervista.org/sof/cfisc-js/cfisc.html).
This is a refactoring code finally here, on Github.
