/**
 * Created by Kacper Chara / kacper.chara@gmail.com
 */

(function ($) {
    var Helpers = function () {
        var checkNip = function (value) {
                var sum;

                if (value == null) {
                    return true;
                }

                value = value.replace(/\-/g, '');
                if (value.length != 10) {
                    return false;
                }


                for (var i = 0; i < 10; i++) {
                    if (isNaN(value[i])) {
                        return false;
                    }
                }

                sum = 6 * value[0] +
                    5 * value[1] +
                    7 * value[2] +
                    2 * value[3] +
                    3 * value[4] +
                    4 * value[5] +
                    5 * value[6] +
                    6 * value[7] +
                    7 * value[8];

                sum %= 11;

                if (value[9] != sum) {
                    return false;
                }

                return true;
            },
            checkPesel = function (value) {
                var reg = /^[0-9]{11}$/,
                    sum,
                    dig;

                if (value == null) {
                    return true;
                }

                if (reg.test(value) == false) {
                    return false;
                } else {
                    dig = ("" + value).split("");
                    sum = (1*parseInt(dig[0]) + 3*parseInt(dig[1]) + 7*parseInt(dig[2]) + 9*parseInt(dig[3]) + 1*parseInt(dig[4]) + 3*parseInt(dig[5]) + 7*parseInt(dig[6]) + 9*parseInt(dig[7]) + 1*parseInt(dig[8]) + 3*parseInt(dig[9]))%10;

                    if (sum == 0) {
                        sum = 10;
                    }

                    sum = 10 - sum;

                    if (parseInt(dig[10]) == sum) {
                        return true;
                    } else {
                        return false;
                    }
                }
            };

        return {
            checkNip: checkNip,
            checkPesel: checkPesel
        }
    };

    /* Custom additional methods */
    $.validator.addMethod("nip", function(value, element) {
        var helpers = new Helpers();
        return this.optional( element ) || helpers.checkNip(value);
    }, "NIP jest niepoprawny.");

    $.validator.addMethod("regon", function(value, element) {
        var reg = /^[0-9]$/;
        var weights = [];
        var sum = 0;
        var inte;
        var checksum;

        if(isNaN(value) == true) {
            return this.optional( element ) || false;
        } else {

            var len = value.length;
            if (len == 9) {
                weights = [8, 9, 2, 3, 4, 5, 6, 7];
            } else {

                if (len == 14) {
                    weights = [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8];
                } else {
                    return this.optional(element) || false;
                }

            }
            sum = 0;
            for (var i = 0; i < weights.length; i++) {
                sum += weights[i] * value[i];
            }
            inte = sum % 11;

            checksum = (inte == 10) ? 0 : inte;

            if (checksum == value[weights.length]) {

                return this.optional(element) || true;
            }
            return this.optional(element) || false;
        }
    }, "REGON jest niepoprawny.");

    $.validator.addMethod("pesel", function(value, element) {
        var helpers = new Helpers();
        return this.optional( element ) || helpers.checkPesel(value);
    }, "Pesel jest niepoprawny.");

    var ValidationExtension = {
        init: function(){
            this.initCustomRadioAndCheckbox();
            this.initCustomSelect();
        },
        initCustomRadioAndCheckbox: function(){
            $('.custom-checkbox, .custom-radio').iCheck();
            $('.custom-checkbox, .custom-radio').on('ifChecked ifUnchecked', function(event){
                var defaultRadioOrCheckbox = $(this);
                defaultRadioOrCheckbox.closest('form').data('validator').element(defaultRadioOrCheckbox);
            });
        },
        initCustomSelect: function(){
            $('.custom-select').selectric({
                onChange: function(element) {
                    var defaultSelect = $(this);
                    $(element).closest('form').data('validator').element(defaultSelect);
                }
            });
        }
    };

    $(document).ready(function() {
        ValidationExtension.init();
    });

    $(window).load(function(){

        // Set plugin options
        var options = {
            debugMode: false // true or false
        };

        // Create main validators container
        var formValidators = {};

        // Get all form id's on a page and push to array
        var forms = [];
        $('form.validation-plugin').each(function (index, form) {
            if ($(form).attr('id') !== undefined) {
                forms.push($(form).attr('id'));
            }
        });

        $.fn.onlyDigits = function () {
            $(this).keyup(function () {
                this.value = this.value.replace(/[^0-9\.]/g, '');
            });
        };

        // Use id's forms, to loop through their inputs - for each form
        for (var i = 0; i < forms.length; i++) {
            // Create form selector
            var selector = '#' + forms[i];

            // Create rules object for rules and messages
            var rulesObj = {
                debug: options.debugMode,
                rules: {},
                messages: {}
            };

            // Print debug info
            if (rulesObj.debug === true) {
                console.log(forms);
                console.log(selector);
            }

            // Get all inputs in a form and parse them for rules
            $(selector + ' *').filter('input, select, textarea').each(function (index, elem) {

                // Skip all inputs without a name
                if ($(elem).attr('name') !== undefined) {
                    // Create easy shortcut for input name
                    var name = $(elem).attr('name');

                    // Print debug info
                    if (rulesObj.debug === true) {
                        console.log(name);
                        console.log(elem);
                    }

                    // BASIC SETUP
                    // Basic setup, create rules and messages objects
                    if (rulesObj.rules[name] === undefined) {
                        rulesObj.rules[name] = {};
                        rulesObj.messages[name] = {};
                    }

                    // VALIDATION RULES & MESSAGES BASED ON RULES
                    // required field default rule
                    if ($(elem).attr('required') !== undefined) {
                        rulesObj.rules[name].required = true;
                        rulesObj.messages[name].required = ($(elem).attr('msg-req') !== undefined) ? $(elem).attr('msg-req') : 'To pole jest wymagane.';
                    }

                    // alnum - alphanumeric
                    if ($(elem).attr('data-type') === 'alnum') {
                        rulesObj.rules[name].pattern = /^[a-zA-Z0-9]+$/;
                        rulesObj.messages[name].pattern = 'Możesz użyć znaków alfabetu oraz cyfr.';
                    }

                    // alpha - alphabetic
                    if ($(elem).attr('data-type') === 'alpha') {
                        rulesObj.rules[name].pattern = /^[a-zA-Z]+$/;
                        rulesObj.messages[name].pattern = 'Wprowadź wyłącznie litery.'
                    }

                    // postcode
                    if ($(elem).attr('data-type') === 'postcode') {
                        rulesObj.rules[name].pattern = /^[0-9\-\s]+$/;
                        rulesObj.rules[name].minlength = 6;
                        rulesObj.messages[name].minlength = 'Wprowadź 5 liczb kodu pocztowego.';
                        rulesObj.messages[name].pattern = 'Podany format kodu jest nieprawidłowy. Spróbuj ponownie.';
                    }

                    // email default messages
                    if ($(elem).attr('type') === 'email') {
                        rulesObj.messages[name].required = 'Uzupełnij adres e-mail.';
                        rulesObj.messages[name].email = 'Proszę wpisać poprawny adres e-mail.';
                    }

                    // pesel
                    if ($(elem).attr('name').match(/pesel/i)) {
                        rulesObj.rules[name].pesel = true;
                        $(this).onlyDigits();
                    }

                    // nip
                    if ($(elem).attr('name').match(/nip/i)) {
                        rulesObj.rules[name].nip = true;
                        $(this).onlyDigits();
                    }

                    // regon
                    if ($(elem).attr('name').match(/regon/i)) {
                        rulesObj.rules[name].regon = true;
                        $(this).onlyDigits();
                    }

                    // strlen max
                    if ($(elem).attr('data-strlen-max') !== undefined) {
                        rulesObj.rules[name].maxlength = parseInt($(elem).attr('data-strlen-max'));
                        rulesObj.messages[name].maxlength = 'Wprowadź maksymalnie {0} znaków.';
                    }

                    // strlen mix
                    if ($(elem).attr('data-strlen-min') !== undefined) {
                        rulesObj.rules[name].minlength = parseInt($(elem).attr('data-strlen-min'));
                        rulesObj.messages[name].minlength = 'Wprowadź co najmniej {0} znaków.'
                    }

                    // digits only
                    if ($(elem).attr('data-type') === 'digit') {
                        rulesObj.rules[name].number = true;
                        rulesObj.messages[name].number = 'Wprowadź wyłącznie cyfry.';
                        //($(elem).attr('data-no-filter') !== undefined) ? $(this) : $(this).onlyDigits();
                        $(this).onlyDigits();
                    }

                    // regex
                    if ($(elem).attr('data-regex') !== undefined) {
                        rulesObj.rules[name].pattern = new RegExp($(elem).attr('data-regex'));
                        rulesObj.messages[name].pattern = 'Niepoprawne dane.'
                    }

                    // value-range
                    if ($(elem).attr('data-value-min') !== undefined || $(elem).attr('data-value-max') !== undefined) {
                        rulesObj.rules[name].range = [
                            ($(elem).attr('data-value-min') !== undefined) ? parseInt($(elem).attr('data-value-min')) : 0,
                            ($(elem).attr('data-value-max') !== undefined) ? parseInt($(elem).attr('data-value-max')) : 9999
                        ];
                        rulesObj.messages[name].range = 'Wprowadź wartość pomiędzy {0} a {1}.';
                        if ($(elem).attr('msg-range') !== undefined) {
                            rulesObj.messages[name].range = $(elem).attr('msg-range');
                        }
                    }

                    // checkbox default required message
                    if ($(elem).attr('type') === 'checkbox') {
                        rulesObj.messages[name].required = 'Zaznacz wybór.';

                        //if($(elem.attr('max-answers') !== undefined)) {
                        //rulesObj.rules[name].multiCheck = true;
                        //}
                    }

                    // select default required message
                    if ($(elem).is('select')) {
                        //rulesObj.rules[name].selectVisible = true;
                        rulesObj.messages[name].required = 'Wybierz z podanych opcji.';
                    }

                    // CUSTOM ERROR MESSAGES
                    // custom required message
                    if ($(elem).attr('data-msg-req') !== undefined) {
                        rulesObj.messages[name].required = $(elem).attr('data-msg-req');
                    }
                }

            });

            // Set error message container element
            rulesObj.errorElement = 'div';

            // Selectric specific setup and hidden inputs with class check-it
            rulesObj.ignore = '.selectric-input, :hidden';

            rulesObj.errorPlacement = function (error, element) {
                if(element.is(".custom-checkbox")){
                    error.appendTo(element.closest('.input-checkbox'));
                } else if (element.is(".custom-radio")) {
                    error.appendTo(element.closest('.input-radio-group'));
                } else if (element.is(".custom-select")) {
                    error.appendTo(element.closest('.input-select'));
                } else {
                    error.insertAfter(element);
                }
            };
            rulesObj.highlight = function (element, errorClass, validClass) {
                $(element).addClass(errorClass).removeClass(validClass); // default functionality

                // For selectric
                if ($(element).is('.custom-select')) {
                    $(element).closest('.input-select').find('.selectric').addClass('error-select');
                }

                // For iCheck - checkbox
                if ($(element).is('.custom-checkbox')) {
                    $(element).closest('.input-checkbox').find('.icheckbox').addClass('error-checkbox');
                }

                // For iCheck - radio
                if ($(element).is('.custom-radio')) {
                    $(element).closest('.input-radio-group').find('.iradio').addClass('error-radio');
                }
            };
            rulesObj.unhighlight = function (element, errorClass, validClass) {
                $(element).removeClass(errorClass).addClass(validClass); // default functionality

                // For selectric
                if ($(element).is('.custom-select')) {
                    $(element).closest('.input-select').find('.selectric').removeClass('error-select');
                }

                // For iCheck - checkbox
                if ($(element).is('.custom-checkbox')) {
                    $(element).closest('.input-checkbox').find('.icheckbox').removeClass('error-checkbox');
                }

                // For iCheck - radio
                if ($(element).is('.custom-radio')) {
                    $(element).closest('.input-radio-group').find('.iradio').removeClass('error-radio');
                }
            }

            // Do something on successful submit
            rulesObj.submitHandler = function(form){
                //alert('This form is VALID');
            }

            // create validator object, passing created rulesObj
            formValidators[selector] = $(selector).validate(rulesObj);
        }

    });
})(jQuery);