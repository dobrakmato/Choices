/*! choices.js v9.0.1 | © 2022 Josh Johnson | https://github.com/jshjohnson/Choices#readme */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Choices"] = factory();
	else
		root["Choices"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/public/assets/scripts/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return target.propertyIsEnumerable(symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

module.exports = deepmerge_1;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Fuse.js v3.6.1 - Lightweight fuzzy-search (http://fusejs.io)
 * 
 * Copyright (c) 2012-2017 Kirollos Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 */
!function(e,t){ true?module.exports=t():undefined}(this,function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){function n(e){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var i=r(1),a=r(7),s=a.get,c=(a.deepValue,a.isArray),h=function(){function e(t,r){var n=r.location,o=void 0===n?0:n,i=r.distance,a=void 0===i?100:i,c=r.threshold,h=void 0===c?.6:c,l=r.maxPatternLength,u=void 0===l?32:l,f=r.caseSensitive,v=void 0!==f&&f,p=r.tokenSeparator,d=void 0===p?/ +/g:p,g=r.findAllMatches,y=void 0!==g&&g,m=r.minMatchCharLength,k=void 0===m?1:m,b=r.id,S=void 0===b?null:b,x=r.keys,M=void 0===x?[]:x,_=r.shouldSort,w=void 0===_||_,L=r.getFn,A=void 0===L?s:L,O=r.sortFn,C=void 0===O?function(e,t){return e.score-t.score}:O,j=r.tokenize,P=void 0!==j&&j,I=r.matchAllTokens,F=void 0!==I&&I,T=r.includeMatches,N=void 0!==T&&T,z=r.includeScore,E=void 0!==z&&z,W=r.verbose,K=void 0!==W&&W;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.options={location:o,distance:a,threshold:h,maxPatternLength:u,isCaseSensitive:v,tokenSeparator:d,findAllMatches:y,minMatchCharLength:k,id:S,keys:M,includeMatches:N,includeScore:E,shouldSort:w,getFn:A,sortFn:C,verbose:K,tokenize:P,matchAllTokens:F},this.setCollection(t),this._processKeys(M)}var t,r,a;return t=e,(r=[{key:"setCollection",value:function(e){return this.list=e,e}},{key:"_processKeys",value:function(e){if(this._keyWeights={},this._keyNames=[],e.length&&"string"==typeof e[0])for(var t=0,r=e.length;t<r;t+=1){var n=e[t];this._keyWeights[n]=1,this._keyNames.push(n)}else{for(var o=null,i=null,a=0,s=0,c=e.length;s<c;s+=1){var h=e[s];if(!h.hasOwnProperty("name"))throw new Error('Missing "name" property in key object');var l=h.name;if(this._keyNames.push(l),!h.hasOwnProperty("weight"))throw new Error('Missing "weight" property in key object');var u=h.weight;if(u<0||u>1)throw new Error('"weight" property in key must bein the range of [0, 1)');i=null==i?u:Math.max(i,u),o=null==o?u:Math.min(o,u),this._keyWeights[l]=u,a+=u}if(a>1)throw new Error("Total of weights cannot exceed 1")}}},{key:"search",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{limit:!1};this._log('---------\nSearch pattern: "'.concat(e,'"'));var r=this._prepareSearchers(e),n=r.tokenSearchers,o=r.fullSearcher,i=this._search(n,o);return this._computeScore(i),this.options.shouldSort&&this._sort(i),t.limit&&"number"==typeof t.limit&&(i=i.slice(0,t.limit)),this._format(i)}},{key:"_prepareSearchers",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=[];if(this.options.tokenize)for(var r=e.split(this.options.tokenSeparator),n=0,o=r.length;n<o;n+=1)t.push(new i(r[n],this.options));return{tokenSearchers:t,fullSearcher:new i(e,this.options)}}},{key:"_search",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0,r=this.list,n={},o=[];if("string"==typeof r[0]){for(var i=0,a=r.length;i<a;i+=1)this._analyze({key:"",value:r[i],record:i,index:i},{resultMap:n,results:o,tokenSearchers:e,fullSearcher:t});return o}for(var s=0,c=r.length;s<c;s+=1)for(var h=r[s],l=0,u=this._keyNames.length;l<u;l+=1){var f=this._keyNames[l];this._analyze({key:f,value:this.options.getFn(h,f),record:h,index:s},{resultMap:n,results:o,tokenSearchers:e,fullSearcher:t})}return o}},{key:"_analyze",value:function(e,t){var r=this,n=e.key,o=e.arrayIndex,i=void 0===o?-1:o,a=e.value,s=e.record,h=e.index,l=t.tokenSearchers,u=void 0===l?[]:l,f=t.fullSearcher,v=t.resultMap,p=void 0===v?{}:v,d=t.results,g=void 0===d?[]:d;!function e(t,o,i,a){if(null!=o)if("string"==typeof o){var s=!1,h=-1,l=0;r._log("\nKey: ".concat(""===n?"--":n));var v=f.search(o);if(r._log('Full text: "'.concat(o,'", score: ').concat(v.score)),r.options.tokenize){for(var d=o.split(r.options.tokenSeparator),y=d.length,m=[],k=0,b=u.length;k<b;k+=1){var S=u[k];r._log('\nPattern: "'.concat(S.pattern,'"'));for(var x=!1,M=0;M<y;M+=1){var _=d[M],w=S.search(_),L={};w.isMatch?(L[_]=w.score,s=!0,x=!0,m.push(w.score)):(L[_]=1,r.options.matchAllTokens||m.push(1)),r._log('Token: "'.concat(_,'", score: ').concat(L[_]))}x&&(l+=1)}h=m[0];for(var A=m.length,O=1;O<A;O+=1)h+=m[O];h/=A,r._log("Token score average:",h)}var C=v.score;h>-1&&(C=(C+h)/2),r._log("Score average:",C);var j=!r.options.tokenize||!r.options.matchAllTokens||l>=u.length;if(r._log("\nCheck Matches: ".concat(j)),(s||v.isMatch)&&j){var P={key:n,arrayIndex:t,value:o,score:C};r.options.includeMatches&&(P.matchedIndices=v.matchedIndices);var I=p[a];I?I.output.push(P):(p[a]={item:i,output:[P]},g.push(p[a]))}}else if(c(o))for(var F=0,T=o.length;F<T;F+=1)e(F,o[F],i,a)}(i,a,s,h)}},{key:"_computeScore",value:function(e){this._log("\n\nComputing score:\n");for(var t=this._keyWeights,r=!!Object.keys(t).length,n=0,o=e.length;n<o;n+=1){for(var i=e[n],a=i.output,s=a.length,c=1,h=0;h<s;h+=1){var l=a[h],u=l.key,f=r?t[u]:1,v=0===l.score&&t&&t[u]>0?Number.EPSILON:l.score;c*=Math.pow(v,f)}i.score=c,this._log(i)}}},{key:"_sort",value:function(e){this._log("\n\nSorting...."),e.sort(this.options.sortFn)}},{key:"_format",value:function(e){var t=[];if(this.options.verbose){var r=[];this._log("\n\nOutput:\n\n",JSON.stringify(e,function(e,t){if("object"===n(t)&&null!==t){if(-1!==r.indexOf(t))return;r.push(t)}return t},2)),r=null}var o=[];this.options.includeMatches&&o.push(function(e,t){var r=e.output;t.matches=[];for(var n=0,o=r.length;n<o;n+=1){var i=r[n];if(0!==i.matchedIndices.length){var a={indices:i.matchedIndices,value:i.value};i.key&&(a.key=i.key),i.hasOwnProperty("arrayIndex")&&i.arrayIndex>-1&&(a.arrayIndex=i.arrayIndex),t.matches.push(a)}}}),this.options.includeScore&&o.push(function(e,t){t.score=e.score});for(var i=0,a=e.length;i<a;i+=1){var s=e[i];if(this.options.id&&(s.item=this.options.getFn(s.item,this.options.id)[0]),o.length){for(var c={item:s.item},h=0,l=o.length;h<l;h+=1)o[h](s,c);t.push(c)}else t.push(s.item)}return t}},{key:"_log",value:function(){var e;this.options.verbose&&(e=console).log.apply(e,arguments)}}])&&o(t.prototype,r),a&&o(t,a),e}();e.exports=h},function(e,t,r){function n(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var o=r(2),i=r(3),a=r(6),s=function(){function e(t,r){var n=r.location,o=void 0===n?0:n,i=r.distance,s=void 0===i?100:i,c=r.threshold,h=void 0===c?.6:c,l=r.maxPatternLength,u=void 0===l?32:l,f=r.isCaseSensitive,v=void 0!==f&&f,p=r.tokenSeparator,d=void 0===p?/ +/g:p,g=r.findAllMatches,y=void 0!==g&&g,m=r.minMatchCharLength,k=void 0===m?1:m,b=r.includeMatches,S=void 0!==b&&b;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.options={location:o,distance:s,threshold:h,maxPatternLength:u,isCaseSensitive:v,tokenSeparator:d,findAllMatches:y,includeMatches:S,minMatchCharLength:k},this.pattern=v?t:t.toLowerCase(),this.pattern.length<=u&&(this.patternAlphabet=a(this.pattern))}var t,r,s;return t=e,(r=[{key:"search",value:function(e){var t=this.options,r=t.isCaseSensitive,n=t.includeMatches;if(r||(e=e.toLowerCase()),this.pattern===e){var a={isMatch:!0,score:0};return n&&(a.matchedIndices=[[0,e.length-1]]),a}var s=this.options,c=s.maxPatternLength,h=s.tokenSeparator;if(this.pattern.length>c)return o(e,this.pattern,h);var l=this.options,u=l.location,f=l.distance,v=l.threshold,p=l.findAllMatches,d=l.minMatchCharLength;return i(e,this.pattern,this.patternAlphabet,{location:u,distance:f,threshold:v,findAllMatches:p,minMatchCharLength:d,includeMatches:n})}}])&&n(t.prototype,r),s&&n(t,s),e}();e.exports=s},function(e,t){var r=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;e.exports=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:/ +/g,o=new RegExp(t.replace(r,"\\$&").replace(n,"|")),i=e.match(o),a=!!i,s=[];if(a)for(var c=0,h=i.length;c<h;c+=1){var l=i[c];s.push([e.indexOf(l),l.length-1])}return{score:a?.5:1,isMatch:a,matchedIndices:s}}},function(e,t,r){var n=r(4),o=r(5);e.exports=function(e,t,r,i){for(var a=i.location,s=void 0===a?0:a,c=i.distance,h=void 0===c?100:c,l=i.threshold,u=void 0===l?.6:l,f=i.findAllMatches,v=void 0!==f&&f,p=i.minMatchCharLength,d=void 0===p?1:p,g=i.includeMatches,y=void 0!==g&&g,m=s,k=e.length,b=u,S=e.indexOf(t,m),x=t.length,M=[],_=0;_<k;_+=1)M[_]=0;if(-1!==S){var w=n(t,{errors:0,currentLocation:S,expectedLocation:m,distance:h});if(b=Math.min(w,b),-1!==(S=e.lastIndexOf(t,m+x))){var L=n(t,{errors:0,currentLocation:S,expectedLocation:m,distance:h});b=Math.min(L,b)}}S=-1;for(var A=[],O=1,C=x+k,j=1<<(x<=31?x-1:30),P=0;P<x;P+=1){for(var I=0,F=C;I<F;){n(t,{errors:P,currentLocation:m+F,expectedLocation:m,distance:h})<=b?I=F:C=F,F=Math.floor((C-I)/2+I)}C=F;var T=Math.max(1,m-F+1),N=v?k:Math.min(m+F,k)+x,z=Array(N+2);z[N+1]=(1<<P)-1;for(var E=N;E>=T;E-=1){var W=E-1,K=r[e.charAt(W)];if(K&&(M[W]=1),z[E]=(z[E+1]<<1|1)&K,0!==P&&(z[E]|=(A[E+1]|A[E])<<1|1|A[E+1]),z[E]&j&&(O=n(t,{errors:P,currentLocation:W,expectedLocation:m,distance:h}))<=b){if(b=O,(S=W)<=m)break;T=Math.max(1,2*m-S)}}if(n(t,{errors:P+1,currentLocation:m,expectedLocation:m,distance:h})>b)break;A=z}var $={isMatch:S>=0,score:0===O?.001:O};return y&&($.matchedIndices=o(M,d)),$}},function(e,t){e.exports=function(e,t){var r=t.errors,n=void 0===r?0:r,o=t.currentLocation,i=void 0===o?0:o,a=t.expectedLocation,s=void 0===a?0:a,c=t.distance,h=void 0===c?100:c,l=n/e.length,u=Math.abs(s-i);return h?l+u/h:u?1:l}},function(e,t){e.exports=function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=[],n=-1,o=-1,i=0,a=e.length;i<a;i+=1){var s=e[i];s&&-1===n?n=i:s||-1===n||((o=i-1)-n+1>=t&&r.push([n,o]),n=-1)}return e[i-1]&&i-n>=t&&r.push([n,i-1]),r}},function(e,t){e.exports=function(e){for(var t={},r=e.length,n=0;n<r;n+=1)t[e.charAt(n)]=0;for(var o=0;o<r;o+=1)t[e.charAt(o)]|=1<<r-o-1;return t}},function(e,t){var r=function(e){return Array.isArray?Array.isArray(e):"[object Array]"===Object.prototype.toString.call(e)},n=function(e){return null==e?"":function(e){if("string"==typeof e)return e;var t=e+"";return"0"==t&&1/e==-1/0?"-0":t}(e)},o=function(e){return"string"==typeof e},i=function(e){return"number"==typeof e};e.exports={get:function(e,t){var a=[];return function e(t,s){if(s){var c=s.indexOf("."),h=s,l=null;-1!==c&&(h=s.slice(0,c),l=s.slice(c+1));var u=t[h];if(null!=u)if(l||!o(u)&&!i(u))if(r(u))for(var f=0,v=u.length;f<v;f+=1)e(u[f],l);else l&&e(u,l);else a.push(n(u))}else a.push(t)}(e,t),a},isArray:r,isString:o,isNum:i,toString:n}}])});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/fuse.js/dist/fuse.js
var dist_fuse = __webpack_require__(1);
var fuse_default = /*#__PURE__*/__webpack_require__.n(dist_fuse);

// EXTERNAL MODULE: ./node_modules/deepmerge/dist/cjs.js
var cjs = __webpack_require__(0);
var cjs_default = /*#__PURE__*/__webpack_require__.n(cjs);

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js


function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}
// CONCATENATED MODULE: ./node_modules/redux/es/redux.js


/**
 * Adapted from React: https://github.com/facebook/react/blob/master/packages/shared/formatProdErrorMessage.js
 *
 * Do not require this module directly! Use normal throw error calls. These messages will be replaced with error codes
 * during build.
 * @param {number} code
 */
function formatProdErrorMessage(code) {
  return "Minified Redux error #" + code + "; visit https://redux.js.org/Errors?code=" + code + " for the full message or " + 'use the non-minified dev environment for full errors. ';
}

// Inlined version of the `symbol-observable` polyfill
var $$observable = (function () {
  return typeof Symbol === 'function' && Symbol.observable || '@@observable';
})();

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

// Inlined / shortened version of `kindOf` from https://github.com/jonschlinkert/kind-of
function miniKindOf(val) {
  if (val === void 0) return 'undefined';
  if (val === null) return 'null';
  var type = typeof val;

  switch (type) {
    case 'boolean':
    case 'string':
    case 'number':
    case 'symbol':
    case 'function':
      {
        return type;
      }
  }

  if (Array.isArray(val)) return 'array';
  if (isDate(val)) return 'date';
  if (isError(val)) return 'error';
  var constructorName = ctorName(val);

  switch (constructorName) {
    case 'Symbol':
    case 'Promise':
    case 'WeakMap':
    case 'WeakSet':
    case 'Map':
    case 'Set':
      return constructorName;
  } // other


  return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
}

function ctorName(val) {
  return typeof val.constructor === 'function' ? val.constructor.name : null;
}

function isError(val) {
  return val instanceof Error || typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number';
}

function isDate(val) {
  if (val instanceof Date) return true;
  return typeof val.toDateString === 'function' && typeof val.getDate === 'function' && typeof val.setDate === 'function';
}

function kindOf(val) {
  var typeOfVal = typeof val;

  if (false) {}

  return typeOfVal;
}

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

function redux_createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error( true ? formatProdErrorMessage(0) : undefined);
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error( true ? formatProdErrorMessage(1) : undefined);
    }

    return enhancer(redux_createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error( true ? formatProdErrorMessage(2) : undefined);
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;
  /**
   * This makes a shallow copy of currentListeners so we can use
   * nextListeners as a temporary list while dispatching.
   *
   * This prevents any bugs around consumers calling
   * subscribe/unsubscribe in the middle of a dispatch.
   */

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */


  function getState() {
    if (isDispatching) {
      throw new Error( true ? formatProdErrorMessage(3) : undefined);
    }

    return currentState;
  }
  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */


  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error( true ? formatProdErrorMessage(4) : undefined);
    }

    if (isDispatching) {
      throw new Error( true ? formatProdErrorMessage(5) : undefined);
    }

    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error( true ? formatProdErrorMessage(6) : undefined);
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */


  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error( true ? formatProdErrorMessage(7) : undefined);
    }

    if (typeof action.type === 'undefined') {
      throw new Error( true ? formatProdErrorMessage(8) : undefined);
    }

    if (isDispatching) {
      throw new Error( true ? formatProdErrorMessage(9) : undefined);
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }
  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */


  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error( true ? formatProdErrorMessage(10) : undefined);
    }

    currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
    // Any reducers that existed in both the new and old rootReducer
    // will receive the previous state. This effectively populates
    // the new state tree with any relevant data from the old one.

    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */


  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new Error( true ? formatProdErrorMessage(11) : undefined);
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _ref[$$observable] = function () {
      return this;
    }, _ref;
  } // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.


  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[$$observable] = observable, _ref2;
}

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */


  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
  } catch (e) {} // eslint-disable-line no-empty

}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!isPlainObject(inputState)) {
    return "The " + argumentName + " has unexpected type of \"" + kindOf(inputState) + "\". Expected argument to be an object with the following " + ("keys: \"" + reducerKeys.join('", "') + "\"");
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });
  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });
  if (action && action.type === ActionTypes.REPLACE) return;

  if (unexpectedKeys.length > 0) {
    return "Unexpected " + (unexpectedKeys.length > 1 ? 'keys' : 'key') + " " + ("\"" + unexpectedKeys.join('", "') + "\" found in " + argumentName + ". ") + "Expected to find one of the known reducer keys instead: " + ("\"" + reducerKeys.join('", "') + "\". Unexpected keys will be ignored.");
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, {
      type: ActionTypes.INIT
    });

    if (typeof initialState === 'undefined') {
      throw new Error( true ? formatProdErrorMessage(12) : undefined);
    }

    if (typeof reducer(undefined, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === 'undefined') {
      throw new Error( true ? formatProdErrorMessage(13) : undefined);
    }
  });
}
/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */


