// ==UserScript==
// @name        Sankaku X
// @namespace   https://github.com/jklgit/Sankaku-X
// @description Sankaku X
// @include     https://chan.sankakucomplex.com*
// @include     https://idol.sankakucomplex.com*
// @version     0
// @updateURL	https://jklgit.github.io/Sankaku-X/Sankaku_X.user.js
// @grant       none
// ==/UserScript==

/*
 * TODO:
 * - B: Blacklist object and blacklisted tags/posts
 * - Score filter slider
 * - Optimize thumb adding algorithm: less jquery more javascript
 * - Optimize tag display: use JS instead of CSS, or nah? <= test performance with 50 tabs and a billion thumbs
 * - Delete post hotkey
 * - L: Undo hotkey via log (check sync capabilities)
 * - G: Post pan/zoom <= Preview / Gallery mode (needs referer post/show/, but not on post page => use post page for gallery with ?search=)
 * - Fav post if vote 5 and vice versa
 * - Fix child-preview adding, it doesnt check for child posts with p-id correctly?
 * - Detail comparison with Post, even detailer when comparing two posts
 * - BACKSPACE to reset hotkeys, currently only ESC
 * - Tag menus: subscription (with account look-up for me)
 * - Tag and post toolbar
 * - Post action menu
 * - Apply tag script hotkey <= own script language
 * - F: Favorite searches and friends
 * - N: News and Mail
 * - S: Search/replace Paginator
 * - Minify header for small screens
 * - Heikedin header broken, why? Define wrapper with table maybe
 * - Send mail to flaggers
 */

var css = document.createElement("style");
css.type = "text/css";
css.id = 'sx-css-main';
css.innerHTML = ".sx-background{background:rgb(250, 250, 250) none repeat scroll 0% 0%}.sx-box{border:#DDD solid 1px}#sx-header-placeholder{height:24px;margin-bottom:10px}#sx-header{position:fixed;top:0px;left:0px;width:100%;border-bottom:#DDD solid 1px;padding-left:10px;z-index:100010}#sx-header ul{position:relative;margin:0;float:left}#sx-header ul > li{list-style:none;position:relative;margin-left:0px;height:24px;line-height:24px;float:left}#sx-header li{padding-left:1em;padding-right:1em;white-space:nowrap}.sx-max-anchor{padding-left:0 !important;padding-right:0 !important}.sx-max-anchor > a{display:block;padding-left:1em;padding-right:1em}#sx-header li:hover{background-color:#EEE}#sx-header ul > li > ul{position:absolute;top:24px;margin:0;display:none}#sx-header ul > li > ul > li{float:none;display:block}#sx-header ul > li:hover > ul{display:block}#sx-navbar-wrapper{font-size:1.2em;border-right:#DDD solid 1px;width:302.3px}#sx-toolbar-wrapper{margin-left:302.3px;border-left:#DDD solid 1px}#sx-toolbar{display:flex;flex-wrap:nowrap;justify-content:space-between;align-items:center;min-height:24px;padding-left:10px;padding-right:2em}#sx-toolbar-left > ul > li{background-color:inherit !important}#sx-toolbar-left > ul{white-space:nowrap}#sx-toolbar-left > ul > li{float:none !important;display:inline-block;white-space:nowrap}#sx-toolbar-right{white-space:nowrap}#sx-toolbar-right > ul{float:none !important;display:inline-block;white-space:nowrap}#sx-toolbar-center{text-align:left;margin:0 auto !important;display:inline-block}#sx-details > li{padding-left:4px;padding-right:4px}#sx-details a{color:black;font-weight:unset}#sx-details > .sx-max-anchor > a{display:inline;padding-left:4px;padding-right:4px}#sx-details > .sx-max-anchor > a:hover{text-decoration:underline}.sx-seperator{color:#DDD}.sx-thumb{display:inline-block;position:relative;color:#AAA;background-color:inherit}.sx-thumb-details{display:none;position:absolute;top:100%;left:50%;transform:translateX(-50%);white-space:nowrap;background-color:inherit}.sx-thumb-details a{font-weight:unset;color:#AAA}.sx-thumb-details a:hover{text-decoration-line:underline}.sx-thumb-details > div{position:relative;left:-50%;white-space:nowrap}.thumb:hover > .sx-thumb > .sx-thumb-details{display:block}.sx-thumb > div > .sx-thumb-tags{position:absolute;top:calc(100% + 20px);left:50%;transform:translateX(-50%);white-space:nowrap;overflow:hidden;text-align:left;color:#999 !important;opacity:0;visibility:hidden;transition-delay:0s;pointer-events:none;height:0;z-index:10001;background-color:rgba(250, 250, 250, 1);font-size:0.9em}.sx-thumb > div > .sx-thumb-tags > .sx-tag-table{display:table}.sx-thumb > div > .sx-thumb-tags > .sx-tag-table > div{display:table-cell;padding:7px}.sx-thumb > div:hover > .sx-thumb-tags{opacity:1;visibility:visible;transition-delay:1s;height:initial}.sx-thumb-compare-info{display:block;text-align:center;white-space:normal;font-size:1.1em;min-width:210px}.sx-thumb-compare-info-padding{padding:5px;border-bottom:inherit}#sx-selected-in-menu{height:unset !important;line-height:unset !important;text-align:center}#sx-selected-in-menu > span{float:unset}.sx-good{color:green}.sx-bad{color:red}.sx-selected{background-color:#e1f0ff}.sx-active{background-color:#daffe6}.sx-pause{background-color:#fffcda}.sx-inactive{background-color:#ffdada}.sx-glow{animation:glow-animation .5s infinite alternate}@keyframes \"glow-animation\"{to{background-color:inherit;}}#sx-icon-hotkeys > ul{text-align:right}.sx-input-hotkey{width:100px;font-size:0.9em}.sx-similar{display:inline-block;position:relative;margin-top:20px}.sx-similar > form{padding-top:40px}.sx-tagspace{font-size:0.5em;opacity:0}#content{min-width:0 !important}#notice.stick{top:29px !important}#compare-posts-window{top:24px !important}.sx-icon-close{position:absolute;font-size:1.7em;top:0px;right:5px}.sx-sc-logo{width:24px;height:24px;background-repeat:no-repeat;background-position-x:center;display:inline-block;background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAAXNSR0ICQMB9xQAAAPBQTFRFAAAA/10A/1wA/2QA/2kH/2cF/3Uc/2gG/3ce/3MY/3Yd/3EW/2sL/3EU/2oK/3Qb/20P/3Qa/3EV/28S/3AU/3IX/20O/3Ub/24R/2oJ/3AT/2wN/2kI/2EA/3cf/3IW/24Q/38s/3sm/30p/34r/4U2/4o//4Ev/4My/4Ew/45F/5VQ/5xb/4tA/5xc/5JM/6Fk/6hx/6du/7SE/72S/7uP/8CY/9a7/8up/9O2/8ah/9Cy/9Cz/9e9/9e+/9a8/93H/9/K/+TS/+jZ/+LQ/+DN/+TT/+/l//79//bx/+/k/+7k//z7//z6//Xv//LrXSE6UwAAAAF0Uk5TAEDm2GYAAAAJcEhZcwAAAk8AAAKdAUSfnw0AAAAZdEVYdFNvZnR3YXJlAE1pY3Jvc29mdCBPZmZpY2V/7TVxAAAAsUlEQVQoz2NgoAlwwiHuzuyBXUKLxQCruDkrG7szNgkOTi5uVSzixjxsvGzsFhjinnz8AgYCgkIYEtrCIloMiqJihmjiDqziLF4MLkDSG1VCSVTACEjpSPDqooibSApKgWgfMUFWSyRxX2l+GSswy0yWXRJJQk9CVA3KdHVz9IOLu7GyCaorKoOAioaGhpw/TEJTnotLkBMOFPSh4qaMknzIQJLJGiJhY2uHCuzNGegDAKrCFCumdTdJAAAAAElFTkSuQmCC')}";
document.head.appendChild(css);

function exec(fn) {
	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.textContent = '(' + fn + ')();';
	document.body.appendChild(script);
	// document.body.removeChild(script);
};

