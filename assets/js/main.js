/* ============================================================
   Prolyne — main.js
   ============================================================ */

(function () {
  "use strict";

  /* ── Navbar shadow on scroll ───────────────────────────────── */
  const navbar = document.getElementById("navbar");
  function onScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    updateActiveNav();
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── Mobile menu toggle ────────────────────────────────────── */
  const navToggle = document.getElementById("navToggle");
  const navDrawer = document.getElementById("navDrawer");
  navToggle.addEventListener("click", function () {
    const isOpen = navDrawer.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  /* Close drawer when a link is clicked */
  navDrawer.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navDrawer.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ── Active nav link on scroll ─────────────────────────────── */
  const sections = ["home", "about", "services", "contact"];
  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    let current = "home";
    sections.forEach(function (id) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) {
        current = id;
      }
    });
    document.querySelectorAll(".nav-link").forEach(function (link) {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === "#" + current);
    });
  }

  /* ── Smooth scroll for anchor links ───────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ── Contact form submission ───────────────────────────────── */
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const phone = contactForm.phone.value.trim();
      const message = contactForm.message.value.trim();

      formStatus.className = "form-status";
      formStatus.textContent = "";

      if (!name || !email || !message) {
        formStatus.textContent =
          "Please fill in your name, email, and message.";
        formStatus.className = "form-status error";
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formStatus.textContent = "Please enter a valid email address.";
        formStatus.className = "form-status error";
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      const data = new URLSearchParams({ name, email, phone, message });

      fetch("send_email.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data.toString(),
      })
        .then(function (res) {
          return res.text().then(function (text) {
            return { ok: res.ok, text: text };
          });
        })
        .then(function (result) {
          if (result.ok) {
            formStatus.textContent = "Thank you! Your message has been sent.";
            formStatus.className = "form-status success";
            contactForm.reset();
          } else {
            formStatus.textContent =
              result.text || "Something went wrong. Please try again.";
            formStatus.className = "form-status error";
          }
        })
        .catch(function () {
          formStatus.textContent = "Could not send. Please try again later.";
          formStatus.className = "form-status error";
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send";
        });
    });
  }

  /* ── Full-page modal ───────────────────────────────────────── */

  /* Build one project entry row (image placeholder + metadata left, description right) */
  function projectEntry(p) {
    var classes = p.imgClass
      ? Array.isArray(p.imgClass)
        ? p.imgClass
        : [p.imgClass]
      : [];
    var imgHtml = classes
      .map(function (cls) {
        return (
          '<div class="project-img ' +
          cls +
          '" role="img" aria-label="' +
          p.name +
          '"></div>'
        );
      })
      .join("");
    var subHtml = p.subName
      ? '<div class="project-meta-subname">' + p.subName + "</div>"
      : "";
    var locHtml = p.location
      ? '<div class="project-meta-location">' + p.location + "</div>"
      : "";
    var credHtml = (p.credits || [])
      .map(function (c) {
        return (
          "<div><strong>" +
          c.label +
          ":</strong> <span>" +
          c.value +
          "</span></div>"
        );
      })
      .join("");
    var descHtml = (p.desc || [])
      .map(function (t) {
        return "<p>" + t + "</p>";
      })
      .join("");
    var labelHtml = p.sectionLabel
      ? '<div class="project-section-label">' + p.sectionLabel + "</div>"
      : "";
    return (
      labelHtml +
      '<div class="project-entry">' +
      '<div class="project-imgs">' +
      imgHtml +
      '<div class="project-meta-name">' +
      p.name +
      "</div>" +
      subHtml +
      locHtml +
      '<div class="project-owners">' +
      credHtml +
      "</div>" +
      "</div>" +
      '<div class="project-details">' +
      descHtml +
      "</div>" +
      "</div>"
    );
  }

  /* ── Service data — each entry is a list of project examples ── */
  var SERVICES = {
    ist: {
      title: "CAN/ULC-S1001 Integrated Systems Testing",
      lead: "Rigorous, coordinated life safety testing that confirms all interconnected systems perform as required under realistic emergency scenarios.",
      projects: [
        {
          imgClass: "img-can1",
          name: "Century City",
          location: "Surrey, BC",
          credits: [{ label: "Client", value: "Century Group" }],
          desc: [
            "Century City is a large mixed-use development consisting of 42-storey and 36-storey condominium towers, a 19-storey rental tower, a 10-storey office building, ground-floor commercial retail units, and a 4,100 sqft. childcare centre.",
            "Due to the scale and mixed-use nature of the development, the project includes a modified two-stage fire alarm system serving the entire complex, along with integrated smoke control, elevator recall, emergency power, voice communication, sprinkler monitoring, and life safety systems. CAN/ULC-S1001 Integrated Systems Testing was completed to verify that all interconnected systems functioned as intended across the full development.",
          ],
        },
        {
          imgClass: "img-can2",
          name: "King + Crescent",
          location: "Surrey, BC",
          credits: [{ label: "Client", value: "Zenterra Group" }],
          desc: [
            "King + Crescent is a master-planned community located in the King George Corridor of South Surrey. Phase 4 represents the final stage of the development and consists of two 6-storey wood-frame residential buildings constructed over a three-level parkade.",
            "The phase includes 69 homes and is served by a single-stage fire alarm system integrated with sprinkler monitoring, smoke control, elevator recall, emergency lighting, and other life safety systems. CAN/ULC-S1001 Integrated Systems Testing was completed to verify that all interconnected systems operated as intended throughout the development.",
          ],
        },
        {
          imgClass: "img-can3",
          name: "Park & Maven",
          location: "Surrey, BC",
          credits: [{ label: "Client", value: "Jayen Properties (RBI Group)" }],
          desc: [
            "Park & Maven is a 15-acre master-planned community in Willoughby consisting of 55 townhomes, four 6-storey residential buildings, two high-rise residential towers, and a hotel.",
            "To date, two 6-storey wood-frame residential buildings have been completed, while the remaining phases are currently under construction. CAN/ULC-S1001 Integrated Systems Testing was completed for the completed phases to verify the performance of the fire alarm, sprinkler monitoring, smoke control, emergency lighting, elevator recall, and other integrated life safety systems.",
          ],
        },
        {
          imgClass: "",
          name: "13559 Bentley Road Modular Supportive Housing",
          location: "Surrey, BC",
          credits: [{ label: "Client", value: "BC Housing" }],
          desc: [
            "13559 Bentley Road Modular Supportive Housing is a 6-storey permanent modular apartment building located in Surrey, BC. The project provides 60 studio homes intended to support single adults who are experiencing or at risk of homelessness.",
            "The building includes residential units, common amenity spaces, staff support areas, offices, and associated site infrastructure. Due to the supportive housing use and modular construction approach, the project includes a fully integrated fire and life safety system consisting of fire alarm, sprinkler, smoke control, emergency lighting, standby power, and access control systems. CAN/ULC-S1001 Integrated Systems Testing was completed to verify that all interconnected systems operated as intended to support occupant safety, emergency response, and occupancy approval.",
          ],
        },
        {
          imgClass: "img-can4",
          name: "The Beachlands Experience Centre",
          location: "Colwood, BC",
          credits: [
            {
              label: "Client",
              value: "Seacliff Properties and Reliance Properties",
            },
          ],
          desc: [
            "The Beachlands Experience Centre is a showcase facility located at the entrance to the Beachlands waterfront development in Colwood, BC. The building features a 141-foot glass wall providing panoramic views toward Esquimalt Lagoon and downtown Victoria.",
            "Completed in 2025, the facility was designed to present the long-term vision for the community through large-scale models, presentation areas, and fully furnished show homes. The building includes assembly, office, and display uses with extensive glazing, feature lighting, and integrated building systems. CAN/ULC-S1001 Integrated Systems Testing was completed for the project to verify the operation and coordination of the fire alarm system, sprinkler monitoring, smoke control, emergency lighting, HVAC shutdown, door release hardware, and other interconnected life safety systems.",
          ],
        },
        {
          imgClass: "img-can5",
          name: "Ascent",
          location: "Surrey, BC",
          credits: [{ label: "Client", value: "Maple Leaf Homes" }],
          desc: [
            "Ascent is a 31-storey residential condominium high-rise located in Surrey, BC, consisting of 234 homes and completed in 2024.",
            "The tower includes residential amenity areas, underground parking, elevators, emergency power, smoke control systems, and interconnected fire and life safety systems throughout the building. Due to the height and complexity of the project, CAN/ULC-S1001 Integrated Systems Testing was completed to verify the coordination and performance of the fire alarm system, sprinkler, fire pump, monitoring, smoke control, elevator recall, emergency power, access control, and other integrated life safety systems.",
          ],
        },
        {
          imgClass: "img-can6",
          name: "Harlo",
          location: "Surrey, BC",
          credits: [{ label: "Client", value: "Steelix Builders Group" }],
          desc: [
            "Two 6-storey residential buildings with 132 units completed in 2025.",
          ],
        },
        {
          imgClass: "",
          name: "Aritzia Distribution Centre",
          location: "Delta, BC",
          credits: [{ label: "Client", value: "Beedie" }],
          desc: [
            "Aritzia has expanded its logistics operations to support growing e-commerce and retail distribution needs with this 380,000 sq. ft. facility within the Tilbury Industrial Park. The building includes a private café for staff, an on-site gym, warehouse storage areas, packing and shipping operations, conveyor systems, elevators, and highly automated logistics functions.",
            "Due to the size and complexity of the facility, CAN/ULC-S1001 Integrated Systems Testing was completed to verify the operation and coordination of the fire alarm system with pre-action sprinkler systems, clean agent suppression systems, VESDA detection, low-volume high-speed fans, conveyor systems, wireless robotic equipment, diesel fire pump operation, elevator recall, HVAC shutdown, emergency power, smoke control, and other interconnected life safety systems.",
          ],
        },
        {
          imgClass: "img-can7",
          name: "The Hawthorn",
          location: "Vancouver, BC",
          credits: [
            { label: "Client", value: "Brightside Community Homes Foundation" },
          ],
          desc: [
            "The Hawthorn is a six-storey wood-frame residential building located in Marpole, Vancouver, providing 100 non-profit rental homes for seniors and families. The project replaced the aging MacLeod Manor and was designed to Passive House standards to improve energy efficiency and reduce long-term operating costs.",
            "The building includes residential suites, amenity spaces, underground parking, elevators, emergency power, and interconnected fire and life safety systems. CAN/ULC-S1001 Integrated Systems Testing was completed to verify the operation and coordination of the fire alarm system, sprinkler monitoring, smoke control, elevator recall, emergency lighting, standby power, access control, and other integrated life safety systems throughout the building.",
          ],
        },
        {
          imgClass: "img-can8",
          name: "Kiwanis Village West",
          location: "West Vancouver, BC",
          credits: [
            { label: "Client", value: "Kiwanis North Shore Housing (KNSHS)" },
          ],
          desc: [
            "156 below-market rental homes across two six-storey buildings, designed for middle-income workforce households including teachers, police officers, and municipal staff who live or work in West Vancouver.",
          ],
        },
        {
          imgClass: "img-can9",
          name: "Hollybrook",
          location: "North Vancouver, BC",
          credits: [
            {
              label: "Client",
              value:
                "Hollyburn Family Services Society, Terra Housing Consultants",
            },
          ],
          desc: [
            "The development is a four-storey building with 86 affordable rental homes designed to provide high-quality housing for independent seniors and families.",
          ],
        },
      ],
    },
    adjacent: {
      title: "Fire Protection of Adjacent Buildings",
      lead: "Independent assessments that support safe construction in dense urban environments where proximity to existing occupied buildings creates exposure risk.",
      projects: [],
    },
    "third-party": {
      title: "Third-Party Review",
      lead: "An unbiased second opinion that identifies omissions, inconsistencies, or coordination issues before they become problems during permitting, construction, or occupancy.",
      projects: [
        {
          sectionLabel: "Third-Party Review — Residential",
          imgClass: "",
          name: "siʔáḿθɘt School",
          subName: "Tsleil-Waututh Nation Modular School",
          location: "North Vancouver, BC",
          credits: [
            { label: "Owner", value: "Tsleil-Waututh Nation (TWN)" },
            { label: "Architect", value: "MQN Architects" },
          ],
          desc: [
            "The project supports the continued growth of the Tsleil-Waututh Nation’s education program and provides additional classroom space for First Nations students. The new permanent modular classrooms include teaching spaces, support areas, and dedicated spaces for səlilwətat language programs and cultural activities. The project is being constructed using high-performance modular units designed for “Net Zero” readiness and is governed independently by the First Nation-led education authority.",
          ],
        },
        {
          imgClass: "img-third1",
          name: "3043 Dollarton Highway",
          location: "North Vancouver, BC",
          credits: [
            { label: "Owner", value: "Tsleil-Waututh Nation (TWN)" },
            { label: "Architect", value: "Fold Architecture" },
          ],
          desc: [
            "A whole-home revitalization focused on energy efficiency, modernizing an older North Shore layout, and structural upgrades. Two-storey, 3,000 sq. ft. single-family home.",
          ],
        },
        {
          imgClass: "img-third2",
          name: "3050 Tsleil Waututh Way",
          location: "North Vancouver, BC",
          credits: [
            { label: "Owner", value: "Tsleil-Waututh Nation (TWN)" },
            {
              label: "Architect",
              value: "Arora Carpentry Construction Design",
            },
          ],
          desc: [
            "Renovation of an existing single-family home, including an expansion of the living room, upgrades to exterior stairs and egress components, and a roof replacement. Two-storey, 2,154 sq. ft. single-family house on 11,500 sq. ft. site.",
          ],
        },
        {
          imgClass: "img-third3",
          name: "3100 Takaya Drive",
          location: "North Vancouver, BC",
          credits: [
            { label: "Owner", value: "Tsleil-Waututh Nation (TWN)" },
            {
              label: "Architect",
              value: "Arora Carpentry Construction Design",
            },
          ],
          desc: [
            "Interior gut-and-rebuild of two interior floors comprising a recreation room and bedroom on the main floor and 3 bedrooms, kitchen, and living room on the second floor. Two-storey, 1,875 sq. ft. single-family house on 7,147 sq. ft. site.",
          ],
        },
        {
          imgClass: "img-third4",
          name: "SEMIAHMUALELEN (Housing) Society",
          location: "Surrey, BC",
          credits: [
            { label: "Developer", value: "SFN Housing Development" },
            {
              label: "Architect",
              value: "Ankenman Associates Architects Inc.",
            },
          ],
          desc: [
            "A new multi-family development is proposed on a vacant parcel within the Semiahmoo First Nation Reserve in Surrey. The development features 32 two-storey 3 bedroom multi-generational homes, complemented by 76 parking stalls, internal access roads, utility buildings, and a family-friendly playground. Phase 1 has a net area of 10,402 sq. m.",
          ],
        },
        {
          imgClass: "img-third5",
          name: "Katzie First Nation Affordable Housing",
          location: "Pitt Meadows, BC",
          credits: [
            {
              label: "Developer",
              value:
                "Katzie First Nation Affordable Housing Development Society",
            },
            { label: "Architect", value: "Station One Architects" },
          ],
          desc: [
            "The Katzie First Nation Affordable Housing project is an $18.2 million development intended to provide a range of housing options for community members within Katzie First Nation. The project consists of three separate buildings with a total area of approximately 35,000 sq. ft.",
            "Building 1 includes 10 youth housing units, Building 2 includes 16 supportive housing units, and Building 3 includes 14 independent housing units. The project is designed to support a variety of housing needs within the community while allowing members to remain close to family, services, and cultural connections. The development includes associated parking, outdoor amenity areas, site servicing, and supporting infrastructure across the site.",
          ],
        },
        {
          imgClass: "img-third6",
          name: "Soul",
          location: "White Rock, BC",
          credits: [
            { label: "Developer", value: "Elevate Development" },
            { label: "Architect", value: "DF Architecture Inc." },
          ],
          desc: [
            "The development consists of five 3-story wood-frame buildings arranged around a central landscaped courtyard with a total of 53 residences.",
            "ProLyne provided third-party building code review to ensure that every innovative design element met the highest standards of safety and regulatory compliance. With a diverse mix of 2-story townhomes and single-level penthouses, the project required meticulous attention to detail regarding fire safety and structural egress, particularly for the signature loft units featuring 18-foot ceilings.",
          ],
        },
        {
          imgClass: "img-third7",
          name: "The Rivana",
          location: "Maple Ridge, BC",
          credits: [
            { label: "Owner", value: "WestUrban Properties" },
            { label: "Architect", value: "THUJA Architecture + Design" },
          ],
          desc: [
            "A premier mixed-use development project featuring six-storey of 121 modern rental suites over ground-floor commercial space.",
            "As a third-party reviewer, ProLyne ensured that this complex wood-frame and retail integration met every safety and compliance milestone, helping bring high-quality, transit-oriented housing to the heart of Maple Ridge.",
          ],
        },
        {
          imgClass: "img-third8",
          name: "UBC Carey Centre Expansion",
          location: "Vancouver, BC",
          credits: [
            { label: "Owner", value: "UBC" },
            { label: "Architect", value: "Urban Solutions Architecture" },
          ],
          desc: [
            "The UBC Carey Centre Expansion is a significant densification of the Carey Theological College campus at 5920 Iona Drive. This multi-phase project includes a new 7-story residential tower and a 4-story mixed-use academic hub.",
            "ProLyne provided third-party building code consulting for the landmark expansion, navigating the complex safety requirements of integrating student housing with specialized institutional spaces and ensuring this vibrant new campus addition meets the highest standards of the BC Building Code and UBC's sustainability mandates.",
          ],
        },
        {
          imgClass: "img-third9",
          name: "UBC Chemical and Biological Engineering Building (CHBE) Addition",
          location: "Vancouver, BC",
          credits: [
            { label: "Owner", value: "UBC" },
            { label: "Architect", value: "Shape Architecture Inc." },
          ],
          desc: [
            "A two-storey, 950 sq. m. addition to provide a fabrication and digital design space for the Faculty of Applied Science, integrating modern engineering tools with the existing CHBE labs. The lower level features a versatile shop fabrication space, while the upper level hosts dynamic class and lab studios, collaborative assembly areas, and modern conference rooms.",
          ],
        },
        {
          imgClass: "img-third0",
          name: "Vancouver Fraser Port Authority Annacis Auto Terminal",
          location: "Delta, BC",
          credits: [
            { label: "Owner", value: "Vancouver Fraser Port Authority" },
          ],
          desc: [
            "To support Canada's growing auto import sector, the Vancouver Fraser Port Authority and Wallenius Wilhelmsen have upgraded the Annacis Auto Terminal to enhance efficiency and expand capacity by 36%, accommodating up to 480,000 vehicles annually.",
            "Improvements include terminal consolidation, expanded rail yards with 60 additional rail car spots, a new vehicle processing facility, and electric vehicle charging infrastructure.",
          ],
        },
        {
          imgClass: "",
          name: "Richardson International Grain Storage Facility",
          location: "North Vancouver, BC",
          credits: [
            {
              label: "Owner",
              value:
                "Richardson International Limited on Vancouver Fraser Port Authority land",
            },
          ],
          desc: [
            "While Richardson's permanent grain storage is handled by its concrete annexes, modular structural fabric tent structures are utilized during the delivery and staging phases. Due to the Richardson terminal being situated on a narrow strip of land between the Burrard Inlet and Low Level Road, these modular structures are essential for managing logistics without disrupting the terminal's throughput.",
          ],
        },
        {
          imgClass: "",
          name: "1231 Burdette Street Expansion",
          location: "Richmond, BC",
          credits: [
            { label: "Owner", value: "Vancouver Fraser Port Authority" },
            { label: "Architect", value: "David J. Ho. Architect" },
          ],
          desc: [
            "Industrial modernization that involves structural additions to the existing building to increase operational capacity.",
          ],
        },
        {
          sectionLabel: "Firestopping Review",
          imgClass: "",
          name: "Hollybrook",
          location: "North Vancouver, BC",
          credits: [
            {
              label: "Client",
              value:
                "Hollyburn Family Services Society, Terra Housing Consultants",
            },
          ],
          desc: [
            "The development is a four-storey building with 86 affordable rental homes designed to provide high-quality housing for independent seniors and families.",
          ],
        },
        {
          imgClass: "",
          name: "Artesia",
          location: "Burnaby, BC",
          credits: [{ label: "Client", value: "Qualex-Landmark" }],
          desc: [
            "Artesia is a 31-storey concrete residential high-rise located on the quieter edge of Metrotown in Burnaby, featuring 245 condominium units and 2 townhomes. The development includes both high-rise and low-rise residential components, underground parking, residential amenity areas, elevators, and interconnected fire and life safety systems.",
            "ProLyne staff were engaged to provide third-party firestopping review services for both the high-rise tower and low-rise portions of the project. Services included site observations of installed firestopping systems, review of joint penetrations and systems, assessment against tested assemblies and approved documentation, and identification of deficiencies or non-conforming installations.",
          ],
        },
      ],
    },
    "alt-solution": {
      title: "Alternative Solution Review",
      lead: "Independent technical review of Alternative Solution submissions to confirm the proposed approach meets the intent and functional objectives of the applicable code.",
      projects: [],
    },
    "life-safety": {
      title: "Existing Building Life Safety Assessments",
      lead: "Clear, practical assessments that identify fire and life safety deficiencies and support informed decision-making for building owners, operators, and Authorities Having Jurisdiction.",
      projects: [],
    },
    "permit-processes": {
      title: "Development of Building Permit Processes and Bylaws",
      lead: "Practical support for First Nations and other authorities in developing clear, effective building permit and development review frameworks.",
      projects: [],
    },
    "ip-projects": {
      title: "Independent Professional Projects",
      lead: "A selection of completed projects where Prolyne has served as Independent Professional for Authorities Having Jurisdiction.",
      projects: [
        {
          imgClass: "img-ip1",
          name: "TownPlace Suites Hotel",
          location: "Sidney, BC",
          credits: [
            { label: "Owner", value: "Kothari" },
            { label: "Architect", value: "MATAJ Architects" },
          ],
          desc: [
            "A 129-room, three-story extended-stay hotel located at the intersection of Beacon Avenue West and Highway 17 (Stirling Way) on land leased from the Victoria Airport Authority (YYJ).",
            "The hotel spans approximately 77,000 sq. ft. on a 3.5-acre site. There are 129 suites, a 5,000 sq. ft. restaurant, 1,500 sq. ft. of meeting space, a fitness centre, and a swimming pool. The building was originally designed for precast concrete but was redesigned using a lightweight steel stud system (LBS) to improve efficiency and reduce costs. The three-story structure was erected in approximately 11 weeks.",
          ],
        },
        {
          imgClass: "",
          name: "YYJ Lower Holdroom and Air Terminal Building (ATB) Holdroom Expansion",
          location: "Sidney, BC",
          credits: [
            { label: "Owner", value: "Victoria Airport Authority (YYJ)" },
          ],
          desc: [
            "The Lower Holdroom Expansion at Victoria International Airport (YYJ) was a multi-phase terminal improvement project completed between 2018 and 2020. The project included expansion of the existing lower passenger departure lounge to accommodate additional boarding gates, food and retail areas, washrooms, seating, and improved passenger circulation space. Exterior improvements also included covered walkways and landscaping.",
            "This project was completed by ProLyne staff while employed by a previous consulting firm and included building code and fire/life safety review services associated with the terminal expansion within an active airport environment. Services included review of fire and life safety systems, including alternative solutions, to assess the project for compliance with the BC Building Code, National Building Code of Canada, applicable Transport Canada regulations, and relevant fire and life safety standards for the terminal building.",
          ],
        },
        {
          imgClass: "img-ip2",
          name: "Make Space Storage",
          location: "Sidney, BC",
          credits: [{ label: "Owner", value: "Make Space Inc." }],
          desc: [
            "The Make Space Storage facility at Victoria International Airport (YYJ) is a recently completed industrial development located on the northern perimeter of Victoria International Airport. The project was developed on federal airport lands and underwent a VAA environmental effects determination.",
            "The modern self-storage warehouse includes 185 climate-controlled units, drive-up containers, and portable storage services on a 2.5 acre site.",
          ],
        },

        {
          imgClass: ["img-ip3", "img-ip4"],
          name: "Amazon YYJ Delivery Station — AVI Tunnel",
          location: "Sidney, BC",
          credits: [
            { label: "Owner", value: "Amazon" },
            { label: "Architect", value: "NORR Architects & Engineers Ltd." },
          ],
          desc: [
            "The Automated Vehicle Inspection (AVI) tunnel at the Amazon YYJ Delivery Station is a specialized system designed to scan delivery vans for maintenance and safety issues as they return from their routes. It was integrated into the facility to improve fleet uptime and driver safety. The AVI tunnel is housed within the 115,000 sq. ft. delivery station on Victoria International Airport lands.",
            "As an Independent Professional, ProLyne worked closely with the equipment provider, architect, and Amazon and provided unbiased oversight for the Victoria International Airport Authority. When Amazon introduced the UVeye automated inspection tunnel to YYJ, success required a technical bridge between global innovation and local regulatory approval. ProLyne provided the specialized oversight and rigorous review necessary to secure Victoria Airport Authority’s confidence.",
          ],
        },
        {
          imgClass: "img-ip5",
          name: "Titan Boats Expansion at YYJ",
          location: "Sidney, BC",
          credits: [
            { label: "Owner", value: "Daneco Holdings Ltd. (Titan Boats)" },
            { label: "Architect", value: "KP Architecture Ltd." },
          ],
          desc: [
            "The Titan Boats Expansion at Victoria International Airport (YYJ) is a major industrial project designed to increase the manufacturing capacity of one of Canada’s leading aluminum rigid hull inflatable boat builders.",
            "The project is located on land leased from the Victoria Airport Authority. The expansion adds a new 12,000 sqft. industrial building bringing the total gross building area across the site to 44,600 sq. ft. over 2.82 acres. The building use is classified as “Medium Hazard Industrial” (F-2 occupancy).",
            "For a project of this nature, an Independent Professional plays a critical role in the industrial process integration. ProLyne provided third-party permit review and inspection services to support the complex industrial expansion and ensure compliance with applicable building code, fire and life safety, and YYJ land use requirements. Services included review of the dedicated marine paint shop and fabrication building, with particular focus on fire separations, hazardous processes, exiting, and life safety requirements.",
          ],
        },
      ],
    },
  };

  /* Build a full modal page for a service (project-entry layout) */
  function buildServiceHTML(d) {
    var entriesHTML = d.projects.map(projectEntry).join("");
    if (!entriesHTML) {
      entriesHTML =
        '<p style="color:#888;font-style:italic;padding:40px 0">Project examples coming soon.</p>';
    }
    return (
      '<div class="mpg-head">' +
      '<div class="mpg-tag">' +
      d.title +
      "</div>" +
      '<p class="mpg-lead">' +
      d.lead +
      "</p>" +
      "</div>" +
      '<div class="mpg-projects"><div class="project-list">' +
      entriesHTML +
      "</div></div>"
    );
  }

  /* ── Modal open / close ────────────────────────────────────── */
  var modalOverlay = document.getElementById("modalOverlay");
  var modalClose = document.getElementById("modalClose");
  var modalPage = document.getElementById("modalPage");
  var modalLabel = document.getElementById("modalTopbarLabel");

  function openModal(key) {
    var html = "";
    if (SERVICES[key]) {
      modalLabel.textContent = "Services";
      html = buildServiceHTML(SERVICES[key]);
    } else {
      return;
    }
    modalPage.innerHTML = html;
    modalOverlay.classList.add("is-open");
    modalOverlay.setAttribute("aria-hidden", "false");
    modalOverlay.scrollTop = 0;
    modalClose.focus();
    document.body.style.overflow = "hidden";

    history.pushState({ modal: key }, "");

    var ctaLink = modalPage.querySelector(".modal-cta-link");
    if (ctaLink) {
      ctaLink.addEventListener("click", closeModal);
    }
  }

  function closeModal() {
    if (!modalOverlay.classList.contains("is-open")) return;
    modalOverlay.classList.remove("is-open");
    modalOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (history.state && history.state.modal) {
      history.back();
    }
  }

  window.addEventListener("popstate", function (e) {
    if (modalOverlay.classList.contains("is-open")) {
      modalOverlay.classList.remove("is-open");
      modalOverlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  });

  document
    .querySelectorAll(
      ".full-svc-card[data-modal], .ip-projects-banner[data-modal]",
    )
    .forEach(function (el) {
      el.addEventListener("click", function () {
        openModal(el.dataset.modal);
      });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(el.dataset.modal);
        }
      });
    });

  modalClose.addEventListener("click", closeModal);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalOverlay.classList.contains("is-open")) {
      closeModal();
    }
  });

  /* ── Initial call ──────────────────────────────────────────── */
  onScroll();
})();
