angular.module('crucioApp')
	.directive('timeago', function() {
		var strings = {
			prefixAgo: "vor",
			prefixFromNow: "in",
			suffixAgo: "",
			suffixFromNow: "",
			seconds: "wenigen Sekunden",
			minute: "etwa einer Minute",
			minutes: "%d Minuten",
			hour: "etwa einer Stunde",
			hours: "%d Stunden",
			day: "etwa einem Tag",
			days: "%d Tagen",
			month: "etwa einem Monat",
			months: "%d Monaten",
			year: "etwa einem Jahr",
			years: "%d Jahren",
			wordSeparator: " ",
			numbers: []
		};

		return {
	    	restrict:'A',
			link: function(scope, element, attrs){
				attrs.$observe("timeago", function(){
					var given = parseInt(attrs.timeago);
					var current = new Date().getTime();

					var distance_millis = Math.abs(current - given);
					var seconds = distance_millis / 1000;
					var minutes = seconds / 60;
					var hours = minutes / 60;
					var days = hours / 24;
					var years = days / 365;

					var prefix = strings.prefixAgo;
					var suffix = strings.suffixAgo;

					function is_function(functionToCheck) {
						var getType = {};
						return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
					}

					function substitute(stringOrFunction, number) {
						var string = is_function(stringOrFunction) ? stringOrFunction(number, distance_millis) : stringOrFunction;
						var value = (strings.numbers && strings.numbers[number]) || number;
						return string.replace(/%d/i, value);
					}

					var words = seconds < 45 && substitute(strings.seconds, Math.round(seconds)) ||
                        seconds < 90 && substitute(strings.minute, 1) ||
                        minutes < 45 && substitute(strings.minutes, Math.round(minutes)) ||
                        minutes < 90 && substitute(strings.hour, 1) ||
                        hours < 24 && substitute(strings.hours, Math.round(hours)) ||
                        hours < 42 && substitute(strings.day, 1) ||
                        days < 30 && substitute(strings.days, Math.round(days)) ||
                        days < 45 && substitute(strings.month, 1) ||
                        days < 365 && substitute(strings.months, Math.round(days / 30)) ||
                        years < 1.5 && substitute(strings.year, 1) ||
                        substitute(strings.years, Math.round(years));

					var separator = strings.wordSeparator;

					String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
					var result = [prefix, words, suffix].join(separator).trim();
					element.text(result);
				});
			}
		};
	});