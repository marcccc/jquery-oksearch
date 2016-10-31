(function($) {
    'use strict';

    var defaults = {
        height: 32,
        searchTypes: [{
            id: 'device',
            name: '搜索',
            columns: [{
                id: 'ALL',
                name: '全文'
            }]
        }],
        searchFunc: function() {

        }
    };

    function OKSearch(element, options) {
        this.element = element;
        this.options = $.extend(true, {}, defaults, options);

        if (!this.options.height || 'number' != typeof this.options.height) {
            this.options.height = 32;
        }
        if(this.options.height < 26){
            this.options.height = 26;
        }

        this.searchValue = {
            searchTypeID: '',
            searchTypeName: '',
            searchWord: '',
            searchColumnID: '',
            searchColumnName: ''
        };
        this.typeColumns = {};

        this.init();
    }
    // do init contains init dom & bindEvents
    OKSearch.prototype.init = function() {

        var baseHtml = '<div class="search-box"><div class="search-type"><span></span><a></a></div><div class="search-holder"><input class="search-input" type="text" name="" /></div><ul class="search-type-select"></ul><ul class="search-input-select"></ul></div>';
        $(this.element).html(baseHtml);
        $(this.element).find('.search-box').height(this.options.height);
        $(this.element).find('.search-type').css('line-height', (this.options.height - 1) + 'px');
        $(this.element).find('.search-type a').css('background-position', ('0px ' + (this.options.height - 11) / 2) + 'px');
        $(this.element).find('.search-type-select').css('top', this.options.height + 1);
        $(this.element).find('.search-input-select').css('top', this.options.height + 1);
        $(this.element).find('.search-input-selected').css('line-height', (this.options.height - 6) + 'px');

        for (var i = 0, len = this.options.searchTypes.length; i < len; i++) {
            var searchType = this.options.searchTypes[i];
            if (0 == i) {
                this.searchValue.searchTypeID = searchType.id;
                this.searchValue.searchTypeName = searchType.name;
            }
            this.typeColumns[searchType.id] = searchType.columns;
        }
        this.render();
        this.bindEvents();
    };

    // do some can change dom init
    OKSearch.prototype.render = function() {

        $(this.element).find('.search-type span').html(this.searchValue.searchTypeName).attr('data-type-id', this.searchValue.searchTypeID).attr('data-type-name', this.searchValue.searchTypeName);

        var searchTypesHtml = new Array();
        for (var i = 0, len = this.options.searchTypes.length; i < len; i++) {
            var searchType = this.options.searchTypes[i];
            searchTypesHtml.push('<li data-type-id="' + searchType.id + '" data-type-name="' + searchType.name + '">' + searchType.name + '</li>');
        }
        $(this.element).find('.search-type-select').html(searchTypesHtml.join(''));

    };
    // bind events
    OKSearch.prototype.bindEvents = function() {

        var _okSearch = this;

        $(_okSearch.element).find('.search-type').click(function(event) {
            $(_okSearch.element).find('.search-type-select').show();
            event.stopPropagation();
        });

        $(_okSearch.element).find('.search-type-select li').click(function(event) {

            if ($(this).attr('data-type-id') == $(_okSearch.element).find('.search-type span').attr('data-type-id')) {
                $(_okSearch.element).find('.search-type-select').hide();
                event.stopPropagation();
                return;
            }
            $(_okSearch.element).find('.search-type span').html($(this).attr('data-type-name')).attr('data-type-name', $(this).attr('data-type-name')).attr('data-type-id', $(this).attr('data-type-id'));
            $(_okSearch.element).find('.search-type-select').hide();

            _okSearch.renderSearchInputSelectList();
            _okSearch.removeSearchInputSelected();

            $(_okSearch.element).find('.search-input').attr('disabled', false).focus();
            $(_okSearch.element).find('.search-input-select').show();

            event.stopPropagation();
        });

        $(_okSearch.element).find('.search-input').focus(function() {
            _okSearch.controlSearchInputSelectShowOrHide($(this).val());
        });

        $(_okSearch.element).find('.search-input').click(function(event) {
            _okSearch.controlSearchInputSelectShowOrHide($(this).val());
            event.stopPropagation();
        });

        $(_okSearch.element).find('.search-input').keyup(function(event) {

            _okSearch.controlSearchInputSelectShowOrHide($(this).val());


            if (40 == event.keyCode) {
                _okSearch.changeSearchInputSelect(1);
            } else if (38 == event.keyCode) {
                _okSearch.changeSearchInputSelect(-1);
            } else if (13 == event.keyCode) {
                _okSearch.selectSearchInputSelect();
            } else {
                _okSearch.renderSearchInputSelectList();
            }
        });

        $(_okSearch.element).delegate('.search-input-selected a', 'click', function(event) {
            _okSearch.removeSearchInputSelected($(this).parent());
            $(_okSearch.element).find('.search-input').attr('disabled', false).focus();
            $(_okSearch.element).find('.search-input-select').show();
            event.stopPropagation();
        });

        $(_okSearch.element).delegate('.search-input-select li', 'click', function(event) {
            if (!$(this).hasClass('selected')) {
                $(_okSearch.element).find('.search-input-select li.selected').removeClass('selected');
                $(this).addClass('selected');
            }
            _okSearch.selectSearchInputSelect();
        });


        $(document).click(function() {
            $(_okSearch.element).find('.search-type-select').hide();
            $(_okSearch.element).find('.search-input-select').hide();
        });
    };

    // prototype methods
    OKSearch.prototype.controlSearchInputSelectShowOrHide = function(inputWord) {
        if ('' === inputWord) {
            $(this.element).find('.search-input-select').hide();
        } else {
            $(this.element).find('.search-input-select').show();
        }
    };

    OKSearch.prototype.renderSearchInputSelectList = function() {

        var searchTypeID = $(this.element).find('.search-type span').attr('data-type-id');
        var inputWord = $(this.element).find('.search-input').val();
        var searchTypeColumnsHtml = new Array();
        var searchTypeColumns = this.typeColumns[searchTypeID];
        for (var i = 0, len = searchTypeColumns.length; i < len; i++) {
            var searchTypeColumn = searchTypeColumns[i];
            searchTypeColumnsHtml.push('<li data-column-id="' + searchTypeColumn.id + '" data-column-name="' + searchTypeColumn.name + '">' + searchTypeColumn.name + '：' + inputWord + '</li>');
        }
        $(this.element).find('.search-input-select').html(searchTypeColumnsHtml.join(''));
    };

    OKSearch.prototype.removeSearchInputSelected = function() {
        $(this.element).find('.search-input-selected').remove();
    };

    OKSearch.prototype.changeSearchInputSelect = function(flag) {
        var $searchInputSelects = $(this.element).find('.search-input-select li');
        var $selectedSearchInput = $(this.element).find('.search-input-select li.selected');

        if (1 == flag) {
            if (0 == $selectedSearchInput.length) {
                $searchInputSelects.first().addClass('selected');
            } else {
                var $nexts = $selectedSearchInput.next();
                if (0 == $nexts.length) {
                    return;
                } else {
                    $($nexts[0]).addClass('selected');
                }
                $selectedSearchInput.removeClass('selected');
            }
        } else if (-1 == flag) {
            if (0 == $selectedSearchInput.length) {
                $searchInputSelects.last().addClass('selected');
            } else {
                var $prevs = $selectedSearchInput.prev();
                if (0 == $prevs.length) {
                    return;
                } else {
                    $($prevs[$prevs.length - 1]).addClass('selected');
                }
                $selectedSearchInput.removeClass('selected');
            }
        }
    };
    OKSearch.prototype.selectSearchInputSelect = function() {
        var $selectedSearchInput = $(this.element).find('.search-input-select li.selected');
        if (0 == $selectedSearchInput.length) {
            $selectedSearchInput = $(this.element).find('.search-input-select li').first().addClass('selected');
        }
        $(this.element).find('.search-input').attr('disabled', 'disabled');
        $(this.element).find('.search-input-select').hide();

        this.searchValue.searchTypeID = $(this.element).find('.search-type span').attr('data-type-id');
        this.searchValue.searchTypeName = $(this.element).find('.search-type span').attr('data-type-name');
        this.searchValue.searchWord = $(this.element).find('.search-input').val();
        this.searchValue.searchColumnID = $selectedSearchInput.attr('data-column-id');
        this.searchValue.searchColumnName = $selectedSearchInput.attr('data-column-name');

        this.addSearchInputSelected();
        this.doSearch();
    };

    OKSearch.prototype.doSearch = function() {
        if ('function' == typeof this.options.searchFunc) {
            this.options.searchFunc(this.searchValue);
        }
    };

    OKSearch.prototype.addSearchInputSelected = function() {
        $(this.element).find('.search-box').append('<span class="search-input-selected">' + this.searchValue.searchColumnName + '：' + this.searchValue.searchWord + '<a>X</a></span>');
        $(this.element).find('.search-input-selected').css('line-height', (this.options.height - 6) + 'px');
    };

    var ua = navigator.userAgent.toLowerCase();
    var Browser = {
        isChrome: ua.indexOf('chrome') > -1 && ua.indexOf('edge') == -1,
        isFirefox: ua.indexOf('firefox') > -1,
        isIE: ua.indexOf('msie') > -1,
        isEdge: ua.indexOf('edge') > -1,
        ieVersion: function() {
            if (ua.indexOf('edge') == -1 && ua.indexOf('msie') > -1) {
                return ua.match(/(msie).*?([\d.]+)/)[2];
            }
        }
    }

    $.fn.oksearch = function(options) {

        var okSearchInstance;

        if (!this.length) {
            throw new Error('okSearch cannot be instantiated on an empty selector.');
        }
        if (Browser.isEdge || Browser.isFirefox || Browser.isChrome || (Browser.isIE && parseInt(Browser.ieVersion()) >= 9)) {
            if (!this.data('plugin_okSearch')) {
                okSearchInstance = new OKSearch(this, options);
                return okSearchInstance;
            }
            return this.data('plugin_okSearch');
        } else {
            throw new Error('okSearch now only support chrome & firefox & IE9+!');
        }
    };
})(jQuery);
