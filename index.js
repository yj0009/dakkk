import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ================= DYNAMIC PORTFOLIO DATA SETS =================
const projectVault = {
  "web-dev": {
    headline: "Our Deployed Websites",
    tagline: "Clean, fast, and crafted to support real human users.",
    technologies: ["React / Next.js", "Tailwind CSS", "Firebase Firestore", "Node.js API Layers"],
    items: [
      { name: "Online Store Platform", meta: "Built with Next.js & Firestore", url: "https://yourportfolio-link1.com" },
      { name: "Live Booking Calendar Dashboard", meta: "Built with Javascript & Tailwind", url: "https://yourportfolio-link2.com" }
    ]
  },
  "ai-automation": {
    headline: "Our Workflow Automations",
    tagline: "Smarter pipelines that handle administrative tasks in the background.",
    technologies: ["Python Scripting", "OpenAI API Core", "Make / Zapier Webhooks", "Node-RED Environments"],
    items: [
      { name: "Customer Lead Ingestion Setup", meta: "Built with Python & OpenAI APIs", url: "#" },
      { name: "Automated Feedback Processing System", meta: "Built with Node.js & Cloud Functions", url: "#" }
    ]
  }
};

// ================= SERVICES PORTFOLIO MODAL CONTROLLER =================
const modal = document.getElementById('portfolio-modal');
const headerArea = document.getElementById('modal-header-area');
const gridContainer = document.getElementById('modal-grid-container');

window.openPortfolio = function(category) {
  const data = projectVault[category];
  if (!data) return; 

  let techPillsHtml = '';
  if (data.technologies) {
    techPillsHtml = `
      <div class="mt-4">
        <p class="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide mb-2">Technologies we use:</p>
        <div class="flex flex-wrap gap-2">
          ${data.technologies.map(tech => `<span class="bg-amber-50 text-amber-800 text-[11px] font-medium px-3 py-1 rounded-full border border-amber-100 shadow-sm">${tech}</span>`).join('')}
        </div>
      </div>
    `;
  }

  headerArea.innerHTML = `
    <p class="text-amber-700 text-xs font-semibold tracking-wider uppercase">Completed work</p>
    <h4 class="text-2xl font-bold text-neutral-900 mt-1 tracking-tight">${data.headline}</h4>
    <p class="text-neutral-500 text-sm font-light mt-1 max-w-md">${data.tagline}</p>
    ${techPillsHtml}
  `;
  gridContainer.innerHTML = '';

  data.items.forEach(proj => {
    gridContainer.innerHTML += `
      <div class="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-500/20 transition duration-300 shadow-sm">
        <div>
          <span class="text-[10px] bg-neutral-50 border border-neutral-100 text-neutral-500 font-medium px-2.5 py-1 rounded-full">${proj.meta}</span>
          <h5 class="text-neutral-900 font-bold mt-4 text-base tracking-tight">${proj.name}</h5>
        </div>
        <div class="pt-6">
          <a href="${proj.url}" target="_blank" rel="noopener noreferrer" class="text-xs text-amber-700 font-semibold tracking-wide hover:text-amber-600 transition inline-flex items-center gap-1">
            Launch live project <span>→</span>
          </a>
        </div>
      </div>
    `;
  });

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden'; 
  }
};

