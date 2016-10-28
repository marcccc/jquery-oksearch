(function($) {
    'use strict';

    var defaults = {
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
                console.log($nexts);
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
    };

    function getBrowserInfo() {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
        var m = ua.match(re);
        Sys.browser = m[1].replace(/version/, "'safari");
        Sys.version = m[2];
        return Sys;
    }

    $.fn.oksearch = function(options) {
        var okSearchInstance;

        if (!this.length) {
            throw new Error('okSearch cannot be instantiated on an empty selector.');
        }
        var browserInfo = getBrowserInfo();
        if ('chrome' == browserInfo.browser || ('msie' == browserInfo.browser && parseInt(browserInfo.version) >= 9) || 'firefox' ==browserInfo.browser) {
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
