# Introduction #

Validation for ABN values.

# Details #
```
        $('#abn').change(function() {
            var abn = $(this);
            var value = abn.val().replace(/\s+/g, '');

            if (value.length == 0) {
                abn.forces_setCustomValidity('');
            } else if (value.match(/^[0-9]{11}$/)) {
                var d = value.split('');

                var checksum = d[0] * 10;
                var weight = 1;
                for (var i = 1; 11 > i; i++) {
                    checksum += (d[i] * weight);
                    weight += 2;
                }

                if (checksum % 89 === 10) {
                    abn.forces_setCustomValidity('');
                } else {
                    abn.forces_setCustomValidity('invalid ABN');
                }
            } else {
                abn.forces_setCustomValidity('must be an 11 digit number');
            }
        });
```


# Reference #
[Format of the Australian Business Number (ABN)](http://ato.gov.au/businesses/content.asp?doc=/content/13187.htm&pc=001/003/021/001/008&mnu=59&mfp=001/003&st=&cy=1)