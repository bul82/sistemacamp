const form = document.querySelector("#weekend-form");
const heroForm = document.querySelector("#hero-form");
const toast = document.querySelector("#toast");
const stickyCta = document.querySelector(".sticky-cta");
const preloader = document.querySelector(".preloader");
const selectedDateInput = document.querySelector("#selected-date");
const revealTargets = document.querySelectorAll(
  ".split, .weekend-picker, .format-shell, .program .section-heading, .program-card, .timeline, .takeaways, .takeaway-grid article, .comfort-copy, .comfort-photo, .comfort-list div, .parent-check, .check-grid div, .price-card, .included-grid span, .quiz-card, .register .section-heading, .form, .dates-panel"
);

const formats = {
  business: {
    kicker: "Бизнес-выходные",
    title: "Как придумать идею и не утонуть в “ну такое”.",
    copy: "Дети пробуют собрать мини-проект: кому он нужен, как объяснить пользу и как защитить идею перед командой.",
    points: ["придумать идею;", "разобрать простую экономику;", "выступить без “я сейчас умру”."]
  },
  tech: {
    kicker: "ТЕХ-выходные",
    title: "Технологии без ощущения, что ты попал на экзамен.",
    copy: "Разбираем, как устроены цифровые продукты, где в них люди, задачи и решения. Не только код, но и логика.",
    points: ["собрать логику продукта;", "разобрать IT-роли;", "решить мини-кейс."]
  },
  creative: {
    kicker: "Креатив-выходные",
    title: "Идеи, которые можно объяснить не только маме.",
    copy: "Дети пробуют придумать концепцию, выбрать формат и показать идею так, чтобы ее поняли другие.",
    points: ["собрать идею;", "упаковать смысл;", "получить обратную связь."]
  },
  sport: {
    kicker: "Спорт-выходные",
    title: "Команда, энергия и решения на скорости.",
    copy: "Через игры и спорт дети тренируют лидерство, договоренности и спокойную голову в моменте.",
    points: ["распределять роли;", "держать темп;", "поддерживать команду."]
  }
};

const quizResults = {
  tech: ["ТЕХ-исследователь", "Начните с ТЕХ-выходных: там больше логики, продуктов и задач “как это работает”."],
  creative: ["Креативный продюсер", "Подойдут креативные выходные: идеи, упаковка смысла и защита своей версии."],
  business: ["Мини-предприниматель", "Хороший старт — бизнес-выходные: идея, польза, простая экономика и выступление."],
  sport: ["Капитан команды", "Спорт-выходные дадут больше движения, командных решений и энергии."]
};

document.body.classList.add("reveal-ready");
revealTargets.forEach((target) => target.setAttribute("data-reveal", ""));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
);

revealTargets.forEach((target) => revealObserver.observe(target));

function updateScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
  stickyCta?.classList.toggle("show", window.scrollY > window.innerHeight * 0.65);
}

function updateSpotlight(event) {
  document.documentElement.style.setProperty("--spot-x", `${event.clientX}px`);
  document.documentElement.style.setProperty("--spot-y", `${event.clientY}px`);
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("pointermove", updateSpotlight, { passive: true });
updateScrollProgress();

window.addEventListener("load", () => {
  window.setTimeout(() => preloader?.classList.add("is-hidden"), 450);
});

document.querySelectorAll(".format-tab").forEach((button) => {
  button.addEventListener("click", () => {
    const data = formats[button.dataset.format];
    if (!data) return;

    document.querySelectorAll(".format-tab").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    document.querySelector("#format-kicker").textContent = data.kicker;
    document.querySelector("#format-title").textContent = data.title;
    document.querySelector("#format-copy").textContent = data.copy;
    document.querySelector("#format-points").innerHTML = data.points.map((point) => `<li>${point}</li>`).join("");
  });
});

document.querySelectorAll("[data-quiz]").forEach((button) => {
  button.addEventListener("click", () => {
    const result = quizResults[button.dataset.quiz];
    if (!result) return;

    document.querySelectorAll("[data-quiz]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelector("#quiz-result").innerHTML = `<strong>${result[0]}</strong><span>${result[1]}</span>`;
  });
});

document.querySelectorAll(".date-choice-card").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".date-choice-card").forEach((card) => card.classList.remove("active"));
    button.classList.add("active");
    if (selectedDateInput) selectedDateInput.value = button.dataset.date;
  });
});

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

  showToast(`Черновик заявки сохранен: ${parentName}, ${date}. Следующий шаг — подключить отправку в CRM или на почту.`);
  form.reset();
  document.querySelectorAll(".date-choice-card").forEach((card, index) => card.classList.toggle("active", index === 0));
  if (selectedDateInput) selectedDateInput.value = "02-04 октября 2026";
});

heroForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(heroForm);
  const name = data.get("name") || "контакт";
  showToast(`Контакт сохранен: ${name}. Следующий шаг — подключить отправку в CRM или на почту.`);
  heroForm.reset();
});