function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};

  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (false) {}

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  var finalReducerKeys = Object.keys(finalReducers); // This is used to make sure we don't warn about the same
  // keys multiple times.

  var unexpectedKeyCache;

  if (false) {}

  var shapeAssertionError;

  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if (false) { var warningMessage; }

    var hasChanged = false;
    var nextState = {};

    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);

      if (typeof nextStateForKey === 'undefined') {
        var actionType = action && action.type;
        throw new Error( true ? formatProdErrorMessage(14) : undefined);
      }

      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}

function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(this, arguments));
  };
}
/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass an action creator as the first argument,
 * and get a dispatch wrapped function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */


function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error( true ? formatProdErrorMessage(16) : undefined);
  }

  var boundActionCreators = {};

  for (var key in actionCreators) {
    var actionCreator = actionCreators[key];

    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }

  return boundActionCreators;
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function () {
      var store = createStore.apply(void 0, arguments);

      var _dispatch = function dispatch() {
        throw new Error( true ? formatProdErrorMessage(15) : undefined);
      };

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread2(_objectSpread2({}, store), {}, {
        dispatch: _dispatch
      });
    };
  };
}

/*
 * This is a dummy function to check if the function name has been altered by minification.
 * If the function has been minified and NODE_ENV !== 'production', warn the user.
 */

function isCrushed() {}

if (false) {}



// CONCATENATED MODULE: ./src/scripts/reducers/items.js
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var defaultState = [];
function items_items() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'ADD_ITEM':
      {
        // Add object to items array
        var newState = [].concat(_toConsumableArray(state), [{
          id: action.id,
          choiceId: action.choiceId,
          groupId: action.groupId,
          value: action.value,
          label: action.label,
          active: true,
          highlighted: false,
          customProperties: action.customProperties,
          placeholder: action.placeholder || false,
          keyCode: null
        }]);
        return newState.map(function (obj) {
          var item = obj;
          item.highlighted = false;
          return item;
        });
      }

    case 'REMOVE_ITEM':
      {
        // Set item to inactive
        return state.map(function (obj) {
          var item = obj;

          if (item.id === action.id) {
            item.active = false;
          }

          return item;
        });
      }

    case 'HIGHLIGHT_ITEM':
      {
        return state.map(function (obj) {
          var item = obj;

          if (item.id === action.id) {
            item.highlighted = action.highlighted;
          }

          return item;
        });
      }

    default:
      {
        return state;
      }
  }
}
// CONCATENATED MODULE: ./src/scripts/reducers/groups.js
function groups_toConsumableArray(arr) { return groups_arrayWithoutHoles(arr) || groups_iterableToArray(arr) || groups_unsupportedIterableToArray(arr) || groups_nonIterableSpread(); }

function groups_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function groups_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return groups_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return groups_arrayLikeToArray(o, minLen); }

function groups_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function groups_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return groups_arrayLikeToArray(arr); }

function groups_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var groups_defaultState = [];
function groups() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : groups_defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'ADD_GROUP':
      {
        return [].concat(groups_toConsumableArray(state), [{
          id: action.id,
          value: action.value,
          active: action.active,
          disabled: action.disabled
        }]);
      }

    case 'CLEAR_CHOICES':
      {
        return [];
      }

    default:
      {
        return state;
      }
  }
}
// CONCATENATED MODULE: ./src/scripts/reducers/choices.js
function choices_toConsumableArray(arr) { return choices_arrayWithoutHoles(arr) || choices_iterableToArray(arr) || choices_unsupportedIterableToArray(arr) || choices_nonIterableSpread(); }

function choices_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function choices_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return choices_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return choices_arrayLikeToArray(o, minLen); }

function choices_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function choices_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return choices_arrayLikeToArray(arr); }

function choices_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var choices_defaultState = [];
function choices_choices() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : choices_defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'ADD_CHOICE':
      {
        /*
            A disabled choice appears in the choice dropdown but cannot be selected
            A selected choice has been added to the passed input's value (added as an item)
            An active choice appears within the choice dropdown
         */
        return [].concat(choices_toConsumableArray(state), [{
          id: action.id,
          elementId: action.elementId,
          groupId: action.groupId,
          value: action.value,
          label: action.label || action.value,
          disabled: action.disabled || false,
          selected: false,
          active: true,
          score: 9999,
          customProperties: action.customProperties,
          placeholder: action.placeholder || false,
          keyCode: null
        }]);
      }

    case 'ADD_ITEM':
      {
        // If all choices need to be activated
        if (action.activateOptions) {
          return state.map(function (obj) {
            var choice = obj;
            choice.active = action.active;
            return choice;
          });
        } // When an item is added and it has an associated choice,
        // we want to disable it so it can't be chosen again


        if (action.choiceId > -1) {
          return state.map(function (obj) {
            var choice = obj;

            if (choice.id === parseInt(action.choiceId, 10)) {
              choice.selected = true;
            }

            return choice;
          });
        }

        return state;
      }

    case 'REMOVE_ITEM':
      {
        // When an item is removed and it has an associated choice,
        // we want to re-enable it so it can be chosen again
        if (action.choiceId > -1) {
          return state.map(function (obj) {
            var choice = obj;

            if (choice.id === parseInt(action.choiceId, 10)) {
              choice.selected = false;
            }

            return choice;
          });
        }

        return state;
      }

    case 'FILTER_CHOICES':
      {
        return state.map(function (obj) {
          var choice = obj; // Set active state based on whether choice is
          // within filtered results

          choice.active = action.results.some(function (_ref) {
            var item = _ref.item,
                score = _ref.score;

            if (item.id === choice.id) {
              choice.score = score;
              return true;
            }

            return false;
          });
          return choice;
        });
      }

    case 'ACTIVATE_CHOICES':
      {
        return state.map(function (obj) {
          var choice = obj;
          choice.active = action.active;
          return choice;
        });
      }

    case 'CLEAR_CHOICES':
      {
        return choices_defaultState;
      }

    default:
      {
        return state;
      }
  }
}
// CONCATENATED MODULE: ./src/scripts/reducers/general.js
var general_defaultState = {
  loading: false
};

var general = function general() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : general_defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'SET_IS_LOADING':
      {
        return {
          loading: action.isLoading
        };
      }

    default:
      {
        return state;
      }
  }
};

/* harmony default export */ var reducers_general = (general);
// CONCATENATED MODULE: ./src/scripts/lib/utils.js
/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
var getRandomNumber = function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};
/**
 * @param {number} length
 * @returns {string}
 */

var generateChars = function generateChars(length) {
  return Array.from({
    length: length
  }, function () {
    return getRandomNumber(0, 36).toString(36);
  }).join('');
};
/**
 * @param {HTMLInputElement | HTMLSelectElement} element
 * @param {string} prefix
 * @returns {string}
 */

var generateId = function generateId(element, prefix) {
  var id = element.id || element.name && "".concat(element.name, "-").concat(generateChars(2)) || generateChars(4);
  id = id.replace(/(:|\.|\[|\]|,)/g, '');
  id = "".concat(prefix, "-").concat(id);
  return id;
};
/**
 * @param {any} obj
 * @returns {string}
 */

var getType = function getType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
};
/**
 * @param {string} type
 * @param {any} obj
 * @returns {boolean}
 */

var isType = function isType(type, obj) {
  return obj !== undefined && obj !== null && getType(obj) === type;
};
/**
 * @param {HTMLElement} element
 * @param {HTMLElement} [wrapper={HTMLDivElement}]
 * @returns {HTMLElement}
 */

var utils_wrap = function wrap(element) {
  var wrapper = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.createElement('div');

  if (element.nextSibling) {
    element.parentNode.insertBefore(wrapper, element.nextSibling);
  } else {
    element.parentNode.appendChild(wrapper);
  }

  return wrapper.appendChild(element);
};
/**
 * @param {Element} startEl
 * @param {string} selector
 * @param {1 | -1} direction
 * @returns {Element | undefined}
 */

var getAdjacentEl = function getAdjacentEl(startEl, selector) {
  var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  if (!(startEl instanceof Element) || typeof selector !== 'string') {
    return undefined;
  }

  var prop = "".concat(direction > 0 ? 'next' : 'previous', "ElementSibling");
  var sibling = startEl[prop];

  while (sibling) {
    if (sibling.matches(selector)) {
      return sibling;
    }

    sibling = sibling[prop];
  }

  return sibling;
};
/**
 * @param {Element} element
 * @param {Element} parent
 * @param {-1 | 1} direction
 * @returns {boolean}
 */

var isScrolledIntoView = function isScrolledIntoView(element, parent) {
  var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  if (!element) {
    return false;
  }

  var isVisible;

  if (direction > 0) {
    // In view from bottom
    isVisible = parent.scrollTop + parent.offsetHeight >= element.offsetTop + element.offsetHeight;
  } else {
    // In view from top
    isVisible = element.offsetTop >= parent.scrollTop;
  }

  return isVisible;
};
/**
 * @param {any} value
 * @returns {any}
 */

var sanitise = function sanitise(value) {
  if (typeof value !== 'string') {
    return value;
  }

  return value.replace(/&/g, '&amp;').replace(/>/g, '&rt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
};
/**
 * @returns {() => (str: string) => Element}
 */

var strToEl = function () {
  var tmpEl = document.createElement('div');
  return function (str) {
    var cleanedInput = str.trim();
    tmpEl.innerHTML = cleanedInput;
    var firldChild = tmpEl.children[0];

    while (tmpEl.firstChild) {
      tmpEl.removeChild(tmpEl.firstChild);
    }

    return firldChild;
  };
}();
/**
 * @param {{ label?: string, value: string }} a
 * @param {{ label?: string, value: string }} b
 * @returns {number}
 */

var sortByAlpha = function sortByAlpha(_ref, _ref2) {
  var value = _ref.value,
      _ref$label = _ref.label,
      label = _ref$label === void 0 ? value : _ref$label;
  var value2 = _ref2.value,
      _ref2$label = _ref2.label,
      label2 = _ref2$label === void 0 ? value2 : _ref2$label;
  return label.localeCompare(label2, [], {
    sensitivity: 'base',
    ignorePunctuation: true,
    numeric: true
  });
};
/**
 * @param {{ score: number }} a
 * @param {{ score: number }} b
 */

var sortByScore = function sortByScore(a, b) {
  return a.score - b.score;
};
/**
 * @param {HTMLElement} element
 * @param {string} type
 * @param {object} customArgs
 */

var dispatchEvent = function dispatchEvent(element, type) {
  var customArgs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var event = new CustomEvent(type, {
    detail: customArgs,
    bubbles: true,
    cancelable: true
  });
  return element.dispatchEvent(event);
};
/**
 * @param {array} array
 * @param {any} value
 * @param {string} [key="value"]
 * @returns {boolean}
 */

var existsInArray = function existsInArray(array, value) {
  var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'value';
  return array.some(function (item) {
    if (typeof value === 'string') {
      return item[key] === value.trim();
    }

    return item[key] === value;
  });
};
/**
 * @param {any} obj
 * @returns {any}
 */

var cloneObject = function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
};
/**
 * Returns an array of keys present on the first but missing on the second object
 * @param {object} a
 * @param {object} b
 * @returns {string[]}
 */

var diff = function diff(a, b) {
  var aKeys = Object.keys(a).sort();
  var bKeys = Object.keys(b).sort();
  return aKeys.filter(function (i) {
    return bKeys.indexOf(i) < 0;
  });
};
// CONCATENATED MODULE: ./src/scripts/reducers/index.js






var appReducer = combineReducers({
  items: items_items,
  groups: groups,
  choices: choices_choices,
  general: reducers_general
});

var reducers_rootReducer = function rootReducer(passedState, action) {
  var state = passedState; // If we are clearing all items, groups and options we reassign
  // state and then pass that state to our proper reducer. This isn't
  // mutating our actual state
  // See: http://stackoverflow.com/a/35641992

  if (action.type === 'CLEAR_ALL') {
    state = undefined;
  } else if (action.type === 'RESET_TO') {
    return cloneObject(action.state);
  }

  return appReducer(state, action);
};

/* harmony default export */ var reducers = (reducers_rootReducer);
// CONCATENATED MODULE: ./src/scripts/store/store.js
function store_toConsumableArray(arr) { return store_arrayWithoutHoles(arr) || store_iterableToArray(arr) || store_unsupportedIterableToArray(arr) || store_nonIterableSpread(); }

function store_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function store_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return store_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return store_arrayLikeToArray(o, minLen); }

function store_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function store_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return store_arrayLikeToArray(arr); }

function store_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



/**
 * @typedef {import('../../../types/index').Choices.Choice} Choice
 * @typedef {import('../../../types/index').Choices.Group} Group
 * @typedef {import('../../../types/index').Choices.Item} Item
 */

var store_Store = /*#__PURE__*/function () {
  function Store() {
    _classCallCheck(this, Store);

    this._store = redux_createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
  }
  /**
   * Subscribe store to function call (wrapped Redux method)
   * @param  {Function} onChange Function to trigger when state changes
   * @return
   */


  _createClass(Store, [{
    key: "subscribe",
    value: function subscribe(onChange) {
      this._store.subscribe(onChange);
    }
    /**
     * Dispatch event to store (wrapped Redux method)
     * @param  {{ type: string, [x: string]: any }} action Action to trigger
     * @return
     */

  }, {
    key: "dispatch",
    value: function dispatch(action) {
      this._store.dispatch(action);
    }
    /**
     * Get store object (wrapping Redux method)
     * @returns {object} State
     */

  }, {
    key: "state",
    get: function get() {
      return this._store.getState();
    }
    /**
     * Get items from store
     * @returns {Item[]} Item objects
     */

  }, {
    key: "items",
    get: function get() {
      return this.state.items;
    }
    /**
     * Get active items from store
     * @returns {Item[]} Item objects
     */

  }, {
    key: "activeItems",
    get: function get() {
      return this.items.filter(function (item) {
        return item.active === true;
      });
    }
    /**
     * Get highlighted items from store
     * @returns {Item[]} Item objects
     */

  }, {
    key: "highlightedActiveItems",
    get: function get() {
      return this.items.filter(function (item) {
        return item.active && item.highlighted;
      });
    }
    /**
     * Get choices from store
     * @returns {Choice[]} Option objects
     */

  }, {
    key: "choices",
    get: function get() {
      return this.state.choices;
    }
    /**
     * Get active choices from store
     * @returns {Choice[]} Option objects
     */

  }, {
    key: "activeChoices",
    get: function get() {
      return this.choices.filter(function (choice) {
        return choice.active === true;
      });
    }
    /**
     * Get selectable choices from store
     * @returns {Choice[]} Option objects
     */

  }, {
    key: "selectableChoices",
    get: function get() {
      return this.choices.filter(function (choice) {
        return choice.disabled !== true;
      });
    }
    /**
     * Get choices that can be searched (excluding placeholders)
     * @returns {Choice[]} Option objects
     */

  }, {
    key: "searchableChoices",
    get: function get() {
      return this.selectableChoices.filter(function (choice) {
        return choice.placeholder !== true;
      });
    }
    /**
     * Get placeholder choice from store
     * @returns {Choice | undefined} Found placeholder
     */

  }, {
    key: "placeholderChoice",
    get: function get() {
      return store_toConsumableArray(this.choices).reverse().find(function (choice) {
        return choice.placeholder === true;
      });
    }
    /**
     * Get groups from store
     * @returns {Group[]} Group objects
     */

  }, {
    key: "groups",
    get: function get() {
      return this.state.groups;
    }
    /**
     * Get active groups from store
     * @returns {Group[]} Group objects
     */

  }, {
    key: "activeGroups",
    get: function get() {
      var groups = this.groups,
          choices = this.choices;
      return groups.filter(function (group) {
        var isActive = group.active === true && group.disabled === false;
        var hasActiveOptions = choices.some(function (choice) {
          return choice.active === true && choice.disabled === false;
        });
        return isActive && hasActiveOptions;
      }, []);
    }
    /**
     * Get loading state from store
     * @returns {boolean} Loading State
     */

  }, {
    key: "isLoading",
    value: function isLoading() {
      return this.state.general.loading;
    }
    /**
     * Get single choice by it's ID
     * @param {string} id
     * @returns {Choice | undefined} Found choice
     */

  }, {
    key: "getChoiceById",
    value: function getChoiceById(id) {
      return this.activeChoices.find(function (choice) {
        return choice.id === parseInt(id, 10);
      });
    }
    /**
     * Get group by group id
     * @param  {number} id Group ID
     * @returns {Group | undefined} Group data
     */

  }, {
    key: "getGroupById",
    value: function getGroupById(id) {
      return this.groups.find(function (group) {
        return group.id === id;
      });
    }
  }]);

  return Store;
}();


