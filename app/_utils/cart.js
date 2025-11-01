// app/_utils/cart.js
export function getCart() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch {
    return [];
  }
}

export function setCart(cart) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCartItem(item) {
  // item expected: { product_id, product_name, unit_price, quantity, subtotal, image_url }
  if (typeof window === 'undefined') return;
  const cart = getCart();
  const idx = cart.findIndex(c => c.product_id === item.product_id);
  if (idx > -1) {
    cart[idx].quantity = (cart[idx].quantity || 0) + (item.quantity || 1);
    cart[idx].subtotal = cart[idx].unit_price * cart[idx].quantity;
  } else {
    cart.push({
      product_id: item.product_id,
      product_name: item.product_name,
      unit_price: item.unit_price,
      quantity: item.quantity || 1,
      subtotal: item.subtotal ?? (item.unit_price * (item.quantity || 1)),
      image_url: item.image_url ?? null
    });
  }
  setCart(cart);
}

export function removeFromCart(product_id) {
  if (typeof window === 'undefined') return;
  const newCart = getCart().filter(c => c.product_id !== product_id);
  setCart(newCart);
}

export function clearCart() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('cart');
}
