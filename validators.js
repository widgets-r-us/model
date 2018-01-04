var ValidatorJs = require('validator')

// TODO(ajmed): a validate call should check that all fields exist and are valid.
// TODO(ajmed): a validateSubset call should only validate the passed in fields.

const basicTextRegex = /^[A-z0-9~`!@#$%^&*()_+=:,?-]$/
const usernameRegex = /^[A-z0-9_-]{3,15}$/

const pass = 'pass'

const WidgetValidator = {
  validate: function (widget) {
    try {
      if (!widget)
        return 'Failed validation: widget was falsy'
      else if (typeof widget._id === 'undefined' || !ValidatorJs.isMongoId(widget._id))
        return 'Failed validation: widget either has no id or an invalid id'
      else if (typeof widget.name === 'undefined' || !ValidatorJs.isLength(widget.name, {min: 2, max: 256}))
        return 'Failed validation: widget name must be between 2 and 256 characters'
      else if (!widget.name.match(basicTextRegex))
        return 'Failed validation: must only contain alphanumerics, spaces, and the following special characters: ' +
            '~, `, !, @, #, $, %, ^, &, *, (, ), _, -, +, =, |, :, ,, ?.'
    } catch(e) {
      return 'Failed validation: ' + e.message
    }

    return pass
  },
  validateSubset: function (widget) {
    try {
      if (typeof widget._id !== 'undefined' && !ValidatorJs.isMongoId('' + widget._id))
        return 'Failed validation: invalid widget id'
      else if (typeof widget.name !== 'undefined' && !ValidatorJs.isLength(widget.name, {min: 2, max: 256}))
        return 'Failed validation: widget name must be inclusive-between 2 and 256 characters'
      else if (typeof widget.name !== 'undefined' && !widget.name.match(basicTextRegex))
        return 'Failed validation: widget name must only contain alphanumerics, spaces, and the following special characters: ' +
            '~, `, !, @, #, $, %, ^, &, *, (, ), _, -, +, =, |, :, ,, ?.'
    } catch(e) {
      return 'Failed validation: ' + e.message
    }

    return pass
  }
}

const WidgetsRUsUserValidator = {
  validate: function (widgetsRUsUser) {
    try {
      if (!widgetsRUsUser)
        return 'Failed validation: Widgets R Us user was falsy'
      else if (typeof widgetsRUsUser.username === 'undefined' || !widgetsRUsUser.username)
        return 'Failed validation: username was falsy'
      else if (!widgetsRUsUser.username.match(usernameRegex))
        return 'Failed validation: Invalid username, must be between 3 & 15 characters and may contain only letters, numbers, and hyphens'
    } catch(e) {
      return 'Failed validation: ' + e.message
    }

    return pass
  },
  validateSubset: function () {
    try {

    } catch(e) {
      return 'Failed validation: ' + e.message
    }
    return pass
  }
}

const OrderValidator = {
  validate: function (order) {
    try {

    } catch(e) {
      return 'Failed validation: ' + e.message
    }
    return pass
  },
  validateSubset: function () {
    try {

    } catch(e) {
      return 'Failed validation: ' + e.message
    }
    return pass
  }
}

const ProductValidator = {
  validate: function (product) {
    try {

    } catch(e) {
      return 'Failed validation: ' + e.message
    }
    return pass
  },
  validateSubset: function (product) {
    try {

    } catch(e) {
      return 'Failed validation: ' + e.message
    }
    return pass
  }
}
const WidgetCategoryValidator = {
  validate: function (widgetCategory) {
    try {
      if (!widgetCategory)
        return 'Failed validation: widget category was falsy'
      else if (typeof widgetCategory.parentId === 'undefined' || !ValidatorJs.isMongoId('' + widgetCategory.parentId))
        return 'Failed validation: invalid widget category parentId'
      else if (typeof widgetCategory._id === 'undefined' || !ValidatorJs.isMongoId('' + widgetCategory._id))
        return 'Failed validation: invalid widget category id'
      else if (typeof widgetCategory.widgetCategory === 'undefined' || !widgetCategory.widgetCategory.match(/^[A-z0-9\s~`@#$%^&*()_+=:,?-]{2,48}$/))
        return 'Failed validation: must be inclusive-between 2 and 48 and may only contain alphanumerics, spaces, and the following special characters: ' +
            '~, `, !, @, #, $, %, ^, &, *, (, ), _, -, +, =, |, :, ,, ?.'
    } catch(e) {
      return 'Failed validation: ' + e.message
    }

    return pass
  },
  validateSubset: function (model) {
    try {

    } catch(e) {
      return 'Failed validation: ' + e.message
    }
    return pass
  }
}
const WidgetCategoryOptionValidator = {
  validate: function (model) {
    try {

    } catch(e) {
      return 'Failed validation: ' + e.message
    }
    return pass
  },
  validateSubset: function (model) {
    try {

    } catch(e) {
      return 'Failed validation: ' + e.message
    }
    return pass
  }
}
const WidgetAttributeValidator = {
  validate: function (model) {
    try {

    } catch(e) {
      return 'Failed validation: ' + e.message
    }
    return pass
  },
  validateSubset: function (model) {
    try {

    } catch(e) {
      return 'Failed validation: ' + e.message
    }
    return pass
  }
}
const WidgetXWidgetAttributeValidator = {
  validate: function (model) {
    try {

    } catch(e) {
      return 'Failed validation: ' + e.message
    }
    return pass
  },
  validateSubset: function (model) {
    try {

    } catch(e) {
      return 'Failed validation: ' + e.message
    }
    return pass
  }
}
const WidgetXWidgetCategoryOptionValidator = {
  validate: function (model) {
    try {

    } catch(e) {
      return 'Failed validation: ' + e.message
    }
    return pass
  },
  validateSubset: function (model) {
    try {

    } catch(e) {
      return 'Failed validation: ' + e.message
    }
    return pass
  }
}
// validator validates that these are mongoIds
const OrderXProductValidator = {
  validate: function (model) {
    try {

    } catch(e) {
      return 'Failed validation: ' + e.message
    }
    return pass
  },
  validateSubset: function () {
    try {

    } catch(e) {
      return 'Failed validation: ' + e.message
    }
    return pass
  }
}


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
