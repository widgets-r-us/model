var ValidatorJs = require('validator')

// TODO(ajmed): a validate call should check that all fields exist and are valid.
// TODO(ajmed): a validateSubset call should only validate the passed in fields.

const basicTextRegex = /^[A-z0-9~`!@#$%^&*()_+=:,?\/-]$/
const usernameRegex = /^[A-z0-9_-]{3,15}$/

const WidgetValidator = {
  validate: function(widget) {
    if (!widget)
      return 'Failed validation: widget was falsy'
    else if (typeof widget._id === 'undefined' || !ValidatorJs.isMongoId(widget._id))
      return 'Failed validation: widget either has no id or an invalid id'
    else if (typeof widget.name === 'undefined' || !ValidatorJs.isLength(widget.name, {min: 2, max: 256}))
      return 'Failed validation: widget name must be between 2 and 256 characters'
    else if (!widget.name.match(basicTextRegex))
      return 'Must only contain alphanumeric characters, spaces, and the following special characters: ' +
          '~, `, !, @, #, $, %, ^, &, *, (, ), _, -, +, =, |, :, ,, ?, /.'

    return 'pass'
  },
  validateSubset: function(widget) {
    if (typeof widget._id !== 'undefined' && !ValidatorJs.isMongoId(widget._id))
      return 'Failed validation: invalid widget id'
    else if (typeof widget.name !== 'undefined' && !ValidatorJs.isLength(widget.name, {min: 2, max: 256}))
      return 'Failed validation: widget name must be inclusive-between 2 and 256 characters'

    return 'pass'
  }
}

const WidgetsRUsUserValidator = {
  validate: function(widgetsRUsUser) {
    if (!widgetsRUsUser.username)
      return 'Failed validation: username was falsy'
    else if (!widgetsRUsUser.username.match(usernameRegex))
      return 'Failed validation: Invalid username, must be between 3 & 15 characters and may contain only letters, numbers, and hyphens'

    return 'pass'
  },
  validateSubset: function() {

  }
}

const OrderValidator = {
  validate: function(order) {

  },
  validateSubset: function() {

  }
}

const BaseValidator = {
  validate: function(model) {
    if (!model.matches(/^[A-z0-9\s~`@#$%^&*()_+=:,?\/-]{2,48}$/)) {
      return 'Must only contain alphanumeric characters, spaces, and the following special characters: ' +
          '~, `, !, @, #, $, %, ^, &, *, (, ), _, -, +, =, |, :, ,, ?, /.'
    }
  }
}

const ProductValidator = {
  validate: function(model) {

  },
  validateSubset: function(model) {

  }}
const WidgetCategoryValidator = {validate: function(model) {}, validateSubset: function(model) {}}
const WidgetCategoryOptionValidator = {validate: function(model) {}, validateSubset: function(model) {}}
const WidgetAttributeValidator = {validate: function(model) {}, validateSubset: function(model) {}}
const WidgetXWidgetAttributeValidator = {validate: function(model) {}, validateSubset: function(model) {}}
const WidgetXWidgetCategoryOptionValidator = {validate: function(model) {}, validateSubset: function(model) {}}
// validator validates that these are mongoIds
const OrderXProductValidator = {validate: function(model) {}, validateSubset: function() {}}


module.exports = {
  WidgetValidator: WidgetValidator,
  WidgetsRUsUserValidator: WidgetsRUsUserValidator,
  OrderValidator: OrderValidator,
  ProductValidator: ProductValidator,
  WidgetCategoryValidator: WidgetCategoryValidator,
  WidgetCategoryOptionValidator: WidgetCategoryOptionValidator,
  WidgetAttributeValidator: WidgetAttributeValidator,
  WidgetXWidgetAttributeValidator: WidgetXWidgetAttributeValidator,
  WidgetXWidgetCategoryOptionValidator: WidgetXWidgetCategoryOptionValidator,
  OrderXProductValidator: OrderXProductValidator
}
