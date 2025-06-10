// --- ข้อมูลเมนูและท็อปปิ้ง (แก้ไขตรงนี้ได้เลย!) ---
const menu = {
    id: 'mee-kai-chick',
    name: 'หมี่ไก่ฉีก',
    price: 50 // สามารถเปลี่ยนราคาหมี่ไก่ฉีกตรงนี้
};

const chiliPaste = { // ข้อมูลน้ำพริกกากหมู
    id: 'chili-paste-jar',
    name: 'น้ำพริกกากหมู',
    price: 10 // ราคา 10 บาท ตามที่คุณต้องการ
};


// --- ส่วนเชื่อมกับหน้าเว็บ ---
const homepage = document.getElementById('homepage');
const orderpage = document.getElementById('orderpage');
const confirmationpage = document.getElementById('confirmationpage');

const orderNowBtn = document.getElementById('orderNowBtn');
const backToHomeBtn = document.getElementById('backToHomeBtn');
const confirmOrderBtn = document.getElementById('confirmOrderBtn');

const quantityDisplay = document.getElementById('quantity');
const decreaseQtyBtn = document.getElementById('decreaseQty');
const increaseQtyBtn = document.getElementById('increaseQty');

// เพิ่มสำหรับน้ำพริกกากหมู
const chiliQuantityDisplay = document.getElementById('chiliQuantity');
const decreaseChiliQtyBtn = document.getElementById('decreaseChiliQty');
const increaseChiliQtyBtn = document.getElementById('increaseChiliQty');

const toppingsContainer = document.getElementById('toppingsContainer');
const totalPriceDisplay = document.getElementById('totalPrice');

const customerNameInput = document.getElementById('customerName');
const customerPhoneInput = document.getElementById('customerPhone');
const customerAddressInput = document.getElementById('customerAddress');
const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
const qrCodeDisplay = document.getElementById('qrCodeDisplay');


// --- ตัวแปรสำหรับเก็บข้อมูลคำสั่งซื้อ ---
let currentQuantity = 1; // จำนวนหมี่ไก่ฉีก
let currentChiliQuantity = 0; // จำนวนน้ำพริกกากหมู (เริ่มต้นที่ 0)
let selectedToppings = {}; // เก็บสถานะว่าท็อปปิ้งไหนถูกเลือกบ้าง เช่น { 'egg': true, 'fishball': false }

// --- ฟังก์ชันการทำงาน ---

// โหลดท็อปปิ้งมาแสดงบนหน้าออเดอร์
function loadToppings() {
    toppingsContainer.innerHTML = ''; // ล้างท็อปปิ้งเก่า (ถ้ามี)
    toppings.forEach(item => { // <--- แก้ไขตรงนี้ (เปลี่ยน 'topping' เป็น 'item')
        const div = document.createElement('div');
        div.className = 'topping-item'; // เพิ่มคลาสเพื่อจัดสไตล์
        div.innerHTML = `
            <label>
                <input type="checkbox" id="topping-${item.id}" name="topping" value="${item.id}">
                ${item.name} <span>฿${item.price}</span>
            </label>
        `;
        toppingsContainer.appendChild(div);

        // เมื่อมีการเลือกท็อปปิ้ง ให้อัปเดตราคา
        div.querySelector(`input[id="topping-${item.id}"]`).addEventListener('change', (e) => {
            selectedToppings[item.id] = e.target.checked;
            updateTotalPrice();
        });
        // กำหนดค่าเริ่มต้นว่ายังไม่มีท็อปปิ้งถูกเลือก
        selectedToppings[item.id] = false;
    });
}

// คำนวณราคารวมทั้งหมด
function updateTotalPrice() {
    let basePrice = menu.price * currentQuantity;
    let toppingsPrice = 0;
    for (const toppingId in selectedToppings) {
        if (selectedToppings[toppingId]) {
            const topping = toppings.find(t => t.id === toppingId);
            if (topping) {
                toppingsPrice += topping.price;
            }
        }
    }
    // เพิ่มราคาน้ำพริกกากหมู
    let chiliPrice = chiliPaste.price * currentChiliQuantity;

    const total = basePrice + toppingsPrice + chiliPrice; // รวมราคาเพิ่ม
    totalPriceDisplay.textContent = `฿${total}`;
}

