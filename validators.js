const WidgetValidator = {
  validate: function(widget, widgetAttributes, widgetCategoryOptions) {
    if (!widget) {
      return 'Failed validation: widget was falsy'
    } else if (!widgetAttributes) {
      return 'Failed validation: widgetAttributes was falsy'
    } else if (!widgetCategoryOptions) {
      return 'Failed validation: widgetCategoryOptions was falsy'
    }

    return 'pass'
    // ensure all the attributes and categoryOptions are valid
  }
}

const WidgetsRUsUserValidator = {
  validate: function(widgetsRUsUser) {
    if (!widgetsRUsUser.username) {
      return 'Failed validation: username was falsy'
    } else if (!widgetsRUsUser.username.match(/^[a-z0-9_-]{3,15}$/)) {
      return 'Failed validation: Invalid username, must be between 3 & 15 characters and may contain only letters, numbers, and hyphens'
    }

    return 'pass'
  }
}

const OrderValidator = {
  validate: function(order) {

  }
}

const ProductValidator = {
  validate: function(product) {

  }
}

module.exports = {
  WidgetValidator: WidgetValidator,
  WidgetsRUsUserValidator: WidgetsRUsUserValidator,
  OrderValidator: OrderValidator,
  ProductValidator: ProductValidator
}