// CONCATENATED MODULE: ./src/scripts/components/dropdown.js
function dropdown_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function dropdown_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function dropdown_createClass(Constructor, protoProps, staticProps) { if (protoProps) dropdown_defineProperties(Constructor.prototype, protoProps); if (staticProps) dropdown_defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @typedef {import('../../../types/index').Choices.passedElement} passedElement
 * @typedef {import('../../../types/index').Choices.ClassNames} ClassNames
 */
var Dropdown = /*#__PURE__*/function () {
  /**
   * @param {{
   *  element: HTMLElement,
   *  type: passedElement['type'],
   *  classNames: ClassNames,
   * }} args
   */
  function Dropdown(_ref) {
    var element = _ref.element,
        type = _ref.type,
        classNames = _ref.classNames;

    dropdown_classCallCheck(this, Dropdown);

    this.element = element;
    this.classNames = classNames;
    this.type = type;
    this.isActive = false;
  }
  /**
   * Bottom position of dropdown in viewport coordinates
   * @returns {number} Vertical position
   */


  dropdown_createClass(Dropdown, [{
    key: "distanceFromTopWindow",
    get: function get() {
      return this.element.getBoundingClientRect().bottom;
    }
    /**
     * Find element that matches passed selector
     * @param {string} selector
     * @returns {HTMLElement | null}
     */

  }, {
    key: "getChild",
    value: function getChild(selector) {
      return this.element.querySelector(selector);
    }
    /**
     * Show dropdown to user by adding active state class
     * @returns {this}
     */

  }, {
    key: "show",
    value: function show() {
      this.element.classList.add(this.classNames.activeState);
      this.element.setAttribute('aria-expanded', 'true');
      this.isActive = true;
      return this;
    }
    /**
     * Hide dropdown from user
     * @returns {this}
     */

  }, {
    key: "hide",
    value: function hide() {
      this.element.classList.remove(this.classNames.activeState);
      this.element.setAttribute('aria-expanded', 'false');
      this.isActive = false;
      return this;
    }
  }]);

  return Dropdown;
}();


// CONCATENATED MODULE: ./src/scripts/constants.js

/**
 * @typedef {import('../../types/index').Choices.ClassNames} ClassNames
 * @typedef {import('../../types/index').Choices.Options} Options
 */

/** @type {ClassNames} */

var DEFAULT_CLASSNAMES = {
  containerOuter: 'choices',
  containerInner: 'choices__inner',
  input: 'choices__input',
  inputCloned: 'choices__input--cloned',
  list: 'choices__list',
  listItems: 'choices__list--multiple',
  listSingle: 'choices__list--single',
  listDropdown: 'choices__list--dropdown',
  item: 'choices__item',
  itemSelectable: 'choices__item--selectable',
  itemDisabled: 'choices__item--disabled',
  itemChoice: 'choices__item--choice',
  placeholder: 'choices__placeholder',
  group: 'choices__group',
  groupHeading: 'choices__heading',
  button: 'choices__button',
  activeState: 'is-active',
  focusState: 'is-focused',
  openState: 'is-open',
  disabledState: 'is-disabled',
  highlightedState: 'is-highlighted',
  selectedState: 'is-selected',
  flippedState: 'is-flipped',
  loadingState: 'is-loading',
  noResults: 'has-no-results',
  noChoices: 'has-no-choices'
};
/** @type {Options} */

var DEFAULT_CONFIG = {
  items: [],
  choices: [],
  silent: false,
  renderChoiceLimit: -1,
  maxItemCount: -1,
  addItems: true,
  addItemFilter: null,
  removeItems: true,
  removeItemButton: false,
  editItems: false,
  duplicateItemsAllowed: true,
  delimiter: ',',
  paste: true,
  searchEnabled: true,
  searchChoices: true,
  searchFloor: 1,
  searchResultLimit: 4,
  searchFields: ['label', 'value'],
  position: 'auto',
  resetScrollPosition: true,
  shouldSort: true,
  shouldSortItems: false,
  sorter: sortByAlpha,
  placeholder: true,
  placeholderValue: null,
  searchPlaceholderValue: null,
  prependValue: null,
  appendValue: null,
  renderSelectedChoices: 'auto',
  loadingText: 'Loading...',
  noResultsText: 'No results found',
  noChoicesText: 'No choices to choose from',
  itemSelectText: 'Press to select',
  uniqueItemText: 'Only unique values can be added',
  customAddItemText: 'Only values matching specific conditions can be added',
  addItemText: function addItemText(value) {
    return "Press Enter to add <b>\"".concat(sanitise(value), "\"</b>");
  },
  maxItemText: function maxItemText(maxItemCount) {
    return "Only ".concat(maxItemCount, " values can be added");
  },
  valueComparer: function valueComparer(value1, value2) {
    return value1 === value2;
  },
  fuseOptions: {
    includeScore: true
  },
  callbackOnInit: null,
  callbackOnCreateTemplates: null,
  classNames: DEFAULT_CLASSNAMES
};
var EVENTS = {
  showDropdown: 'showDropdown',
  hideDropdown: 'hideDropdown',
  change: 'change',
  choice: 'choice',
  search: 'search',
  addItem: 'addItem',
  removeItem: 'removeItem',
  highlightItem: 'highlightItem',
  highlightChoice: 'highlightChoice'
};
var ACTION_TYPES = {
  ADD_CHOICE: 'ADD_CHOICE',
  FILTER_CHOICES: 'FILTER_CHOICES',
  ACTIVATE_CHOICES: 'ACTIVATE_CHOICES',
  CLEAR_CHOICES: 'CLEAR_CHOICES',
  ADD_GROUP: 'ADD_GROUP',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  HIGHLIGHT_ITEM: 'HIGHLIGHT_ITEM',
  CLEAR_ALL: 'CLEAR_ALL'
};
var KEY_CODES = {
  BACK_KEY: 46,
  DELETE_KEY: 8,
  ENTER_KEY: 13,
  A_KEY: 65,
  ESC_KEY: 27,
  UP_KEY: 38,
  DOWN_KEY: 40,
  PAGE_UP_KEY: 33,
  PAGE_DOWN_KEY: 34
};
var TEXT_TYPE = 'text';
var SELECT_ONE_TYPE = 'select-one';
var SELECT_MULTIPLE_TYPE = 'select-multiple';
var SCROLLING_SPEED = 4;
// CONCATENATED MODULE: ./src/scripts/components/container.js
function container_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function container_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function container_createClass(Constructor, protoProps, staticProps) { if (protoProps) container_defineProperties(Constructor.prototype, protoProps); if (staticProps) container_defineProperties(Constructor, staticProps); return Constructor; }



/**
 * @typedef {import('../../../types/index').Choices.passedElement} passedElement
 * @typedef {import('../../../types/index').Choices.ClassNames} ClassNames
 */

var container_Container = /*#__PURE__*/function () {
  /**
   * @param {{
   *  element: HTMLElement,
   *  type: passedElement['type'],
   *  classNames: ClassNames,
   *  position
   * }} args
   */
  function Container(_ref) {
    var element = _ref.element,
        type = _ref.type,
        classNames = _ref.classNames,
        position = _ref.position;

    container_classCallCheck(this, Container);

    this.element = element;
    this.classNames = classNames;
    this.type = type;
    this.position = position;
    this.isOpen = false;
    this.isFlipped = false;
    this.isFocussed = false;
    this.isDisabled = false;
    this.isLoading = false;
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  container_createClass(Container, [{
    key: "addEventListeners",
    value: function addEventListeners() {
      this.element.addEventListener('focus', this._onFocus);
      this.element.addEventListener('blur', this._onBlur);
    }
  }, {
    key: "removeEventListeners",
    value: function removeEventListeners() {
      this.element.removeEventListener('focus', this._onFocus);
      this.element.removeEventListener('blur', this._onBlur);
    }
    /**
     * Determine whether container should be flipped based on passed
     * dropdown position
     * @param {number} dropdownPos
     * @returns {boolean}
     */
    // prettier-ignore

    /* eslint-disable */

  }, {
    key: "shouldFlip",
    value: function shouldFlip(dropdownPos) {
      if (typeof dropdownPos !== 'number') {
        return false;
      }

      return false;
      /*
      // If flip is enabled and the dropdown bottom position is
      // greater than the window height flip the dropdown.
      let shouldFlip = false;
      if (this.position === 'auto') {
        shouldFlip = !window.matchMedia(`(min-height: ${dropdownPos + 1}px)`)
          .matches;
      } else if (this.position === 'top') {
        shouldFlip = true;
      }
       return shouldFlip;
      */
    }
    /* eslint-enable */

    /**
     * @param {string} activeDescendantID
     */

  }, {
    key: "setActiveDescendant",
    value: function setActiveDescendant(activeDescendantID) {
      this.element.setAttribute('aria-activedescendant', activeDescendantID);
    }
  }, {
    key: "removeActiveDescendant",
    value: function removeActiveDescendant() {
      this.element.removeAttribute('aria-activedescendant');
    }
    /**
     * @param {number} dropdownPos
     */

  }, {
    key: "open",
    value: function open(dropdownPos) {
      this.element.classList.add(this.classNames.openState);
      this.element.setAttribute('aria-expanded', 'true');
      this.isOpen = true;

      if (this.shouldFlip(dropdownPos)) {
        this.element.classList.add(this.classNames.flippedState);
        this.isFlipped = true;
      }
    }
  }, {
    key: "close",
    value: function close() {
      this.element.classList.remove(this.classNames.openState);
      this.element.setAttribute('aria-expanded', 'false');
      this.removeActiveDescendant();
      this.isOpen = false; // A dropdown flips if it does not have space within the page

      if (this.isFlipped) {
        this.element.classList.remove(this.classNames.flippedState);
        this.isFlipped = false;
      }
    }
  }, {
    key: "focus",
    value: function focus() {
      if (!this.isFocussed) {
        this.element.focus();
      }
    }
  }, {
    key: "addFocusState",
    value: function addFocusState() {
      this.element.classList.add(this.classNames.focusState);
    }
  }, {
    key: "removeFocusState",
    value: function removeFocusState() {
      this.element.classList.remove(this.classNames.focusState);
    }
  }, {
    key: "enable",
    value: function enable() {
      this.element.classList.remove(this.classNames.disabledState);
      this.element.removeAttribute('aria-disabled');

      if (this.type === SELECT_ONE_TYPE) {
        this.element.setAttribute('tabindex', '0');
      }

      this.isDisabled = false;
    }
  }, {
    key: "disable",
    value: function disable() {
      this.element.classList.add(this.classNames.disabledState);
      this.element.setAttribute('aria-disabled', 'true');

      if (this.type === SELECT_ONE_TYPE) {
        this.element.setAttribute('tabindex', '-1');
      }

      this.isDisabled = true;
    }
    /**
     * @param {HTMLElement} element
     */

  }, {
    key: "wrap",
    value: function wrap(element) {
      utils_wrap(element, this.element);
    }
    /**
     * @param {Element} element
     */

  }, {
    key: "unwrap",
    value: function unwrap(element) {
      // Move passed element outside this element
      this.element.parentNode.insertBefore(element, this.element); // Remove this element

      this.element.parentNode.removeChild(this.element);
    }
  }, {
    key: "addLoadingState",
    value: function addLoadingState() {
      this.element.classList.add(this.classNames.loadingState);
      this.element.setAttribute('aria-busy', 'true');
      this.isLoading = true;
    }
  }, {
    key: "removeLoadingState",
    value: function removeLoadingState() {
      this.element.classList.remove(this.classNames.loadingState);
      this.element.removeAttribute('aria-busy');
      this.isLoading = false;
    }
  }, {
    key: "_onFocus",
    value: function _onFocus() {
      this.isFocussed = true;
    }
  }, {
    key: "_onBlur",
    value: function _onBlur() {
      this.isFocussed = false;
    }
  }]);

  return Container;
}();


// CONCATENATED MODULE: ./src/scripts/components/input.js
function input_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function input_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function input_createClass(Constructor, protoProps, staticProps) { if (protoProps) input_defineProperties(Constructor.prototype, protoProps); if (staticProps) input_defineProperties(Constructor, staticProps); return Constructor; }



/**
 * @typedef {import('../../../types/index').Choices.passedElement} passedElement
 * @typedef {import('../../../types/index').Choices.ClassNames} ClassNames
 */

var input_Input = /*#__PURE__*/function () {
  /**
   * @param {{
   *  element: HTMLInputElement,
   *  type: passedElement['type'],
   *  classNames: ClassNames,
   *  preventPaste: boolean
   * }} args
   */
  function Input(_ref) {
    var element = _ref.element,
        type = _ref.type,
        classNames = _ref.classNames,
        preventPaste = _ref.preventPaste;

    input_classCallCheck(this, Input);

    this.element = element;
    this.type = type;
    this.classNames = classNames;
    this.preventPaste = preventPaste;
    this.isFocussed = this.element === document.activeElement;
    this.isDisabled = element.disabled;
    this._onPaste = this._onPaste.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }
  /**
   * @param {string} placeholder
   */


  input_createClass(Input, [{
    key: "placeholder",
    set: function set(placeholder) {
      this.element.placeholder = placeholder;
    }
    /**
     * @returns {string}
     */

  }, {
    key: "value",
    get: function get() {
      return sanitise(this.element.value);
    }
    /**
     * @param {string} value
     */
    ,
    set: function set(value) {
      this.element.value = value;
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      this.element.addEventListener('paste', this._onPaste);
      this.element.addEventListener('input', this._onInput, {
        passive: true
      });
      this.element.addEventListener('focus', this._onFocus, {
        passive: true
      });
      this.element.addEventListener('blur', this._onBlur, {
        passive: true
      });
    }
  }, {
    key: "removeEventListeners",
    value: function removeEventListeners() {
      this.element.removeEventListener('input', this._onInput, {
        passive: true
      });
      this.element.removeEventListener('paste', this._onPaste);
      this.element.removeEventListener('focus', this._onFocus, {
        passive: true
      });
      this.element.removeEventListener('blur', this._onBlur, {
        passive: true
      });
    }
  }, {
    key: "enable",
    value: function enable() {
      this.element.removeAttribute('disabled');
      this.isDisabled = false;
    }
  }, {
    key: "disable",
    value: function disable() {
      this.element.setAttribute('disabled', '');
      this.isDisabled = true;
    }
  }, {
    key: "focus",
    value: function focus() {
      if (!this.isFocussed) {
        this.element.focus();
      }
    }
  }, {
    key: "blur",
    value: function blur() {
      if (this.isFocussed) {
        this.element.blur();
      }
    }
    /**
     * Set value of input to blank
     * @param {boolean} setWidth
     * @returns {this}
     */

  }, {
    key: "clear",
    value: function clear() {
      var setWidth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (this.element.value) {
        this.element.value = '';
      }

      if (setWidth) {
        this.setWidth();
      }

      return this;
    }
    /**
     * Set the correct input width based on placeholder
     * value or input value
     */

  }, {
    key: "setWidth",
    value: function setWidth() {
      // Resize input to contents or placeholder
      var _this$element = this.element,
          style = _this$element.style,
          value = _this$element.value,
          placeholder = _this$element.placeholder;
      style.minWidth = "".concat(placeholder.length + 1, "ch");
      style.width = "".concat(value.length + 1, "ch");
    }
    /**
     * @param {string} activeDescendantID
     */

  }, {
    key: "setActiveDescendant",
    value: function setActiveDescendant(activeDescendantID) {
      this.element.setAttribute('aria-activedescendant', activeDescendantID);
    }
  }, {
    key: "removeActiveDescendant",
    value: function removeActiveDescendant() {
      this.element.removeAttribute('aria-activedescendant');
    }
  }, {
    key: "_onInput",
    value: function _onInput() {
      if (this.type !== SELECT_ONE_TYPE) {
        this.setWidth();
      }
    }
    /**
     * @param {Event} event
     */

  }, {
    key: "_onPaste",
    value: function _onPaste(event) {
      if (this.preventPaste) {
        event.preventDefault();
      }
    }
  }, {
    key: "_onFocus",
    value: function _onFocus() {
      this.isFocussed = true;
    }
  }, {
    key: "_onBlur",
    value: function _onBlur() {
      this.isFocussed = false;
    }
  }]);

  return Input;
}();


// CONCATENATED MODULE: ./src/scripts/components/list.js
function list_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function list_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function list_createClass(Constructor, protoProps, staticProps) { if (protoProps) list_defineProperties(Constructor.prototype, protoProps); if (staticProps) list_defineProperties(Constructor, staticProps); return Constructor; }


/**
 * @typedef {import('../../../types/index').Choices.Choice} Choice
 */

var list_List = /*#__PURE__*/function () {
  /**
   * @param {{ element: HTMLElement }} args
   */
  function List(_ref) {
    var element = _ref.element;

    list_classCallCheck(this, List);

    this.element = element;
    this.scrollPos = this.element.scrollTop;
    this.height = this.element.offsetHeight;
  }

  list_createClass(List, [{
    key: "clear",
    value: function clear() {
      this.element.innerHTML = '';
    }
    /**
     * @param {Element | DocumentFragment} node
     */

  }, {
    key: "append",
    value: function append(node) {
      this.element.appendChild(node);
    }
    /**
     * @param {string} selector
     * @returns {Element | null}
     */

  }, {
    key: "getChild",
    value: function getChild(selector) {
      return this.element.querySelector(selector);
    }
    /**
     * @returns {boolean}
     */

  }, {
    key: "hasChildren",
    value: function hasChildren() {
      return this.element.hasChildNodes();
    }
  }, {
    key: "scrollToTop",
    value: function scrollToTop() {
      this.element.scrollTop = 0;
    }
    /**
     * @param {Element} element
     * @param {1 | -1} direction
     */

  }, {
    key: "scrollToChildElement",
    value: function scrollToChildElement(element, direction) {
      var _this = this;

      if (!element) {
        return;
      }

      var listHeight = this.element.offsetHeight; // Scroll position of dropdown

      var listScrollPosition = this.element.scrollTop + listHeight;
      var elementHeight = element.offsetHeight; // Distance from bottom of element to top of parent

      var elementPos = element.offsetTop + elementHeight; // Difference between the element and scroll position

      var destination = direction > 0 ? this.element.scrollTop + elementPos - listScrollPosition : element.offsetTop;
      requestAnimationFrame(function () {
        _this._animateScroll(destination, direction);
      });
    }
    /**
     * @param {number} scrollPos
     * @param {number} strength
     * @param {number} destination
     */

  }, {
    key: "_scrollDown",
    value: function _scrollDown(scrollPos, strength, destination) {
      var easing = (destination - scrollPos) / strength;
      var distance = easing > 1 ? easing : 1;
      this.element.scrollTop = scrollPos + distance;
    }
    /**
     * @param {number} scrollPos
     * @param {number} strength
     * @param {number} destination
     */

  }, {
    key: "_scrollUp",
    value: function _scrollUp(scrollPos, strength, destination) {
      var easing = (scrollPos - destination) / strength;
      var distance = easing > 1 ? easing : 1;
      this.element.scrollTop = scrollPos - distance;
    }
    /**
     * @param {*} destination
     * @param {*} direction
     */

  }, {
    key: "_animateScroll",
    value: function _animateScroll(destination, direction) {
      var _this2 = this;

      var strength = SCROLLING_SPEED;
      var choiceListScrollTop = this.element.scrollTop;
      var continueAnimation = false;

      if (direction > 0) {
        this._scrollDown(choiceListScrollTop, strength, destination);

        if (choiceListScrollTop < destination) {
          continueAnimation = true;
        }
      } else {
        this._scrollUp(choiceListScrollTop, strength, destination);

        if (choiceListScrollTop > destination) {
          continueAnimation = true;
        }
      }

      if (continueAnimation) {
        requestAnimationFrame(function () {
          _this2._animateScroll(destination, direction);
        });
      }
    }
  }]);

  return List;
}();


// CONCATENATED MODULE: ./src/scripts/components/wrapped-element.js
function wrapped_element_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function wrapped_element_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function wrapped_element_createClass(Constructor, protoProps, staticProps) { if (protoProps) wrapped_element_defineProperties(Constructor.prototype, protoProps); if (staticProps) wrapped_element_defineProperties(Constructor, staticProps); return Constructor; }


/**
 * @typedef {import('../../../types/index').Choices.passedElement} passedElement
 * @typedef {import('../../../types/index').Choices.ClassNames} ClassNames
 */

var wrapped_element_WrappedElement = /*#__PURE__*/function () {
  /**
   * @param {{
   *  element: HTMLInputElement | HTMLSelectElement,
   *  classNames: ClassNames,
   * }} args
   */
  function WrappedElement(_ref) {
    var element = _ref.element,
        classNames = _ref.classNames;

    wrapped_element_classCallCheck(this, WrappedElement);

    this.element = element;
    this.classNames = classNames;

    if (!(element instanceof HTMLInputElement) && !(element instanceof HTMLSelectElement)) {
      throw new TypeError('Invalid element passed');
    }

    this.isDisabled = false;
  }

  wrapped_element_createClass(WrappedElement, [{
    key: "isActive",
    get: function get() {
      return this.element.dataset.choice === 'active';
    }
  }, {
    key: "dir",
    get: function get() {
      return this.element.dir;
    }
  }, {
    key: "value",
    get: function get() {
      return this.element.value;
    },
    set: function set(value) {
      // you must define setter here otherwise it will be readonly property
      this.element.value = value;
    }
  }, {
    key: "conceal",
    value: function conceal() {
      // Hide passed input
      this.element.classList.add(this.classNames.input);
      this.element.hidden = true; // Remove element from tab index

      this.element.tabIndex = -1; // Backup original styles if any

      var origStyle = this.element.getAttribute('style');

      if (origStyle) {
        this.element.setAttribute('data-choice-orig-style', origStyle);
      }

      this.element.setAttribute('data-choice', 'active');
    }
  }, {
    key: "reveal",
    value: function reveal() {
      // Reinstate passed element
      this.element.classList.remove(this.classNames.input);
      this.element.hidden = false;
      this.element.removeAttribute('tabindex'); // Recover original styles if any

      var origStyle = this.element.getAttribute('data-choice-orig-style');

      if (origStyle) {
        this.element.removeAttribute('data-choice-orig-style');
        this.element.setAttribute('style', origStyle);
      } else {
        this.element.removeAttribute('style');
      }

      this.element.removeAttribute('data-choice'); // Re-assign values - this is weird, I know
      // @todo Figure out why we need to do this

      this.element.value = this.element.value; // eslint-disable-line no-self-assign
    }
  }, {
    key: "enable",
    value: function enable() {
      this.element.removeAttribute('disabled');
      this.element.disabled = false;
      this.isDisabled = false;
    }
  }, {
    key: "disable",
    value: function disable() {
      this.element.setAttribute('disabled', '');
      this.element.disabled = true;
      this.isDisabled = true;
    }
  }, {
    key: "triggerEvent",
    value: function triggerEvent(eventType, data) {
      dispatchEvent(this.element, eventType, data);
    }
  }]);

  return WrappedElement;
}();


// CONCATENATED MODULE: ./src/scripts/components/wrapped-input.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function wrapped_input_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function wrapped_input_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function wrapped_input_createClass(Constructor, protoProps, staticProps) { if (protoProps) wrapped_input_defineProperties(Constructor.prototype, protoProps); if (staticProps) wrapped_input_defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }


/**
 * @typedef {import('../../../types/index').Choices.ClassNames} ClassNames
 * @typedef {import('../../../types/index').Choices.Item} Item
 */

var WrappedInput = /*#__PURE__*/function (_WrappedElement) {
  _inherits(WrappedInput, _WrappedElement);

  var _super = _createSuper(WrappedInput);

  /**
   * @param {{
   *  element: HTMLInputElement,
   *  classNames: ClassNames,
   *  delimiter: string
   * }} args
   */
  function WrappedInput(_ref) {
    var _this;

    var element = _ref.element,
        classNames = _ref.classNames,
        delimiter = _ref.delimiter;

    wrapped_input_classCallCheck(this, WrappedInput);

    _this = _super.call(this, {
      element: element,
      classNames: classNames
    });
    _this.delimiter = delimiter;
    return _this;
  }
  /**
   * @returns {string}
   */


  wrapped_input_createClass(WrappedInput, [{
    key: "value",
    get: function get() {
      return this.element.value;
    }
    /**
     * @param {Item[]} items
     */
    ,
    set: function set(items) {
      var itemValues = items.map(function (_ref2) {
        var value = _ref2.value;
        return value;
      });
      var joinedValues = itemValues.join(this.delimiter);
      this.element.setAttribute('value', joinedValues);
      this.element.value = joinedValues;
    }
  }]);

  return WrappedInput;
}(wrapped_element_WrappedElement);


// CONCATENATED MODULE: ./src/scripts/components/wrapped-select.js
function wrapped_select_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { wrapped_select_typeof = function _typeof(obj) { return typeof obj; }; } else { wrapped_select_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return wrapped_select_typeof(obj); }

function wrapped_select_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function wrapped_select_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function wrapped_select_createClass(Constructor, protoProps, staticProps) { if (protoProps) wrapped_select_defineProperties(Constructor.prototype, protoProps); if (staticProps) wrapped_select_defineProperties(Constructor, staticProps); return Constructor; }

function wrapped_select_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) wrapped_select_setPrototypeOf(subClass, superClass); }

