var uuid = require('node-uuid')
var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')
var Schema = mongoose.Schema

/**
 * Naming conventions:
 * - Table/Schema names:
 * -- are singular
 * -- are PascalCase
 * --- I understand some databases aren't case-sensitive, but this is a necessary evil to have the same variable
 *     names in code as we have in the database. If they represent the same data, it's nice to have the same name.
 * - Key/Column names:
 * -- are singular
 * -- are camelCase
 * - Junction tables are a combination of both table names appended one after another in alphabetical order, separated by an X.
 * -- Example, junction table between Product & Order = OrderXProduct
 * - Names should be descriptive to avoid collision in the future. Instead of naming the WidgetAttribute just
 * Attribute, we name it WidgetAttribute. If, later, we figure out it really is just an Attribute that can apply to
 * more than just widgets, we can handle it then. It's better to start with a more limited scope and have to make it
 * broader than making a broad scope and having it collide with something else.
 * -- Don't worry too much about table name length. Brevity is nice, but if we can't accomplish this while also being
 *    descriptive, we shouldn't mind a longer name.
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
  data: String,
}, {timestamps: true})

/**
 * @key _id: String - A UUID (universally unique identifier) for each widget. This will allow a widget to be
 *        loosely coupled to the Products table. I don't want widgets to inherently have a quantity or price, and I
 *        don't want to require a Product be a widget. As such, a widget will have a UUID which the products table
 *        can reference. That way, in the future, a product can be anything that has a UUID as its 'primary key,' and
 *        not only a widget.
 * @key name: String - represents the name of this widget, generally a combination of its type, finish, and size.
 */
var WidgetSchema = new Schema({
  _id: {type: String, default: uuid },
  name: String
})

/**
 * @key widgetAttribute: String - represents a user-defined widget attribute. Examples include 'Haunted' or
 *        'Crawling with critters.'
 */
var WidgetAttributeSchema = new Schema({
  widgetAttribute: String
})

/**
 * This is a junction table joining WidgetAttribute to Widget because Widget can have many Attributes,
 * and Attributes can be attached to many Widget.
 *
 * @key widgetAttributeId: Mongoose.Schema.Types.ObjectId - foreign key to WidgetAttribute table.
 * @key widgetId: Mongoose.Schema.Types.ObjectId - foreign key to Widget table.
 */
var WidgetXWidgetAttributeSchema = new Schema({
  widgetId: {type: Schema.Types.ObjectId, ref: 'Widget'},
  widgetAttributeId: {type: Schema.Types.ObjectId, ref: 'WidgetAttribute'},
})

/**
 * @key widgetCategory: String - represents the widget category. Examples include Size, Finish, Type, Texture, etc.
 */
var WidgetCategorySchema = new Schema({
  widgetCategory: String
})

/**
 * @key widgetCategoryId: Mongoose.Schema.Types.ObjectId - foreign key to WidgetCategory table.
 * @key widgetCategoryOption: String - represents an option for the widget category. Examples include:
 *        let widgetCategory = scent, widgetCategoryOption might be sweet, fruity, pungent, musky.
 */
var WidgetCategoryOptionSchema = new Schema({
  widgetCategoryId: {type: Schema.Types.ObjectId, ref: 'WidgetCategory'},
  widgetCategoryOption: String
})

/**
 * This schema represents a junction table between a widget category option and a widget. We
 * can recover the category by looking up the widgetCategoryOptionId in the WidgetCategoryOption table
 * and following the associated widgetCategoryId.
 *
 * @key widgetsId: Mongoose.Schema.Types.ObjectId - foreign key to Widget table.
 * @key widgetCategoryOptionId: Mongoose.Schema.Types.ObjectId - foreign key to WidgetCategoryOption table.
 */
var WidgetXWidgetCategoryOptionSchema = new Schema({
  widgetId: {type: Schema.Types.ObjectId, ref: 'Widget'},
  widgetCategoryOptionId: {type: Schema.Types.ObjectId, ref: 'WidgetCategoryOption'},
})

/**
 * @key username: String - represents the name of the user in our system.
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
 * @key name: String - represents the name of the product to sell. If the referenced product has a name, we can fallback
 *        to that.
 * @key quantity: Number - The amount we have in stock of this product.
 * @key price: Number - The price of the product.
 */
var ProductSchema = new Schema({
  merchandiseId: String,
  name: String,
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

const widgetsRUsError = mongoose.model('WidgetsRUsError', WidgetsRUsErrorSchema)
const widget = mongoose.model('Widget', WidgetSchema)
const widgetAttribute = mongoose.model('WidgetAttribute', WidgetAttributeSchema)
const widgetXWidgetAttribute = mongoose.model('WidgetXWidgetAttribute', WidgetXWidgetAttributeSchema)
const widgetCategory = mongoose.model('WidgetCategory', WidgetCategorySchema)
const widgetCategoryOption = mongoose.model('WidgetCategoryOption', WidgetCategoryOptionSchema)
const widgetXWidgetCategoryOption = mongoose.model('WidgetXWidgetCategoryOption', WidgetXWidgetCategoryOptionSchema)
const widgetsRUsUser = mongoose.model('WidgetsRUsUser', WidgetsRUsUserSchema)
const product = mongoose.model('Product', ProductSchema)
const order = mongoose.model('Order', OrderSchema)
const orderXProduct = mongoose.model('OrderXProduct', OrderXProductSchema)

// TODO(ajmed): Verify mongoose does cascading deletes (like when deleting an order, it's also removed from
// the OrderProduct table

module.exports = {
  WidgetsRUsError: widgetsRUsError,
  Widget: widget,
  WidgetAttribute: widgetAttribute,
  WidgetXWidgetAttribute: widgetXWidgetAttribute,
  WidgetCategory: widgetCategory,
  WidgetCategoryOption: widgetCategoryOption,
  WidgetXWidgetCategoryOption: widgetXWidgetCategoryOption,
  WidgetsRUsUser: widgetsRUsUser,
  Product: product,
  Order: order,
  OrderXProduct: orderXProduct
}
