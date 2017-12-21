module.exports = {
  setUp: function (callback) {
    // setup test database connection
    this.foo = 'bar'
    callback()
  },
  tearDown: function(callback) {
    // cleanup test database connection
    callback()
  },
  testModel: function(test) {
    test.equals(this.foo, 'bar')
    test.done()
  }
}