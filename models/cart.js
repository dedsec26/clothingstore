module.exports = function (oldcart) {
  this.items = oldcart.items || {};
  this.totalQty = oldcart.totalQty || 0;
  this.totalPrice = oldcart.totalPrice || 0;

  this.add = (item, id) => {
    let storedItem = this.items[id];
    if (!storedItem)
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice = this.totalPrice + storedItem.item.price;
  };

  this.reduceOne = (id) => {
    this.items[id].qty--;
    this.items[id].price = this.items[id].price - this.items[id].item.price;
    this.totalQty--;
    this.totalPrice = this.totalPrice - this.items[id].item.price;
    if (this.items[id].qty <= 0) delete this.items[id];
  };

  this.remove = (id) => {
    this.totalQty = this.totalQty - this.items[id].qty;
    this.totalPrice =
      this.totalPrice - this.items[id].price * this.items[id].qty;
    delete this.items[id];
  };

  this.genArray = () => {
    let arr = [];
    for (const id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
};
