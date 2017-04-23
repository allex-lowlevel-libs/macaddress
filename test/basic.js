var expect = require('chai').expect,
  Checks = require('allex_checkslowlevellib'),
  MacAddrLib = require('..')(Checks.isFunction, Checks.isArray),
  _macaddress;

describe('Basic tests', function () {
  it('Get mac address', function (done) {
    MacAddrLib.getMac(function (err, macaddress) {
      expect(err).to.equal(null);
      _macaddress = macaddress;
      done();
      done = null;
    });
  });
  it('Check if isMac', function () {
    expect(MacAddrLib.isMac(_macaddress)).to.equal(true);
  });
});
