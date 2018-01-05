var uuid = require('uuid')
var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')
var Schema = mongoose.Schema
var Validators = require('./validators')

/**
 * Naming conventions:
 * - Table/Schema names:
 * -- are singular
 * -- are PascalCase
 * --- I understand some databases aren't case-sensitive, but this is a necessary evil to have the same variable
 *     names in code as we have in the database. If they represent the same data, it's nice to have the same widgetName.
 * - Key/Column names:
 * -- are singular
 * -- are camelCase
 * - Junction tables are a combination of both table names appended one after another in alphabetical order, separated by an X.
 * -- Example, junction table between Product & Order = OrderXProduct
 * - Names should be descriptive to avoid collision in the future. Instead of naming the WidgetAttribute just
 * Attribute, we widgetName it WidgetAttribute. If, later, we figure out it really is just an Attribute that can apply to
 * more than just widgets, we can handle it then. It's better to start with a more limited scope and have to make it
 * broader than making a broad scope and having it collide with something else.
 * -- Don't worry too much about table widgetName length. Brevity is nice, but if we can't accomplish this while also being
 *    descriptive, we shouldn't mind a longer widgetName.
 */

/**
 * @key context: String - represents the functionName where this error occurred, perhaps even class#functionName if a
 *        class exists.
 * @key code: String - Category of log and few word summary of info to be logged.
 *        (i.e. http/404, or auth/user-logged-in)
 * @key message: String - User-friendly description of what happened
 * @key data: String - Any data that helps figure out what was happeneing (should be JSON serializable string)
 *        during the time of this error. (i.e. If a user is logging in, it's helpful to pass in the userId or username)
 */
var WidgetsRUsErrorSchema = new Schema({
  context: String,
  code: String,
  message: String,
  data: Schema.Types.Mixed,
}, {timestamps: true})

/**
 * @key _id: String - A UUID (universally unique identifier) for each widget. This will allow a widget to be
 *        loosely coupled to the Products table. I don't want widgets to inherently have a quantity or price, and I
 *        don't want to require a Product be a widget. As such, a widget will have a UUID which the products table
 *        can reference. That way, in the future, a product can be anything that has a UUID as its 'primary key,' and
 *        not only a widget.
 * @key widgetName: String - represents the widgetName of this widget, generally a combination of its type, finish, and size.
 */
var WidgetSchema = new Schema({
  _id: {type: String, default: uuid },
  widgetName: String
})

/**
 * @key widgetAttributeForm: String - represents a user-defined widget attribute. Examples include 'Haunted' or
 *        'Crawling with critters.'
 */
var WidgetAttributeSchema = new Schema({
  widgetAttributeName: {type: String, unique: true}
})

/**
 * This is a junction table joining WidgetAttribute to Widget because Widget can have many Attributes,
 * and Attributes can be attached to many Widget.
 *
 * @key widgetAttributeId: Mongoose.Schema.Types.ObjectId - foreign key to WidgetAttribute table.
 * @key widgetId: String - foreign key to Widget table.
 */
var WidgetXWidgetAttributeSchema = new Schema({
  widgetId: {type: String, ref: 'Widget'},
  widgetAttributeId: {type: Schema.Types.ObjectId, ref: 'WidgetAttribute'},
})

/**
 * @key parentId: Mongoose.Schema.Types.ObjectId - foreign key to WidgetCategory table. Think of this field
 *        as the parent of this category.
 * @key widgetCategoryName: String - represents the widget category. Examples include Size, Finish, Type, Texture, etc.
 */
var WidgetCategorySchema = new Schema({
  parentId: {type: Schema.Types.ObjectId, ref: 'WidgetCategory'},
  widgetCategoryName: String
})

/**
 * @key parentId: Mongoose.Schema.Types.ObjectId - foreign key to WidgetCategory table. Think of this field
 *        as the parent of this option.
 * @key widgetCategoryOptionName: String - represents an option for the widget category. Examples include:
 *        let widgetCategoryName = scent, widgetCategoryOptionName might be sweet, fruity, pungent, musky.
 */
var WidgetCategoryOptionSchema = new Schema({
  parentId: {type: Schema.Types.ObjectId, ref: 'WidgetCategory'},
  widgetCategoryOptionName: String
})

/**
 * This schema represents a junction table between a widget category option and a widget. We
 * can recover the category by looking up the widgetCategoryOptionId in the WidgetCategoryOption table
 * and following the associated parentId.
 *
 * @key widgetsId: Mongoose.Schema.Types.ObjectId - foreign key to Widget table.
 * @key widgetCategoryOptionId: String - foreign key to WidgetCategoryOption table.
 */
var WidgetXWidgetCategoryOptionSchema = new Schema({
  widgetId: {type: String, ref: 'Widget'},
  widgetCategoryOptionId: {type: Schema.Types.ObjectId, ref: 'WidgetCategoryOption'},
})