window.closePortfolio = function() {
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

// ================= CORE STATIC FOOTER MENUS (ABOUT / PRIVACY / CONTACT) =================
const textVault = {
  about: `
    <h3 class="text-xl font-bold text-neutral-900 mb-2">About DARKK</h3>
    <p class="mb-3">DARKK is a modern digital agency dedicated to helping businesses grow through technology, creativity, and innovation. We specialize in web development, software solutions, AI-powered systems, automation, and digital services tailored to the unique needs of each client.</p>
    <p class="mb-3">Our mission is simple: deliver high-quality solutions that solve real business problems while maintaining transparency, reliability, and long-term value.</p>
    <p>At DARKK, we believe every business deserves access to powerful digital tools, regardless of its size. Whether you're a startup, small business, or growing enterprise, we work closely with you to transform ideas into impactful digital experiences. We focus on innovation, performance, and client success, ensuring every project is built with quality, scalability, and future growth in mind.</p>
  `,
  privacy: `
    <h3>Privacy Policy</h3>
    <p class="content-modal-meta">Last updated: July 2026</p>

    <p>DARKK ("we," "us," "our") values your privacy. This policy explains what information we collect through this website, why, and how it's handled. It is designed to meet the requirements of major global data protection frameworks, including the EU/UK GDPR, Australia's Privacy Act, Canada's PIPEDA, applicable U.S. state privacy laws (e.g. CCPA/CPRA), and India's Digital Personal Data Protection Act, 2023.</p>

    <h4>Information We Collect</h4>
    <p>When you submit our contact/audit form, we collect only what you provide:</p>
    <ul>
      <li>Name / company name</li>
      <li>Email address</li>
      <li>Phone number (if provided)</li>
      <li>Country / city / service location</li>
      <li>Business details you share (website URL, social media handles, service needed)</li>
    </ul>
    <p>We also automatically capture your IP address at the moment of submission. This is used solely to prevent spam by limiting how many submissions can be sent from the same address in a 24-hour period — it is not used to track you across the web or shared for advertising.</p>

    <h4>No Cookies or Tracking Scripts</h4>
    <p>This website does not use cookies, tracking pixels, or third-party analytics scripts to monitor visitor behaviour. The only data we receive is what you actively submit through our form.</p>

    <h4>Consent</h4>
    <p>By checking the consent box on our form and submitting it, you provide your free, informed, specific and unambiguous consent for us to collect and process the personal data listed above for the purposes described in this policy. You may withdraw this consent at any time by contacting us; withdrawal will not affect the lawfulness of processing carried out before that point.</p>

    <h4>Where Your Data Is Stored</h4>
    <p>Form submissions are stored securely in Google Firebase (Firestore), Google's cloud database service, in a private collection accessible only to DARKK. We do not use spreadsheets or any other third-party tool to store your information.</p>

    <h4>International Data Transfers</h4>
    <p>DARKK works with clients across multiple countries. Depending on where you're located, submitting our form may involve your data being transferred to and stored on servers outside your home country. Where required by your local law (for example, if you're in the EEA, UK, or Switzerland), we rely on appropriate safeguards for any such transfer, and you may request details of these safeguards by contacting us.</p>

    <h4>How We Use Your Information</h4>
    <p>We use it only to:</p>
    <ul>
      <li>Respond to your inquiry and prepare your requested audit or quote</li>
      <li>Deliver the service you've asked for</li>
      <li>Maintain basic business, consent and security records</li>
    </ul>

    <h4>Information Sharing</h4>
    <p>We do not sell, rent, or share your information with any third party for marketing or advertising purposes. If we ever want to use your details beyond responding to your inquiry — for example, featuring your business as a case study — we will contact you directly and ask for your explicit consent first.</p>

    <h4>Data Retention</h4>
    <p>We retain form submissions for as long as necessary to respond to your inquiry and maintain business records, and no longer than 24 months unless you become a client — in which case we retain it for the duration of our working relationship plus any legally required period afterward.</p>

    <h4>Your Rights</h4>
    <p>Wherever you're located, you can request access to, correction of, withdrawal of consent for, or deletion of your personal information at any time by contacting us. Depending on your jurisdiction, this may include specific rights such as data portability, objection to processing, or lodging a complaint with your local data protection authority (for example, under GDPR, the Australian Privacy Act, PIPEDA, or applicable U.S. state privacy laws).</p>

    <h4>Data Security</h4>
    <p>Your information is stored on Firebase, which uses encryption in transit and at rest. Access to our database is restricted to authorised DARKK personnel only.</p>

    <h4>Changes to This Policy</h4>
    <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date.</p>

    <h4>Contact Us</h4>
    <p>For privacy-related questions, rights requests, or complaints, please contact us at hello@darkkagency.com.</p>
  `,
  terms: `
    <h3>Terms &amp; Conditions</h3>
    <p class="content-modal-meta">Last updated: July 2026</p>

    <p>DARKK ("we," "us," "our") is a digital agency providing website design, local SEO, and content marketing services to businesses worldwide. These Terms & Conditions ("Terms") form a binding agreement between DARKK and any person or business ("you," "Client") who submits a form on, or otherwise uses, this website, wherever you are located. By submitting our contact/audit form, engaging our services, or otherwise using this site, you agree to be bound by these Terms.</p>

    <h4>Nature &amp; Scope of Services</h4>
    <p>DARKK provides websites, local SEO, and content/social media systems primarily for roofing, landscaping, and construction businesses. The specific scope, timeline, and deliverables for any paid engagement will be set out in a separate quote or service agreement. These Terms govern the website and the general relationship; they do not replace a signed statement of work.</p>

    <h4>Accuracy of Information</h4>
    <p>You agree to provide accurate, current and complete information when submitting our form. We are not responsible for delays, errors, or inaccuracies in any audit, quote, or deliverable resulting from incomplete or incorrect information you've supplied.</p>

    <h4>Engagement Process</h4>
    <p>Submitting our website form is an inquiry, not a binding order. A binding engagement is formed only once we provide a written quote or proposal and you confirm acceptance of it, and/or a formal service agreement is signed by both parties.</p>

    <h4>Fees &amp; Payment</h4>
    <p>Where paid Services are engaged, fees, payment schedule and currency will be specified in the applicable quote or service agreement. Fees are exclusive of any taxes, duties or levies applicable in either party's jurisdiction. Clients are responsible for any currency conversion or bank charges on their end.</p>

    <h4>Intellectual Property</h4>
    <p>All content on this website — text, graphics, logos and design — is the property of DARKK unless otherwise stated. Upon full payment for a completed project, ownership of the final agreed Deliverables transfers to the Client, unless the applicable agreement states otherwise. DARKK retains the right to showcase completed work in its own portfolio unless the Client requests otherwise in writing.</p>

    <h4>Client-Provided Content</h4>
    <p>You are responsible for ensuring any content, images or materials you provide for use in a project do not infringe any third party's rights, and agree to indemnify DARKK against any claim arising from content you have supplied.</p>

    <h4>No Guarantee of Results</h4>
    <p>While we aim to deliver high-quality websites, SEO and content strategies, we do not guarantee specific rankings, traffic, leads or revenue outcomes, as these depend on factors outside our control, including search engine algorithm changes and market conditions.</p>

    <h4>Limitation of Liability</h4>
    <p>To the maximum extent permitted by applicable law, DARKK's total liability shall not exceed the total fees paid by the Client for the engagement giving rise to the claim, and DARKK shall not be liable for indirect, incidental or consequential loss. Nothing here excludes liability that cannot lawfully be excluded under the mandatory consumer protection law of the Client's home jurisdiction.</p>

    <h4>International Clients &amp; Data Protection</h4>
    <p>DARKK works with clients across multiple countries and delivers Services remotely. You remain responsible for ensuring your own use of the Deliverables complies with the laws applicable in your own country. Personal data you provide is processed in accordance with our Privacy Policy, designed to meet the requirements of major global data protection frameworks including the EU/UK GDPR, Australia's Privacy Act, Canada's PIPEDA, and applicable U.S. state privacy laws.</p>

    <h4>Termination</h4>
    <p>Either party may terminate an ongoing engagement per the notice period in the applicable service agreement. DARKK reserves the right to suspend access to the website or Services in the event of misuse, non-payment, or breach of these Terms.</p>

    <h4>Governing Law &amp; Dispute Resolution</h4>
    <p>Where a specific governing law is required to resolve a dispute, the parties agree that the law named in the applicable signed service agreement shall apply. The parties will first attempt to resolve any dispute through good-faith negotiation; unresolved disputes may be referred to binding arbitration under mutually agreed international arbitration rules (such as ICC or UNCITRAL), conducted remotely wherever possible. This does not remove any statutory consumer-protection rights you may have under the mandatory law of your home jurisdiction.</p>

    <h4>Changes to These Terms</h4>
    <p>We may update these Terms from time to time. Continued use of this website after changes are posted constitutes acceptance of the revised Terms.</p>

    <h4>Contact Us</h4>
    <p>For questions about these Terms, please contact us at hello@darkkagency.com.</p>
  `,
  contact: `
    <h3 class="text-xl font-bold text-neutral-900 mb-2">Contact Channels</h3>
    <p class="mb-4">Get in touch directly with our support teams using any of the active channels below:</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 font-medium">
      <a href="https://wa.me/your-demo-link" target="_blank" class="p-3 bg-neutral-50 hover:bg-amber-50 rounded-xl border border-neutral-200 transition flex items-center gap-2">🟢 WhatsApp Support</a>
      <a href="https://t.me/your-demo-link" target="_blank" class="p-3 bg-neutral-50 hover:bg-amber-50 rounded-xl border border-neutral-200 transition flex items-center gap-2">🔵 Telegram Channel</a>
      <a href="https://instagram.com/your-demo-link" target="_blank" class="p-3 bg-neutral-50 hover:bg-amber-50 rounded-xl border border-neutral-200 transition flex items-center gap-2">📸 Instagram Profile</a>
      <a href="tel:+1234567890" class="p-3 bg-neutral-50 hover:bg-amber-50 rounded-xl border border-neutral-200 transition flex items-center gap-2">📞 Direct Mobile Line</a>
    </div>
  `
};

const contentModal = document.getElementById('content-modal');
const contentBody = document.getElementById('content-modal-body');

window.openContent = function(type) {
  if (contentModal && contentBody && textVault[type]) {
    contentBody.innerHTML = textVault[type];
    contentModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    contentModal.scrollTop = 0;
  }
};

window.closeContentModal = function() {
  if (contentModal) {
    contentModal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

// Close the privacy/terms modal on outside click or Escape key
if (contentModal) {
  contentModal.addEventListener('click', (e) => {
    if (e.target === contentModal) window.closeContentModal();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contentModal && contentModal.classList.contains('open')) {
    window.closeContentModal();
  }
});

// ================= LEAD FORM → FIREBASE FIRESTORE INGESTION =================
// Stores every submission in the "leads" collection, and rate-limits each
// visitor's IP address to a maximum of 4 submissions per rolling 24 hours.
const leadForm = document.getElementById('agency-lead-form');

const DAILY_SUBMIT_LIMIT = 4;

// Looks up the visitor's public IP address (used purely for rate-limiting,
// not stored anywhere sensitive beyond the leads collection itself).
async function getClientIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip || 'unknown';
  } catch (err) {
    console.error('IP lookup failed:', err);
    return 'unknown';
  }
}

// Counts how many leads this IP has submitted in the last 24 hours.
// If the IP can't be determined, we fail OPEN (allow the submission)
// rather than blocking a legitimate visitor.
async function hasReachedDailyLimit(ip) {
  if (ip === 'unknown') return false;

  const since = Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const q = query(
    collection(db, 'leads'),
    where('ip', '==', ip),
    where('timestamp', '>=', since)
  );

  const snapshot = await getDocs(q);
  return snapshot.size >= DAILY_SUBMIT_LIMIT;
}

if (leadForm) {
  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('submit-btn');
    const status = document.getElementById('form-status');
    const needValue = leadForm.querySelector('input[name="Need"]:checked')?.value || 'Audit';
    const consentBox = document.getElementById('consent');

    if (!consentBox || !consentBox.checked) {
      status.style.display = 'block';
      status.style.color = '#c0392b';
      status.textContent = 'Please agree to the Privacy Policy and Terms & Conditions to continue.';
      consentBox?.focus();
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending...';
    status.style.display = 'block';
    status.style.color = 'var(--ink-soft)';
    status.textContent = 'Checking your request...';

    try {
      const ip = await getClientIP();

      if (await hasReachedDailyLimit(ip)) {
        status.style.color = '#c0392b';
        status.textContent = `You've already sent ${DAILY_SUBMIT_LIMIT} requests today. Please try again tomorrow.`;
        btn.disabled = false;
        btn.textContent = needValue === 'BuildWeb' ? 'Send my request' : 'Send & get my audit';
        return;
      }

      status.textContent = 'Sending your details...';

      const get = (id) => document.getElementById(id)?.value.trim() || '';

      const country = get('location') === 'Other' ? get('location-other') : get('location');

      const leadData = {
        need: needValue,
        company: get('company'),
        email: get('email'),
        country,
        ip,
        timestamp: serverTimestamp(),
        processedState: 'unread',
        consentGiven: true,
        consentTimestamp: serverTimestamp()
      };

      if (needValue === 'BuildWeb') {
        const countryCode = get('country-code') === 'Other' ? get('country-code-other') : get('country-code');
        leadData.countryCode = countryCode;
        leadData.phone = get('phone');
      } else {
        leadData.service = get('service');
        leadData.website = get('website');
        leadData.city = get('city');
        leadData.serviceLocation = get('service-location');
        leadData.instagram = get('ig');
        leadData.facebook = get('fb');
        leadData.youtube = get('yt');
      }

      await addDoc(collection(db, 'leads'), leadData);

      status.style.color = '#1a7a3c';
      status.textContent = needValue === 'BuildWeb'
        ? "Thanks! We'll reach out to you by email."
        : "Got it — your audit will be sent to you within 1–3 hours.";

      leadForm.reset();
      window.updateNeed?.('Audit');
      window.updateLocation?.('');
      window.updateCountryCode?.('');
    } catch (err) {
      console.error(err);
      status.style.color = '#c0392b';
      status.textContent = 'Something went wrong — please try again.';
    } finally {
      btn.disabled = false;
      btn.textContent = needValue === 'BuildWeb' ? 'Send my request' : 'Send & get my audit';
    }
  });
}

