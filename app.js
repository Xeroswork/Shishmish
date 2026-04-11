// ===== CART LOGIC =====

const PHONE = '359897728878';

function changeQty(btn, delta) {
  const qtyEl = btn.parentElement;
  const valEl = qtyEl.querySelector('.qty__val');
  let val = parseInt(valEl.textContent) + delta;
  if (val < 0) val = 0;
  valEl.textContent = val;
  updateTotal();
}

function updateTotal() {
  let total = 0;
  const items = [];

  document.querySelectorAll('.qty').forEach(qtyEl => {
    const price = parseFloat(qtyEl.dataset.price);
    const name  = qtyEl.dataset.name;
    const qty   = parseInt(qtyEl.querySelector('.qty__val').textContent);
    if (qty > 0) {
      total += price * qty;
      items.push(`${name} x${qty}`);
    }
  });

  document.getElementById('total').textContent = total.toFixed(2).replace('.', '.') + ' €';

  const orderBtns = document.getElementById('order-btns');
  if (total > 0) {
    orderBtns.style.display = 'flex';
    const msg = encodeURIComponent('Здравейте! Искам да поръчам:\n' + items.join('\n') + '\nОбщо: ' + total.toFixed(2) + ' €');
    document.getElementById('wa-link').href    = `https://wa.me/${PHONE}?text=${msg}`;
    document.getElementById('viber-link').href = `viber://chat?number=${PHONE}&text=${msg}`;
  } else {
    orderBtns.style.display = 'none';
  }
}

// ===== SMOOTH SCROLL for older browsers =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== HEADER scroll shadow =====
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 10
    ? '0 4px 24px rgba(0,0,0,0.5)'
    : 'none';
});
