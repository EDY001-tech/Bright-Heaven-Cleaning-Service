const WHATSAPP_NUMBER = "447857552641";
const BUSINESS_EMAIL = "brighthavencleaninguk@gmail.com";

const nav = document.getElementById("nav");
const menu = document.getElementById("menu");
const form = document.getElementById("quoteForm");
const status = document.getElementById("status");
const progress = document.getElementById("progress");
const backTop = document.getElementById("backTop");

menu?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll("#nav a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

function getFormData() {
  return {
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    postcode: document.getElementById("postcode").value.trim(),
    service: document.getElementById("service").value,
    property: document.getElementById("property").value.trim(),
    date: document.getElementById("date").value,
    message: document.getElementById("message").value.trim()
  };
}

function readableDate(value) {
  if (!value) return "Not specified";
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

function enquiryText(d) {
  return `Hello BrightHaven Cleaning,

I'd like to request a free cleaning quote.

CUSTOMER DETAILS
Name: ${d.name}
Phone: ${d.phone}
Postcode: ${d.postcode}

CLEANING REQUEST
Service: ${d.service}
Property size: ${d.property || "Not specified"}
Preferred date: ${readableDate(d.date)}

Additional information:
${d.message || "None"}

Please let me know the price and availability. Thank you.`;
}

function validateForm() {
  if (!form.reportValidity()) return false;

  const d = getFormData();
  if (!d.name || !d.phone || !d.postcode || !d.service) {
    status.textContent = "Please complete the required fields.";
    return false;
  }
  return true;
}

function openWhatsApp() {
  if (!validateForm()) return;
  const d = getFormData();
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(enquiryText(d))}`;
  window.open(url, "_blank", "noopener,noreferrer");
  status.textContent = "WhatsApp opened with the complete enquiry ready to send to BrightHaven Cleaning.";
}

document.getElementById("waSubmit")?.addEventListener("click", openWhatsApp);

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateForm()) return;

  const d = getFormData();
  const subject = `BrightHaven Cleaning Enquiry - ${d.service}`;
  const mailto = `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(enquiryText(d))}`;

  // Opens the customer's email app with every submitted field included.
  window.location.href = mailto;
  status.textContent = "Your email app should open with the complete enquiry prepared.";
});

window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  backTop.classList.toggle("show", window.scrollY > 500);

  const sections = [...document.querySelectorAll("main section[id], footer[id]")];
  const current = sections
    .filter(section => window.scrollY + 130 >= section.offsetTop)
    .pop()?.id;

  document.querySelectorAll("#nav a").forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
  });
}, { passive: true });

backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

document.querySelectorAll('a[href="#"]').forEach(link => {
  if (link.id !== "facebookLink") return;
  link.addEventListener("click", (event) => {
    event.preventDefault();
    status && (status.textContent = "Send the BrightHaven Cleaning Facebook page link and I will connect it.");
  });
});
