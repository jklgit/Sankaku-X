// ==UserScript==
// @name        Sankaku X
// @namespace   jklsan
// @description Sankaku X
// @include     https://chan.sankakucomplex.com*
// @include     https://idol.sankakucomplex.com*
// @version     0
// @grant       none
// ==/UserScript==

function exec(fn) {
	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.textContent = '(' + fn + ')();';
	document.body.appendChild(script);
	//document.body.removeChild(script);
};

exec(function () {
	
	var sx = {}; // Object for Sankaku X

	/* Core: Saving all page info which is parsed at the beginning in the core. */
	(function () {
		sx.core = {};

		var link = document.location.href;

		// Root: idol or chan
		sx.core.getRoot = function () {
			if (link.startsWith('https://c'))
				return 'https://chan.sankakucomplex.com/';
			else if (link.startsWith('https://i'))
				return 'https://idol.sankakucomplex.com/'
		};
		sx.core.root = sx.core.getRoot();

		// PageType: search, post, user,... rest is undefined
		sx.core.getPageType = function () {
			if (link === sx.core.root) {
				return 'search';
			} else if (link.startsWith(sx.core.root + '?')) {
				return 'search'
			} else if (link.startsWith(sx.core.root + 'post/show/') || (link === (sx.core.root + '#'))) {
				return 'post'
			} else if (link.startsWith(sx.core.root + 'user/show')) {
				return 'user'
			} else if (link.startsWith(sx.core.root + 'user/home')) {
				return 'home';
			} else {
				return undefined;
			}
		};
		sx.core.pagetype = sx.core.getPageType();

		// PostInfo
		(function () {
			if (sx.core.pagetype === 'post') {
				sx.core.post = {};

				jQuery('#stats > ul > li').each(function (idx, li) {

					// Get post date
					if (li.innerText.startsWith('Posted: ')) {
						var agohtml = li.getElementsByTagName('a')[0].outerHTML;
						var abbr = ['seconds', 'sec', 'minutes', 'min', 'weeks', 'we', 'months', 'mo', 'years', 'yr'];
						for (var i = 0; i < abbr.length; i = i + 2) {
							agohtml = agohtml.replace(abbr[i], abbr[i + 1]);
						}
						sx.core.post.agohtml = agohtml;
					} else if (li.innerText.startsWith('Resized: ')) {
						//sx.core.post.resized.width = ''; // TODO
					}

				});
			}
		})();

		// Which language?
		if (jQuery(".lang-select").find("a").eq(0).hasClass("active")) { // if english
			sx.core.language = "en";
		} else {
			sx.core.language = "ja";
		}

		// User logged in?
		sx.core.isLoggedIn = jQuery('#navbar > li > a')
			.get(0)
			.innerText === 'My Account';

		// If logged in get username
		if (sx.core.isLoggedIn) {
			sx.core.username = jQuery('#navbar').find('a:contains("Favorites")')
				.attr('href')
				.substr('/?tags=fav%3A'.length);
		}

	})();

	/* Options: Settings for all elements. Saved and loaded from the localstorage. */
	sx.options = { // Standard settings
		header : {},
		hokeys : {
			activated : true,
		},
	};
	sx.options.header = {};
	sx.optionsManager = {
		load : function () {
			console.log('loaded')
		},
		save : function () {
			console.log('saved')
		}
	};

	/* Header: Replace big header with small header/navbar and tools. */
	(function () {
		// Allocate object
		sx.header = {};
		// Create Navbar object
		sx.header.initNavbar = function () {
			var navbar = Array();
			navbar.push({
				// Sankaku-Logo
				html : '<li><a class="sx-navbar-item" href="/"><img src=" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAAXNSR0ICQMB9xQAAAPBQTFRFAAAA/10A/1wA/2QA/2kH/2cF/3Uc/2gG/3ce/3MY/3Yd/3EW/2sL/3EU/2oK/3Qb/20P/3Qa/3EV/28S/3AU/3IX/20O/3Ub/24R/2oJ/3AT/2wN/2kI/2EA/3cf/3IW/24Q/38s/3sm/30p/34r/4U2/4o//4Ev/4My/4Ew/45F/5VQ/5xb/4tA/5xc/5JM/6Fk/6hx/6du/7SE/72S/7uP/8CY/9a7/8up/9O2/8ah/9Cy/9Cz/9e9/9e+/9a8/93H/9/K/+TS/+jZ/+LQ/+DN/+TT/+/l//79//bx/+/k/+7k//z7//z6//Xv//LrXSE6UwAAAAF0Uk5TAEDm2GYAAAAJcEhZcwAAAk8AAAKdAUSfnw0AAAAZdEVYdFNvZnR3YXJlAE1pY3Jvc29mdCBPZmZpY2V/7TVxAAAAsUlEQVQoz2NgoAlwwiHuzuyBXUKLxQCruDkrG7szNgkOTi5uVSzixjxsvGzsFhjinnz8AgYCgkIYEtrCIloMiqJihmjiDqziLF4MLkDSG1VCSVTACEjpSPDqooibSApKgWgfMUFWSyRxX2l+GSswy0yWXRJJQk9CVA3KdHVz9IOLu7GyCaorKoOAioaGhpw/TEJTnotLkBMOFPSh4qaMknzIQJLJGiJhY2uHCuzNGegDAKrCFCumdTdJAAAAAElFTkSuQmCC"></a></li>',
			});
			if (sx.core.isLoggedIn) {
				navbar.push({
					name : 'My Account',
					link : '/user/home',
					menu : [{
							name : 'My Favorites',
							link : '/?tags=fav:' + sx.core.username,
						}, {
							name : 'My Profile',
							link : '/user/show/?name=' + sx.core.username,
						}, {
							name : 'My Mail',
							link : '/dmail/inbox',
						}, {
							name : 'Tag Subscriptions',
							link : '/?tags=sub:' + sx.core.username,
						}, {
							name : 'Settings',
							link : '/user/edit',
						}, {
							name : 'Logout',
							link : '/user/logout',
						},
					],
				});
			} else {
				navbar.push({
					name : 'Login',
					link : '/user/login',
					menu : [{
							name : 'Sign Up',
							link : '/user/signup',
						}
					],
				});
			}
			navbar.push({
				name : 'Posts',
				link : '/?tags=threshold%3A0', // sx.core.root,
				width : 280,
				menu : [{
						name : 'Upload',
						link : '/post/upload',
					}, {
						name : 'Favorites',
						link : '/?tags=fav:' + sx.core.username,
					}, {
						name : 'Subscriptions',
						link : '/?tags=sub:' + sx.core.username,
					}, {
						html : jQuery('#header .subnavbar-option:contains("Monthly")').eq(0).parent().html(),
					}, {
						name : 'Comments',
						link : '/comment/index',
					}, {
						name : 'Changes',
						link : '/post_tag_history/index',
					}, {
						name : 'Help',
						link : '/wiki/show?title=help%3A_quick_guide',
					},
				],
			});
			navbar.push({
				name : 'More',
				link : '/static/more',
				width : 180,
				menu : [{
						name : 'Rankings',
						link : '/rankings/show',
					}, {
						name : 'Notes',
						link : '/note/index',
					}, {
						name : 'Artists',
						link : '/artist/index?order=date',
					}, {
						name : 'Tags',
						link : '/tag/index?order=date',
					}, {
						name : 'Pools',
						link : '/pool/index',
					}, {
						name : 'Wiki',
						link : '/wiki/show?title=help:home',
					}, {
						name : 'Help',
						link : '/wiki/show?title=help%3A_quick_guide',
					}, {
						name : 'Forum',
						link : '/forum/index',
					}, {
						html : '<div style="font-size:0.7em; padding-top:3px;">' + jQuery('.lang-select').html() + '</div>',
					},
				],
			});

			sx.header.navbar = navbar;
		};
		sx.header.initNavbar();

		// Create Navbar HTML
		sx.header.getNavbarHtml = function () {
			var s = '<ul id="sx-navbar">';
			var navbar = sx.header.navbar;

			// Return <ul> of submenu
			var getSubMenu = function (menu, width) {
				// If menu is defined
				if (menu) {
					var s;
					if (width) {
						s = '<ul class="sx-background sx-box" style="width:' + width + 'px">';
					} else {
						s = '<ul class="sx-background sx-box">';
					}

					// Go through all menu items
					for (var i = 0; i < menu.length; i++) {
						if (menu[i].link) {
							s = s + '<li><a href="' + menu[i].link + '" class="sx-navbar-item">' + menu[i].name + '</a></li>';
						} else if (menu[i].html) {
							s = s + '<li class="sx-navbar-item">' + menu[i].html + '</li>';
						}
					}
					return s + '</ul>';
				}
				return '';
			};

			// Return <ul> of menu
			var getMenu = function (menu, width) {
				// If menu is defined
				if (menu) {
					var s;
					if (width) { // If width given
						s = '<ul class="sx-background sx-box" style="width:' + width + 'px">';
					} else {
						s = '<ul class="sx-background sx-box">';
					}

					// Go through all menu items
					for (var i = 0; i < menu.length; i++) {
						if (menu[i].link) {
							s = s + '<li><a href="' + menu[i].link + '" class="sx-navbar-item">' + menu[i].name + '</a>' + getSubMenu(menu[i].menu, menu[i].width) + '</li>';
						} else if (menu[i].html) {
							s = s + '<li class="sx-navbar-item">' + menu[i].html + '</li>';
						}
					}
					return s + '</ul>';
				}
				return '';
			};

			// Go through all main items
			for (var i = 0; i < navbar.length; i++) {
				if (navbar[i].html) // If html defined
				{
					s = s + navbar[i].html;
				} else {
					s = s + '<li><a href="' + navbar[i].link + '" class="sx-navbar-item">' + navbar[i].name + '</a>' + getMenu(navbar[i].menu, navbar[i].width) + '</li>';
				}
			}
			return s + '</ul>';
		};

		// Create Searchbar object
		// Create Searchbar HTML

		// Create Iconbar object
		// Create Iconbar HTML

		// Create Actionbar object
		// Create Actionbar HTML
		sx.header.getActionbarHtml = function () {
			var s;

			function getActionbarForPost() {
				var s = '';

				s = '<ul id="sx-actionbar">' + jQuery('#stats > ul').html() + '</ul>';
				jQuery('#stats').hide();

				return s;
			}

			if (sx.core.pagetype === 'post') {
				s = getActionbarForPost();
			} else if (sx.core.pagetype === 'search') {
				s = jQuery('#site-title').html();
				if(sx.core.root === 'https://chan.sankakucomplex.com/'){
					s = s.substr('<a href="/">Sankaku Channel</a>/'.length);
				}
				else{
					s = s.substr('<a href="/">Idol Complex</a>/'.length);
				}
				if (s === '<a href="/">Posts</a>') {
					s = '';
				}
			} else {
				s = '<ul id="sx-actionbar">' + jQuery('#subnavbar').html() + '</ul>';
			}
			return s;
		}

		// Append Header
		jQuery('body').append('<div id="sx-header" class="sx-background">' + sx.header.getNavbarHtml() +
			'<div id="sx-toolbar">' +
			'<div id="sx-toolbar-left"></div>' +
			'<div id="sx-toolbar-center">' + sx.header.getActionbarHtml() + '</div>' +
			'<div id="sx-toolbar-right"></div>' +
			'</div>' +
			'</div>');

		// Append header placeholder so that the whole page scrolls down by 24px
		jQuery('body').prepend('<div id="sx-header-placeholder"></div>');

		// Hide old header
		jQuery('#header').css('display', 'none');
	})();

	/* Hotkeys */
	(function () {

		// sx.header.addIcon('HK', sx.hotkeys.toggle)

	})();

	/* Improvisatorischer Part */
	jQuery('video')
	.attr('controls', 'true')
	.attr('muted', 'true');

	Post.register = function (post) {
		post.tags = post.tags.match(/\S+/g);
		if (!post.tags) { // Fix 0-tag posts
			post.tags = [];
		}
		post.match_tags = post.tags.clone();
		post.match_tags.push("rating:" + post.rating.charAt(0));
		post.match_tags.push("status:" + post.status);
		post.match_tags.push("user:" + post.author);
		this.posts.set(post.id, post);
	};

	sx.optionsManager.load();
	console.log(sx);
	Post.sx = sx;
	
	// Tags mit underscore
	jQuery('a[href^="/?tags="]').each(function (i, el) {
		el.innerHTML = el.innerHTML
			.split(' ')
			.join('<span class="sx-tagspace">_</span>');
	});
});
