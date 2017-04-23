// Taken from https://github.com/bevry/getmac, js-ed from coffeescript
var exec = require('child_process').exec;
function createMacAddressLib(isFunction, isArray) {
  'use strict';
  var getMac, isMac, isWindows, macRegex, zeroRegex;


  function extractOpts(opts, next, config) {
    var completionCallbackName, i, len, ref;
    if (config == null) {
      config = {};
    }
    if ((config.completionCallbackNames != null) === false) {
      config.completionCallbackNames = ['next'];
    } else if (isArray(config.completionCallbackNames) === false) {
      config.completionCallbackNames = [config.completionCallbackNames];
    }
    if (isFunction(opts) && (next != null) === false) {
      next = opts;
      opts = {};
    } else {
      opts || (opts = {});
    }
    if (!next) {
      ref = config.completionCallbackNames;
      for (i = 0, len = ref.length; i < len; i++) {
        completionCallbackName = ref[i];
        next = opts[completionCallbackName];
        delete opts[completionCallbackName];
        if (next) {
          break;
        }
      }
    }
    next || (next = null);
    return [opts, next];
  };

  isWindows = (typeof window === 'undefined') ? process.platform.indexOf('win') === 0 : false;

  macRegex = /(?:[a-z0-9]{1,2}[:\-]){5}[a-z0-9]{1,2}/ig;

  zeroRegex = /(?:[0]{2}[:\-]){5}[0]{2}/;

  function extractMac (data, next) {
    var err, isZero, macAddress, match, result;
    result = null;
    while (match = macRegex.exec(data)) {
      macAddress = match[0];
      isZero = zeroRegex.test(macAddress);
      if (isZero === false) {
        if (result == null) {
          result = macAddress;
        }
      }
    }
    if (result === null) {
      err = new Error('could not determine the mac address from:\n' + data);
      return next(err);
    }
    return next(null, result);
  };

  function onExtractMacProc (next, err, stdout, stderr) {
    if (err) {
      return next(err);
    }
    return extractMac(stdout, next);
  }

  getMac = function(opts, next) {
    var command, data, ref;
    ref = extractOpts(opts, next), opts = ref[0], next = ref[1];
    if(typeof window !== 'undefined'){
      next(null,'00:00:00:00:00:00');
      return;
    }
    data = opts.data;
    if (data == null) {
      data = null;
    }
    command = isWindows ? "getmac" : "ifconfig || ip link";
    if (data) {
      return extractMac(data, next);
    } else {
      return exec(command, onExtractMacProc.bind(null, next));
    }
  };

  isMac = function(macAddress) {
    var ref;
    return ((ref = String(macAddress).match(macRegex)) != null ? ref.length : void 0) === 1;
  };

  return {
    macRegex: macRegex,
    getMac: getMac,
    isMac: isMac
  };

}

module.exports = createMacAddressLib;