function wrapped_select_setPrototypeOf(o, p) { wrapped_select_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return wrapped_select_setPrototypeOf(o, p); }

function wrapped_select_createSuper(Derived) { var hasNativeReflectConstruct = wrapped_select_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = wrapped_select_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = wrapped_select_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return wrapped_select_possibleConstructorReturn(this, result); }; }

function wrapped_select_possibleConstructorReturn(self, call) { if (call && (wrapped_select_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return wrapped_select_assertThisInitialized(self); }

function wrapped_select_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function wrapped_select_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function wrapped_select_getPrototypeOf(o) { wrapped_select_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return wrapped_select_getPrototypeOf(o); }


/**
 * @typedef {import('../../../types/index').Choices.ClassNames} ClassNames
 * @typedef {import('../../../types/index').Choices.Item} Item
 * @typedef {import('../../../types/index').Choices.Choice} Choice
 */

var WrappedSelect = /*#__PURE__*/function (_WrappedElement) {
  wrapped_select_inherits(WrappedSelect, _WrappedElement);

  var _super = wrapped_select_createSuper(WrappedSelect);

  /**
   * @param {{
   *  element: HTMLSelectElement,
   *  classNames: ClassNames,
   *  delimiter: string
   *  template: function
   * }} args
   */
  function WrappedSelect(_ref) {
    var _this;

    var element = _ref.element,
        classNames = _ref.classNames,
        template = _ref.template;

    wrapped_select_classCallCheck(this, WrappedSelect);

    _this = _super.call(this, {
      element: element,
      classNames: classNames
    });
    _this.template = template;
    return _this;
  }

  wrapped_select_createClass(WrappedSelect, [{
    key: "placeholderOption",
    get: function get() {
      return this.element.querySelector('option[value=""]') || // Backward compatibility layer for the non-standard placeholder attribute supported in older versions.
      this.element.querySelector('option[placeholder]');
    }
    /**
     * @returns {Element[]}
     */

  }, {
    key: "optionGroups",
    get: function get() {
      return Array.from(this.element.getElementsByTagName('OPTGROUP'));
    }
    /**
     * @returns {Item[] | Choice[]}
     */

  }, {
    key: "options",
    get: function get() {
      return Array.from(this.element.options);
    }
    /**
     * @param {Item[] | Choice[]} options
     */
    ,
    set: function set(options) {
      var _this2 = this;

      var fragment = document.createDocumentFragment();

      var addOptionToFragment = function addOptionToFragment(data) {
        // Create a standard select option
        var option = _this2.template(data); // Append it to fragment


        fragment.appendChild(option);
      }; // Add each list item to list


      options.forEach(function (optionData) {
        return addOptionToFragment(optionData);
      });
      this.appendDocFragment(fragment);
    }
    /**
     * @param {DocumentFragment} fragment
     */

  }, {
    key: "appendDocFragment",
    value: function appendDocFragment(fragment) {
      this.element.innerHTML = '';
      this.element.appendChild(fragment);
    }
  }]);

  return WrappedSelect;
}(wrapped_element_WrappedElement);


// CONCATENATED MODULE: ./src/scripts/components/index.js







// CONCATENATED MODULE: ./src/scripts/templates.js
/**
 * Helpers to create HTML elements used by Choices
 * Can be overridden by providing `callbackOnCreateTemplates` option
 * @typedef {import('../../types/index').Choices.Templates} Templates
 * @typedef {import('../../types/index').Choices.ClassNames} ClassNames
 * @typedef {import('../../types/index').Choices.Options} Options
 * @typedef {import('../../types/index').Choices.Item} Item
 * @typedef {import('../../types/index').Choices.Choice} Choice
 * @typedef {import('../../types/index').Choices.Group} Group
 */
var TEMPLATES =
/** @type {Templates} */
{
  /**
   * @param {Partial<ClassNames>} classNames
   * @param {"ltr" | "rtl" | "auto"} dir
   * @param {boolean} isSelectElement
   * @param {boolean} isSelectOneElement
   * @param {boolean} searchEnabled
   * @param {"select-one" | "select-multiple" | "text"} passedElementType
   */
  containerOuter: function containerOuter(_ref, dir, isSelectElement, isSelectOneElement, searchEnabled, passedElementType) {
    var containerOuter = _ref.containerOuter;
    var div = Object.assign(document.createElement('div'), {
      className: containerOuter
    });
    div.dataset.type = passedElementType;

    if (dir) {
      div.dir = dir;
    }

    if (isSelectOneElement) {
      div.tabIndex = 0;
    }

    if (isSelectElement) {
      div.setAttribute('role', searchEnabled ? 'combobox' : 'listbox');

      if (searchEnabled) {
        div.setAttribute('aria-autocomplete', 'list');
      }
    }

    div.setAttribute('aria-haspopup', 'true');
    div.setAttribute('aria-expanded', 'false');
    return div;
  },

  /**
   * @param {Partial<ClassNames>} classNames
   */
  containerInner: function containerInner(_ref2) {
    var containerInner = _ref2.containerInner;
    return Object.assign(document.createElement('div'), {
      className: containerInner
    });
  },

  /**
   * @param {Partial<ClassNames>} classNames
   * @param {boolean} isSelectOneElement
   */
  itemList: function itemList(_ref3, isSelectOneElement) {
    var list = _ref3.list,
        listSingle = _ref3.listSingle,
        listItems = _ref3.listItems;
    return Object.assign(document.createElement('div'), {
      className: "".concat(list, " ").concat(isSelectOneElement ? listSingle : listItems)
    });
  },

  /**
   * @param {Partial<ClassNames>} classNames
   * @param {string} value
   */
  placeholder: function placeholder(_ref4, value) {
    var placeholder = _ref4.placeholder;
    return Object.assign(document.createElement('div'), {
      className: placeholder,
      innerHTML: value
    });
  },

  /**
   * @param {Partial<ClassNames>} classNames
   * @param {Item} item
   * @param {boolean} removeItemButton
   */
  item: function item(_ref5, _ref6, removeItemButton) {
    var item = _ref5.item,
        button = _ref5.button,
        highlightedState = _ref5.highlightedState,
        itemSelectable = _ref5.itemSelectable,
        placeholder = _ref5.placeholder;
    var id = _ref6.id,
        value = _ref6.value,
        label = _ref6.label,
        customProperties = _ref6.customProperties,
        active = _ref6.active,
        disabled = _ref6.disabled,
        highlighted = _ref6.highlighted,
        isPlaceholder = _ref6.placeholder;
    var div = Object.assign(document.createElement('div'), {
      className: item,
      innerHTML: label
    });
    Object.assign(div.dataset, {
      item: '',
      id: id,
      value: value,
      customProperties: customProperties
    });

    if (active) {
      div.setAttribute('aria-selected', 'true');
    }

    if (disabled) {
      div.setAttribute('aria-disabled', 'true');
    }

    if (isPlaceholder) {
      div.classList.add(placeholder);
    }

    div.classList.add(highlighted ? highlightedState : itemSelectable);

    if (removeItemButton) {
      if (disabled) {
        div.classList.remove(itemSelectable);
      }

      div.dataset.deletable = '';
      /** @todo This MUST be localizable, not hardcoded! */

      var REMOVE_ITEM_TEXT = 'Remove item';
      var removeButton = Object.assign(document.createElement('button'), {
        type: 'button',
        className: button,
        innerHTML: REMOVE_ITEM_TEXT
      });
      removeButton.setAttribute('aria-label', "".concat(REMOVE_ITEM_TEXT, ": '").concat(value, "'"));
      removeButton.dataset.button = '';
      div.appendChild(removeButton);
    }

    return div;
  },

  /**
   * @param {Partial<ClassNames>} classNames
   * @param {boolean} isSelectOneElement
   */
  choiceList: function choiceList(_ref7, isSelectOneElement) {
    var list = _ref7.list;
    var div = Object.assign(document.createElement('div'), {
      className: list
    });

    if (!isSelectOneElement) {
      div.setAttribute('aria-multiselectable', 'true');
    }

    div.setAttribute('role', 'listbox');
    return div;
  },

  /**
   * @param {Partial<ClassNames>} classNames
   * @param {Group} group
   */
  choiceGroup: function choiceGroup(_ref8, _ref9) {
    var group = _ref8.group,
        groupHeading = _ref8.groupHeading,
        itemDisabled = _ref8.itemDisabled;
    var id = _ref9.id,
        value = _ref9.value,
        disabled = _ref9.disabled;
    var div = Object.assign(document.createElement('div'), {
      className: "".concat(group, " ").concat(disabled ? itemDisabled : '')
    });
    div.setAttribute('role', 'group');
    Object.assign(div.dataset, {
      group: '',
      id: id,
      value: value
    });

    if (disabled) {
      div.setAttribute('aria-disabled', 'true');
    }

    div.appendChild(Object.assign(document.createElement('div'), {
      className: groupHeading,
      innerHTML: value
    }));
    return div;
  },

  /**
   * @param {Partial<ClassNames>} classNames
   * @param {Choice} choice
   * @param {Options['itemSelectText']} selectText
   */
  choice: function choice(_ref10, _ref11, selectText) {
    var item = _ref10.item,
        itemChoice = _ref10.itemChoice,
        itemSelectable = _ref10.itemSelectable,
        selectedState = _ref10.selectedState,
        itemDisabled = _ref10.itemDisabled,
        placeholder = _ref10.placeholder;
    var id = _ref11.id,
        value = _ref11.value,
        label = _ref11.label,
        groupId = _ref11.groupId,
        elementId = _ref11.elementId,
        isDisabled = _ref11.disabled,
        isSelected = _ref11.selected,
        isPlaceholder = _ref11.placeholder;
    var div = Object.assign(document.createElement('div'), {
      id: elementId,
      innerHTML: label,
      className: "".concat(item, " ").concat(itemChoice)
    });

    if (isSelected) {
      div.classList.add(selectedState);
    }

    if (isPlaceholder) {
      div.classList.add(placeholder);
    }

    div.setAttribute('role', groupId > 0 ? 'treeitem' : 'option');
    Object.assign(div.dataset, {
      choice: '',
      id: id,
      value: value,
      selectText: selectText
    });

    if (isDisabled) {
      div.classList.add(itemDisabled);
      div.dataset.choiceDisabled = '';
      div.setAttribute('aria-disabled', 'true');
    } else {
      div.classList.add(itemSelectable);
      div.dataset.choiceSelectable = '';
    }

    return div;
  },

  /**
   * @param {Partial<ClassNames>} classNames
   * @param {string} placeholderValue
   */
  input: function input(_ref12, placeholderValue) {
    var input = _ref12.input,
        inputCloned = _ref12.inputCloned;
    var inp = Object.assign(document.createElement('input'), {
      type: 'text',
      className: "".concat(input, " ").concat(inputCloned),
      autocomplete: 'off',
      autocapitalize: 'off',
      spellcheck: false
    });
    inp.setAttribute('role', 'textbox');
    inp.setAttribute('aria-autocomplete', 'list');
    inp.setAttribute('aria-label', placeholderValue);
    return inp;
  },

  /**
   * @param {Partial<ClassNames>} classNames
   */
  dropdown: function dropdown(_ref13) {
    var list = _ref13.list,
        listDropdown = _ref13.listDropdown;
    var div = document.createElement('div');
    div.classList.add(list, listDropdown);
    div.setAttribute('aria-expanded', 'false');
    return div;
  },

  /**
   *
   * @param {Partial<ClassNames>} classNames
   * @param {string} innerHTML
   * @param {"no-choices" | "no-results" | ""} type
   */
  notice: function notice(_ref14, innerHTML) {
    var item = _ref14.item,
        itemChoice = _ref14.itemChoice,
        noResults = _ref14.noResults,
        noChoices = _ref14.noChoices;
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var classes = [item, itemChoice];

    if (type === 'no-choices') {
      classes.push(noChoices);
    } else if (type === 'no-results') {
      classes.push(noResults);
    }

    return Object.assign(document.createElement('div'), {
      innerHTML: innerHTML,
      className: classes.join(' ')
    });
  },

  /**
   * @param {Item} option
   */
  option: function option(_ref15) {
    var label = _ref15.label,
        value = _ref15.value,
        customProperties = _ref15.customProperties,
        active = _ref15.active,
        disabled = _ref15.disabled;
    var opt = new Option(label, value, false, active);

    if (customProperties) {
      opt.dataset.customProperties = customProperties;
    }

    opt.disabled = disabled;
    return opt;
  }
};
/* harmony default export */ var templates = (TEMPLATES);
// CONCATENATED MODULE: ./src/scripts/actions/choices.js
/**
 * @typedef {import('redux').Action} Action
 * @typedef {import('../../../types/index').Choices.Choice} Choice
 */

/**
 * @argument {Choice} choice
 * @returns {Action & Choice}
 */

var choices_addChoice = function addChoice(_ref) {
  var value = _ref.value,
      label = _ref.label,
      id = _ref.id,
      groupId = _ref.groupId,
      disabled = _ref.disabled,
      elementId = _ref.elementId,
      customProperties = _ref.customProperties,
      placeholder = _ref.placeholder,
      keyCode = _ref.keyCode;
  return {
    type: ACTION_TYPES.ADD_CHOICE,
    value: value,
    label: label,
    id: id,
    groupId: groupId,
    disabled: disabled,
    elementId: elementId,
    customProperties: customProperties,
    placeholder: placeholder,
    keyCode: keyCode
  };
};
/**
 * @argument {Choice[]} results
 * @returns {Action & { results: Choice[] }}
 */

var choices_filterChoices = function filterChoices(results) {
  return {
    type: ACTION_TYPES.FILTER_CHOICES,
    results: results
  };
};
/**
 * @argument {boolean} active
 * @returns {Action & { active: boolean }}
 */

var choices_activateChoices = function activateChoices() {
  var active = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  return {
    type: ACTION_TYPES.ACTIVATE_CHOICES,
    active: active
  };
};
/**
 * @returns {Action}
 */

var choices_clearChoices = function clearChoices() {
  return {
    type: ACTION_TYPES.CLEAR_CHOICES
  };
};
// CONCATENATED MODULE: ./src/scripts/actions/items.js

/**
 * @typedef {import('redux').Action} Action
 * @typedef {import('../../../types/index').Choices.Item} Item
 */

/**
 * @param {Item} item
 * @returns {Action & Item}
 */

var items_addItem = function addItem(_ref) {
  var value = _ref.value,
      label = _ref.label,
      id = _ref.id,
      choiceId = _ref.choiceId,
      groupId = _ref.groupId,
      customProperties = _ref.customProperties,
      placeholder = _ref.placeholder,
      keyCode = _ref.keyCode;
  return {
    type: ACTION_TYPES.ADD_ITEM,
    value: value,
    label: label,
    id: id,
    choiceId: choiceId,
    groupId: groupId,
    customProperties: customProperties,
    placeholder: placeholder,
    keyCode: keyCode
  };
};
/**
 * @param {string} id
 * @param {string} choiceId
 * @returns {Action & { id: string, choiceId: string }}
 */

var items_removeItem = function removeItem(id, choiceId) {
  return {
    type: ACTION_TYPES.REMOVE_ITEM,
    id: id,
    choiceId: choiceId
  };
};
/**
 * @param {string} id
 * @param {boolean} highlighted
 * @returns {Action & { id: string, highlighted: boolean }}
 */

var items_highlightItem = function highlightItem(id, highlighted) {
  return {
    type: ACTION_TYPES.HIGHLIGHT_ITEM,
    id: id,
    highlighted: highlighted
  };
};
// CONCATENATED MODULE: ./src/scripts/actions/groups.js

/**
 * @typedef {import('redux').Action} Action
 * @typedef {import('../../../types/index').Choices.Group} Group
 */

/**
 * @param {Group} group
 * @returns {Action & Group}
 */

var groups_addGroup = function addGroup(_ref) {
  var value = _ref.value,
      id = _ref.id,
      active = _ref.active,
      disabled = _ref.disabled;
  return {
    type: ACTION_TYPES.ADD_GROUP,
    value: value,
    id: id,
    active: active,
    disabled: disabled
  };
};
// CONCATENATED MODULE: ./src/scripts/actions/misc.js
/**
 * @typedef {import('redux').Action} Action
 */

/**
 * @returns {Action}
 */
var clearAll = function clearAll() {
  return {
    type: 'CLEAR_ALL'
  };
};
/**
 * @param {any} state
 * @returns {Action & { state: object }}
 */

var resetTo = function resetTo(state) {
  return {
    type: 'RESET_TO',
    state: state
  };
};
/**
 * @param {boolean} isLoading
 * @returns {Action & { isLoading: boolean }}
 */

var setIsLoading = function setIsLoading(isLoading) {
  return {
    type: 'SET_IS_LOADING',
    isLoading: isLoading
  };
};
// CONCATENATED MODULE: ./src/scripts/choices.js
function choices_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function choices_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { choices_typeof = function _typeof(obj) { return typeof obj; }; } else { choices_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return choices_typeof(obj); }

function scripts_choices_toConsumableArray(arr) { return scripts_choices_arrayWithoutHoles(arr) || scripts_choices_iterableToArray(arr) || scripts_choices_unsupportedIterableToArray(arr) || scripts_choices_nonIterableSpread(); }

function scripts_choices_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function scripts_choices_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return scripts_choices_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return scripts_choices_arrayLikeToArray(o, minLen); }

function scripts_choices_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function scripts_choices_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return scripts_choices_arrayLikeToArray(arr); }

