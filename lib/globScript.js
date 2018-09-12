'use strict';

window.ClientCoverage = {
  LocalStorageWrapper: {
    getLocalStorage: function getLocalStorage(property, defaultVal) {
      if (localStorage.hasOwnProperty(property)) {
        Object.assign(defaultVal, JSON.parse(localStorage.getItem(property)));
        localStorage.setItem(property, JSON.stringify(defaultVal));return defaultVal;
      }
      localStorage.setItem(property, JSON.stringify(defaultVal));return defaultVal || {};
    },
    clearLocalStorage: function clearLocalStorage(property) {
      localStorage.removeItem(property);
    }
  }, JS: {
    jsMethodInstrumentObject: {}, jsStorageKey: 'jsClientCoverageObject', init: function init() {
      this.jsMethodInstrumentObject = ClientCoverage.LocalStorageWrapper.getLocalStorage(this.jsStorageKey, this.jsMethodInstrumentObject);
    },
    visitMethod: function visitMethod(jsFileName, jsMethodName) {
      this.init();if (this.jsMethodInstrumentObject.hasOwnProperty(jsFileName)) {
        if (!this.jsMethodInstrumentObject[jsFileName].includes(jsMethodName)) {
          this.jsMethodInstrumentObject[jsFileName].push(jsMethodName);
        }
      } else {
        this.jsMethodInstrumentObject[jsFileName] = [];this.jsMethodInstrumentObject[jsFileName].push(jsMethodName);
      }
      localStorage.setItem(this.jsStorageKey, JSON.stringify(this.jsMethodInstrumentObject));
    },
    clear: function clear() {
      this.jsMethodInstrumentObject = {};ClientCoverage.LocalStorageWrapper.clearLocalStorage(this.jsStorageKey);
    },
    getData: function getData() {
      return { methods: this.jsMethodInstrumentObject };
    }
  }, getCoverageData: function getCoverageData() {
    return { JS: this.JS.getData() };
  },
  clear: function clear() {
    this.JS.clear();
  },
  init: function init() {
    this.JS.init();
  }
};