/**
 * Created by Kacper Chara / kacper.chara@gmail.com
 */

(function ($) {
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
            debugMode: true // true or false
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

            // Get all inputs in a form and parse them for rules
            $(selector + ' *').filter('input, select, textarea').each(function (index, elem) {

                // Skip all inputs without a name
                if ($(elem).attr('name') !== undefined) {
                    // Create easy shortcut for input name
                    var name = $(elem).attr('name');

                    // BASIC SETUP
                    // basic setup, create rules and messages objects
                    if (rulesObj.rules[name] === undefined) {
                        rulesObj.rules[name] = {};
                        rulesObj.messages[name] = {};
                    }
                }

            });

            // Set error message container element
            rulesObj.errorElement = 'div';

            // Selectric specific setup and hidden inputs with class check-it
            rulesObj.ignore = '.selectric-input, :hidden:not(select)';

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

            rulesObj.submitHandler = function(form){
                console.log('this form is valid');
            }

            // create validator object, passing created rulesObj
            formValidators[selector] = $(selector).validate(rulesObj);
        }

    });
})(jQuery);