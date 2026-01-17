document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle (Restored for V2 Design)
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Optional: Toggle icon between bars and times
            const icon = mobileBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 2. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {

            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileBtn) {
                    const icon = mobileBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }

            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 70; // Height of fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 3. Header Scroll Effect (Optional Sparkle)
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = "rgba(255, 255, 255, 0.98)";
            header.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.1)";
        } else {
            header.style.background = "rgba(255, 255, 255, 0.95)";
            header.style.boxShadow = "none";
        }
    });

});



function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    // 1. Hide all tab contents
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // 2. Reset all buttons
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
        // Reset inline styles
        tablinks[i].style.background = "white";
        tablinks[i].style.color = "#333";
        tablinks[i].style.border = "2px solid var(--primary-color)";
    }

    // 3. Show current tab and activate button
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    // Set active styles
    evt.currentTarget.style.background = "var(--primary-color)";
    evt.currentTarget.style.color = "white";
}

function filterInventory() {
    var input, filter, details, tr, td, i, j, txtValue, match;
    input = document.getElementById("inventorySearch");
    filter = input.value.toUpperCase();

    var container = document.getElementById("retail"); // Default to retail for search
    // If not found, check other tabs? For now we assume user is on retail tab or wants to search retail layout
    // Actually, let's search in all tabs or just the active one?
    // The current complexity suggests we search within the visible container, 
    // but the extracted version put everything in retail categories.

    var categories = container.getElementsByTagName("details");

    for (i = 0; i < categories.length; i++) {
        var table = categories[i].querySelector("table");
        tr = table.getElementsByTagName("tr");
        var categoryHasMatch = false;

        for (j = 0; j < tr.length; j++) {
            // Skip header row if it exists inside tbody (unlikely based on my code but safe)
            if (tr[j].getElementsByTagName("th").length > 0) continue;

            td = tr[j].getElementsByTagName("td");
            match = false;
            // Check Item Name (col 0) and Details (col 1)
            if (td[0] || td[1]) {
                var txt1 = td[0].textContent || td[0].innerText;
                var txt2 = td[1] ? (td[1].textContent || td[1].innerText) : "";

                if (txt1.toUpperCase().indexOf(filter) > -1 || txt2.toUpperCase().indexOf(filter) > -1) {
                    match = true;
                    categoryHasMatch = true;
                }
            }

            if (match) {
                tr[j].style.display = "";
            } else {
                tr[j].style.display = "none";
            }
        }

        // Logic to open/close categories based on matches
        if (filter === "") {
            categories[i].open = false; // Collapse all when search cleared
            categories[i].style.display = "block";
        } else if (categoryHasMatch) {
            categories[i].open = true; // Open category if match found
            categories[i].style.display = "block";
        } else {
            categories[i].style.display = "none"; // Hide empty categories
        }
    }
}

// =========================================
// Chatbot Logic
// =========================================
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");

// Predefined Bot Responses
// Predefined Bot Responses
const botResponses = {
    "location": "We are located at: <br><strong>Moha No 4, Near SBI Bank, Sirasal Road, Bilsi</strong>.<br><br><a href='https://www.google.com/maps/search/?api=1&query=Prince+Electronics+Bilsi' target='_blank' style='color: yellow; text-decoration: underline;'>📍 View on Google Maps</a>",
    "hours": "🕒 <strong>Shop Timings:</strong><br>Mon - Sun: 9:00 AM - 9:00 PM<br>(Open 7 Days a Week)",
    "contact": "📞 <strong>Call Us:</strong><br><a href='tel:+919758081689' style='color: white; text-decoration: underline;'>+91 97580 81689</a><br><a href='tel:+919758976224' style='color: white; text-decoration: underline;'>+91 97589 76224</a><br><br><strong>Owner:</strong> Mr. Avinash Kumar",
    "services": "🛠️ <strong>We Repair:</strong><br>• Speeding up Fans (Winding)<br>• Cooler Motor & Pump Reuse<br>• Inverter & Stabilizer PCB<br>• Press/Iron & Mixer Grinders",
    "default": "Welcome to Prince Electronics! How can I help you today?"
};

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span><i class="fas fa-robot"></i></span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").innerHTML = message; // Changed to innerHTML for links
    return chatLi;
};

const handleOption = (optionType) => {
    // 1. User Message (Visual only)
    let userText = "";
    if (optionType === 'location') userText = "Where is the shop?";
    else if (optionType === 'hours') userText = "Opening Hours?";
    else if (optionType === 'contact') userText = "Contact Number?";
    else if (optionType === 'services') userText = "Repair Services?";

    chatbox.appendChild(createChatLi(userText, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // 2. Bot Response
    setTimeout(() => {
        const botResponse = botResponses[optionType];
        chatbox.appendChild(createChatLi(botResponse, "incoming"));
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 600);
}

// Toggle Chat Window
if (chatbotToggler) {
    chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
    closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
}