// แสดงหน้าตามที่ต้องการ (ซ่อนหน้าอื่น)
function showPage(pageId) {
    homepage.classList.add('hidden');
    orderpage.classList.add('hidden');
    confirmationpage.classList.add('hidden');

    if (pageId === 'homepage') {
        homepage.classList.remove('hidden');
    } else if (pageId === 'orderpage') {
        orderpage.classList.remove('hidden');
    } else if (pageId === 'confirmationpage') {
        confirmationpage.classList.remove('hidden');
    }
}

// --- การทำงานเมื่อกดปุ่มต่างๆ ---

// เมื่อกดปุ่ม "สั่งเลย!" บนหน้าแรก
orderNowBtn.addEventListener('click', () => {
    showPage('orderpage');
    loadToppings(); // โหลดท็อปปิ้งขึ้นมา
    updateTotalPrice(); // คำนวณราคารวมเริ่มต้น
});

// เมื่อกดปุ่ม "เพิ่มจำนวน" หมี่ไก่ฉีก
increaseQtyBtn.addEventListener('click', () => {
    currentQuantity++;
    quantityDisplay.textContent = currentQuantity;
    updateTotalPrice();
});

// เมื่อกดปุ่ม "ลดจำนวน" หมี่ไก่ฉีก
decreaseQtyBtn.addEventListener('click', () => {
    if (currentQuantity > 1) { // ไม่ให้ลดต่ำกว่า 1 กล่อง
        currentQuantity--;
        quantityDisplay.textContent = currentQuantity;
        updateTotalPrice();
    }
});

// ปุ่มเพิ่มจำนวนน้ำพริกกากหมู
increaseChiliQtyBtn.addEventListener('click', () => {
    currentChiliQuantity++;
    chiliQuantityDisplay.textContent = currentChiliQuantity;
    updateTotalPrice();
});

// ปุ่มลดจำนวนน้ำพริกกากหมู
decreaseChiliQtyBtn.addEventListener('click', () => {
    if (currentChiliQuantity > 0) { // ไม่ให้ลดต่ำกว่า 0
        currentChiliQuantity--;
        chiliQuantityDisplay.textContent = currentChiliQuantity;
        updateTotalPrice();
    }
});