/**
 * @key username: String - represents the widgetName of the user in our system.
 *        TODO(ajmed): add authentication, email address, mailing address, billing info, etc.
 */
var WidgetsRUsUserSchema = new Schema({
  username: String,
})

/**
 * @key widgetsRUsUserId: Mongoose.Schema.Types.ObjectId - foreign key to WidgetsRUsUser table.
 */
var OrderSchema = new Schema({
  widgetsRUsUserId: {type: Schema.Types.ObjectId, unique: true, ref: 'WidgetsRUsUser'}
})

/**
 * @key merchandiseId: String - UUID of the merchandise. For now that only includes widgets.
 * @key productName: String - represents the productName of the product to sell. This value will be listed in the store.
 * @key quantity: Number - The amount we have in stock of this product.
 * @key price: Number - The price of the product.
 */
var ProductSchema = new Schema({
  merchandiseId: String,
  productName: String,
  quantity: Number,
  price: Number,
})

/**
 * This Schema represents a junction table between an order created by a user and the products in that order.
 *
 * @key orderId: Mongoose.Schema.Types.ObjectId - foreign key to Order table.
 * @key orderId: Mongoose.Schema.Types.ObjectId - foreign key to Product table.
 * @key quantityToBuy: Number - number of specified products in this order.
 */
var OrderXProductSchema = new Schema({
  orderId: {type: Schema.Types.ObjectId, ref: 'Order'},
  productId: {type: Schema.Types.ObjectId, ref: 'Product'},
  quantityToBuy: Number
})

WidgetSchema.plugin(mongoosePaginate)

WidgetCategoryOptionSchema.pre('remove', function(next) {
  WidgetXWidgetCategoryOption.remove({widgetCategoryOptionId: this._id}).exec()
  next()
})

// Ensure we have cascading delete functionality (i.e. when a category is deleted
// the widget is no longer referencing that category).
WidgetCategorySchema.pre('remove', function(next) {
  WidgetCategory.remove({parentId: this._id}).exec()
  WidgetCategoryOption.remove({parentId: this._id}).exec()
  next()
})

WidgetCategorySchema.index({parentId: 1, widgetCategoryName: 1}, {unique: true})
WidgetCategoryOptionSchema.index({parentId: 1, widgetCategoryOptionName: 1}, {unique: true})

WidgetAttributeSchema.pre('remove', function(next) {
  WidgetXWidgetAttribute.remove({widgetAttributeId: this._id}).exec()
  next()
})

ProductSchema.pre('remove', function(next) {
  OrderXProduct.remove({productId: this._id}).exec()
  next()
})

WidgetSchema.pre('remove', function(next) {
  WidgetXWidgetAttribute.remove({widgetId: this._id}).exec()
  WidgetXWidgetCategoryOption.remove({widgetId: this._id}).exec()
  Product.remove({merchandiseId: this._id}).exec()
  next()
})

WidgetsRUsUserSchema.pre('remove', function(next) {
  Order.remove({widgetsRUsUserId: this._id}).exec()
  next()
})

// Define the model objects using the schemas
const WidgetsRUsError = mongoose.model('WidgetsRUsError', WidgetsRUsErrorSchema)
const Widget = mongoose.model('Widget', WidgetSchema)
const WidgetAttribute = mongoose.model('WidgetAttribute', WidgetAttributeSchema)
const WidgetXWidgetAttribute = mongoose.model('WidgetXWidgetAttribute', WidgetXWidgetAttributeSchema)
const WidgetCategory = mongoose.model('WidgetCategory', WidgetCategorySchema)
const WidgetCategoryOption = mongoose.model('WidgetCategoryOption', WidgetCategoryOptionSchema)
const WidgetXWidgetCategoryOption = mongoose.model('WidgetXWidgetCategoryOption', WidgetXWidgetCategoryOptionSchema)
const WidgetsRUsUser = mongoose.model('WidgetsRUsUser', WidgetsRUsUserSchema)
const Product = mongoose.model('Product', ProductSchema)
const Order = mongoose.model('Order', OrderSchema)
const OrderXProduct = mongoose.model('OrderXProduct', OrderXProductSchema)

module.exports = {
  WidgetsRUsError: WidgetsRUsError,
  Widget: Widget,
  WidgetAttribute: WidgetAttribute,
  WidgetXWidgetAttribute: WidgetXWidgetAttribute,
  WidgetCategory: WidgetCategory,
  WidgetCategoryOption: WidgetCategoryOption,
  WidgetXWidgetCategoryOption: WidgetXWidgetCategoryOption,
  WidgetsRUsUser: WidgetsRUsUser,
  Product: Product,
  Order: Order,
  OrderXProduct: OrderXProduct,

  Validators: Validators
}