// ================= INTERACTIVE SUPPORT CHAT MECHANICS =================
window.toggleChatbotState = function() {
  const frame = document.getElementById('chatbot-frame');
  const icon = document.getElementById('bubble-icon');
  if (frame && icon) {
    frame.classList.toggle('hidden');
    icon.innerText = frame.classList.contains('hidden') ? "Chat" : "Close";
  }
};

window.processChatMessage = function() {
  const field = document.getElementById('chat-user-input');
  const text = field ? field.value.trim() : '';
  if(!text) return;

  const panel = document.getElementById('chat-message-display');
  if (!panel) return;

  panel.innerHTML += `
    <div class="bg-neutral-900 text-white p-3 rounded-2xl rounded-tr-none self-end max-w-[85%] ml-auto shadow-sm">
      ${text}
    </div>
  `;
  field.value = '';
  panel.scrollTop = panel.scrollHeight;

  setTimeout(() => {
    let responseText = "Got it! For custom pricing or specific estimates, please fill out our quick questionnaire on the web page.";
    
    const lowered = text.toLowerCase();
    if(lowered.includes('web') || lowered.includes('dev')) {
      responseText = "We construct responsive web applications with straightforward tools like Next.js and Firebase. You can read details inside our Web Development service box on the page.";
    } else if(lowered.includes('ai') || lowered.includes('automation')) {
      responseText = "Our automation systems handle repeating workspace tasks to help you save time. Head over to our Smart Automation service block to see examples.";
    }

    panel.innerHTML += `
      <div class="bg-white border border-neutral-200 p-3 rounded-2xl rounded-tl-none max-w-[85%] leading-relaxed shadow-sm">
        ${responseText}
      </div>
    `;
    panel.scrollTop = panel.scrollHeight;
  }, 600);
};

const chatInput = document.getElementById('chat-user-input');
if (chatInput) {
  chatInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') window.processChatMessage();
  });
}