function scripts_choices_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function choices_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function choices_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function choices_createClass(Constructor, protoProps, staticProps) { if (protoProps) choices_defineProperties(Constructor.prototype, protoProps); if (staticProps) choices_defineProperties(Constructor, staticProps); return Constructor; }












/** @see {@link http://browserhacks.com/#hack-acea075d0ac6954f275a70023906050c} */

var IS_IE11 = '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style;
/**
 * @typedef {import('../../types/index').Choices.Choice} Choice
 * @typedef {import('../../types/index').Choices.Item} Item
 * @typedef {import('../../types/index').Choices.Group} Group
 * @typedef {import('../../types/index').Choices.Options} Options
 */

/** @type {Partial<Options>} */

var USER_DEFAULTS = {};
/**
 * Choices
 * @author Josh Johnson<josh@joshuajohnson.co.uk>
 */

var choices_Choices = /*#__PURE__*/function () {
  /**
   * @param {string | HTMLInputElement | HTMLSelectElement} element
   * @param {Partial<Options>} userConfig
   */
  function Choices() {
    var _this = this;

    var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-choice]';
    var userConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    choices_classCallCheck(this, Choices);

    /** @type {Partial<Options>} */
    this.config = cjs_default.a.all([DEFAULT_CONFIG, Choices.defaults.options, userConfig], // When merging array configs, replace with a copy of the userConfig array,
    // instead of concatenating with the default array
    {
      arrayMerge: function arrayMerge(_, sourceArray) {
        return scripts_choices_toConsumableArray(sourceArray);
      }
    });
    var invalidConfigOptions = diff(this.config, DEFAULT_CONFIG);

    if (invalidConfigOptions.length) {
      console.warn('Unknown config option(s) passed', invalidConfigOptions.join(', '));
    }

    var passedElement = typeof element === 'string' ? document.querySelector(element) : element;

    if (!(passedElement instanceof HTMLInputElement || passedElement instanceof HTMLSelectElement)) {
      throw TypeError('Expected one of the following types text|select-one|select-multiple');
    }

    this._isTextElement = passedElement.type === TEXT_TYPE;
    this._isSelectOneElement = passedElement.type === SELECT_ONE_TYPE;
    this._isSelectMultipleElement = passedElement.type === SELECT_MULTIPLE_TYPE;
    this._isSelectElement = this._isSelectOneElement || this._isSelectMultipleElement;
    this.config.searchEnabled = this._isSelectMultipleElement || this.config.searchEnabled;

    if (!['auto', 'always'].includes(this.config.renderSelectedChoices)) {
      this.config.renderSelectedChoices = 'auto';
    }

    if (userConfig.addItemFilter && typeof userConfig.addItemFilter !== 'function') {
      var re = userConfig.addItemFilter instanceof RegExp ? userConfig.addItemFilter : new RegExp(userConfig.addItemFilter);
      this.config.addItemFilter = re.test.bind(re);
    }

    if (this._isTextElement) {
      this.passedElement = new WrappedInput({
        element: passedElement,
        classNames: this.config.classNames,
        delimiter: this.config.delimiter
      });
    } else {
      this.passedElement = new WrappedSelect({
        element: passedElement,
        classNames: this.config.classNames,
        template: function template(data) {
          return _this._templates.option(data);
        }
      });
    }

    this.initialised = false;
    this._store = new store_Store();
    this._initialState = {};
    this._currentState = {};
    this._prevState = {};
    this._currentValue = '';
    this._canSearch = this.config.searchEnabled;
    this._isScrollingOnIe = false;
    this._highlightPosition = 0;
    this._wasTap = true;
    this._placeholderValue = this._generatePlaceholderValue();
    this._baseId = generateId(this.passedElement.element, 'choices-');
    /**
     * setting direction in cases where it's explicitly set on passedElement
     * or when calculated direction is different from the document
     * @type {HTMLElement['dir']}
     */

    this._direction = this.passedElement.dir;

    if (!this._direction) {
      var _window$getComputedSt = window.getComputedStyle(this.passedElement.element),
          elementDirection = _window$getComputedSt.direction;

      var _window$getComputedSt2 = window.getComputedStyle(document.documentElement),
          documentDirection = _window$getComputedSt2.direction;

      if (elementDirection !== documentDirection) {
        this._direction = elementDirection;
      }
    }

    this._idNames = {
      itemChoice: 'item-choice'
    }; // Assign preset groups from passed element

    this._presetGroups = this.passedElement.optionGroups; // Assign preset options from passed element

    this._presetOptions = this.passedElement.options; // Assign preset choices from passed object

    this._presetChoices = this.config.choices; // Assign preset items from passed object first

    this._presetItems = this.config.items; // Add any values passed from attribute

    if (this.passedElement.value) {
      this._presetItems = this._presetItems.concat(this.passedElement.value.split(this.config.delimiter));
    } // Create array of choices from option elements


    if (this.passedElement.options) {
      this.passedElement.options.forEach(function (o) {
        var pomCustomProperties = o.getAttribute('data-custom-properties');

        try {
          pomCustomProperties = JSON.parse(pomCustomProperties);
        } catch (e) {
          /* empty */
        }

        _this._presetChoices.push({
          value: o.value,
          label: o.innerHTML,
          selected: o.selected,
          disabled: o.disabled || o.parentNode.disabled,
          placeholder: o.value === '' || o.hasAttribute('placeholder'),
          customProperties: pomCustomProperties
        });
      });
    }

    this._render = this._render.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseOver = this._onMouseOver.bind(this);
    this._onFormReset = this._onFormReset.bind(this);
    this._onAKey = this._onAKey.bind(this);
    this._onEnterKey = this._onEnterKey.bind(this);
    this._onEscapeKey = this._onEscapeKey.bind(this);
    this._onDirectionKey = this._onDirectionKey.bind(this);
    this._onDeleteKey = this._onDeleteKey.bind(this); // If element has already been initialised with Choices, fail silently

    if (this.passedElement.isActive) {
      if (!this.config.silent) {
        console.warn('Trying to initialise Choices on element already initialised');
      }

      this.initialised = true;
      return;
    } // Let's go


    this.init();
  }

  choices_createClass(Choices, [{
    key: "init",
    value: function init() {
      if (this.initialised) {
        return;
      }

      this._createTemplates();

      this._createElements();

      this._createStructure(); // Set initial state (We need to clone the state because some reducers
      // modify the inner objects properties in the state) 🤢


      this._initialState = cloneObject(this._store.state);

      this._store.subscribe(this._render);

      this._render();

      this._addEventListeners();

      var shouldDisable = !this.config.addItems || this.passedElement.element.hasAttribute('disabled');

      if (shouldDisable) {
        this.disable();
      }

      this.initialised = true;
      var callbackOnInit = this.config.callbackOnInit; // Run callback if it is a function

      if (callbackOnInit && typeof callbackOnInit === 'function') {
        callbackOnInit.call(this);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (!this.initialised) {
        return;
      }

      this._removeEventListeners();

      this.passedElement.reveal();
      this.containerOuter.unwrap(this.passedElement.element);
      this.clearStore();

      if (this._isSelectElement) {
        this.passedElement.options = this._presetOptions;
      }

      this._templates = null;
      this.initialised = false;
    }
  }, {
    key: "enable",
    value: function enable() {
      if (this.passedElement.isDisabled) {
        this.passedElement.enable();
      }

      if (this.containerOuter.isDisabled) {
        this._addEventListeners();

        this.input.enable();
        this.containerOuter.enable();
      }

      return this;
    }
  }, {
    key: "disable",
    value: function disable() {
      if (!this.passedElement.isDisabled) {
        this.passedElement.disable();
      }

      if (!this.containerOuter.isDisabled) {
        this._removeEventListeners();

        this.input.disable();
        this.containerOuter.disable();
      }

      return this;
    }
  }, {
    key: "highlightItem",
    value: function highlightItem(item) {
      var runEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (!item) {
        return this;
      }

      var id = item.id,
          _item$groupId = item.groupId,
          groupId = _item$groupId === void 0 ? -1 : _item$groupId,
          _item$value = item.value,
          value = _item$value === void 0 ? '' : _item$value,
          _item$label = item.label,
          label = _item$label === void 0 ? '' : _item$label;
      var group = groupId >= 0 ? this._store.getGroupById(groupId) : null;

      this._store.dispatch(items_highlightItem(id, true));

      if (runEvent) {
        this.passedElement.triggerEvent(EVENTS.highlightItem, {
          id: id,
          value: value,
          label: label,
          groupValue: group && group.value ? group.value : null
        });
      }

      return this;
    }
  }, {
    key: "unhighlightItem",
    value: function unhighlightItem(item) {
      if (!item) {
        return this;
      }

      var id = item.id,
          _item$groupId2 = item.groupId,
          groupId = _item$groupId2 === void 0 ? -1 : _item$groupId2,
          _item$value2 = item.value,
          value = _item$value2 === void 0 ? '' : _item$value2,
          _item$label2 = item.label,
          label = _item$label2 === void 0 ? '' : _item$label2;
      var group = groupId >= 0 ? this._store.getGroupById(groupId) : null;

      this._store.dispatch(items_highlightItem(id, false));

      this.passedElement.triggerEvent(EVENTS.highlightItem, {
        id: id,
        value: value,
        label: label,
        groupValue: group && group.value ? group.value : null
      });
      return this;
    }
  }, {
    key: "highlightAll",
    value: function highlightAll() {
      var _this2 = this;

      this._store.items.forEach(function (item) {
        return _this2.highlightItem(item);
      });

      return this;
    }
  }, {
    key: "unhighlightAll",
    value: function unhighlightAll() {
      var _this3 = this;

      this._store.items.forEach(function (item) {
        return _this3.unhighlightItem(item);
      });

      return this;
    }
  }, {
    key: "removeActiveItemsByValue",
    value: function removeActiveItemsByValue(value) {
      var _this4 = this;

      this._store.activeItems.filter(function (item) {
        return item.value === value;
      }).forEach(function (item) {
        return _this4._removeItem(item);
      });

      return this;
    }
  }, {
    key: "removeActiveItems",
    value: function removeActiveItems(excludedId) {
      var _this5 = this;

      this._store.activeItems.filter(function (_ref) {
        var id = _ref.id;
        return id !== excludedId;
      }).forEach(function (item) {
        return _this5._removeItem(item);
      });

      return this;
    }
  }, {
    key: "removeHighlightedItems",
    value: function removeHighlightedItems() {
      var _this6 = this;

      var runEvent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      this._store.highlightedActiveItems.forEach(function (item) {
        _this6._removeItem(item); // If this action was performed by the user
        // trigger the event


        if (runEvent) {
          _this6._triggerChange(item.value);
        }
      });

      return this;
    }
  }, {
    key: "showDropdown",
    value: function showDropdown(preventInputFocus) {
      var _this7 = this;

      if (this.dropdown.isActive) {
        return this;
      }

      requestAnimationFrame(function () {
        _this7.dropdown.show();

        _this7.containerOuter.open(_this7.dropdown.distanceFromTopWindow);

        if (!preventInputFocus && _this7._canSearch) {
          _this7.input.focus();
        }

        _this7.passedElement.triggerEvent(EVENTS.showDropdown, {});
      });
      return this;
    }
  }, {
    key: "hideDropdown",
    value: function hideDropdown(preventInputBlur) {
      var _this8 = this;

      if (!this.dropdown.isActive) {
        return this;
      }

      requestAnimationFrame(function () {
        _this8.dropdown.hide();

        _this8.containerOuter.close();

        if (!preventInputBlur && _this8._canSearch) {
          _this8.input.removeActiveDescendant();

          _this8.input.blur();
        }

        _this8.passedElement.triggerEvent(EVENTS.hideDropdown, {});
      });
      return this;
    }
  }, {
    key: "getValue",
    value: function getValue() {
      var valueOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var values = this._store.activeItems.reduce(function (selectedItems, item) {
        var itemValue = valueOnly ? item.value : item;
        selectedItems.push(itemValue);
        return selectedItems;
      }, []);

      return this._isSelectOneElement ? values[0] : values;
    }
    /**
     * @param {string[] | import('../../types/index').Choices.Item[]} items
     */

  }, {
    key: "setValue",
    value: function setValue(items) {
      var _this9 = this;

      if (!this.initialised) {
        return this;
      }

      items.forEach(function (value) {
        return _this9._setChoiceOrItem(value);
      });
      return this;
    }
  }, {
    key: "setChoiceByValue",
    value: function setChoiceByValue(value) {
      var _this10 = this;

      if (!this.initialised || this._isTextElement) {
        return this;
      } // If only one value has been passed, convert to array


      var choiceValue = Array.isArray(value) ? value : [value]; // Loop through each value and

      choiceValue.forEach(function (val) {
        return _this10._findAndSelectChoiceByValue(val);
      });
      return this;
    }
    /**
     * Set choices of select input via an array of objects (or function that returns array of object or promise of it),
     * a value field name and a label field name.
     * This behaves the same as passing items via the choices option but can be called after initialising Choices.
     * This can also be used to add groups of choices (see example 2); Optionally pass a true `replaceChoices` value to remove any existing choices.
     * Optionally pass a `customProperties` object to add additional data to your choices (useful when searching/filtering etc).
     *
     * **Input types affected:** select-one, select-multiple
     *
     * @template {Choice[] | ((instance: Choices) => object[] | Promise<object[]>)} T
     * @param {T} [choicesArrayOrFetcher]
     * @param {string} [value = 'value'] - name of `value` field
     * @param {string} [label = 'label'] - name of 'label' field
     * @param {boolean} [replaceChoices = false] - whether to replace of add choices
     * @returns {this | Promise<this>}
     *
     * @example
     * ```js
     * const example = new Choices(element);
     *
     * example.setChoices([
     *   {value: 'One', label: 'Label One', disabled: true},
     *   {value: 'Two', label: 'Label Two', selected: true},
     *   {value: 'Three', label: 'Label Three'},
     * ], 'value', 'label', false);
     * ```
     *
     * @example
     * ```js
     * const example = new Choices(element);
     *
     * example.setChoices(async () => {
     *   try {
     *      const items = await fetch('/items');
     *      return items.json()
     *   } catch(err) {
     *      console.error(err)
     *   }
     * });
     * ```
     *
     * @example
     * ```js
     * const example = new Choices(element);
     *
     * example.setChoices([{
     *   label: 'Group one',
     *   id: 1,
     *   disabled: false,
     *   choices: [
     *     {value: 'Child One', label: 'Child One', selected: true},
     *     {value: 'Child Two', label: 'Child Two',  disabled: true},
     *     {value: 'Child Three', label: 'Child Three'},
     *   ]
     * },
     * {
     *   label: 'Group two',
     *   id: 2,
     *   disabled: false,
     *   choices: [
     *     {value: 'Child Four', label: 'Child Four', disabled: true},
     *     {value: 'Child Five', label: 'Child Five'},
     *     {value: 'Child Six', label: 'Child Six', customProperties: {
     *       description: 'Custom description about child six',
     *       random: 'Another random custom property'
     *     }},
     *   ]
     * }], 'value', 'label', false);
     * ```
     */

  }, {
    key: "setChoices",
    value: function setChoices() {
      var _this11 = this;

      var choicesArrayOrFetcher = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'value';
      var label = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'label';
      var replaceChoices = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (!this.initialised) {
        throw new ReferenceError("setChoices was called on a non-initialized instance of Choices");
      }

      if (!this._isSelectElement) {
        throw new TypeError("setChoices can't be used with INPUT based Choices");
      }

      if (typeof value !== 'string' || !value) {
        throw new TypeError("value parameter must be a name of 'value' field in passed objects");
      } // Clear choices if needed


      if (replaceChoices) {
        this.clearChoices();
      }

      if (typeof choicesArrayOrFetcher === 'function') {
        // it's a choices fetcher function
        var fetcher = choicesArrayOrFetcher(this);

        if (typeof Promise === 'function' && fetcher instanceof Promise) {
          // that's a promise
          // eslint-disable-next-line compat/compat
          return new Promise(function (resolve) {
            return requestAnimationFrame(resolve);
          }).then(function () {
            return _this11._handleLoadingState(true);
          }).then(function () {
            return fetcher;
          }).then(function (data) {
            return _this11.setChoices(data, value, label, replaceChoices);
          }).catch(function (err) {
            if (!_this11.config.silent) {
              console.error(err);
            }
          }).then(function () {
            return _this11._handleLoadingState(false);
          }).then(function () {
            return _this11;
          });
        } // function returned something else than promise, let's check if it's an array of choices


        if (!Array.isArray(fetcher)) {
          throw new TypeError(".setChoices first argument function must return either array of choices or Promise, got: ".concat(choices_typeof(fetcher)));
        } // recursion with results, it's sync and choices were cleared already


        return this.setChoices(fetcher, value, label, false);
      }

      if (!Array.isArray(choicesArrayOrFetcher)) {
        throw new TypeError(".setChoices must be called either with array of choices with a function resulting into Promise of array of choices");
      }

      this.containerOuter.removeLoadingState();

      this._startLoading();

      choicesArrayOrFetcher.forEach(function (groupOrChoice) {
        if (groupOrChoice.choices) {
          _this11._addGroup({
            id: parseInt(groupOrChoice.id, 10) || null,
            group: groupOrChoice,
            valueKey: value,
            labelKey: label
          });
        } else {
          _this11._addChoice({
            value: groupOrChoice[value],
            label: groupOrChoice[label],
            isSelected: groupOrChoice.selected,
            isDisabled: groupOrChoice.disabled,
            customProperties: groupOrChoice.customProperties,
            placeholder: groupOrChoice.placeholder
          });
        }
      });

      this._stopLoading();

      return this;
    }
  }, {
    key: "clearChoices",
    value: function clearChoices() {
      this._store.dispatch(choices_clearChoices());

      return this;
    }
  }, {
    key: "clearStore",
    value: function clearStore() {
      this._store.dispatch(clearAll());

      return this;
    }
  }, {
    key: "clearSelection",
    value: function clearSelection() {
      this.removeActiveItems(-1);

      this._addItem({
        value: '',
        label: 'Select',
        placeholder: true
      });

      return this;
    }
  }, {
    key: "clearInput",
    value: function clearInput() {
      var shouldSetInputWidth = !this._isSelectOneElement;
      this.input.clear(shouldSetInputWidth);

      if (!this._isTextElement && this._canSearch) {
        this._isSearching = false;

        this._store.dispatch(choices_activateChoices(true));
      }

      return this;
    }
  }, {
    key: "_render",
    value: function _render() {
      if (this._store.isLoading()) {
        return;
      }

      this._currentState = this._store.state;
      var stateChanged = this._currentState.choices !== this._prevState.choices || this._currentState.groups !== this._prevState.groups || this._currentState.items !== this._prevState.items;
      var shouldRenderChoices = this._isSelectElement;
      var shouldRenderItems = this._currentState.items !== this._prevState.items;

      if (!stateChanged) {
        return;
      }

      if (shouldRenderChoices) {
        this._renderChoices();
      }

      if (shouldRenderItems) {
        this._renderItems();
      }

      this._prevState = this._currentState;
    }
  }, {
    key: "_renderChoices",
    value: function _renderChoices() {
      var _this12 = this;

      var _this$_store = this._store,
          activeGroups = _this$_store.activeGroups,
          activeChoices = _this$_store.activeChoices;
      var choiceListFragment = document.createDocumentFragment();
      this.choiceList.clear();

      if (this.config.resetScrollPosition) {
        requestAnimationFrame(function () {
          return _this12.choiceList.scrollToTop();
        });
      } // If we have grouped options


      if (activeGroups.length >= 1 && !this._isSearching) {
        // If we have a placeholder choice along with groups
        var activePlaceholders = activeChoices.filter(function (activeChoice) {
          return activeChoice.placeholder === true && activeChoice.groupId === -1;
        });

        if (activePlaceholders.length >= 1) {
          choiceListFragment = this._createChoicesFragment(activePlaceholders, choiceListFragment);
        }

        choiceListFragment = this._createGroupsFragment(activeGroups, activeChoices, choiceListFragment);
      } else if (activeChoices.length >= 1) {
        choiceListFragment = this._createChoicesFragment(activeChoices, choiceListFragment);
      } // If we have choices to show


      if (choiceListFragment.childNodes && choiceListFragment.childNodes.length > 0) {
        var activeItems = this._store.activeItems;

        var canAddItem = this._canAddItem(activeItems, this.input.value); // ...and we can select them


        if (canAddItem.response) {
          // ...append them and highlight the first choice
          this.choiceList.append(choiceListFragment);

          this._highlightChoice();
        } else {
          // ...otherwise show a notice
          this.choiceList.append(this._getTemplate('notice', canAddItem.notice));
        }
      } else {
        // Otherwise show a notice
        var dropdownItem;
        var notice;

        if (this._isSearching) {
          notice = typeof this.config.noResultsText === 'function' ? this.config.noResultsText() : this.config.noResultsText;
          dropdownItem = this._getTemplate('notice', notice, 'no-results');
        } else {
          notice = typeof this.config.noChoicesText === 'function' ? this.config.noChoicesText() : this.config.noChoicesText;
          dropdownItem = this._getTemplate('notice', notice, 'no-choices');
        }

        this.choiceList.append(dropdownItem);
      }
    }
  }, {
    key: "_renderItems",
    value: function _renderItems() {
      var activeItems = this._store.activeItems || [];
      this.itemList.clear(); // Create a fragment to store our list items
      // (so we don't have to update the DOM for each item)

      var itemListFragment = this._createItemsFragment(activeItems); // If we have items to add, append them


      if (itemListFragment.childNodes) {
        this.itemList.append(itemListFragment);
      }
    }
  }, {
    key: "_createGroupsFragment",
    value: function _createGroupsFragment(groups, choices) {
      var _this13 = this;

      var fragment = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.createDocumentFragment();

      var getGroupChoices = function getGroupChoices(group) {
        return choices.filter(function (choice) {
          if (_this13._isSelectOneElement) {
            return choice.groupId === group.id;
          }

          return choice.groupId === group.id && (_this13.config.renderSelectedChoices === 'always' || !choice.selected);
        });
      }; // If sorting is enabled, filter groups


      if (this.config.shouldSort) {
        groups.sort(this.config.sorter);
      }

      groups.forEach(function (group) {
        var groupChoices = getGroupChoices(group);

        if (groupChoices.length >= 1) {
          var dropdownGroup = _this13._getTemplate('choiceGroup', group);

          fragment.appendChild(dropdownGroup);

          _this13._createChoicesFragment(groupChoices, fragment, true);
        }
      });
      return fragment;
    }
  }, {
    key: "_createChoicesFragment",
    value: function _createChoicesFragment(choices) {
      var _this14 = this;

      var fragment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.createDocumentFragment();
      var withinGroup = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      // Create a fragment to store our list items (so we don't have to update the DOM for each item)
      var _this$config = this.config,
          renderSelectedChoices = _this$config.renderSelectedChoices,
          searchResultLimit = _this$config.searchResultLimit,
          renderChoiceLimit = _this$config.renderChoiceLimit;
      var filter = this._isSearching ? sortByScore : this.config.sorter;

      var appendChoice = function appendChoice(choice) {
        var shouldRender = renderSelectedChoices === 'auto' ? _this14._isSelectOneElement || !choice.selected : true;

        if (shouldRender) {
          var dropdownItem = _this14._getTemplate('choice', choice, _this14.config.itemSelectText);

          fragment.appendChild(dropdownItem);
        }
      };

      var rendererableChoices = choices;

      if (renderSelectedChoices === 'auto' && !this._isSelectOneElement) {
        rendererableChoices = choices.filter(function (choice) {
          return !choice.selected;
        });
      } // Split array into placeholders and "normal" choices


      var _rendererableChoices$ = rendererableChoices.reduce(function (acc, choice) {
        if (choice.placeholder) {
          acc.placeholderChoices.push(choice);
        } else {
          acc.normalChoices.push(choice);
        }

        return acc;
      }, {
        placeholderChoices: [],
        normalChoices: []
      }),
          placeholderChoices = _rendererableChoices$.placeholderChoices,
          normalChoices = _rendererableChoices$.normalChoices; // If sorting is enabled or the user is searching, filter choices


      if (this.config.shouldSort || this._isSearching) {
        normalChoices.sort(filter);
      }

      var choiceLimit = rendererableChoices.length; // Prepend placeholeder

      var sortedChoices = this._isSelectOneElement ? [].concat(scripts_choices_toConsumableArray(placeholderChoices), scripts_choices_toConsumableArray(normalChoices)) : normalChoices;

      if (this._isSearching) {
        choiceLimit = searchResultLimit;
      } else if (renderChoiceLimit && renderChoiceLimit > 0 && !withinGroup) {
        choiceLimit = renderChoiceLimit;
      } // Add each choice to dropdown within range


      for (var i = 0; i < choiceLimit; i += 1) {
        if (sortedChoices[i]) {
          appendChoice(sortedChoices[i]);
        }
      }

      return fragment;
    }
  }, {
    key: "_createItemsFragment",
    value: function _createItemsFragment(items) {
      var _this15 = this;

      var fragment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.createDocumentFragment();
      // Create fragment to add elements to
      var _this$config2 = this.config,
          shouldSortItems = _this$config2.shouldSortItems,
          sorter = _this$config2.sorter,
          removeItemButton = _this$config2.removeItemButton; // If sorting is enabled, filter items

      if (shouldSortItems && !this._isSelectOneElement) {
        items.sort(sorter);
      }

      if (this._isTextElement) {
        // Update the value of the hidden input
        this.passedElement.value = items;
      } else {
        // Update the options of the hidden input
        this.passedElement.options = items;
      }

      var addItemToFragment = function addItemToFragment(item) {
        // Create new list element
        var listItem = _this15._getTemplate('item', item, removeItemButton); // Append it to list


        fragment.appendChild(listItem);
      }; // Add each list item to list


      items.forEach(addItemToFragment);
      return fragment;
    }
  }, {
    key: "_triggerChange",
    value: function _triggerChange(value) {
      if (value === undefined || value === null) {
        return;
      }

      this.passedElement.triggerEvent(EVENTS.change, {
        value: value
      });
    }
  }, {
    key: "_selectPlaceholderChoice",
    value: function _selectPlaceholderChoice() {
      var placeholderChoice = this._store.placeholderChoice;

      if (placeholderChoice) {
        this._addItem({
          value: placeholderChoice.value,
          label: placeholderChoice.label,
          choiceId: placeholderChoice.id,
          groupId: placeholderChoice.groupId,
          placeholder: placeholderChoice.placeholder
        });

        this._triggerChange(placeholderChoice.value);
      }
    }
  }, {
    key: "_handleButtonAction",
    value: function _handleButtonAction(activeItems, element) {
      if (!activeItems || !element || !this.config.removeItems || !this.config.removeItemButton) {
        return;
      }

      var itemId = element.parentNode.getAttribute('data-id');
      var itemToRemove = activeItems.find(function (item) {
        return item.id === parseInt(itemId, 10);
      }); // Remove item associated with button

      this._removeItem(itemToRemove);

      this._triggerChange(itemToRemove.value);

      if (this._isSelectOneElement) {
        this._selectPlaceholderChoice();
      }
    }
  }, {
    key: "_handleItemAction",
    value: function _handleItemAction(activeItems, element) {
      var _this16 = this;

      var hasShiftKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (!activeItems || !element || !this.config.removeItems || this._isSelectOneElement) {
        return;
      }

      var passedId = element.getAttribute('data-id'); // We only want to select one item with a click
      // so we deselect any items that aren't the target
      // unless shift is being pressed

      activeItems.forEach(function (item) {
        if (item.id === parseInt(passedId, 10) && !item.highlighted) {
          _this16.highlightItem(item);
        } else if (!hasShiftKey && item.highlighted) {
          _this16.unhighlightItem(item);
        }
      }); // Focus input as without focus, a user cannot do anything with a
      // highlighted item

      this.input.focus();
    }
  }, {
    key: "_handleChoiceAction",
    value: function _handleChoiceAction(activeItems, element) {
      if (!activeItems || !element) {
        return;
      } // If we are clicking on an option


      var id = element.dataset.id;

      var choice = this._store.getChoiceById(id);

      if (!choice) {
        return;
      }

      var passedKeyCode = activeItems[0] && activeItems[0].keyCode ? activeItems[0].keyCode : null;
      var hasActiveDropdown = this.dropdown.isActive; // Update choice keyCode

      choice.keyCode = passedKeyCode;
      this.passedElement.triggerEvent(EVENTS.choice, {
        choice: choice
      });

      if (!choice.selected && !choice.disabled) {
        var canAddItem = this._canAddItem(activeItems, choice.value);

        if (canAddItem.response) {
          this._addItem({
            value: choice.value,
            label: choice.label,
            choiceId: choice.id,
            groupId: choice.groupId,
            customProperties: choice.customProperties,
            placeholder: choice.placeholder,
            keyCode: choice.keyCode
          });

          this._triggerChange(choice.value);
        }
      }

      this.clearInput(); // We want to close the dropdown if we are dealing with a single select box

      if (hasActiveDropdown && this._isSelectOneElement) {
        this.hideDropdown(true);
        this.containerOuter.focus();
      }
    }
  }, {
    key: "_handleBackspace",
    value: function _handleBackspace(activeItems) {
      if (!this.config.removeItems || !activeItems) {
        return;
      }

      var lastItem = activeItems[activeItems.length - 1];
      var hasHighlightedItems = activeItems.some(function (item) {
        return item.highlighted;
      }); // If editing the last item is allowed and there are not other selected items,
      // we can edit the item value. Otherwise if we can remove items, remove all selected items

      if (this.config.editItems && !hasHighlightedItems && lastItem) {
        this.input.value = lastItem.value;
        this.input.setWidth();

        this._removeItem(lastItem);

        this._triggerChange(lastItem.value);
      } else {
        if (!hasHighlightedItems) {
          // Highlight last item if none already highlighted
          this.highlightItem(lastItem, false);
        }

        this.removeHighlightedItems(true);
      }
    }
  }, {
    key: "_startLoading",
    value: function _startLoading() {
      this._store.dispatch(setIsLoading(true));
    }
  }, {
    key: "_stopLoading",
    value: function _stopLoading() {
      this._store.dispatch(setIsLoading(false));
    }
  }, {
    key: "_handleLoadingState",
    value: function _handleLoadingState() {
      var setLoading = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var placeholderItem = this.itemList.getChild(".".concat(this.config.classNames.placeholder));

      if (setLoading) {
        this.disable();
        this.containerOuter.addLoadingState();

        if (this._isSelectOneElement) {
          if (!placeholderItem) {
            placeholderItem = this._getTemplate('placeholder', this.config.loadingText);
            this.itemList.append(placeholderItem);
          } else {
            placeholderItem.innerHTML = this.config.loadingText;
          }
        } else {
          this.input.placeholder = this.config.loadingText;
        }
      } else {
        this.enable();
        this.containerOuter.removeLoadingState();

        if (this._isSelectOneElement) {
          placeholderItem.innerHTML = this._placeholderValue || '';
        } else {
          this.input.placeholder = this._placeholderValue || '';
        }
      }
    }
  }, {
    key: "_handleSearch",
    value: function _handleSearch(value) {
      if (!value || !this.input.isFocussed) {
        return;
      }

      var choices = this._store.choices;
      var _this$config3 = this.config,
          searchFloor = _this$config3.searchFloor,
          searchChoices = _this$config3.searchChoices;
      var hasUnactiveChoices = choices.some(function (option) {
        return !option.active;
      }); // Check that we have a value to search and the input was an alphanumeric character

      if (value && value.length >= searchFloor) {
        var resultCount = searchChoices ? this._searchChoices(value) : 0; // Trigger search event

        this.passedElement.triggerEvent(EVENTS.search, {
          value: value,
          resultCount: resultCount
        });
      } else if (hasUnactiveChoices) {
        // Otherwise reset choices to active
        this._isSearching = false;

        this._store.dispatch(choices_activateChoices(true));
      }
    }
  }, {
    key: "_canAddItem",
    value: function _canAddItem(activeItems, value) {
      var canAddItem = true;
      var notice = typeof this.config.addItemText === 'function' ? this.config.addItemText(value) : this.config.addItemText;

      if (!this._isSelectOneElement) {
        var isDuplicateValue = existsInArray(activeItems, value);

        if (this.config.maxItemCount > 0 && this.config.maxItemCount <= activeItems.length) {
          // If there is a max entry limit and we have reached that limit
          // don't update
          canAddItem = false;
          notice = typeof this.config.maxItemText === 'function' ? this.config.maxItemText(this.config.maxItemCount) : this.config.maxItemText;
        }

        if (!this.config.duplicateItemsAllowed && isDuplicateValue && canAddItem) {
          canAddItem = false;
          notice = typeof this.config.uniqueItemText === 'function' ? this.config.uniqueItemText(value) : this.config.uniqueItemText;
        }

        if (this._isTextElement && this.config.addItems && canAddItem && typeof this.config.addItemFilter === 'function' && !this.config.addItemFilter(value)) {
          canAddItem = false;
          notice = typeof this.config.customAddItemText === 'function' ? this.config.customAddItemText(value) : this.config.customAddItemText;
        }
      }

      return {
        response: canAddItem,
        notice: notice
      };
    }
  }, {
    key: "_searchChoices",
    value: function _searchChoices(value) {
      var newValue = typeof value === 'string' ? value.trim() : value;
      var currentValue = typeof this._currentValue === 'string' ? this._currentValue.trim() : this._currentValue;

      if (newValue.length < 1 && newValue === "".concat(currentValue, " ")) {
        return 0;
      } // If new value matches the desired length and is not the same as the current value with a space


      var haystack = this._store.searchableChoices;
      var needle = newValue;

      var keys = scripts_choices_toConsumableArray(this.config.searchFields);

      var options = Object.assign(this.config.fuseOptions, {
        keys: keys
      });
      var fuse = new fuse_default.a(haystack, options);
      var results = fuse.search(needle);
      this._currentValue = newValue;
      this._highlightPosition = 0;
      this._isSearching = true;

      this._store.dispatch(choices_filterChoices(results));

      return results.length;
    }
  }, {
    key: "_addEventListeners",
    value: function _addEventListeners() {
      var _document = document,
          documentElement = _document.documentElement; // capture events - can cancel event processing or propagation

      documentElement.addEventListener('touchend', this._onTouchEnd, true);
      this.containerOuter.element.addEventListener('keydown', this._onKeyDown, true);
      this.containerOuter.element.addEventListener('mousedown', this._onMouseDown, true); // passive events - doesn't call `preventDefault` or `stopPropagation`

      documentElement.addEventListener('click', this._onClick, {
        passive: true
      });
      documentElement.addEventListener('touchmove', this._onTouchMove, {
        passive: true
      });
      this.dropdown.element.addEventListener('mouseover', this._onMouseOver, {
        passive: true
      });

      if (this._isSelectOneElement) {
        this.containerOuter.element.addEventListener('focus', this._onFocus, {
          passive: true
        });
        this.containerOuter.element.addEventListener('blur', this._onBlur, {
          passive: true
        });
      }

      this.input.element.addEventListener('keyup', this._onKeyUp, {
        passive: true
      });
      this.input.element.addEventListener('focus', this._onFocus, {
        passive: true
      });
      this.input.element.addEventListener('blur', this._onBlur, {
        passive: true
      });

      if (this.input.element.form) {
        this.input.element.form.addEventListener('reset', this._onFormReset, {
          passive: true
        });
      }

      this.input.addEventListeners();
    }
  }, {
    key: "_removeEventListeners",
    value: function _removeEventListeners() {
      var _document2 = document,
          documentElement = _document2.documentElement;
      documentElement.removeEventListener('touchend', this._onTouchEnd, true);
      this.containerOuter.element.removeEventListener('keydown', this._onKeyDown, true);
      this.containerOuter.element.removeEventListener('mousedown', this._onMouseDown, true);
      documentElement.removeEventListener('click', this._onClick);
      documentElement.removeEventListener('touchmove', this._onTouchMove);
      this.dropdown.element.removeEventListener('mouseover', this._onMouseOver);

      if (this._isSelectOneElement) {
        this.containerOuter.element.removeEventListener('focus', this._onFocus);
        this.containerOuter.element.removeEventListener('blur', this._onBlur);
      }

      this.input.element.removeEventListener('keyup', this._onKeyUp);
      this.input.element.removeEventListener('focus', this._onFocus);
      this.input.element.removeEventListener('blur', this._onBlur);

      if (this.input.element.form) {
        this.input.element.form.removeEventListener('reset', this._onFormReset);
      }

      this.input.removeEventListeners();
    }
    /**
     * @param {KeyboardEvent} event
     */

  }, {
    key: "_onKeyDown",
    value: function _onKeyDown(event) {
      var _keyDownActions;

      var target = event.target,
          keyCode = event.keyCode,
          ctrlKey = event.ctrlKey,
          metaKey = event.metaKey;
      var activeItems = this._store.activeItems;
      var hasFocusedInput = this.input.isFocussed;
      var hasActiveDropdown = this.dropdown.isActive;
      var hasItems = this.itemList.hasChildren();
      var keyString = String.fromCharCode(keyCode);
      var BACK_KEY = KEY_CODES.BACK_KEY,
          DELETE_KEY = KEY_CODES.DELETE_KEY,
          ENTER_KEY = KEY_CODES.ENTER_KEY,
          A_KEY = KEY_CODES.A_KEY,
          ESC_KEY = KEY_CODES.ESC_KEY,
          UP_KEY = KEY_CODES.UP_KEY,
          DOWN_KEY = KEY_CODES.DOWN_KEY,
          PAGE_UP_KEY = KEY_CODES.PAGE_UP_KEY,
          PAGE_DOWN_KEY = KEY_CODES.PAGE_DOWN_KEY;
      var hasCtrlDownKeyPressed = ctrlKey || metaKey; // If a user is typing and the dropdown is not active

      if (!this._isTextElement && /[a-zA-Z0-9-_ ]/.test(keyString)) {
        this.showDropdown();
      } // Map keys to key actions


      var keyDownActions = (_keyDownActions = {}, choices_defineProperty(_keyDownActions, A_KEY, this._onAKey), choices_defineProperty(_keyDownActions, ENTER_KEY, this._onEnterKey), choices_defineProperty(_keyDownActions, ESC_KEY, this._onEscapeKey), choices_defineProperty(_keyDownActions, UP_KEY, this._onDirectionKey), choices_defineProperty(_keyDownActions, PAGE_UP_KEY, this._onDirectionKey), choices_defineProperty(_keyDownActions, DOWN_KEY, this._onDirectionKey), choices_defineProperty(_keyDownActions, PAGE_DOWN_KEY, this._onDirectionKey), choices_defineProperty(_keyDownActions, DELETE_KEY, this._onDeleteKey), choices_defineProperty(_keyDownActions, BACK_KEY, this._onDeleteKey), _keyDownActions); // If keycode has a function, run it

      if (keyDownActions[keyCode]) {
        keyDownActions[keyCode]({
          event: event,
          target: target,
          keyCode: keyCode,
          metaKey: metaKey,
          activeItems: activeItems,
          hasFocusedInput: hasFocusedInput,
          hasActiveDropdown: hasActiveDropdown,
          hasItems: hasItems,
          hasCtrlDownKeyPressed: hasCtrlDownKeyPressed
        });
      }
    }
  }, {
    key: "_onKeyUp",
    value: function _onKeyUp(_ref2) {
      var target = _ref2.target,
          keyCode = _ref2.keyCode;
      var value = this.input.value;
      var activeItems = this._store.activeItems;

      var canAddItem = this._canAddItem(activeItems, value);

      var backKey = KEY_CODES.BACK_KEY,
          deleteKey = KEY_CODES.DELETE_KEY; // We are typing into a text input and have a value, we want to show a dropdown
      // notice. Otherwise hide the dropdown

      if (this._isTextElement) {
        var canShowDropdownNotice = canAddItem.notice && value;

        if (canShowDropdownNotice) {
          var dropdownItem = this._getTemplate('notice', canAddItem.notice);

          this.dropdown.element.innerHTML = dropdownItem.outerHTML;
          this.showDropdown(true);
        } else {
          this.hideDropdown(true);
        }
      } else {
        var userHasRemovedValue = (keyCode === backKey || keyCode === deleteKey) && !target.value;
        var canReactivateChoices = !this._isTextElement && this._isSearching;
        var canSearch = this._canSearch && canAddItem.response;

        if (userHasRemovedValue && canReactivateChoices) {
          this._isSearching = false;

          this._store.dispatch(choices_activateChoices(true));
        } else if (canSearch) {
          this._handleSearch(this.input.value);
        }
      }

      this._canSearch = this.config.searchEnabled;
    }
  }, {
    key: "_onAKey",
    value: function _onAKey(_ref3) {
      var hasItems = _ref3.hasItems,
          hasCtrlDownKeyPressed = _ref3.hasCtrlDownKeyPressed;

      // If CTRL + A or CMD + A have been pressed and there are items to select
      if (hasCtrlDownKeyPressed && hasItems) {
        this._canSearch = false;
        var shouldHightlightAll = this.config.removeItems && !this.input.value && this.input.element === document.activeElement;

        if (shouldHightlightAll) {
          this.highlightAll();
        }
      }
    }
  }, {
    key: "_onEnterKey",
    value: function _onEnterKey(_ref4) {
      var event = _ref4.event,
          target = _ref4.target,
          activeItems = _ref4.activeItems,
          hasActiveDropdown = _ref4.hasActiveDropdown;
      var enterKey = KEY_CODES.ENTER_KEY;
      var targetWasButton = target.hasAttribute('data-button');

      if (this._isTextElement && target.value) {
        var value = this.input.value;

        var canAddItem = this._canAddItem(activeItems, value);

        if (canAddItem.response) {
          this.hideDropdown(true);

          this._addItem({
            value: value
          });

          this._triggerChange(value);

          this.clearInput();
        }
      }

      if (targetWasButton) {
        this._handleButtonAction(activeItems, target);

        event.preventDefault();
      }

      if (hasActiveDropdown) {
        var highlightedChoice = this.dropdown.getChild(".".concat(this.config.classNames.highlightedState));

        if (highlightedChoice) {
          // add enter keyCode value
          if (activeItems[0]) {
            activeItems[0].keyCode = enterKey; // eslint-disable-line no-param-reassign
          }

          this._handleChoiceAction(activeItems, highlightedChoice);
        }

        event.preventDefault();
      } else if (this._isSelectOneElement) {
        this.showDropdown();
        event.preventDefault();
      }
    }
  }, {
    key: "_onEscapeKey",
    value: function _onEscapeKey(_ref5) {
      var hasActiveDropdown = _ref5.hasActiveDropdown;

      if (hasActiveDropdown) {
        this.hideDropdown(true);
        this.containerOuter.focus();
      }
    }
  }, {
    key: "_onDirectionKey",
    value: function _onDirectionKey(_ref6) {
      var event = _ref6.event,
          hasActiveDropdown = _ref6.hasActiveDropdown,
          keyCode = _ref6.keyCode,
          metaKey = _ref6.metaKey;
      var downKey = KEY_CODES.DOWN_KEY,
          pageUpKey = KEY_CODES.PAGE_UP_KEY,
          pageDownKey = KEY_CODES.PAGE_DOWN_KEY; // If up or down key is pressed, traverse through options

      if (hasActiveDropdown || this._isSelectOneElement) {
        this.showDropdown();
        this._canSearch = false;
        var directionInt = keyCode === downKey || keyCode === pageDownKey ? 1 : -1;
        var skipKey = metaKey || keyCode === pageDownKey || keyCode === pageUpKey;
        var selectableChoiceIdentifier = '[data-choice-selectable]';
        var nextEl;

        if (skipKey) {
          if (directionInt > 0) {
            nextEl = this.dropdown.element.querySelector("".concat(selectableChoiceIdentifier, ":last-of-type"));
          } else {
            nextEl = this.dropdown.element.querySelector(selectableChoiceIdentifier);
          }
        } else {
          var currentEl = this.dropdown.element.querySelector(".".concat(this.config.classNames.highlightedState));

          if (currentEl) {
            nextEl = getAdjacentEl(currentEl, selectableChoiceIdentifier, directionInt);
          } else {
            nextEl = this.dropdown.element.querySelector(selectableChoiceIdentifier);
          }
        }

        if (nextEl) {
          // We prevent default to stop the cursor moving
          // when pressing the arrow
          if (!isScrolledIntoView(nextEl, this.choiceList.element, directionInt)) {
            this.choiceList.scrollToChildElement(nextEl, directionInt);
          }

          this._highlightChoice(nextEl);
        } // Prevent default to maintain cursor position whilst
        // traversing dropdown options


        event.preventDefault();
      }
    }
  }, {
    key: "_onDeleteKey",
    value: function _onDeleteKey(_ref7) {
      var event = _ref7.event,
          target = _ref7.target,
          hasFocusedInput = _ref7.hasFocusedInput,
          activeItems = _ref7.activeItems;

      // If backspace or delete key is pressed and the input has no value
      if (hasFocusedInput && !target.value && !this._isSelectOneElement) {
        this._handleBackspace(activeItems);

        event.preventDefault();
      }
    }
  }, {
    key: "_onTouchMove",
    value: function _onTouchMove() {
      if (this._wasTap) {
        this._wasTap = false;
      }
    }
  }, {
    key: "_onTouchEnd",
    value: function _onTouchEnd(event) {
      var _ref8 = event || event.touches[0],
          target = _ref8.target;

      var touchWasWithinContainer = this._wasTap && this.containerOuter.element.contains(target);

      if (touchWasWithinContainer) {
        var containerWasExactTarget = target === this.containerOuter.element || target === this.containerInner.element;

        if (containerWasExactTarget) {
          if (this._isTextElement) {
            this.input.focus();
          } else if (this._isSelectMultipleElement) {
            this.showDropdown();
          }
        } // Prevents focus event firing


        event.stopPropagation();
      }

      this._wasTap = true;
    }
    /**
     * Handles mousedown event in capture mode for containetOuter.element
     * @param {MouseEvent} event
     */

  }, {
    key: "_onMouseDown",
    value: function _onMouseDown(event) {
      var target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      } // If we have our mouse down on the scrollbar and are on IE11...


      if (IS_IE11 && this.choiceList.element.contains(target)) {
        // check if click was on a scrollbar area
        var firstChoice =
        /** @type {HTMLElement} */
        this.choiceList.element.firstElementChild;
        var isOnScrollbar = this._direction === 'ltr' ? event.offsetX >= firstChoice.offsetWidth : event.offsetX < firstChoice.offsetLeft;
        this._isScrollingOnIe = isOnScrollbar;
      }

      if (target === this.input.element) {
        return;
      }

      var item = target.closest('[data-button],[data-item],[data-choice]');

      if (item instanceof HTMLElement) {
        var hasShiftKey = event.shiftKey;
        var activeItems = this._store.activeItems;
        var dataset = item.dataset;

        if ('button' in dataset) {
          this._handleButtonAction(activeItems, item);
        } else if ('item' in dataset) {
          this._handleItemAction(activeItems, item, hasShiftKey);
        } else if ('choice' in dataset) {
          this._handleChoiceAction(activeItems, item);
        }
      }

      event.preventDefault();
    }
    /**
     * Handles mouseover event over this.dropdown
     * @param {MouseEvent} event
     */

  }, {
    key: "_onMouseOver",
    value: function _onMouseOver(_ref9) {
      var target = _ref9.target;

      if (target instanceof HTMLElement && 'choice' in target.dataset) {
        this._highlightChoice(target);
      }
    }
  }, {
    key: "_onClick",
    value: function _onClick(_ref10) {
      var target = _ref10.target;
      var clickWasWithinContainer = this.containerOuter.element.contains(target);

      if (clickWasWithinContainer) {
        if (!this.dropdown.isActive && !this.containerOuter.isDisabled) {
          if (this._isTextElement) {
            if (document.activeElement !== this.input.element) {
              this.input.focus();
            }
          } else {
            this.showDropdown();
            this.containerOuter.focus();
          }
        } else if (this._isSelectOneElement && target !== this.input.element && !this.dropdown.element.contains(target)) {
          this.hideDropdown();
        }
      } else {
        var hasHighlightedItems = this._store.highlightedActiveItems.length > 0;

        if (hasHighlightedItems) {
          this.unhighlightAll();
        }

        this.containerOuter.removeFocusState();
        this.hideDropdown(true);
      }
    }
  }, {
    key: "_onFocus",
    value: function _onFocus(_ref11) {
      var _this17 = this,
          _focusActions;

      var target = _ref11.target;
      var focusWasWithinContainer = this.containerOuter.element.contains(target);

      if (!focusWasWithinContainer) {
        return;
      }

      var focusActions = (_focusActions = {}, choices_defineProperty(_focusActions, TEXT_TYPE, function () {
        if (target === _this17.input.element) {
          _this17.containerOuter.addFocusState();
        }
      }), choices_defineProperty(_focusActions, SELECT_ONE_TYPE, function () {
        _this17.containerOuter.addFocusState();

        if (target === _this17.input.element) {
          _this17.showDropdown(true);
        }
      }), choices_defineProperty(_focusActions, SELECT_MULTIPLE_TYPE, function () {
        if (target === _this17.input.element) {
          _this17.showDropdown(true); // If element is a select box, the focused element is the container and the dropdown
          // isn't already open, focus and show dropdown


          _this17.containerOuter.addFocusState();
        }
      }), _focusActions);
      focusActions[this.passedElement.element.type]();
    }
  }, {
    key: "_onBlur",
    value: function _onBlur(_ref12) {
      var _this18 = this;

      var target = _ref12.target;
      var blurWasWithinContainer = this.containerOuter.element.contains(target);

      if (blurWasWithinContainer && !this._isScrollingOnIe) {
        var _blurActions;

        var activeItems = this._store.activeItems;
        var hasHighlightedItems = activeItems.some(function (item) {
          return item.highlighted;
        });
        var blurActions = (_blurActions = {}, choices_defineProperty(_blurActions, TEXT_TYPE, function () {
          if (target === _this18.input.element) {
            _this18.containerOuter.removeFocusState();

            if (hasHighlightedItems) {
              _this18.unhighlightAll();
            }

            _this18.hideDropdown(true);
          }
        }), choices_defineProperty(_blurActions, SELECT_ONE_TYPE, function () {
          _this18.containerOuter.removeFocusState();

          if (target === _this18.input.element || target === _this18.containerOuter.element && !_this18._canSearch) {
            _this18.hideDropdown(true);
          }
        }), choices_defineProperty(_blurActions, SELECT_MULTIPLE_TYPE, function () {
          if (target === _this18.input.element) {
            _this18.containerOuter.removeFocusState();

            _this18.hideDropdown(true);

            if (hasHighlightedItems) {
              _this18.unhighlightAll();
            }
          }
        }), _blurActions);
        blurActions[this.passedElement.element.type]();
      } else {
        // On IE11, clicking the scollbar blurs our input and thus
        // closes the dropdown. To stop this, we refocus our input
        // if we know we are on IE *and* are scrolling.
        this._isScrollingOnIe = false;
        this.input.element.focus();
      }
    }
  }, {
    key: "_onFormReset",
    value: function _onFormReset() {
      this._store.dispatch(resetTo(this._initialState));
    }
  }, {
    key: "_highlightChoice",
    value: function _highlightChoice() {
      var _this19 = this;

      var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var choices = Array.from(this.dropdown.element.querySelectorAll('[data-choice-selectable]'));

      if (!choices.length) {
        return;
      }

      var passedEl = el;
      var highlightedChoices = Array.from(this.dropdown.element.querySelectorAll(".".concat(this.config.classNames.highlightedState))); // Remove any highlighted choices

      highlightedChoices.forEach(function (choice) {
        choice.classList.remove(_this19.config.classNames.highlightedState);
        choice.setAttribute('aria-selected', 'false');
      });

      if (passedEl) {
        this._highlightPosition = choices.indexOf(passedEl);
      } else {
        // Highlight choice based on last known highlight location
        if (choices.length > this._highlightPosition) {
          // If we have an option to highlight
          passedEl = choices[this._highlightPosition];
        } else {
          // Otherwise highlight the option before
          passedEl = choices[choices.length - 1];
        }

        if (!passedEl) {
          passedEl = choices[0];
        }
      }

      passedEl.classList.add(this.config.classNames.highlightedState);
      passedEl.setAttribute('aria-selected', 'true');
      this.passedElement.triggerEvent(EVENTS.highlightChoice, {
        el: passedEl
      });

      if (this.dropdown.isActive) {
        // IE11 ignores aria-label and blocks virtual keyboard
        // if aria-activedescendant is set without a dropdown
        this.input.setActiveDescendant(passedEl.id);
        this.containerOuter.setActiveDescendant(passedEl.id);
      }
    }
  }, {
    key: "_addItem",
    value: function _addItem(_ref13) {
      var value = _ref13.value,
          _ref13$label = _ref13.label,
          label = _ref13$label === void 0 ? null : _ref13$label,
          _ref13$choiceId = _ref13.choiceId,
          choiceId = _ref13$choiceId === void 0 ? -1 : _ref13$choiceId,
          _ref13$groupId = _ref13.groupId,
          groupId = _ref13$groupId === void 0 ? -1 : _ref13$groupId,
          _ref13$customProperti = _ref13.customProperties,
          customProperties = _ref13$customProperti === void 0 ? null : _ref13$customProperti,
          _ref13$placeholder = _ref13.placeholder,
          placeholder = _ref13$placeholder === void 0 ? false : _ref13$placeholder,
          _ref13$keyCode = _ref13.keyCode,
          keyCode = _ref13$keyCode === void 0 ? null : _ref13$keyCode;
      var passedValue = typeof value === 'string' ? value.trim() : value;
      var passedKeyCode = keyCode;
      var passedCustomProperties = customProperties;
      var items = this._store.items;
      var passedLabel = label || passedValue;
      var passedOptionId = choiceId || -1;
      var group = groupId >= 0 ? this._store.getGroupById(groupId) : null;
      var id = items ? items.length + 1 : 1; // If a prepended value has been passed, prepend it

      if (this.config.prependValue) {
        passedValue = this.config.prependValue + passedValue.toString();
      } // If an appended value has been passed, append it


      if (this.config.appendValue) {
        passedValue += this.config.appendValue.toString();
      }

      this._store.dispatch(items_addItem({
        value: passedValue,
        label: passedLabel,
        id: id,
        choiceId: passedOptionId,
        groupId: groupId,
        customProperties: customProperties,
        placeholder: placeholder,
        keyCode: passedKeyCode
      }));

      if (this._isSelectOneElement) {
        this.removeActiveItems(id);
      } // Trigger change event


      this.passedElement.triggerEvent(EVENTS.addItem, {
        id: id,
        value: passedValue,
        label: passedLabel,
        customProperties: passedCustomProperties,
        groupValue: group && group.value ? group.value : undefined,
        keyCode: passedKeyCode
      });
      return this;
    }
  }, {
    key: "_removeItem",
    value: function _removeItem(item) {
      if (!item || !isType('Object', item)) {
        return this;
      }

      var id = item.id,
          value = item.value,
          label = item.label,
          choiceId = item.choiceId,
          groupId = item.groupId;
      var group = groupId >= 0 ? this._store.getGroupById(groupId) : null;

      this._store.dispatch(items_removeItem(id, choiceId));

      if (group && group.value) {
        this.passedElement.triggerEvent(EVENTS.removeItem, {
          id: id,
          value: value,
          label: label,
          groupValue: group.value
        });
      } else {
        this.passedElement.triggerEvent(EVENTS.removeItem, {
          id: id,
          value: value,
          label: label
        });
      }

      return this;
    }
  }, {
    key: "_addChoice",
    value: function _addChoice(_ref14) {
      var value = _ref14.value,
          _ref14$label = _ref14.label,
          label = _ref14$label === void 0 ? null : _ref14$label,
          _ref14$isSelected = _ref14.isSelected,
          isSelected = _ref14$isSelected === void 0 ? false : _ref14$isSelected,
          _ref14$isDisabled = _ref14.isDisabled,
          isDisabled = _ref14$isDisabled === void 0 ? false : _ref14$isDisabled,
          _ref14$groupId = _ref14.groupId,
          groupId = _ref14$groupId === void 0 ? -1 : _ref14$groupId,
          _ref14$customProperti = _ref14.customProperties,
          customProperties = _ref14$customProperti === void 0 ? null : _ref14$customProperti,
          _ref14$placeholder = _ref14.placeholder,
          placeholder = _ref14$placeholder === void 0 ? false : _ref14$placeholder,
          _ref14$keyCode = _ref14.keyCode,
          keyCode = _ref14$keyCode === void 0 ? null : _ref14$keyCode;

      if (typeof value === 'undefined' || value === null) {
        return;
      } // Generate unique id


      var choices = this._store.choices;
      var choiceLabel = label || value;
      var choiceId = choices ? choices.length + 1 : 1;
      var choiceElementId = "".concat(this._baseId, "-").concat(this._idNames.itemChoice, "-").concat(choiceId);

      this._store.dispatch(choices_addChoice({
        id: choiceId,
        groupId: groupId,
        elementId: choiceElementId,
        value: value,
        label: choiceLabel,
        disabled: isDisabled,
        customProperties: customProperties,
        placeholder: placeholder,
        keyCode: keyCode
      }));

      if (isSelected) {
        this._addItem({
          value: value,
          label: choiceLabel,
          choiceId: choiceId,
          customProperties: customProperties,
          placeholder: placeholder,
          keyCode: keyCode
        });
      }
    }
  }, {
    key: "_addGroup",
    value: function _addGroup(_ref15) {
      var _this20 = this;

      var group = _ref15.group,
          id = _ref15.id,
          _ref15$valueKey = _ref15.valueKey,
          valueKey = _ref15$valueKey === void 0 ? 'value' : _ref15$valueKey,
          _ref15$labelKey = _ref15.labelKey,
          labelKey = _ref15$labelKey === void 0 ? 'label' : _ref15$labelKey;
      var groupChoices = isType('Object', group) ? group.choices : Array.from(group.getElementsByTagName('OPTION'));
      var groupId = id || Math.floor(new Date().valueOf() * Math.random());
      var isDisabled = group.disabled ? group.disabled : false;

      if (groupChoices) {
        this._store.dispatch(groups_addGroup({
          value: group.label,
          id: groupId,
          active: true,
          disabled: isDisabled
        }));

        var addGroupChoices = function addGroupChoices(choice) {
          var isOptDisabled = choice.disabled || choice.parentNode && choice.parentNode.disabled;

          _this20._addChoice({
            value: choice[valueKey],
            label: isType('Object', choice) ? choice[labelKey] : choice.innerHTML,
            isSelected: choice.selected,
            isDisabled: isOptDisabled,
            groupId: groupId,
            customProperties: choice.customProperties,
            placeholder: choice.placeholder
          });
        };

        groupChoices.forEach(addGroupChoices);
      } else {
        this._store.dispatch(groups_addGroup({
          value: group.label,
          id: group.id,
          active: false,
          disabled: group.disabled
        }));
      }
    }
  }, {
    key: "_getTemplate",
    value: function _getTemplate(template) {
      var _this$_templates$temp;

      if (!template) {
        return null;
      }

      var classNames = this.config.classNames;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return (_this$_templates$temp = this._templates[template]).call.apply(_this$_templates$temp, [this, classNames].concat(args));
    }
  }, {
    key: "_createTemplates",
    value: function _createTemplates() {
      var callbackOnCreateTemplates = this.config.callbackOnCreateTemplates;
      var userTemplates = {};

      if (callbackOnCreateTemplates && typeof callbackOnCreateTemplates === 'function') {
        userTemplates = callbackOnCreateTemplates.call(this, strToEl);
      }

      this._templates = cjs_default()(TEMPLATES, userTemplates);
    }
  }, {
    key: "_createElements",
    value: function _createElements() {
      this.containerOuter = new container_Container({
        element: this._getTemplate('containerOuter', this._direction, this._isSelectElement, this._isSelectOneElement, this.config.searchEnabled, this.passedElement.element.type),
        classNames: this.config.classNames,
        type: this.passedElement.element.type,
        position: this.config.position
      });
      this.containerInner = new container_Container({
        element: this._getTemplate('containerInner'),
        classNames: this.config.classNames,
        type: this.passedElement.element.type,
        position: this.config.position
      });
      this.input = new input_Input({
        element: this._getTemplate('input', this._placeholderValue),
        classNames: this.config.classNames,
        type: this.passedElement.element.type,
        preventPaste: !this.config.paste
      });
      this.choiceList = new list_List({
        element: this._getTemplate('choiceList', this._isSelectOneElement)
      });
      this.itemList = new list_List({
        element: this._getTemplate('itemList', this._isSelectOneElement)
      });
      this.dropdown = new Dropdown({
        element: this._getTemplate('dropdown'),
        classNames: this.config.classNames,
        type: this.passedElement.element.type
      });
    }
  }, {
    key: "_createStructure",
    value: function _createStructure() {
      // Hide original element
      this.passedElement.conceal(); // Wrap input in container preserving DOM ordering

      this.containerInner.wrap(this.passedElement.element); // Wrapper inner container with outer container

      this.containerOuter.wrap(this.containerInner.element);

      if (this._isSelectOneElement) {
        this.input.placeholder = this.config.searchPlaceholderValue || '';
      } else if (this._placeholderValue) {
        this.input.placeholder = this._placeholderValue;
        this.input.setWidth();
      }

      this.containerOuter.element.appendChild(this.containerInner.element);
      this.containerOuter.element.appendChild(this.dropdown.element);
      this.containerInner.element.appendChild(this.itemList.element);

      if (!this._isTextElement) {
        this.dropdown.element.appendChild(this.choiceList.element);
      }

      if (!this._isSelectOneElement) {
        this.containerInner.element.appendChild(this.input.element);
      } else if (this.config.searchEnabled) {
        this.dropdown.element.insertBefore(this.input.element, this.dropdown.element.firstChild);
      }

      if (this._isSelectElement) {
        this._highlightPosition = 0;
        this._isSearching = false;

        this._startLoading();

        if (this._presetGroups.length) {
          this._addPredefinedGroups(this._presetGroups);
        } else {
          this._addPredefinedChoices(this._presetChoices);
        }

        this._stopLoading();
      }

      if (this._isTextElement) {
        this._addPredefinedItems(this._presetItems);
      }
    }
  }, {
    key: "_addPredefinedGroups",
    value: function _addPredefinedGroups(groups) {
      var _this21 = this;

      // If we have a placeholder option
      var placeholderChoice = this.passedElement.placeholderOption;

      if (placeholderChoice && placeholderChoice.parentNode.tagName === 'SELECT') {
        this._addChoice({
          value: placeholderChoice.value,
          label: placeholderChoice.innerHTML,
          isSelected: placeholderChoice.selected,
          isDisabled: placeholderChoice.disabled,
          placeholder: true
        });
      }

      groups.forEach(function (group) {
        return _this21._addGroup({
          group: group,
          id: group.id || null
        });
      });
    }
  }, {
    key: "_addPredefinedChoices",
    value: function _addPredefinedChoices(choices) {
      var _this22 = this;

      // If sorting is enabled or the user is searching, filter choices
      if (this.config.shouldSort) {
        choices.sort(this.config.sorter);
      }

      var hasSelectedChoice = choices.some(function (choice) {
        return choice.selected;
      });
      var firstEnabledChoiceIndex = choices.findIndex(function (choice) {
        return choice.disabled === undefined || !choice.disabled;
      });
      choices.forEach(function (choice, index) {
        var value = choice.value,
            label = choice.label,
            customProperties = choice.customProperties,
            placeholder = choice.placeholder;

        if (_this22._isSelectElement) {
          // If the choice is actually a group
          if (choice.choices) {
            _this22._addGroup({
              group: choice,
              id: choice.id || null
            });
          } else {
            /**
             * If there is a selected choice already or the choice is not the first in
             * the array, add each choice normally.
             *
             * Otherwise we pre-select the first enabled choice in the array ("select-one" only)
             */
            var shouldPreselect = _this22._isSelectOneElement && !hasSelectedChoice && index === firstEnabledChoiceIndex;
            var isSelected = shouldPreselect ? true : choice.selected;
            var isDisabled = choice.disabled;

            _this22._addChoice({
              value: value,
              label: label,
              isSelected: isSelected,
              isDisabled: isDisabled,
              customProperties: customProperties,
              placeholder: placeholder
            });
          }
        } else {
          _this22._addChoice({
            value: value,
            label: label,
            isSelected: choice.selected,
            isDisabled: choice.disabled,
            customProperties: customProperties,
            placeholder: placeholder
          });
        }
      });
    }
    /**
     * @param {Item[]} items
     */

  }, {
    key: "_addPredefinedItems",
    value: function _addPredefinedItems(items) {
      var _this23 = this;

      items.forEach(function (item) {
        if (choices_typeof(item) === 'object' && item.value) {
          _this23._addItem({
            value: item.value,
            label: item.label,
            choiceId: item.id,
            customProperties: item.customProperties,
            placeholder: item.placeholder
          });
        }

        if (typeof item === 'string') {
          _this23._addItem({
            value: item
          });
        }
      });
    }
  }, {
    key: "_setChoiceOrItem",
    value: function _setChoiceOrItem(item) {
      var _this24 = this;

      var itemType = getType(item).toLowerCase();
      var handleType = {
        object: function object() {
          if (!item.value) {
            return;
          } // If we are dealing with a select input, we need to create an option first
          // that is then selected. For text inputs we can just add items normally.


          if (!_this24._isTextElement) {
            _this24._addChoice({
              value: item.value,
              label: item.label,
              isSelected: true,
              isDisabled: false,
              customProperties: item.customProperties,
              placeholder: item.placeholder
            });
          } else {
            _this24._addItem({
              value: item.value,
              label: item.label,
              choiceId: item.id,
              customProperties: item.customProperties,
              placeholder: item.placeholder
            });
          }
        },
        string: function string() {
          if (!_this24._isTextElement) {
            _this24._addChoice({
              value: item,
              label: item,
              isSelected: true,
              isDisabled: false
            });
          } else {
            _this24._addItem({
              value: item
            });
          }
        }
      };
      handleType[itemType]();
    }
  }, {
    key: "_findAndSelectChoiceByValue",
    value: function _findAndSelectChoiceByValue(val) {
      var _this25 = this;

      var choices = this._store.choices; // Check 'value' property exists and the choice isn't already selected

      var foundChoice = choices.find(function (choice) {
        return _this25.config.valueComparer(choice.value, val);
      });

      if (foundChoice && !foundChoice.selected) {
        this._addItem({
          value: foundChoice.value,
          label: foundChoice.label,
          choiceId: foundChoice.id,
          groupId: foundChoice.groupId,
          customProperties: foundChoice.customProperties,
          placeholder: foundChoice.placeholder,
          keyCode: foundChoice.keyCode
        });
      }
    }
  }, {
    key: "_generatePlaceholderValue",
    value: function _generatePlaceholderValue() {
      if (this._isSelectElement) {
        var placeholderOption = this.passedElement.placeholderOption;
        return placeholderOption ? placeholderOption.text : false;
      }

      var _this$config4 = this.config,
          placeholder = _this$config4.placeholder,
          placeholderValue = _this$config4.placeholderValue;
      var dataset = this.passedElement.element.dataset;

      if (placeholder) {
        if (placeholderValue) {
          return placeholderValue;
        }

        if (dataset.placeholder) {
          return dataset.placeholder;
        }
      }

      return false;
    }
  }], [{
    key: "defaults",
    get: function get() {
      return Object.preventExtensions({
        get options() {
          return USER_DEFAULTS;
        },

        get templates() {
          return TEMPLATES;
        }

      });
    }
  }]);

  return Choices;
}();

/* harmony default export */ var scripts_choices = __webpack_exports__["default"] = (choices_Choices);

/***/ })
/******/ ])["default"];
});