exec(function () {

	// Global object for Sankaku X
	window.sx = {};

	// Options
	(function () {
		// User _boolean, _int, _json to denote types
		var defaultOptions = {
			'Post_close_when_faved_boolean': false,
			'Post_close_when_deleted_boolean': false,
			'Post_always_load_original_boolean': false,
			'Post_mute_video_boolean': true,
			'Post_show_video_controls_boolean': true,
			'Thumbs_display_details_boolean': true,
			'Thumbs_display_tags_boolean': true,
			'Thumbs_remove_tooltip_boolean': true,
			'Thumbs_compare_boolean': true,
			'Thumbs_compare_same_ratio_boolean': true,
			'Thumbs_display_rating_boolean': false,
			'Thumbs_blur_blacklisted_boolean': true,
			'Thumbs_hide_blacklisted_boolean': false,
			'Thumbs_hide_favorited_boolean': false,
			'Thumbs_selected_json': {},
			'Hotkeys_active_boolean': true,
			'Hotkeys_toggle_favorite': '',
			'Hotkeys_favorite': 'A',
			'Hotkeys_unfavorite': 'X',
			'Hotkeys_vote_1': '1',
			'Hotkeys_vote_2': '2',
			'Hotkeys_vote_3': '3',
			'Hotkeys_vote_4': '4',
			'Hotkeys_vote_5': '5',
			'Hotkeys_find_similar': 'F',
			'Hotkeys_select': 'S',
			'Hotkeys_set_as_child': 'C',
			'Hotkeys_set_as_parent': '',
			'Hotkeys_set_rating_s': 'CTRL+S',
			'Hotkeys_set_rating_q': 'CTRL+Q',
			'Hotkeys_set_rating_e': 'CTRL+E',
			'Hotkeys_delete': ''
		};

		// Return object with listeners
		window.sx.Options = {
			save: saveOptions,
			load: loadOptions,
			listener: {
				'Post_close_when_faved_boolean': function (key, value) {
					var checkbox = document.getElementById(key);
					if (checkbox) {
						checkbox.checked = value;
					}
					if (value) { // If checkbox checked
						if (jQuery('#remove-from-favs:visible').length > 0) { // If remove button is visible
							window.close();
						}
					}
				},
				'Post_close_when_deleted_boolean': function (key, value) {
					var checkbox = document.getElementById(key);
					if (checkbox) {
						checkbox.checked = value;
					}
					if (value) { // If checkbox checked
						if (jQuery('div.status-notice.deleted').length > 0) { // If remove button is visible
							window.close();
						}
					}
				},
				'Post_always_load_original_boolean': function (key, value) {
					var checkbox = document.getElementById(key);
					if (checkbox) {
						checkbox.checked = value;
					}
				},
				'Thumbs_display_details_boolean': function (key, value) {
					var checkbox = document.getElementById(key);
					if (checkbox) {
						checkbox.checked = value;
					}
					if (value) {
						remCSS('sx-css-' + key);
					} else {
						setCSS('sx-css-' + key, '.sx-thumb-details{display:none!important}');
					}
				},
				'Thumbs_selected_json': function (key, value) {
					if (sx.Thumbs !== undefined) {
						sx.Thumbs.applyFilter();
						sx.Thumbs.updateSelected();
					}
				},
				'Thumbs_compare_json': function (key, value) {
					if (sx.Thumbs !== undefined) {
						sx.Thumbs.applyFilter();
					}
				},
				'Thumbs_compare_same_ratio_json': function (key, value) {
					if (sx.Thumbs !== undefined) {
						sx.Thumbs.applyFilter();
					}
				},
				'Thumbs_display_tags_boolean': function (key, value) {
					var checkbox = document.getElementById(key);
					if (checkbox) {
						checkbox.checked = value;
					}
					if (value) {
						remCSS('sx-css-' + key);
					} else {
						setCSS('sx-css-' + key, '.sx-thumb-tags{display:none!important}');
					}
				},
				'Thumbs_display_rating_boolean': function (key, value) {
					var checkbox = document.getElementById(key);
					if (checkbox) {
						checkbox.checked = value;
					}
					if (value) {
						setCSS('sx-css-' + key, '.sx-safe{background-color: #daffe6;}.sx-questionable{background-color: #fffcda;}.sx-explicit{background-color:#ffdada;}');
					} else {
						remCSS('sx-css-' + key);
					}
				},
				'Thumbs_blur_blacklisted_boolean': function (key, value) {
					var checkbox = document.getElementById(key);
					if (checkbox) {
						checkbox.checked = value;
					}
					if (value) {
						remCSS('sx-css-' + key);
					} else {
						setCSS('sx-css-' + key, '.blacklisted {-webkit-filter:unset!important;filter:unset!important;}');
					}
				},
				'Thumbs_hide_blacklisted_boolean': function (key, value) {
					var checkbox = document.getElementById(key);
					if (checkbox) {
						checkbox.checked = value;
					}
					if (value) {
						setCSS('sx-css-' + key, '.sx-blacklisted {display:none!important;}');
					} else {
						remCSS('sx-css-' + key);
					}
				},
				'Thumbs_hide_favorited_boolean': function (key, value) {
					var checkbox = document.getElementById(key);
					if (checkbox) {
						checkbox.checked = value;
					}
					if (value) {
						setCSS('sx-css-' + key, '.sx-favorited{display:none!important;}');
					} else {
						remCSS('sx-css-' + key);
					}
				},
				'Hotkeys_active_boolean': function (key, value) {
					var checkbox = document.getElementById(key);
					if (checkbox) {
						checkbox.checked = value;
					}
					var input = document.getElementById(key);
					if (input) {
						if (value) {
							// input > label > li > ul > li
							document.getElementById(key)
							.parentNode.parentNode.parentNode.parentNode
							.className = 'sx-active';
						} else {
							document.getElementById(key)
							.parentNode.parentNode.parentNode.parentNode
							.className = 'sx-inactive';
						}
					}
				}
			}
		};

		// Read out options first time from localstorage
		loadOptions();

		// Run listener
		var timer = 0;
		var PERIOD = 5000;
		document.addEventListener("visibilitychange", function () {
			if (document.hidden) {
				timer = setInterval(loadOptions, PERIOD);
			} else {
				clearTimeout(timer);
				loadOptions();
			}
		});

		// Functions

		function loadOptions() {
			var value;
			for (var key in defaultOptions) {
				value = getLocalStorageItem(key);
				if (value === null) {
					value = defaultOptions[key];
				}
				// If value has changed (compare with isEquivalent because might be object)
				if (!isEquivalent(sx.Options[key], value)) {
					sx.Options[key] = value;

					// If a listener is defined, run it
					if (sx.Options.listener[key] !== undefined) {
						sx.Options.listener[key](key, value);
					}
				}
			}
		}

		function saveOptions() {
			for (var key in defaultOptions) {
				value = sx.Options[key];
				if ((value === null) || (value === undefined)) {
					value = defaultOptions[key];
				} else {
					if (key.endsWith('_json')) {
						value = JSON.stringify(value);
					}
				}
				// Value has been modified
				if (!isEquivalent(getLocalStorageItem(key), value)) {
					localStorage.setItem(key, value);

					// If a listener is defined, run it
					if (sx.Options.listener[key] !== undefined) {
						sx.Options.listener[key](key, value);
					}
				}
			}
		}

		function getLocalStorageItem(key) {
			var value = localStorage.getItem(key);
			if (value !== null) {
				if (key.endsWith('_boolean')) {
					value = value === 'true';
				} else if (key.endsWith('_int')) {
					value = parseInt(value);
				} else if (key.endsWith('_json')) {
					value = JSON.parse(value);
					// Parse tags beforehand
					if (value.tags !== undefined) {
						value.tags = JSON.parse(value.tags);
					}
				}
			}
			return value;
		}
	})();

	// Header
	(function () {
		'use strict';

		// Append header
		jQuery('body').append('<div id="sx-header" class="sx-background">' +
			'<div id="sx-navbar-wrapper"></div>' +
			'<div id="sx-toolbar-wrapper">' +
			'<div id="sx-toolbar">' +
			'<div id="sx-toolbar-left"></div>' +
			'<div id="sx-toolbar-center"></div>' +
			'<div id="sx-toolbar-right"></div>' +
			'</div>' +
			'</div>' +
			'</div>');

		// Prepend placeholder
		jQuery('body').prepend('<div id="sx-header-placeholder"></div>');

		// Hide old header if not on /static/more page
		if (parseUrl().pathname.startsWith('/static/more')) {
			jQuery('#header > div').eq(0).hide();
		} else {
			jQuery('#header').hide();
		}

	})();

	// Navbar
	(function () {

		var cookie = parseCookie();
		var isLoggedIn = cookie.login !== undefined;
		var username = cookie.login;
		var canModerate = true;

		var navbar = Array();
		navbar.push({
			// Sankaku-Logo
			html: '<li class="sx-max-anchor"><a class="sx-sc-logo" href="/"></a></li>',
		});
		if (isLoggedIn) {
			navbar.push({
				name: 'My Account',
				link: '/user/home',
				menu: [{
						name: 'My Favorites',
						link: '/?tags=fav:' + username,
					}, {
						name: 'My Profile',
						link: '/user/show?name=' + username,
					}, {
						name: 'My Mail',
						link: '/dmail/inbox',
					}, {
						name: 'Tag Subscriptions',
						link: '/?tags=sub:' + username,
					}, {
						name: 'Settings',
						link: '/user/edit',
					}, {
						name: 'Logout',
						link: '/user/logout',
					},
				],
			});
		} else {
			navbar.push({
				name: 'Login',
				link: '/user/login',
				menu: [{
						name: 'Sign Up',
						link: '/user/signup',
					}
				],
			});
		}
		navbar.push({
			name: 'Posts',
			link: '/?tags=threshold%3A0',
			menu: [{
					name: 'Upload',
					link: '/post/upload',
				}, {
					name: 'Favorites',
					link: '/?tags=fav:' + username,
				}, {
					name: 'Subscriptions',
					link: '/?tags=sub:' + username,
				}, {
					html: '<li>' + jQuery('#header .subnavbar-option:contains("Monthly")').eq(0).parent().html() + '</li>',
				}, {
					name: 'Comments',
					link: '/comment/index',
				}, {
					name: 'Changes',
					link: '/post_tag_history/index',
				}
			],
		});
		if (canModerate) {
			navbar[navbar.length - 1].menu.push({
				name: 'Moderate',
				link: '/post/moderate'
			});
			navbar[navbar.length - 1].menu.push({
				name: 'Approvals',
				link: '/post/recent_approvals'
			});
		}
		navbar.push({
			name: 'More',
			link: '/static/more',
			menu: [{
					name: 'Rankings',
					link: '/rankings/show',
				}, {
					name: 'Notes',
					link: '/note/index',
				}, {
					name: 'Artists',
					link: '/artist/index?order=date',
				}, {
					name: 'Tags',
					link: '/tag/index?order=date',
					menu: [{
							name: 'Popular',
							link: '/tag/popular_by_day'
						}, {
							name: 'Aliases',
							link: '/tag_alias/index'
						}, {
							name: 'Implications',
							link: '/tag_implication/index'
						}, {
							name: 'Tag Translations',
							link: '/tag_translation/index'
						}, {
							name: 'Tag History',
							link: '/tag/history'
						}, {
							name: 'Help',
							link: '/wiki/show?title=help:_tags'
						}
					]
				}, {
					name: 'Pools',
					link: '/pool/index',
				}, {
					name: 'Wiki',
					link: '/wiki/show?title=help:home',
				}, {
					name: 'Help',
					link: '/wiki/show?title=help%3A_quick_guide',
				}, {
					name: 'Forum',
					link: '/forum/index',
				}, {
					html: '<li style="font-size:0.7em;">' + jQuery('.lang-select').html() + '</li>',
				},
			],
		});

		// Append to header
		jQuery('#sx-navbar-wrapper').append(createMenu(navbar, 'sx-navbar'));

	})();

	// Id operations
	(function () {
		// Return
		window.sx.Operation = {
			fav: fav,
			unfav: unfav,
			vote: vote,
			findSimilar: findSimilar,
			setParent: setParent,
			setRating: setRating
		}

		function fav(id, onSuccess, onError) {
			notice('Adding Post #' + id + ' to favorites...');
			postJSON('/favorite/create.json', {
				id: id
			}, function (resp) {
				notice('Added Post #' + id + ' to favorites.');
				if (onSuccess !== undefined) {
					onSuccess(resp);
				}
			}, function (status, resp) {
				if (status === 423) {
					notice('Already added Post #' + id + ' to favorites');
				} else {
					notice('Error ' + status + ': ' + resp.reason);
				}
				if (onError !== undefined) {
					onError(status, resp);
				}
			});
		}

		function unfav(id, onSuccess, onError) {
			notice('Removing Post #' + id + ' from favorites...');
			postJSON('/favorite/destroy.json', {
				id: id
			}, function (resp) {
				notice('Removed Post #' + id + ' from favorites.');
				if (onSuccess !== undefined) {
					onSuccess(resp);
				}
			}, function (status, resp) {
				if (status === 423) {
					notice('Already removed Post #' + id + ' from favorites');
				} else {
					notice('Error ' + status + ': ' + resp.reason);
				}
				if (onError !== undefined) {
					onError(status, resp);
				}
			});
		}

		function vote(id, score, onSuccess, onError) {
			notice('Voting ' + score + ' on Post #' + id + '...');
			postJSON('/post/vote.json', {
				id: id,
				score: score
			}, function (resp) {
				notice('Voted ' + score + ' on Post #' + id + '. New score: ' + resp.score);
				if (onSuccess !== undefined) {
					onSuccess(resp);
				}
			}, function (status, resp) {
				if (status === 423) {
					notice('Error: ' + resp.reason);
				} else {
					notice('Error while voting ' + score + ': ' + status);
				}
				if (onError !== undefined) {
					onError(status, resp);
				}
			});
		}

		function findSimilar(id, onSuccess, onError) {
			notice('Loading similar posts to Post #' + id + '...');
			var div = jQuery('<div class="status-notice sx-similar"></div>');
			div.load('/post/similar?id=' + id + ' #similar-form', function (response, status, jqXHR) {
				if (status === 'success') {
					div.find('#similar-image-form').remove();
					// Add a close button
					var a = jQuery('<a class="sx-icon-close" href="#">&#10006;</a>');
					a.bind('click', function () {
						div.remove();
						return false;
					});
					div.append(a);
					// Add a text describing the content
					div.append('<div style="position:absolute; top:5px; left:5px; font-size:1.2em">Similar images to Post #' + id + '</div>');
					if (onSuccess !== undefined) {
						onSuccess(div);
					}
				} else {
					div.remove();
					console.log(response, status, jqXHR);
					if (onError !== undefined) {
						onError(status, response, jqXHR);
					}
				}
			});
			jQuery('#post-content').after(div);
			return div;
		}

		function setParent(id, id_parent, onSuccess, onError) {
			var url = '/post/update/' + id;
			var params = 'post[parent_id]=';
			if ((id === id_parent) || (id_parent === undefined)) {
				notice('Removing parent from Post #' + id + '...');
			} else {
				notice('Adding parent #' + id_parent + ' to Post #' + id + '...');
				params += id_parent;
			}

			postXML(url, params, function (response) { // onSuccess
				if (id !== id_parent) {
					notice('Added parent #' + id_parent + ' to Post #' + id + '.');
				} else {
					notice('Removed parent from Post #' + id + '.');
				}
				if (onSuccess !== undefined) {
					onSuccess(response);
				}
			}, function (status, response) { // onError
				notice('Error while parenting: ' + xhr.status);
				if (onError !== undefined) {
					onError(xhr.status, xhr.response);
				}
			});
		}

		function setRating(id, rating, onSuccess, onError) {
			var url = '/post/update/' + id;
			var params = 'post[rating]=' + rating;
			notice('Setting rating of Post #' + id + ' to ' + rating + '...');

			postXML(url, params, function (response) { // onSuccess
				notice('Set rating of Post #' + id + ' to ' + rating + '.');
				if (onSuccess !== undefined) {
					onSuccess(response);
				}
			}, function (status, response) { // onError
				notice('Error while setting rating: ' + status);
				if (onError !== undefined) {
					onError(status, response);
				}
			});
		}

		function postXML(url, params, onSuccess, onError) {
			var xhr = new XMLHttpRequest();
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						if (onSuccess !== undefined) {
							onSuccess(xhr.response);
						}
					} else {
						console.log(xhr);
						if (onError !== undefined) {
							onError(xhr.status, xhr.response);
						}
					}
				}
			}
			xhr.send(params);
		}

		function postJSON(url, obj, onSuccess, onError) {
			var xhr = new XMLHttpRequest();
			xhr.open('POST', url);
			xhr.onload = function (event) {
				if (xhr.status === 200) {
					if (onSuccess !== undefined) {
						onSuccess(JSON.parse(xhr.response));
					}
				} else {
					console.log(xhr);
					if (onError !== undefined) {
						onError(xhr.status, JSON.parse(xhr.response));
					}
				}
			};
			xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
			xhr.send(JSON.stringify(obj));
		}

	})();

	// Post: Only defined on post/show/ pages
	(function () {
		// Menu

		// Create a menu
		var menu = [{
				html: '<li>P</li>',
				menu: [{
						html: '<li>Post options:</li>'
					}, {
						node: createCheckbox('Post_close_when_faved_boolean', 'Close post when faved')
					}, {
						node: createCheckbox('Post_close_when_deleted_boolean', 'Close post when deleted')
					}, {
						node: createCheckbox('Post_always_load_original_boolean', 'Always load full size image')
					}, {
						node: createCheckbox('Post_mute_video_boolean', 'Mute videos')
					}, {
						node: createCheckbox('Post_show_video_controls_boolean', 'Show video controls')
					}
				]
			}
		];

		// Append it to the header
		jQuery('#sx-toolbar-right').append(createMenu(menu, undefined, 'right'));

		// If on /post/show/ page
		var url = parseUrl();
		if (url.path === '/post/show/') {
			// Get id from Url
			var id = url.name;

			// Parse stats
			var user = {
				name: 'System',
				href: '/user/show/1'
			};
			var approver = {};
			var date = {};
			var original = {};
			var resized = {};
			var rating = '';
			jQuery('#stats li').each(function () {
				var text = this.innerText.trim();
				if (text.startsWith('Posted: ')) {
					var as = this.getElementsByTagName('a');
					date.pretty = as[0].innerText;
					date.str = as[0].title;
					date.href = as[0].href;
					if (as.length === 3) {
						user.name = as[1].innerText;
						user.href = as[1].href;
					}
				} else if (text.startsWith('Approver: ')) {
					var name = text.substring('Approver: '.length);
					approver.name = name;
					approver.href = '/user/show?name=' + name;
				} else if (text.startsWith('Resized: ')) {
					var a = this.getElementsByTagName('a')[0];
					resized.href = a.href;
					var size = a.innerText.split('x');
					resized.width = parseInt(size[0]);
					resized.height = parseInt(size[1]);
				} else if (text.startsWith('Original: ')) {
					var a = this.getElementsByTagName('a')[0];
					original.href = a.href;
					original.bytes_pretty = a.title;
					var tokens = /(\d+)x(\d+) \((.+)\)/.exec(a.innerText);
					original.width = parseInt(tokens[1]);
					original.height = parseInt(tokens[2]);
					original.bytes_prettier = tokens[3];
					original.ratio = Math.round(original.height * 100 / original.width) / 100; // > 1 portrait, < 1 landscape
				} else if (text.startsWith('Rating: ')) {
					rating = text.substring('Rating: '.length, text.length).toLowerCase();
				}
			});

			// Put together tags
			var tags = [];
			var tag_types = [];
			var tag_jps = [];
			jQuery('#tag-sidebar > li').each(function () {
				var a = this.childNodes[0];
				tags.push(a.innerText.split(' ').join('_'));
				tag_types.push(this.className);
				tag_jps.push(a.title);
			});

			// If resized given, then calc how much resized
			if (resized.width !== undefined) {
				resized.relative = Math.round(resized.width / original.width * 100);
			}

			// Get thumb from original link
			var originalUrl = parseUrl(original.href);
			var thumb = {
				href: 'https://' + originalUrl.host.replace('s.s', '.s') + originalUrl.path.replace('/data/', '/data/preview/') + originalUrl.name + '.jpg',
			}

			// Get file extension from the url
			original.type = originalUrl.ext;

			// Set thumb as favicon
			jQuery(document.head).append('<link rel="shortcut icon" href="' + thumb.href + '" type="image/x-icon" />');

			// Return Post
			var Post = {
				id: id,
				tags: tags,
				tag_types: tag_types,
				tag_jps: tag_jps,
				user: user,
				approver: approver,
				date: date,
				original: original,
				resized: resized,
				thumb: thumb,
				source: document.getElementById('post_source').value,
				rating: rating,
				score: parseFloat(document.getElementById('post-score-' + id).innerHTML),
				fav: fav,
				unfav: unfav,
				toggleFav: toggleFav,
				vote: vote,
				select: select,
				findSimilar: findSimilar,
				toggleFindSimilar: toggleFindSimilar,
				addToPreview: addToPreview,
				removeFromPreview: removeFromPreview,
				setRating: setRating,
			};
			window.sx.Post = Post;

			// Replace site functions
			jQuery('#add-to-favs > a').attr('onclick', '').bind('click', Post.fav);
			jQuery('#remove-from-favs > a').attr('onclick', '').bind('click', Post.unfav);
			jQuery('.unit-rating .r1-unit').attr('onclick', '').bind('click', function () {
				sx.Post.vote(1);
			});
			jQuery('.unit-rating .r2-unit').attr('onclick', '').bind('click', function () {
				sx.Post.vote(2);
			});
			jQuery('.unit-rating .r3-unit').attr('onclick', '').bind('click', function () {
				sx.Post.vote(3);
			});
			jQuery('.unit-rating .r4-unit').attr('onclick', '').bind('click', function () {
				sx.Post.vote(4);
			});
			jQuery('.unit-rating .r5-unit').attr('onclick', '').bind('click', function () {
				sx.Post.vote(5);
			});

			// Changes depending on options
			if (sx.Options['Post_mute_video_boolean']) {
				jQuery('video').attr('muted', 'true');
			}
			if (sx.Options['Post_show_video_controls_boolean']) {
				jQuery('video').attr('controls', 'true');
			}
			if (sx.Options['Post_always_load_original_boolean']) {
				if (Post.resized.href !== undefined) {
					var img = document.getElementById('image');
					img.src = sx.Post.original.href;
					img.removeAttribute('width');
					img.removeAttribute('height');
				}
			}

			// Functions

			var username = parseCookie().login;

			function fav() {
				sx.Operation.fav(sx.Post.id, function (resp) { // onSuccess
					jQuery('#add-to-favs').hide();
					jQuery('#remove-from-favs').show();
					updateFavbyList(resp);
					if (sx.Options['Post_close_when_faved_boolean']) {
						window.close();
					}
				}, function (status, resp) { // onError
					if (status === 423) { // Already faved.
						jQuery('#add-to-favs').hide();
						jQuery('#remove-from-favs').show();
						if (jQuery('#favorited-by a:contains("' + username + '")').length === 0) {
							jQuery('#favorited-by').prepend('<a href="/user/show?name=' + username + '">' + username + '</a>, ');
						}
						if (sx.Options['Post_close_when_faved_boolean']) {
							window.close();
						}
					}
				});
				return false;
			}

			function unfav() {
				sx.Operation.unfav(sx.Post.id, function (resp) { // onSuccess
					jQuery('#add-to-favs').show();
					jQuery('#remove-from-favs').hide();
					updateFavbyList(resp);
				}, function (status, resp) { // onError
					if (status === 423) { // Already unfaved.
						jQuery('#add-to-favs').show();
						jQuery('#remove-from-favs').hide();
						jQuery('#favorited-by a:contains("' + username + '")').remove();
					}
				});
				return false;
			}

			function toggleFav() {
				// If the remove favorite is visible
				if (jQuery('#remove-from-favs:visible').length > 0) {
					sx.Post.unfav();
				} else {
					sx.Post.fav();
				}
			}

			function vote(score) {
				sx.Operation.vote(id, score, function (resp) { // onSuccess
					// Update score
					jQuery('#post-score-' + id).html(resp.score);
					jQuery('#post-vote-count-' + id).html(resp.vote_count);

					// Update stars
					var score_new = Math.round(resp.score * 2) / 2;
					var star1 = jQuery('.unit-rating .r1-unit').parent();
					var star2 = jQuery('.unit-rating .r2-unit').parent();
					var star3 = jQuery('.unit-rating .r3-unit').parent();
					var star4 = jQuery('.unit-rating .r4-unit').parent();
					var star5 = jQuery('.unit-rating .r5-unit').parent();
					if (score_new >= 1.5) {
						star1.attr('class', 'star-full');
						star2.attr('class', 'star-half');
						if (score_new >= 2) {
							star2.attr('class', 'star-full');
							if (score_new >= 2.5) {
								star3.attr('class', 'star-half');
								if (score_new >= 3) {
									star3.attr('class', 'star-full');
									if (score_new >= 3.5) {
										star4.attr('class', 'star-half');
										if (score_new >= 4) {
											star4.attr('class', 'star-full');
											if (score_new >= 4.5) {
												star5.attr('class', 'star-half');
												if (score_new === 5) {
													star5.attr('class', 'star-full');
												}
											} else {
												star5.attr('class', '');
											}
										} else {
											star5.attr('class', '');
										}
									} else {
										star4.attr('class', '');
										star5.attr('class', '');
									}
								} else {
									star4.attr('class', '');
									star5.attr('class', '');
								}
							} else {
								star3.attr('class', '');
								star4.attr('class', '');
								star5.attr('class', '');
							}
						} else {
							star3.attr('class', '');
							star4.attr('class', '');
							star5.attr('class', '');
						}
					} else {
						star1.attr('class', 'star-full');
						star2.attr('class', '');
						star3.attr('class', '');
						star4.attr('class', '');
						star5.attr('class', '');
					}
				});
				return false;
			}

			function updateFavbyList(resp) {
				// Update userlist
				var users = resp.favorited_users.split(',');
				if (user.length === 0) {
					jQuery('#favorited-by').html('no one');
				} else {
					var favorited_by = jQuery('#favorited-by').html('');
					var remaining_favs = jQuery('<span id="remaining-favs" style="display:none;">, </span>');
					var temp;
					for (var i = 0; i < users.length; i++) {
						temp = '<a href="/user/show?name=' + encodeURIComponent(users[i]) + '">' + users[i] + '</a>';
						if (!((i === 6) || (i === (users.length - 1)))) {
							temp = temp + ', ';
						}
						if (i <= 6) {
							favorited_by.append(temp);
						} else {
							remaining_favs.append(temp);
						}
					}
					if (users.length > 6) {
						favorited_by.append(remaining_favs);
						favorited_by.append('<span id="remaining-favs-link">\
							(<a href="#" onclick="$(\'remaining-favs\').show(); $(\'remaining-favs-link\').hide(); return false;">' + (users.length - 6) + ' more</a>)\
							</span>');
					}
				}
			}

			// Set selected thumb to this and apply colors in applyFilter
			function select() {
				// If there is an already selected post, check if ids are same
				var selected = sx.Options['Thumbs_selected_json'];
				if (selected.id !== undefined) {
					// If a new post has been selected, select the new one
					if (selected.id !== id) {
						setPostAsSelected();
					} else {
						// Else deselect post
						sx.Options['Thumbs_selected_json'] = {};
						sx.Options.save();
					}
				} else {
					// No selected post yet
					setPostAsSelected();
				}

				// Apply color filters after select is complete
				sx.Thumbs.applyFilter();

				function setPostAsSelected() {
					sx.Options['Thumbs_selected_json'] = post2thumb();
					notice('Selected Post #' + sx.Post.id);
					sx.Options.save();
				}
			}

			// Add thumb to parent or child-preview
			function addToPreview(thumb, preview_id) {
				var className = '';
				switch (preview_id) {
				case 'child-preview':
					className = 'has-parent';
					break;
				case 'parent-preview':
					className = 'has-children';
					break;
				}

				var thumbHTML = sx.Thumbs.thumb2html(thumb, className);
				// If preview exists
				if (jQuery('#' + preview_id).length > 0) {
					// If thumb is not already in preview
					if (jQuery('#' + preview_id + ' > p' + thumb.id).length === 0) {
						// Add the thumb
						jQuery('#' + preview_id).append(thumbHTML);
					};
				} else {
					// Create preview and prepend it
					switch (preview_id) {
					case 'child-preview':
						var previewHTML = '<div class="status-notice"><div id="child-preview">' + thumbHTML + '</div><div>This post has <a href="/?tags=parent%3A' + sx.Post.id + '">child posts</a> (<a href="/help/post_relationships">help</a>)</div></div>';
						// If parent-preview given, append child-preview after
						if (jQuery('#parent-preview').length > 0) {
							jQuery('#parent-preview').after(previewHTML);
						} else {
							jQuery('#right-col').prepend(previewHTML);
						}
						break;
					case 'parent-preview':
						jQuery('#right-col').prepend('<div class="status-notice"><div id="parent-preview">' + thumbHTML + '</div><div>This post belongs to <a href="/post/show/' + thumb.id + '">a parent post</a> (<a href="/help/post_relationships">help</a>)</div></div>');
						break;
					}
				}
			}

			// Remove thumb from preview
			function removeFromPreview(thumb, preview_id) {
				// If id is in preview
				var thumb = jQuery('#' + preview_id + ' > #p' + thumb.id);
				if (thumb.length > 0) {
					thumb.remove();

					// Check if any thumbs left
					if (jQuery('#' + preview_id + ' > .thumb').length === 0) {
						jQuery('#' + preview_id).parent().remove();
					}
				}
			}

			function findSimilar() {
				sx.Operation.findSimilar(sx.Post.id, function (div) {
					sx.Post.findSimilarDiv = div;
					jQuery('#post-content').after(div);
				});
			}

			function toggleFindSimilar() {
				if (sx.Post.findSimilarDiv === undefined) {
					sx.Post.findSimilar();
				} else {
					sx.Post.findSimilarDiv.remove();
					sx.Post.findSimilarDiv = undefined;
				}
			}

			function setRating(rating) {
				sx.Operation.setRating(sx.Post.id, rating, function () { // onSuccess
					// Short and long name
					var r = rating[0].toLowerCase();
					switch (r) {
					case 's':
						rating = 'safe';
						break;
					case 'q':
						rating = 'questionable';
						break;
					case 'e':
						rating = 'explicit';
						break;
					}
					// Update object
					sx.Post.rating = rating;
					// Update UI
					jQuery('#sx-post-rating').html(r);
					document.getElementById('post_rating_' + rating).checked = true;
				});
			}
			
			function post2thumb(){
				var thumb = {
					id: sx.Post.id,
					href: sx.Post.thumb.href,
					tags: sx.Post.tags,
					width: sx.Post.original.width,
					height: sx.Post.original.height,
					rating: sx.Post.rating,
					score: sx.Post.score,
					user: sx.Post.user,
					ratio: sx.Post.original.ratio
				};
				return thumb;
			}
		}
	})();

	// Actionbar
	(function () {
		var url = parseUrl();

		if (url.path.startsWith('/post/')) { // If on any post page
			if (sx.Post !== undefined) { // If on post/show page
				// If resized post given
				var resized = '';
				var resizedMenu;
				if (sx.Post.resized.relative !== undefined) {
					resized = sx.Post.resized.relative + ' %';
					resizedMenu = [{
							name: 'Resized: ' + sx.Post.resized.width + 'x' + sx.Post.resized.height,
							link: sx.Post.resized.href
						}
					];
				}

				// If approver given
				var approver = {};
				var approverDelim = {};

				if (sx.Post.approver.name !== undefined) {
					approver = {
						name: sx.Post.approver.name,
						link: sx.Post.approver.href,
						menu: [{
								name: 'Uploads',
								link: '/?tags=user%3A' + sx.Post.approver.name
							}, {
								name: 'Favorites',
								link: '/?tags=fav%3A' + sx.Post.approver.name
							}, {
								name: 'Send mail',
								link: '/dmail/compose/?to=' + sx.Post.approver.name
							}
						]
					};
					approverDelim = {
						html: '<li class="sx-seperator">approved by</li>'
					};
				}

				// Create menu for the stats
				var menu = [{
						name: sx.Post.user.name,
						link: sx.Post.user.href,
						menu: [{
								name: 'Uploads',
								link: '/?tags=user%3A' + sx.Post.user.name
							}, {
								name: 'Favorites',
								link: '/?tags=fav%3A' + sx.Post.user.name
							}, {
								name: 'Send mail',
								link: '/dmail/compose/?to=' + sx.Post.user.name
							}
						],
					},
					approverDelim,
					approver, {
						html: '<li class="sx-seperator">|</li>'
					}, {
						html: '<li id="sx-post-rating">' + sx.Post.rating[0] + '</li>'
					}, {
						html: '<li class="sx-seperator">|</li>'
					}, {
						name: sx.Post.original.width + 'x' + sx.Post.original.height + ' (' + sx.Post.original.bytes_prettier + ') ' + resized,
						link: sx.Post.original.href,
						menu: resizedMenu
					}, {
						html: '<li class="sx-seperator">|</li>'
					}, {
						name: sx.Post.date.pretty,
						link: sx.Post.date.href
					}
				];

				// If source given
				if (sx.Post.source !== '') {
					menu.push({
						html: '<li class="sx-seperator">from</li>'
					});

					var source = parseUrl(sx.Post.source);
					if (source.hostname !== undefined) {
						menu.push({
							name: source.hostname,
							link: source.href
						});
					} else {
						menu.push({
							html: '<li>' + sx.Post.source + '</li>'
						});
					}
				}

				// Append stats in header
				jQuery('#sx-toolbar-left').append(createMenu(menu, 'sx-details'));

				// Hide old stats
				jQuery('#stats').hide();
			}
		} else if (url.path === '/') { // If on frontpage
			if (url.search !== '') { // If searching something
				// Display search tag results
				var search = jQuery('#site-title').html();
				var n = search.indexOf('</a>/');
				if (n > -1) {
					search = '<li>' + search.substring(n + 5) + '</li>';
					// Add menu
					var menu = [{
							html: search
						}
					];
					jQuery('#sx-toolbar-left').append(createMenu(menu));
				}
			}
		} else {
			// Add subnavbar from old header
			jQuery('#sx-toolbar-left')
			.append(jQuery('#subnavbar').removeClass('flat-list'));
		}
	})();

	// Thumbs
	(function () {

		// Return
		var Thumbs = {
			fav: fav,
			unfav: unfav,
			toggleFav: toggleFav,
			vote: vote,
			select: select,
			setAsChild: setAsChild,
			setAsParent: setAsParent,
			findSimilar: findSimilar,
			toggleFindSimilar: toggleFindSimilar,
			applyFilter: applyFilter,
			filterIdNode: filterIdNode,
			thumb2html: thumb2html,
			setRating: setRating,
			addThumbs: addThumbs,
			updateSelected: updateSelected
		};
		window.sx.Thumbs = Thumbs;
		sx.Thumbs.list = [];

		// Listener to capture every thumb entering the page
		var target = document.querySelector(".content");
		if (!target) {
			target = document; // Whole document, because header can contain thumbs
		}
		var observer = new MutationObserver(function (mutations) {
				addThumbs(target);
			});
		observer.observe(target, {
			childList: true,
			subtree: true,
			characterData: false
		});

		// Listener to find out which thumb the user is hovering at
		var id_hover = undefined,
		uid_hover = undefined; // Currently hovered id
		var node,
		b_found;
		window.onmouseover = function (e) {
			// Go up 5 times and see if the parent post is a thumb
			node = e.target;
			b_found = false;
			for (var i = 0; i < 5; i++) {
				if (node) {
					if ((' ' + node.className + ' ').indexOf(' thumb ') > -1) {
						setIdHover(node.id, node.getAttribute('uid'));
						b_found = true;
						break;
					}
				} else {
					setIdHover(undefined);
					break;
				}
				node = node.parentNode;
			}
			if (!b_found) {
				setIdHover(undefined);
			}

			function setIdHover(pid, uid) {
				// If thumb hovered
				if (pid !== undefined) {
					// If new thumb is hovered
					pid = pid.substr(1);
					if (id_hover !== pid) {
						// Do something here: new id: pid, old id: id_hover
						id_hover = pid;
					}
					if (uid_hover !== uid) {
						// Do something here: new uid: uid, old uid: uid_hover
						uid_hover = uid;
					}
				} else {
					// No thumb hovered, last thumb was id_hover
					id_hover = undefined;
					uid_hover = undefined;
				}
			}
		};

		// Create a menu
		var menu = [{
				html: '<li id="sx-icon-thumbs">T</li>',
				menu: [{
						html: '<li>Thumbnail options:</li>'
					}, {
						node: createCheckbox('Thumbs_display_details_boolean', 'Display details below')
					}, {
						node: createCheckbox('Thumbs_display_tags_boolean', 'Display tags / comparison info on hover')
					}, {
						node: createCheckbox('Thumbs_remove_tooltip_boolean', 'Remove tooltip (needs reload)')
					}, {
						node: createCheckbox('Thumbs_display_rating_boolean', 'Display rating as background color')
					}, {
						node: createCheckbox('Thumbs_blur_blacklisted_boolean', 'Blur blacklisted')
					}, {
						node: createCheckbox('Thumbs_hide_blacklisted_boolean', 'Hide blacklisted')
					}, {
						node: createCheckbox('Thumbs_hide_favorited_boolean', 'Hide favorited')
					}, {
						node: createCheckbox('Thumbs_compare_boolean', 'Compare thumbs when selected')
					}, {
						node: createCheckbox('Thumbs_compare_same_ratio_boolean', 'Compare thumbs only when same ratio')
					}, {
						html: '<li id="sx-selected-in-menu"></li>'
					}
				]
			}
		];

		// Append it to the header
		jQuery('#sx-toolbar-right').append(createMenu(menu, undefined, 'right'));

		// Replace site behavior
		Post.apply_blacklists = function () {};
		var blacklist = parseBlacklist(parseCookie().blacklisted_tags);

		// Add thumbs when page is loaded
		addThumbs();
		updateSelected();

		// Functions
		function addThumbs(target, b_applyFilter) {
			if (target === undefined) {
				target = document;
			}
			if (b_applyFilter === undefined) {
				b_applyFilter = true;
			}

			var thumbs_new = [];
			var imgs = target.querySelectorAll('span.thumb > a > img');
			var div,
			div_sub,
			tokens,
			thumb,
			attr,
			id,
			details,
			tags;
			for (var i = 0; i < imgs.length; i++) {
				// Get id
				var span = imgs[i].parentNode.parentNode;
				id = span.getAttribute('id').substr(1);

				// Set unique id
				span.setAttribute('uid', id);

				// Remove blacklist class
				attr = imgs[i].parentNode.parentNode.getAttribute('class');
				if (attr.indexOf('blacklisted') > -1) {
					imgs[i].parentNode.parentNode.setAttribute('class', attr.replace('blacklisted', ''));
					// imgs[i].setAttribute('class', imgs[i].getAttribute('class') + ' blacklisted');
				}

				// Add favorited class to span, for easier hide
				if (imgs[i].className.indexOf('favorited') > -1) {
					span.className += ' sx-favorited';
				}

				// Create divs and move the images inside there
				div = document.createElement('div');
				div.setAttribute('class', 'sx-thumb');
				div_sub = document.createElement('div'); // div for the tags
				imgs[i].parentNode.parentNode.appendChild(div);
				div_sub.appendChild(imgs[i].parentNode);
				div.appendChild(div_sub);

				// Parse thumbnail data
				tokens = /(.*)Rating:(\w+) Score:(\S+) Size:(\d+)x(\d+) User:(.*)/.exec(imgs[i].title);
				thumb = {
					id: id,
					node: [imgs[i]], // Later on array in case, same id but multiple nodes
					span: [span],
					href: imgs[i].src,
					tags: tokens[1].trim().split(' '),
					rating: tokens[2].toLowerCase(),
					score: parseFloat(tokens[3]),
					width: parseInt(tokens[4]),
					height: parseInt(tokens[5]),
					user: {
						name: tokens[6],
						href: '/user/show?name=' + tokens[6],
					}
				};

				// Calc ratio
				thumb.ratio = Math.round(thumb.height * 100 / thumb.width) / 100; // > 1: portrait, < 1 landscape

				// Add rating class to span
				switch (thumb.rating[0]) {
				case 's':
					thumb.span[0].className += ' sx-safe';
					break;
				case 'q':
					thumb.span[0].className += ' sx-questionable';
					break;
				case 'e':
					thumb.span[0].className += ' sx-explicit';
					break;
				}

				// Remove image title after parse
				if (sx.Options['Thumbs_remove_tooltip_boolean']) {
					imgs[i].title = '';
				}

				// Apply blacklist
				if (isBlacklisted(thumb)) {
					imgs[i].className = imgs[i].className + ' blacklisted';
					div.parentNode.className = div.parentNode.className + ' sx-blacklisted';
				}

				// Add additional information to the div
				details = document.createElement('div');
				details.className = 'sx-thumb-details';
				details.innerHTML = '<a href="' + thumb.user.href + '">' + thumb.user.name + '</a> | <span class="sx-thumb-rating">' + thumb.rating[0] + '</span> | ' + thumb.width + 'x' + thumb.height + '';
				div.appendChild(details);
				div_sub.appendChild(getTagsDiv(thumb.tags));

				// Add thumbnail to the new thumbs
				thumbs_new.push(thumb);
			}

			// Filter new thumbs, and clean up Thumbs.list
			if (b_applyFilter) {
				applyFilter(thumbs_new);
			}

			// "Clean up Thumbs.list" and add new_thumbs
			var b_found,
			l;
			for (var j = 0; j < thumbs_new.length; j++) {
				b_found = false;
				for (var i = 0; i < sx.Thumbs.list.length; i++) {
					// If id is in Thumbs.list, just add span and node
					if (sx.Thumbs.list[i].id === thumbs_new[j].id) {
						sx.Thumbs.list[i].node.push(thumbs_new[j].node[0]);
						sx.Thumbs.list[i].span.push(thumbs_new[j].span[0]);
						// Update uid with length of array
						l = sx.Thumbs.list[i].span.length;
						sx.Thumbs.list[i].span[l - 1].setAttribute('uid', sx.Thumbs.list[i].id + '-' + l);
						b_found = true;
						break;
					}
				}
				if (!b_found) {
					sx.Thumbs.list.push(thumbs_new[j]);
				}
			}

			// Put tags in 3 columns
			function getTagsDiv(tags) {
				var div = document.createElement('div');
				div.className = 'sx-thumb-tags sx-background sx-box';

				// Settings
				var n_lines = 16; // Number of max amount of tags to be displayed in the tagsbox. Cleanest results for n_lines%3 = 1
				var n_letters = 20; // Max number of letters per line

				// If number of tags greater then max number of lines to display
				if (tags.length > (n_lines + 2)) {
					var n_tags = tags.length;
					tags = tags.slice(0, n_lines);
					tags.push('...');
					tags.push((n_tags - n_lines) + " tags more");
				}

				var col1 = "";
				var col2 = "";
				var col3 = "";
				if (tags.length > 6) { // if more than 6 tags, create three columns of tags
					var n_tags = Math.ceil(tags.length / 3);
					for (var i = 0; i < n_tags; i++) {
						col1 = col1 + shorten(tags[i]) + "<br>";
					}
					for (var i = n_tags; i < 2 * n_tags; i++) {
						col2 = col2 + shorten(tags[i]) + "<br>";
					}
					for (var i = 2 * n_tags; i < tags.length; i++) {
						col3 = col3 + shorten(tags[i]) + "<br>";
					}
				} else if (tags.length > 3) { // if 4 to 6 tags, create only two columns
					var n_tags = Math.ceil(tags.length / 2);
					for (var i = 0; i < n_tags; i++) {
						col1 = col1 + shorten(tags[i]) + "<br>";
					}
					for (var i = n_tags; i < tags.length; i++) {
						col2 = col2 + shorten(tags[i]) + "<br>";
					}
				} else { // if 0 to 3 tags, create only one column
					for (var i = 0; i < tags.length; i++) {
						col1 = col1 + shorten(tags[i]) + "<br>";
					}
				}

				div.innerHTML = '<div class="sx-thumb-compare-info"></div><div class="sx-tag-table"><div>' + col1 + '</div><div>' + col2 + '</div><div>' + col3 + '</div></div>';

				return div;

				function shorten(tag) {
					return ((tag.length > (n_letters + 3)) ? tag.substr(0, n_letters) + "..." : tag);
				}
			}
		}

		function parseBlacklist(text) {
			var array = text.split('&');
			for (var i = 0; i < array.length; i++) {
				array[i] = array[i].split('+');
				for (var j = 0; j < array[i].length; j++) {
					array[i][j] = decodeURIComponent(array[i][j]).toLowerCase();
					var tokens = /[-~]?rating:(\w)\w*/.exec(array[i][j]);
					if (tokens) {
						array[i][j] = 'rating:' + tokens[1];
					}
				}
			}
			return array;
		}

		function isBlacklisted(thumb) {
			// For every tag combination in the blacklist
			var tags = thumb.tags.clone();
			tags.push('user:' + thumb.user.name.toLowerCase());
			tags.push('rating:' + thumb.rating[0]);
			var b;
			for (var i = 0; i < blacklist.length; i++) {
				b = undefined;
				// For all tags in a tag combination
				for (var j = 0; j < blacklist[i].length; j++) {
					if (blacklist[i][j][0] === '-') { // Negated
						if (b === undefined) {
							b = !(thumb.tags.includes(blacklist[i][j].substr(1)));
						} else {
							b &= !(thumb.tags.includes(blacklist[i][j].substr(1)));
						}
					} else if (blacklist[i][j][0] === '~') { // Or
						if (b === undefined) {
							b = thumb.tags.includes(blacklist[i][j].substr(1));
						} else {
							b |= thumb.tags.includes(blacklist[i][j].substr(1));
						}
					} else { // And
						if (b === undefined) {
							b = thumb.tags.includes(blacklist[i][j]);
						} else {
							b &= thumb.tags.includes(blacklist[i][j]);
						}
					}
				}
				// If line found, where it got blacklisted
				if (b) {
					return true;
				}
			}
			return false;
		}

		// Runs fun for every node in thumb with id
		function filterIdNode(id, fun) {
			filter(function (thumb) {
				return (thumb.id === id);
			}, function (thumb) {
				for (var i = 0; i < thumb.node.length; i++) {
					fun(thumb.node[i]);
				}
			});
		}

		// Runs fun for every span in thumb with id
		function filterIdSpan(id, fun) {
			filter(function (thumb) {
				return (thumb.id === id);
			}, function (thumb) {
				for (var i = 0; i < thumb.span.length; i++) {
					fun(thumb.span[i]);
				}
			});
		}

		// Runs fun for every thumb with id
		function filterId(id, fun) {
			filter(function (thumb) {
				return (thumb.id === id);
			}, fun);
		}

		// Runs fun for every filter in f
		function filter(f, fun) {
			// If a function is given, filter and run fun for every thumb
			if (fun !== undefined) {
				for (var i = 0; i < sx.Thumbs.list.length; i++) {
					if (f(sx.Thumbs.list[i])) {
						fun(sx.Thumbs.list[i]);
					}
				}
			} else { // Filter list and give it back
				var new_list = [];
				for (var i = 0; i < sx.Thumbs.list.length; i++) {
					if (f(sx.Thumbs.list[i])) {
						new_list.push(sx.Thumbs.list[i]);
					}
				}
				return new_list;
			}
		}

		function fav() {
			// If currently hovered not given, fav Post if Post given
			if (id_hover === undefined) {
				if (sx.Post !== undefined) {
					sx.Post.fav();
				}
			} else {
				// Fav thumb
				var id = id_hover;
				sx.Operation.fav(id, function () { // onSuccess
					filterId(id, function (thumb) {
						jQuery(thumb.node).addClass('favorited');
						jQuery(thumb.span).addClass('sx-favorited');
					});
				}, function (status, resp) { // onError
					if (status === 423) { // Already faved
						filterId(id, function (thumb) {
							jQuery(thumb.node).addClass('favorited');
							jQuery(thumb.span).addClass('sx-favorited');
						});
					}
				});
			}
		}

		function unfav() {
			// If currently hovered not given, fav Post if Post given
			if (id_hover === undefined) {
				if (sx.Post !== undefined) {
					sx.Post.unfav();
				}
			} else {
				// Unfav thumb
				var id = id_hover;
				sx.Operation.unfav(id, function () { // onSuccess
					filterId(id, function (thumb) {
						jQuery(thumb.node).removeClass('favorited');
						jQuery(thumb.span).removeClass('sx-favorited');
					});
				}, function (status, resp) { // onError
					if (status === 423) { // Already unfaved
						filterId(id, function (thumb) {
							jQuery(thumb.node).removeClass('favorited');
							jQuery(thumb.span).removeClass('sx-favorited');
						});
					}
				});
			}
		}

		function toggleFav(id) {
			// If currently hovered not given, fav Post if Post given
			if (id_hover === undefined) {
				if (sx.Post !== undefined) {
					sx.Post.toggleFav();
				}
			} else {
				var id = id_hover;
				filterId(id, function (thumb) {
					if (jQuery(thumb.node[0]).hasClass('favorited')) {
						sx.Thumbs.unfav();
					} else {
						sx.Thumbs.fav();
					}
				})
			}
		}

		function vote(score) {
			// If currently hovered not given, fav Post if Post given
			if (id_hover === undefined) {
				if (sx.Post !== undefined) {
					sx.Post.vote(score);
				}
			} else {
				var id = id_hover;
				sx.Operation.vote(id, score, function () { // onSuccess
					// Update score
					filterId(id, function (thumb) {
						thumb.score = resp.score;
					});
				});
			}
		}

		// Set selected thumb to this and apply colors in applyFilter
		function select() {
			// If currently hovered not given, fav Post if Post given
			if (id_hover === undefined) {
				if (sx.Post !== undefined) {
					sx.Post.select();
				}
			} else {
				var id = id_hover;
				// If there is an already selected post, check if ids are same
				var selected = sx.Options['Thumbs_selected_json'];
				if (selected.id !== undefined) {
					// If a new post has been selected, select the new one
					if (selected.id !== id) {
						filterId(id, setThumbAsSelected);
					} else {
						// Else deselect post
						sx.Options['Thumbs_selected_json'] = {};
						sx.Options.save();
					}
				} else {
					// No selected post yet
					filterId(id, setThumbAsSelected);
				}

				// Apply color filters after select is complete
				applyFilter();
			}

			function setThumbAsSelected(thumb) {
				sx.Options['Thumbs_selected_json'] = {
					id: thumb.id,
					href: thumb.href,
					tags: thumb.tags,
					width: thumb.width,
					height: thumb.height,
					rating: thumb.rating,
					score: thumb.score,
					user: thumb.user,
					ratio: thumb.ratio
				};
				notice('Selected Post #' + thumb.id);
				sx.Options.save();
			}
		}

		// Set hovered thumb as child of selected post
		function setAsChild() {
			// If currently hovered not given, but Post, take Post id
			var id = id_hover;
			if (id === undefined) {
				if (sx.Post !== undefined) {
					id = sx.Post.id;
				}
			}
			if (id !== undefined) {
				var selected = clone(sx.Options['Thumbs_selected_json']);

				// Run parenting operation
				sx.Operation.setParent(id, selected.id, function () {
					// If selected post and hovered post the same
					if (selected.id === id) {
						// Removed parent during operation
						filterId(id, function (thumb) {
							jQuery(thumb.node).removeClass('has-parent');
							if (sx.Post !== undefined) {
								sx.Post.removeFromPreview(thumb, 'child-preview');
							}
						});
					} else {
						// Added parent during operation

						// If on post page
						if (sx.Post !== undefined) {
							// If pressed setAsChild on Post
							if (id === sx.Post.id) {
								filterId(selected.id, function (thumb) {
									jQuery(thumb.node).addClass('has-children');
									sx.Post.addToPreview(thumb, 'parent-preview');
								});
							} // If Post was selected as parent => clicked setAsChild on thumb
							else if (selected.id === sx.Post.id) {
								filterId(id, function (thumb) {
									jQuery(thumb.node).addClass('has-parent');
									sx.Post.addToPreview(thumb, 'child-preview');
								});
							} // If nothing to do with Post
							else {
								filterId(id, function (thumb) {
									jQuery(thumb.node).addClass('has-parent');
								});
								filterId(selected.id, function (thumb) {
									jQuery(thumb.node).addClass('has-children');
								});
							}
						} // Nothing to do with Post
						else {
							filterId(id, function (thumb) {
								jQuery(thumb.node).addClass('has-parent');
							});
							filterId(selected.id, function (thumb) {
								jQuery(thumb.node).addClass('has-children');
							});
						}
					}
				});
			}
		}

		// Set hovered thumb as parent of selected post
		function setAsParent() {
			// If currently hovered not given, but Post, take Post id
			var id = id_hover;
			if (id === undefined) {
				if (sx.Post !== undefined) {
					id = sx.Post.id;
				}
			}
			if (id !== undefined) {
				var selected = clone(sx.Options['Thumbs_selected_json']);

				// Run parenting operation
				sx.Operation.setParent(selected.id, id, function () {
					// If selected post and hovered post the same
					if (selected.id === id) {
						// Removed parent during operation
						filterId(id, function (thumb) {
							jQuery(thumb.node).removeClass('has-parent');
							if (sx.Post !== undefined) {
								sx.Post.removeFromPreview(thumb, 'child-preview');
							}
						});
					} else {
						// Added parent during operation

						// If on post page
						if (sx.Post !== undefined) {
							// If pressed setAsChild on Post
							if (id === sx.Post.id) {
								filterId(selected.id, function (thumb) {
									jQuery(thumb.node).addClass('has-parent');
									sx.Post.addToPreview(thumb, 'child-preview');
								});
							} // If Post was selected as parent => clicked setAsChild on thumb
							else if (selected.id === sx.Post.id) {
								filterId(id, function (thumb) {
									jQuery(thumb.node).addClass('has-children');
									sx.Post.addToPreview(thumb, 'parent-preview');
								});
							} // If nothing to do with Post
							else {
								filterId(id, function (thumb) {
									jQuery(thumb.node).addClass('has-children');
								});
								filterId(selected.id, function (thumb) {
									jQuery(thumb.node).addClass('has-parent');
								});
							}
						} // Nothing to do with Post
						else {
							filterId(id, function (thumb) {
								jQuery(thumb.node).addClass('has-children');
							});
							filterId(selected.id, function (thumb) {
								jQuery(thumb.node).addClass('has-parent');
							});
						}
					}
				});
			}
		}

		function findSimilar() {
			if (id_hover === undefined) {
				if (sx.Post !== undefined) {
					sx.Post.findSimilar();
				}
			} else {
				var id = id_hover;
				var uid = uid_hover;
				filterIdSpan(id, function (span) {
					if (uid === span.getAttribute('uid')) {
						sx.Operation.findSimilar(id, function (div) {
							jQuery(span).after(div);
						});
					}
				});
			}
		}

		function toggleFindSimilar() {
			if (id_hover === undefined) {
				if (sx.Post !== undefined) {
					sx.Post.toggleFindSimilar();
				}
			} else {
				var id = id_hover;
				var uid = uid_hover;
				filterIdSpan(id, function (span) {
					if (uid === span.getAttribute('uid')) {
						// If there is a div next to this thumb with findSimilar content, remove it
						if (jQuery(span.nextSibling).hasClass('sx-similar')) {
							jQuery(span.nextSibling).remove();
						} else {
							sx.Thumbs.findSimilar();
						}
					}
				});
			}
		}

		// Update selected thumb
		function updateSelected() {
			// Selected filter for Post
			var selected = clone(sx.Options['Thumbs_selected_json']);
			// Assume no post has been selected
			jQuery('#sx-icon-thumbs').removeClass('sx-selected');
			jQuery('#sx-selected-in-menu').children().remove();
			// If a post has been selected
			if (selected.id !== undefined) {
				// Add it to the thumbnail menu
				jQuery('#sx-icon-thumbs').addClass('sx-selected');
				jQuery('#sx-selected-in-menu').append('<div>Currently selected: Post #' + selected.id + '</div>' + sx.Thumbs.thumb2html(selected));
				addThumbs(document.getElementById('sx-selected-in-menu'), false);
			}
		}

		// Apply color filters and thumb displays
		function applyFilter(thumbs) {

			if (thumbs === undefined) {
				thumbs = sx.Thumbs.list;
			}

			// Selected filter for Post
			var selected = clone(sx.Options['Thumbs_selected_json']);
			// If on post page
			if (sx.Post !== undefined) {
				jQuery('#sx-toolbar').removeClass('sx-selected');
				if (selected.id === sx.Post.id) {
					jQuery('#sx-toolbar').addClass('sx-selected');
				}
				// Comparison filter for the post
				// If thumb compare is activated
				if (sx.Options['Thumbs_compare_boolean']) {}
			}

			// Thumb filters
			var jspan,
			thumb;
			for (var j = 0; j < thumbs.length; j++) {
				thumb = thumbs[j];

				for (var i = 0; i < thumb.span.length; i++) {
					jspan = jQuery(thumb.span[i]);

					// If an item has been selected
					jspan.removeClass('sx-selected sx-active sx-inactive');
					if (selected.id !== undefined) {

						// Selected thumb filter
						if (thumb.id === selected.id) {
							jspan.addClass('sx-selected');
						}
					}
					
					// Comparison filter
					// If thumb compare is activated
					if (sx.Options['Thumbs_compare_boolean']) {
						n = compareThumbs(thumb, selected);
						if (n === 1) { // thumb is better
							jspan.addClass('sx-active');
						} else if (n === -1) { // thumb is worse
							jspan.addClass('sx-inactive');
						} else { // Remove comparison classes
							jspan.removeClass('sx-active sx-inactive');
						}
					}

					// Score filter

					// Tag filter

				}
			}

			// Return: 1 thumb1 better; -1 thumb1 worse; 0 no compare
			// Second should be selected, because thumb1, will try to add info to the thumb
			function compareThumbs(thumb1, thumb2) {
				var n = 0; // 1 thumb1 is better, -1 thumb1 is worse
				var text = '';
				var divs = jQuery(thumb1.span) // Reset the old infos
					.find('.sx-thumb-compare-info')
					.html('')
					.removeClass('sx-thumb-compare-info-padding');
				
				if ((thumb1.id !== thumb2.id) && (thumb1.id !== undefined) && (thumb2.id !== undefined)) {
					if ((thumb1.ratio === thumb2.ratio) || !sx.Options['Thumbs_compare_same_ratio_boolean']) {
						// Compare sizes
						if (thumb1.ratio === thumb2.ratio) {
							// Calc multiplier and judge with that
							var m = Math.round(thumb1.width * 100 / thumb2.width) / 100;
							if (m < 1) {
								text = 'This post is <span class="sx-bad">' + m + '</span> the size, ';
								if (n === 0) {
									n = -1;
								}
							} else if (m > 1) {
								text = 'This post is <span class="sx-good">' + m + '</span> the size, ';
								if (n === 0) {
									n = 1;
								}
							} else {
								text = 'This post is the same size, ';
							}
						} else {
							// Display width and height differences
							var w = thumb1.width - thumb2.width;
							if (w < 0) {
								w = 'is <span class="sx-bad">' + ((-1) * w) + ' px thinner</span>';
							} else if (w > 0) {
								w = 'is <span class="sx-good">' + w + ' px wider</span>';
							} else {
								w = 'has same width';
							}
							var h = thumb1.height - thumb2.height;
							if (h < 0) {
								h = 'is <span class="sx-bad">' + ((-1) * h) + ' px smaller</span>';
							} else if (h > 0) {
								h = 'is <span class="sx-good">' + h + ' px taller</span>';
							} else {
								h = 'has same height';
							}
							text = 'This post ' + w + ', ' + h + ', ';
						}

						// Compare number of tags
						var n_tags = thumb1.tags.length - thumb2.tags.length;
						var s = '';
						if (Math.abs(n_tags) > 1) {
							s = 's';
						}
						if (n_tags > 0) {
							text = text + 'has <span class="sx-good">' + n_tags + ' tag' + s + ' more</span> and ';
						} else if (n_tags < 0) {
							text = text + 'has <span class="sx-bad">' + ((-1) * n_tags) + ' tag' + s + ' less</span> and ';
						} else {
							text = text + 'has same number of tags, ';
						}

						// Compare age
						if (thumb1.id > thumb2.id) {
							text = text + 'is <span class="sx-bad">younger</span>';
							if (thumb1.ratio === thumb2.ratio) {
								if (n === 0) {
									n = -1;
								}
							}
						} else {
							if (thumb1.ratio === thumb2.ratio) {
								if (n === 0) {
									n = 1;
								}
							}
							text = text + 'is <span class="sx-good">older</span>';
						}

						text = text + ' compared to selected post.';

						divs.html(text).addClass('sx-thumb-compare-info-padding');
					}
				}
				return n;
			}
		}

		// Generate span html from a thumb (e.g. selected thumb)
		function thumb2html(thumb, className) {
			if (className === undefined) {
				className = '';
			}
			return ('<span class="thumb" id="p' + thumb.id + '"><a href="/post/show/' + thumb.id + '" target="_blank"><img class="preview ' + className + '" src="' + thumb.href + '" title="' + thumb.tags.join(' ') + ' Rating:' + thumb.rating + ' Score:' + thumb.score + ' Size:' + thumb.width + 'x' + thumb.height + ' User:' + thumb.user.name + '" alt=""></a></span>');
		}

		function setRating(rating) {
			// If currently hovered not given, rate Post if Post given
			if (id_hover === undefined) {
				if (sx.Post !== undefined) {
					sx.Post.setRating(rating);
				}
			} else {
				var r = rating[0].toLowerCase();
				switch (r) {
				case 's':
					rating = 'safe';
					break;
				case 'q':
					rating = 'questionable';
					break;
				case 'e':
					rating = 'explicit';
					break;
				}

				// Rate thumb
				var id = id_hover;
				sx.Operation.setRating(id, rating, function () { // onSuccess
					filterId(id, function (thumb) {
						var jspan = jQuery(thumb.span);
						jspan.removeClass('sx-safe sx-questionable sx-explicit');
						jspan.addClass('sx-' + rating);
						jspan.find('.sx-thumb-rating').html(r);
					});
				});
			}
		}
	})();

	// Hotkeys
	(function () {
		// Create a menu for the hotkeys
		var menu = [{
				html: '<li id="sx-icon-hotkeys" class="sx-inactive">H</li>',
				menu: [{
						node: createCheckbox('Hotkeys_active_boolean', 'Activate hotkeys'),
					}, {
						node: createHotkeyField('Hotkeys_toggle_favorite', 'Toggle favorite'),
					}, {
						node: createHotkeyField('Hotkeys_favorite', 'Favorite'),
					}, {
						node: createHotkeyField('Hotkeys_unfavorite', 'Unfavorite'),
					}, {
						node: createHotkeyField('Hotkeys_vote_1', 'Vote 1'),
					}, {
						node: createHotkeyField('Hotkeys_vote_2', 'Vote 2'),
					}, {
						node: createHotkeyField('Hotkeys_vote_3', 'Vote 3'),
					}, {
						node: createHotkeyField('Hotkeys_vote_4', 'Vote 4'),
					}, {
						node: createHotkeyField('Hotkeys_vote_5', 'Vote 5'),
					}, {
						node: createHotkeyField('Hotkeys_set_rating_s', 'Set rating safe'),
					}, {
						node: createHotkeyField('Hotkeys_set_rating_q', 'Set rating questionable'),
					}, {
						node: createHotkeyField('Hotkeys_set_rating_e', 'Set rating explicit'),
					}, {
						node: createHotkeyField('Hotkeys_find_similar', 'Find similar'),
					}, {
						node: createHotkeyField('Hotkeys_select', 'Select post'),
					}, {
						node: createHotkeyField('Hotkeys_set_as_child', 'Set as child'),
					}, {
						node: createHotkeyField('Hotkeys_set_as_parent', 'Set as parent'),
					}, {
						node: createHotkeyField('Hotkeys_delete', 'Delete'),
					}
				]
			}
		];

		// Append it to the header
		jQuery('#sx-toolbar-right').append(createMenu(menu, undefined, 'right'));

		var icon_hotkeys = document.getElementById('sx-icon-hotkeys');
		if (sx.Options['Hotkeys_active_boolean']) {
			icon_hotkeys.className = 'sx-active';
		}

		// Listener for the different pressed keys defined in options
		Listener = {
			'Hotkeys_toggle_favorite': sx.Thumbs.toggleFav,
			'Hotkeys_favorite': sx.Thumbs.fav,
			'Hotkeys_unfavorite': sx.Thumbs.unfav,
			'Hotkeys_vote_1': function () {
				sx.Thumbs.vote(1);
			},
			'Hotkeys_vote_2': function () {
				sx.Thumbs.vote(2);
			},
			'Hotkeys_vote_3': function () {
				sx.Thumbs.vote(3);
			},
			'Hotkeys_vote_4': function () {
				sx.Thumbs.vote(4);
			},
			'Hotkeys_vote_5': function () {
				sx.Thumbs.vote(5);
			},
			'Hotkeys_find_similar': sx.Thumbs.toggleFindSimilar,
			'Hotkeys_select': sx.Thumbs.select,
			'Hotkeys_set_as_child': sx.Thumbs.setAsChild,
			'Hotkeys_set_as_parent': sx.Thumbs.setAsParent,
			'Hotkeys_set_rating_s': function () {
				sx.Thumbs.setRating('safe');
			},
			'Hotkeys_set_rating_q': function () {
				sx.Thumbs.setRating('questionable');
			},
			'Hotkeys_set_rating_e': function () {
				sx.Thumbs.setRating('explicit');
			},
			'Hotkeys_delete': sx.Thumbs.del,
		};

		// Focus listener to display deactivated hotkeys when input is focused
		jQuery('input[type=text]:not(.sx-input-hotkey), textarea')
		.bind('focus', function () {
			if (sx.Options['Hotkeys_active_boolean']) {
				icon_hotkeys.className = 'sx-pause';
			}
		})
		.bind('focusout', function () {
			if (sx.Options['Hotkeys_active_boolean']) {
				icon_hotkeys.className = 'sx-active';
			}
		});

		// Keylistener
		var value,
		b,
		k;
		window.onkeydown = function (e) {

			if (sx.Options['Hotkeys_active_boolean']) {
				// Replace + sign and CONTROL with CTRL
				k = e.key.toUpperCase();
				if (k === '+') {
					k = 'PLUS';
				} else if (k === 'CONTROL') {
					k = 'CTRL';
				}

				// If a set key fild is focused
				if (e.target.className === 'sx-input-hotkey') {

					// Put together combination and save the options
					if (k === 'ESCAPE') { // Delete hotkey when pressed ESC
						value = '';
					} else {
						value = [];
						if (e.ctrlKey) {
							value.push('CTRL');
						}
						if (e.shiftKey) {
							value.push('SHIFT');
						}
						if (e.altKey) {
							value.push('ALT');
						}
						value = value.join('+');
						if (!(['CTRL', 'SHIFT', 'ALT'].includes(k))) {
							if (value === '') {
								value = k;
							} else {
								value = value + '+' + k;
							}
						}
					}
					e.stopPropagation();
					e.preventDefault();
					// When value has changed
					if (e.target.value !== value) {
						e.target.value = value;
						sx.Options[e.target.id] = value;
						sx.Options.save();
					}
				} else if (!((e.target.tagName === 'INPUT' && // If not an input field and a textarea
							(e.target.type.toLowerCase() === 'text'))) && !(e.target.tagName === 'TEXTAREA')) {

					// If any of the hotkeys is pressed, run the listener
					for (var key in sx.Options) {
						// If key is a hotkey and is not a boolean
						if (key.startsWith('Hotkey') && !key.endsWith('boolean')) {
							// If a hotkey is set
							if (sx.Options[key] !== '') {
								value = sx.Options[key].split('+');
								if (value[value.length - 1] === k) {
									b = value.includes('CTRL');
									if ((b && e.ctrlKey) || (!b && !e.ctrlKey)) {
										b = value.includes('SHIFT');
										if (b && e.shiftKey || (!b && !e.shiftKey)) {
											b = value.includes('ALT');
											if (b && e.altKey || (!b && !e.altKey)) {
												Listener[key]();
												e.stopPropagation();
												e.preventDefault();
												break;
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	})();

	/* For the future */

	// Fix 0-tag posts
	Post.register = function (post) {
		post.tags = post.tags.match(/\S+/g);
		if (!post.tags) { // Fix
			post.tags = [];
		}
		post.match_tags = post.tags.clone();
		post.match_tags.push("rating:" + post.rating.charAt(0));
		post.match_tags.push("status:" + post.status);
		post.match_tags.push("user:" + post.author);
		this.posts.set(post.id, post);
	};
	// Tags with underscore
	jQuery('a[href^="/?tags="]').each(function (i, el) {
		el.innerHTML = el.innerHTML
			.split(' ')
			.join('<span class="sx-tagspace">_</span>');
	});

	// Export of functions which I don't really need later on
	window.parseUrl = parseUrl;
	window.parseCookie = parseCookie;

	// Functions

	// Create an ul element from all menu entries in array
	function createMenu(array, id, align, level) {
		var ul = document.createElement('ul');
		if (id !== undefined) {
			ul.id = id;
		}
		if (level === undefined) {
			level = 0;
		}
		if (align === undefined) {
			align = 'left';
		}

		// Temporary variables
		var temp,
		li,
		a,
		b_added, // If a menu entry is added, true
		style;

		// Go through all main items
		for (var i = 0; i < array.length; i++) {

			b_added = false;
			if (array[i].node !== undefined) { // If menu item is a node
				li = document.createElement('li');
				ul.appendChild(li);
				li.appendChild(array[i].node);
				b_added = true;
			} else if (array[i].html !== undefined) { // If menu item is html code
				temp = document.createElement('div');
				temp.innerHTML = array[i].html;
				for (var j = 0; j < temp.childNodes.length; j++) {
					ul.appendChild(temp.childNodes[j]);
				}
				b_added = true;
			} else if (array[i].link !== undefined) { // If menu item is a link
				li = document.createElement('li');
				li.setAttribute('class', 'sx-max-anchor');
				ul.appendChild(li);

				a = document.createElement('a');
				a.href = array[i].link;
				a.innerHTML = array[i].name;
				li.appendChild(a);

				b_added = true;
			}

			// If a submenu is given and a menu entry has been added
			if ((array[i].menu !== undefined) && b_added) {
				temp = createMenu(array[i].menu, undefined, align, level + 1);
				temp.setAttribute('class', 'sx-background sx-box');
				style = '';
				if (array[i].width !== undefined) {
					style = 'width:' + array[i].width + 'px;';
				}
				if (level === 0) { // If first submenu
					if (align === 'left') {
						style = style + 'left:0;';
					} else {
						style = style + 'right:0;'
					}
				} else {
					if (align === 'left') {
						style = style + 'top:0px;left:100%;';
					} else {
						style = style + 'top:0px;right:100%;';
					}
				}
				temp.style = style;
				ul.childNodes[ul.childNodes.length - 1].appendChild(temp);
			}
		}
		return ul;
	}

	// Create a checkbox for an option
	function createCheckbox(key, name, listener) {
		var label = document.createElement('label');
		var value = false;
		label.innerHTML = '<input type="checkbox" id="' + key + '"> ' + name;
		if (sx.Options[key]) {
			label.childNodes[0].checked = true;
			value = true;
		}
		// Add listener if given
		if (listener !== undefined) {
			sx.Options.listener[key] = listener;
		}
		// Save options directly on change
		label.onclick = function () {
			if (value !== label.childNodes[0].checked) {
				value = label.childNodes[0].checked;
				sx.Options[key] = value;
				sx.Options.save();
			}
		};
		return label;
	}

	// Create a label and field for a hotkey
	function createHotkeyField(key, name) {
		var label = document.createElement('label');
		var value = '';
		label.innerHTML = name + ': <input type="text" id="' + key + '" class="sx-input-hotkey">';
		input = label.lastChild;
		input.value = sx.Options[key];
		return label;
	}

	// Parse URL
	function parseUrl(link) {

		if (link === undefined) {
			link = document.location.href;
		}

		var url = {};
		url.href = link;

		// Split link into link and hash part
		var n = link.indexOf('#');
		if (n > -1) {
			url.hash = link.substr(n + 1);
			url.hrefNoHash = link.substr(0, n);
			link = url.hrefNoHash;
		} else {
			url.hash = '';
			url.hrefNoHash = link;
		}

		// Split link into link and search part
		n = link.indexOf('?');
		if (n > -1) {
			url.search = link.substr(n + 1);
			url.hrefNoSearch = link.substr(0, n);
		} else {
			url.search = '';
			url.hrefNoSearch = link;
		}

		// Get all parts of the link
		// Regexp coarse: ((protocol://host:port)|file://)(path)(name.ext)
		var regexp = /^((([^\/\.]+):\/\/)?(([^\/\.]+\.)*[^\/\.]+\.[^\/\.:]+(:\d+)?)|(file):\/\/)(\/.+\/|\/)?([^\/]+)?$/;
		var tokens = regexp.exec(url.hrefNoSearch);
		// url.regexp = regexp; // Save to check
		// url.tokens = tokens;
		/* Tokens:
		 * 0: match
		 * 1: link without /path/name.ext, if file, then file://
		 * 2: https:// or ftp:// or undefined if not given
		 * 3: http, https or ftp, if 2 http or https,e else undefined
		 * 4: hostname + subdomain if 2 http, https or undefined
		 * 5: undefined
		 * 6: port
		 * 7: file, if 2 file://
		 * 8: /path/
		 * 9: name.ext
		 */
		if (tokens) {
			// If not a file, then get hostname
			if (tokens[1] !== 'file://') {
				url.protocol = tokens[3];
				url.hostname = tokens[4];
				url.port = (tokens[6]) ? tokens[6].substr(1) : undefined;
				url.host = (url.port) ? url.hostname + ':' + url.port : url.hostname;
				url.path = tokens[8];
			} else {
				url.protocol = 'file';
				url.hostname = 'localhost';
				url.path = tokens[8].substr(1);
			}
			url.file = tokens[9];
			url.pathname = (url.file) ? url.path + url.file : url.path;
		}

		// Parse filename
		if (url.file) {
			n = url.file.lastIndexOf('.');
			if (n > -1) {
				url.name = url.file.substr(0, n);
				url.ext = url.file.substr(n + 1);
			} else {
				url.name = url.file;
				url.ext = '';
			}
		}

		// Parse arguments
		url.args = {};
		if (url.search !== '') {
			var array = url.search.split('&');
			for (var i = 0; i < array.length; i++) {
				n = array[i].indexOf('=');
				if (n > -1) {
					url.args[decodeURIComponent(array[i].substr(0, n))] =
						decodeURIComponent(array[i].substr(n + 1));
				} else {
					url.args[decodeURIComponent(array[i])] = undefined;
				}
			}
		}

		return url;
	}

	// Parse cookie
	function parseCookie(cookie) {
		var obj = {};
		if (cookie === undefined) {
			cookie = document.cookie;
		}
		var array = cookie.split('; ');
		var n;
		for (var i = 0; i < array.length; i++) {
			n = array[i].indexOf('=');
			if (n > -1) {
				obj[array[i].substr(0, n)] = array[i].substr(n + 1);
			} else {
				obj[array[i]] = undefined;
			}
		}
		return obj;
	}

	// Set CSS
	function setCSS(id, style) {
		var css = document.createElement("style");
		css.type = "text/css";
		css.id = id;
		css.innerHTML = style;
		document.head.appendChild(css);
	}

	// Remove CSS
	function remCSS(id) {
		var css = document.getElementById(id);
		if (css) {
			document.head.removeChild(css);
		}
	}

	// Clone objects
	function clone(obj) {
		if (null == obj || "object" != typeof obj)
			return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr))
				copy[attr] = obj[attr];
		}
		return copy;
	}
	
	// Compare if two objects are same, if they are objects, else compare with ===
	function isEquivalent(a, b) {
		return (JSON.stringify(a) === JSON.stringify(b));
	}
});
