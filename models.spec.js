module.exports = {
  setUp: function (callback) {
    // setup
    this.foo = 'bar'
    callback()
  },
  tearDown: function(callback) {
    // cleanup
    callback()
  },
  testModel: function(test) {
    test.equals(this.foo, 'bar')
    test.done()
  }
}