// เมื่อกดปุ่ม "ยืนยันสั่งซื้อ" บนหน้าออเดอร์
confirmOrderBtn.addEventListener('click', () => {
    // ดึงข้อมูลจากฟอร์ม
    const customerName = customerNameInput.value.trim();
    const customerPhone = customerPhoneInput.value.trim();
    const customerAddress = customerAddressInput.value.trim();
    const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value; // 'cash' หรือ 'transfer'

    // ตรวจสอบว่ากรอกข้อมูลครบไหม
    if (!customerName || !customerPhone || !customerAddress) {
        alert('กรุณากรอกข้อมูล ชื่อ-นามสกุล, เบอร์โทรศัพท์ และที่อยู่จัดส่ง ให้ครบถ้วนค่ะ');
        return; // หยุดการทำงานถ้าข้อมูลไม่ครบ
    }

    // เตรียมข้อมูลคำสั่งซื้อ (สำหรับส่งไป LINE Notify หรือบันทึกในอนาคต)
    const orderDetails = {
        menu: menu.name,
        quantity: currentQuantity,
        chiliPasteQuantity: currentChiliQuantity, // เพิ่มจำนวนน้ำพริกกากหมู
        toppings: Object.keys(selectedToppings).filter(id => selectedToppings[id]).map(id => {
            const topping = toppings.find(t => t.id === id);
            return `${topping.name} (฿${topping.price})`;
        }).join(', ') || 'ไม่มี', // ถ้าไม่มีท็อปปิ้งก็แสดงว่า 'ไม่มี'
        customerName: customerName,
        customerPhone: customerPhone,
        customerAddress: customerAddress,
        paymentMethod: selectedPaymentMethod === 'cash' ? 'ชำระปลายทาง' : 'โอนเงิน',
        totalPrice: totalPriceDisplay.textContent,
        orderTime: new Date().toLocaleString('th-TH') // วันที่เวลาปัจจุบัน
    };

    console.log("ข้อมูลคำสั่งซื้อ:", orderDetails); // แสดงใน Console ของ Browser ไว้ดูเฉยๆ

    // แสดงหน้ายืนยัน
    showPage('confirmationpage');

    // แสดง QR Code ถ้าเลือกโอนเงิน
    if (selectedPaymentMethod === 'transfer') {
        qrCodeDisplay.classList.remove('hidden');
    } else {
        qrCodeDisplay.classList.add('hidden');
    }

    // --- ส่วนนี้คือที่ต้องเชื่อมกับ LINE Notify และ Firebase ในอนาคต (ไม่ได้ทำงานในเวอร์ชันนี้) ---
    // ตอนนี้ยังไม่มีระบบหลังบ้าน ดังนั้นจะแสดงแค่ใน Console
    const lineMessage = `
        🎉 ออเดอร์ใหม่! 🎉
        ลูกค้า: ${orderDetails.customerName}
        เบอร์: ${orderDetails.customerPhone}
        ที่อยู่: ${orderDetails.customerAddress}
        --------------------
        รายการ: ${orderDetails.menu} x ${orderDetails.quantity} กล่อง
        ${orderDetails.chiliPasteQuantity > 0 ? `น้ำพริกกากหมู: ${orderDetails.chiliPasteQuantity} กระปุก\n` : ''}
        ท็อปปิ้ง: ${orderDetails.toppings}
        ยอดรวม: ${orderDetails.totalPrice}
        ชำระแบบ: ${orderDetails.paymentMethod}
        เวลา: ${orderDetails.orderTime}
        `;
    console.log("ข้อความสำหรับ LINE Notify:\n", lineMessage);


    // รีเซ็ตฟอร์มหลังจากสั่งซื้อเสร็จ
    customerNameInput.value = '';
    customerPhoneInput.value = '';
    customerAddressInput.value = '';
    currentQuantity = 1;
    quantityDisplay.textContent = 1;
    currentChiliQuantity = 0; // รีเซ็ตจำนวนน้ำพริกกากหมู
    chiliQuantityDisplay.textContent = 0; // รีเซ็ตจำนวนน้ำพริกกากหมูบนหน้าจอ
    selectedToppings = {}; // เคลียร์ท็อปปิ้งที่เลือกไว้
    document.querySelector('input[name="paymentMethod"][value="cash"]').checked = true; // ตั้งค่าเริ่มต้นเป็นชำระปลายทาง
    updateTotalPrice(); // อัปเดตราคาให้เป็นเริ่มต้น
    loadToppings(); // โหลดท็อปปิ้งใหม่เพื่อให้ Checkbox ถูกรีเซ็ต
});

// เมื่อกดปุ่ม "กลับสู่หน้าแรก" บนหน้ายืนยัน
backToHomeBtn.addEventListener('click', () => {
    showPage('homepage');
});

// --- เริ่มต้นเมื่อโหลดหน้าเว็บ ---
document.addEventListener('DOMContentLoaded', () => {
    showPage('homepage'); // แสดงหน้าแรกเมื่อโหลดเว็บไซต์ครั้งแรก
    loadToppings(); // โหลดท็อปปิ้งเผื่อไว้ (ถึงแม้จะยังไม่เห็น)
    currentChiliQuantity = 0; // ตรวจสอบให้แน่ใจว่าค่าเริ่มต้นเป็น 0
    if (chiliQuantityDisplay) chiliQuantityDisplay.textContent = 0; // ป้องกัน error ถ้า element ยังไม่พร้อม
    updateTotalPrice(); // คำนวณราคาเริ่มต้น (฿60 สำหรับ 1 กล่อง)
});