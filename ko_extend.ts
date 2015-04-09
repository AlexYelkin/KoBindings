/// <reference path="../../typings/knockout/knockout.d.ts" />
module DataM {    
    //#region ko Вспомогательные методы.
    ko.observable.fn.beforeAndAfterSubscribe = function <T>(callback: (oldValue: T, newValue: T) => void, target?: any, event?: string): KnockoutSubscription {
        var _oldValue;
        this.subscribe(function (oldValue) {
            _oldValue = oldValue;
        }, null, 'beforeChange');
        return this.subscribe(function (newValue) {
            callback.call(target, _oldValue, newValue);
        });
    };

    ko.subscribable.fn.beforeAndAfterSubscribe = function <T>(callback: (oldValue: T, newValue: T) => void, target?: any, event?: string): KnockoutSubscription {
        var _oldValue;
        this.subscribe(function (oldValue) {
            _oldValue = oldValue;
        }, null, 'beforeChange');
        return this.subscribe(function (newValue) {
            callback.call(target, _oldValue, newValue);
        });
    };

    ko.bindingHandlers.logger = {
        update: function (element, valueAccessor, allBindings) {
            var count = ko.utils.domData.get(element, "_ko_logger") || 0,
                data = ko.toJS(valueAccessor() || allBindings());

            ko.utils.domData.set(element, "_ko_logger", ++count);

            if (console && console.log) {
                console.log(count, element, data);
            }
        }
    };

    ko.subscribable.fn.logIt = function (name) {
        this.triggeredCount = 0;
        this.subscribe(function (newValue) {
            if (console && console.log) {
                console.log(++this.triggeredCount, name + " triggered with new value", newValue);
            }
        }, this);

        return this;
    };
    //#endregion

    ko.bindingHandlers.windowResize = {
        index: 0,
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var handlerFunction: any = ko.unwrap(valueAccessor());
            var index = ++ko.bindingHandlers.windowResize.index;
            var nsEvent = "resize.windowResize" + index;

            jQuery(window).bind(nsEvent, function (event) {
                var viewModel = bindingContext['$data'];
                handlerFunction.apply(viewModel, [viewModel, event, element]);
            }).resize();

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                jQuery(window).unbind(nsEvent);
            });
        }
    };
    ko.virtualElements.allowedBindings["windowResize"] = true;

    /**
     * Внедряет элемент управления PP.
     * @namespace Ghed
     */
    module Ghed {
        //#region 
        ko.bindingHandlers.ppcontrol = {
            /**
             * Внедряет элемент управления PP.
             * 
             * @param element Вершина для связки
             * @param valueAccessor Наблюдаемое значение
             * @param allBindingsAccessor Другие обработчики
             * @param viewModel 
             * @param bindingContext 
             */
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var value = ko.unwrap(valueAccessor());
            },
            update: function (element, valueAccessor) {
                var value: IPPControl = ko.unwrap(valueAccessor());

                if (value && value instanceof PP.Object) {
                    value.addToNode(element);

                    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                        value.removeFromDOM();
                    });
                }
            }
        };
        //#endregion
    }
}