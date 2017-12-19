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
 * - Junction tables are a simple combination of both table names appended one after another in alphabetical order.
 * -- For example, Product table & Order table = OrderProduct table
 * - Names should be descriptive to avoid collision in the future. For example, the WidgetType table could have been
 *   named Types, but Types is a very general word that could likely be used for some notion of Types in the future. To
 *   avoid that, we prepend the table name with Widget because it is, indeed, a WidgetType.
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
 * @key widgetType: String - represents the type a widget is. Examples include Prime, Elite, Extreme Edition, etc.
 */
var WidgetTypeSchema = new Schema({
  widgetType: String
})

/**
 * @key widgetFinish: String - represents the finish a widget has. Examples include Wood, Chrome, Matte, etc.
 */
var WidgetFinishSchema = new Schema({
  widgetFinish: String
})

/**
 * @key widgetSize: String - represents the size of a widget. Examples include Infinitesimal, Galactically Huge.
 */
var WidgetSizeSchema = new Schema({
  widgetSize: String
})

/**
 * @key _id: String - A UUID (universally unique identifier) for each widget. This will allow a widget to be
 *        loosely coupled to the Products table. I don't want widgets to inherently have a quantity or price, and I
 *        don't want to require a Product be a widget. As such, a widget will have a UUID which the products table
 *        can reference. That way, in the future, a product can be anything that has a UUID as its 'primary key,' and
 *        not only a widget.
 * @key name: String - represents the name of this widget, generally a combination of its type, finish, and size.
 * @key widgetTypeId: Mongoose.Schema.Types.ObjectId - foreign key to WidgetType table.
 * @key widgetFinishId: Mongoose.Schema.Types.ObjectId - foreign key to WidgetFinish table.
 * @key widgetSizeId: Mongoose.Schema.Types.ObjectId - foreign key to WidgetSize table.
 */
var WidgetSchema = new Schema({
  _id: {type: String, default: uuid.v1 },
  name: String,
  widgetTypeId: {type: Schema.Types.ObjectId, ref: 'WidgetType'},
  widgetFinishId: {type: Schema.Types.ObjectId, ref: 'WidgetFinish'},
  widgetSizeId: {type: Schema.Types.ObjectId, ref: 'WidgetSize'},
})

/**
 * @key customWidgetAttribute: String - represents a user-defined widget attribute. Examples include 'Haunted' or
 *        'Crawling with critters.'
 */
var CustomWidgetAttributeSchema = new Schema({
  customWidgetAttribute: String
})

/**
 * This is a junction table joining CustomWidgetAttribute to Widget because Widget can have many CustomAttributes,
 * and CustomAttributes can be attached to many Widget.
 *
 * @key customWidgetAttributeId: Mongoose.Schema.Types.ObjectId - foreign key to CustomWidgetAttribute table.
 * @key widgetId: Mongoose.Schema.Types.ObjectId - foreign key to Widget table.
 */
var CustomWidgetAttributeWidgetSchema = new Schema({
  customWidgetAttributeId: {type: Schema.Types.ObjectId, ref: 'CustomWidgetAttribute'},
  widgetId: {type: Schema.Types.ObjectId, ref: 'Widget'},
})

/**
 * @key customWidgetCategory: String - represents the custom widget category. Examples include Scent or Texture.
 */
var CustomWidgetCategorySchema = new Schema({
  customWidgetCategory: String
})

/**
 * @key customWidgetCategoryId: Mongoose.Schema.Types.ObjectId - foreign key to CustomWidgetCategory table.
 * @key customWidgetCategoryOption: String - represents an option for the custom widget category. Examples include:
 *        let customWidgetCategory = scent, customWidgetCategoryOption might be sweet, fruity, pungent, musky.
 */
var CustomWidgetCategoryOptionSchema = new Schema({
  customWidgetCategoryId: {type: Schema.Types.ObjectId, ref: 'CustomWidgetCategory'},
  customWidgetCategoryOption: String
})

/**
 * This schema represents a junction table between a custom widget category option and a widget.
 *
 * @key customWidgetCategoryOptionId: Mongoose.Schema.Types.ObjectId - foreign key to CustomWidgetCategoryOption table.
 * @key widgetsId: Mongoose.Schema.Types.ObjectId - foreign key to Widget table.
 */
var CustomWidgetCategoryOptionWidgetSchema = new Schema({
  customWidgetCategoryOptionId: {type: Schema.Types.ObjectId, ref: 'CustomWidgetCategoryOption'},
  widgetId: {type: Schema.Types.ObjectId, ref: 'Widget'},
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
var OrderProductSchema = new Schema({
  orderId: {type: Schema.Types.ObjectId, ref: 'Order'},
  productId: {type: Schema.Types.ObjectId, ref: 'Product'},
  quantityToBuy: Number
})

WidgetSchema.plugin(mongoosePaginate)

const widgetsRUsError = mongoose.model('WidgetsRUsError', WidgetsRUsErrorSchema)
const widgetType = mongoose.model('WidgetType', WidgetTypeSchema)
const widgetFinish = mongoose.model('WidgetFinish', WidgetFinishSchema)
const widgetSize = mongoose.model('WidgetSize', WidgetSizeSchema)
const widget = mongoose.model('Widget', WidgetSchema)
const customWidgetAttribute = mongoose.model('CustomWidgetAttribute', CustomWidgetAttributeSchema)
const customWidgetAttributeWidget = mongoose.model('CustomWidgetAttributeWidget', CustomWidgetAttributeWidgetSchema)
const customWidgetCategory = mongoose.model('CustomWidgetCategory', CustomWidgetCategorySchema)
const customWidgetCategoryOption = mongoose.model('CustomWidgetCategoryOption', CustomWidgetCategoryOptionSchema)
const customWidgetCategoryOptionWidget = mongoose.model('CustomWidgetCategoryOptionWidget', CustomWidgetCategoryOptionWidgetSchema)
const widgetsRUsUser = mongoose.model('WidgetsRUsUser', WidgetsRUsUserSchema)
const product = mongoose.model('Product', ProductSchema)
const order = mongoose.model('Order', OrderSchema)
const orderProduct = mongoose.model('OrderProduct', OrderProductSchema)

// TODO(ajmed): Verify mongoose does cascading deletes (like when deleting an order, it's also removed from
// the OrderProduct table

module.exports = {
  WidgetsRUsError: widgetsRUsError,
  WidgetType: widgetType,
  WidgetFinish: widgetFinish,
  WidgetSize: widgetSize,
  Widget: widget,
  CustomWidgetAttribute: customWidgetAttribute,
  CustomWidgetAttributeWidget: customWidgetAttributeWidget,
  CustomWidgetCategory: customWidgetCategory,
  CustomWidgetCategoryOption: customWidgetCategoryOption,
  CustomWidgetCategoryOptionWidget: customWidgetCategoryOptionWidget,
  WidgetsRUsUser: widgetsRUsUser,
  Product: product,
  Order: order,
  OrderProduct: orderProduct
}
