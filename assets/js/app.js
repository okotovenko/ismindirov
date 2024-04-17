(() => {
	"use strict";
	const files_modules_flsModules = {};
	function getHash() {
		if (location.hash) return location.hash.replace("#", "");
	}
	let bodyLockStatus = true;
	let bodyLockToggle = (delay = 500) => {
		if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
	};
	let bodyUnlock = (delay = 500) => {
		let body = document.querySelector("body");
		if (bodyLockStatus) {
			let lock_padding = document.querySelectorAll("[data-lp]");
			setTimeout((() => {
				for (let index = 0; index < lock_padding.length; index++) {
					const el = lock_padding[index];
					el.style.paddingRight = "0px";
				}
				body.style.paddingRight = "0px";
				document.documentElement.classList.remove("lock");
			}), delay);
			bodyLockStatus = false;
			setTimeout((function () {
				bodyLockStatus = true;
			}), delay);
		}
	};
	let bodyLock = (delay = 500) => {
		let body = document.querySelector("body");
		if (bodyLockStatus) {
			let lock_padding = document.querySelectorAll("[data-lp]");
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index];
				el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
			}
			body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
			document.documentElement.classList.add("lock");
			bodyLockStatus = false;
			setTimeout((function () {
				bodyLockStatus = true;
			}), delay);
		}
	};
	function menuInit() {
		if (document.querySelector(".icon-menu")) document.addEventListener("click", (function (e) {
			if (bodyLockStatus && e.target.closest(".icon-menu")) {
				bodyLockToggle();
				document.documentElement.classList.toggle("menu-open");
			}
		}));
	}
	function menuClose() {
		bodyUnlock();
		document.documentElement.classList.remove("menu-open");
	}
	let addWindowScrollEvent = false;
	function headerScroll() {
		addWindowScrollEvent = true;
		const header = document.querySelector("header.nav");
		const headerShow = header.hasAttribute("data-scroll-show");
		const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
		const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
		let scrollDirection = 0;
		let timer;
		document.addEventListener("windowScroll", (function (e) {
			const scrollTop = window.scrollY;
			clearTimeout(timer);
			if (scrollTop >= startPoint) {
				!header.classList.contains("_header-scroll") ? header.classList.add("_header-scroll") : null;
				if (headerShow) {
					if (scrollTop > scrollDirection) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null; else !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
					timer = setTimeout((() => {
						!header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
					}), headerShowTimer);
				}
			} else {
				header.classList.contains("_header-scroll") ? header.classList.remove("_header-scroll") : null;
				if (headerShow) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
			}
			scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
		}));
	}
	setTimeout((() => {
		if (addWindowScrollEvent) {
			let windowScroll = new Event("windowScroll");
			window.addEventListener("scroll", (function (e) {
				document.dispatchEvent(windowScroll);
			}));
		}
	}), 0);
	function functions_FLS(message) {
		setTimeout((() => {
			if (window.FLS) console.log(message);
		}), 0);
	}
	function uniqArray(array) {
		return array.filter((function (item, index, self) {
			return self.indexOf(item) === index;
		}));
	}
	let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
		const targetBlockElement = document.querySelector(targetBlock);
		if (targetBlockElement) {
			let headerItem = "";
			let headerItemHeight = 0;
			if (noHeader) {
				headerItem = "header.header";
				const headerElement = document.querySelector(headerItem);
				if (!headerElement.classList.contains("_header-scroll")) {
					headerElement.style.cssText = `transition-duration: 0s;`;
					headerElement.classList.add("_header-scroll");
					headerItemHeight = headerElement.offsetHeight;
					headerElement.classList.remove("_header-scroll");
					setTimeout((() => {
						headerElement.style.cssText = ``;
					}), 0);
				} else headerItemHeight = headerElement.offsetHeight;
			}
			let options = {
				speedAsDuration: true,
				speed,
				header: headerItem,
				offset: offsetTop,
				easing: "easeOutQuad"
			};
			document.documentElement.classList.contains("menu-open") ? menuClose() : null;
			if (typeof SmoothScroll !== "undefined") (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
				let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
				targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
				targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
				window.scrollTo({
					top: targetBlockElementPosition,
					behavior: "smooth"
				});
			}
			functions_FLS(`[gotoBlock]: Юхуу...едем к ${targetBlock}`);
		} else functions_FLS(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${targetBlock}`);
	};
	class ScrollWatcher {
		constructor(props) {
			let defaultConfig = {
				logging: true
			};
			this.config = Object.assign(defaultConfig, props);
			this.observer;
			!document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
		}
		scrollWatcherUpdate() {
			this.scrollWatcherRun();
		}
		scrollWatcherRun() {
			document.documentElement.classList.add("watcher");
			this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
		}
		scrollWatcherConstructor(items) {
			if (items.length) {
				this.scrollWatcherLogging(`Проснулся, слежу за объектами (${items.length})...`);
				let uniqParams = uniqArray(Array.from(items).map((function (item) {
					return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
				})));
				uniqParams.forEach((uniqParam => {
					let uniqParamArray = uniqParam.split("|");
					let paramsWatch = {
						root: uniqParamArray[0],
						margin: uniqParamArray[1],
						threshold: uniqParamArray[2]
					};
					let groupItems = Array.from(items).filter((function (item) {
						let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
						let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
						let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
						if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
					}));
					let configWatcher = this.getScrollWatcherConfig(paramsWatch);
					this.scrollWatcherInit(groupItems, configWatcher);
				}));
			} else this.scrollWatcherLogging("Сплю, нет объектов для слежения. ZzzZZzz");
		}
		getScrollWatcherConfig(paramsWatch) {
			let configWatcher = {};
			if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if (paramsWatch.root !== "null") this.scrollWatcherLogging(`Эмм... родительского объекта ${paramsWatch.root} нет на странице`);
			configWatcher.rootMargin = paramsWatch.margin;
			if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
				this.scrollWatcherLogging(`Ой ой, настройку data-watch-margin нужно задавать в PX или %`);
				return;
			}
			if (paramsWatch.threshold === "prx") {
				paramsWatch.threshold = [];
				for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
			} else paramsWatch.threshold = paramsWatch.threshold.split(",");
			configWatcher.threshold = paramsWatch.threshold;
			return configWatcher;
		}
		scrollWatcherCreate(configWatcher) {
			this.observer = new IntersectionObserver(((entries, observer) => {
				entries.forEach((entry => {
					this.scrollWatcherCallback(entry, observer);
				}));
			}), configWatcher);
		}
		scrollWatcherInit(items, configWatcher) {
			this.scrollWatcherCreate(configWatcher);
			items.forEach((item => this.observer.observe(item)));
		}
		scrollWatcherIntersecting(entry, targetElement) {
			if (entry.isIntersecting) {
				!targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view", "animation") : null;
				this.scrollWatcherLogging(`Я вижу ${targetElement.classList}, добавил класс _watcher-view`);
			} else {
				targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view", "animation") : null;
				this.scrollWatcherLogging(`Я не вижу ${targetElement.classList}, убрал класс _watcher-view`);
			}
		}
		scrollWatcherOff(targetElement, observer) {
			observer.unobserve(targetElement);
			this.scrollWatcherLogging(`Я перестал следить за ${targetElement.classList}`);
		}
		scrollWatcherLogging(message) {
			this.config.logging ? functions_FLS(`[Наблюдатель]: ${message}`) : null;
		}
		scrollWatcherCallback(entry, observer) {
			const targetElement = entry.target;
			this.scrollWatcherIntersecting(entry, targetElement);
			targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
			document.dispatchEvent(new CustomEvent("watcherCallback", {
				detail: {
					entry
				}
			}));
		}
	}
	files_modules_flsModules.watcher = new ScrollWatcher({});
	function pageNavigation() {
		document.addEventListener("click", pageNavigationAction);
		document.addEventListener("watcherCallback", pageNavigationAction);
		function pageNavigationAction(e) {
			if (e.type === "click") {
				const targetElement = e.target;
				if (targetElement.closest("[data-goto]")) {
					const gotoLink = targetElement.closest("[data-goto]");
					const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
					const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
					const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
					const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
					if (files_modules_flsModules.fullpage) {
						const fullpageSectionId = +document.querySelector(`${gotoLinkSelector}[data-fp-section]`);
						files_modules_flsModules.fullpage.switchingSection(fullpageSectionId);
					} else gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
					e.preventDefault();
				}
			} else if (e.type === "watcherCallback" && e.detail) {
				const entry = e.detail.entry;
				const targetElement = entry.target;
				if (targetElement.dataset.watch === "navigator") {
					document.querySelector(`[data-goto]._navigator-active`);
					let navigatorCurrentItem;
					if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
						const element = targetElement.classList[index];
						if (document.querySelector(`[data-goto=".${element}"]`)) {
							navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
							break;
						}
					}
					if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
				}
			}
		}
		if (getHash()) {
			let goToHash;
			if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
			goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
		}
	}
	setTimeout((() => {
		if (addWindowScrollEvent) {
			let windowScroll = new Event("windowScroll");
			window.addEventListener("scroll", (function (e) {
				document.dispatchEvent(windowScroll);
			}));
		}
	}), 0);
	function preloader() {
		window.addEventListener("load", (function () {
			document.body.classList.add("loaded_hiding");
			window.setTimeout((function () {
				document.body.classList.add("loaded");
				document.body.classList.remove("loaded_hiding");
			}), 500);
		}));
	}
	window["FLS"] = true;
	menuInit();
	headerScroll();
	pageNavigation();
	preloader();
})();
