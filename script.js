const form = document.querySelector("#weekend-form");
const toast = document.querySelector("#toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 5200);
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const parentName = data.get("parent") || "родитель";
  const date = data.get("date") || "выбранный заезд";

  showToast(`Заявка для ${parentName} сохранена как черновик: ${date}. Осталось подключить отправку в CRM или на почту.`);
  form.reset();
});
