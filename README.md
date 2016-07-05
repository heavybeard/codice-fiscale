# codice-fiscale

Javascript object for managing the italian tax code.

## How To Use

Add the Object file

```html
<script src="./CodiceFiscale.min.js" type="text/javascript"></script>
```

Use the function to calculate the tax code

```javascript
var name = 'Mario',
    lastname = 'Rossi',
    day = '25',
    month = '04',
    year = '1945',
    isMale = true,
    commune = 'Milano';

CodiceFiscale.getTaxCode(name, lastname, day, month, year, true, 'Milano');
```

## Known issues

### Calculation of control char

The `CodiceFiscale.getControlChar()` don't work properly, so the last tax code's char is not always right.

## Versions

### Version 0.0.1

* Initialize the code
* CodiceFiscale is an Object without constructor
* Used the original logic code

## Credits

The code is freely taken from [zingus.altervista.org](http://zingus.altervista.org/sof/cfisc-js/cfisc.html).
This is a refactoring code finally here, on Github.
