const { form } = document.forms;
const modalBuy = document.getElementById('modalBuy');

function validationForm(form) {
  let result = true;
  const allInputs = form.querySelectorAll('input');

  for (let input of allInputs) {

    // перевірнка важливості
    if (input.dataset.required == "true") {
      removeError(input);
      if (input.value.trim() == "") {
        createrError(input, "Поле не заповне!");
        result = false;
      }
    }

    // перевірка довжини
    if (input.dataset.minLength) {
      removeError(input);
      if (input.value.length < input.dataset.minLength) {
        createrError(
          input,
          `Мінімальна к-ть синволів: ${input.dataset.minLength}`
        );
        result = false;
      }
    }

    // Прибирання  блока про помилку
    function removeError(input) {
      const papert = input.parentNode;
      if (papert.classList.contains("error")) {
        papert.querySelector(".error-lable").remove();
        papert.classList.remove("error");
      }
    }

    // Створення блока про помилку
    function createrError(input, text) {
      const papert = input.parentNode;
      const errorLable = document.createElement("label");
      errorLable.classList.add("error-lable");
      errorLable.innerText = text;
      papert.classList.add("error");
      papert.append(errorLable);
    }
  }

  return result;
}

function getForm(e) {
  e.preventDefault();
  if (validationForm(this) == false) {
    console.log("Form not validate");
    return
  }
  const {
    name,
    phone,
    cardBank,
  } = form;

  let cardBankValue;
  cardBank.forEach((radio) => {
    if (radio.checked) cardBankValue = radio.value;
  });

  const values = {
    name: name.value.trim(),
    phone: phone.value.trim(),
    cardBank: cardBankValue
  };

  console.log('values:>', values);
  modalBuyShow();
}
form.addEventListener("submit", getForm);

function modalBuyShow() {
  modalBuy.style.display = `flex`;
  modalBuy.classList.add('updete');
  setTimeout(() => {
    modalBuy.classList.remove('updete')
  }, 1000)
  setTimeout(()=>{
    modalBuy.classList.add('close');
    modal.closeModal();
    cart.clearCart();
    setTimeout(() => {
      modalBuy.classList.remove('close');
      modalBuy.style.display = `none`;
    }, 1000)
  }, 2000)
 
}