# CodiceFiscale

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

### [Omocodia](http://www.engyes.com/en/dic-content/omocodia)

This is an issue in italian system.
In this case government offices change chars without a real algorithm because we don't know how many omocodias there're in this moment.
Here there's a [good explanation](http://quifinanza.it/tasse/codice-fiscale-come-si-calcola-e-come-si-corregge-in-caso-di-omocodia/1708/) for calculating it.

> It consists in replacing one or more of the seven numbers of the code, starting from the rightmost one, with the corresponding letters below:
> 
> ```0 = L   |   1 = M   |   2 = N   |   3 = P   |   4 = Q ```
>
> ``` 5 = R  |    6 = S   |   7 = T   |   8 = U   |   9 = V ```


### ~~Calculation of control char~~

~~The control char calculation don't work properly, so the last tax code's char is not always right.~~

## Versions

### Version 1.0.2
* Added on bower packages
* Fix bower.json file for publishing
* Added beautified script on dist

### Version 1.0.1

* New functions for setting and getting properties
* Functions now have correct scope
* Properties refactoring

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
