// ===== SOFTWARE COMPANY MOUSE EFFECT =====

class SoftwareCompanyMouseEffect {
  constructor(options = {}) {
    // Professional color scheme for software companies
    this.colors = {
      primary: options.primaryColor || "#2563eb", // Professional blue
      secondary: options.secondaryColor || "#7c3aed", // Purple accent
      accent: options.accentColor || "#06b6d4", // Cyan for tech feel
      success: options.successColor || "#10b981", // Green for success states
      ...options.colors,
    };

    this.settings = {
      mainSize: options.mainSize || 24,
      hoverSize: options.hoverSize || 36,
      trailSize: options.trailSize || 12,
      followSpeed: options.followSpeed || 0.12,
      trailSpeed: options.trailSpeed || 0.06,
      enabled: window.innerWidth > 768, // Desktop only
      ...options.settings,
    };

    this.elements = {};
    this.mouse = { x: 0, y: 0 };
    this.follower = { x: 0, y: 0 };
    this.trail = { x: 0, y: 0 };
    this.isHovering = false;
    this.currentElement = null;

    if (this.settings.enabled) {
      this.init();
    }
  }

  init() {
    this.createElements();
    this.addEventListeners();
    this.startAnimation();
    this.setupCompanySpecificEffects();
  }

  createElements() {
    // Main cursor follower
    this.elements.follower = this.createElement("mouse-follower", {
      width: `${this.settings.mainSize}px`,
      height: `${this.settings.mainSize}px`,
      background: this.colors.primary,
      borderRadius: "50%",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      boxShadow: `0 0 20px ${this.colors.primary}40`,
      mixBlendMode: "difference",
      transition:
        "width 0.3s ease, height 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
    });

    // Trail effect
    this.elements.trail = this.createElement("mouse-trail", {
      width: `${this.settings.trailSize}px`,
      height: `${this.settings.trailSize}px`,
      background: `linear-gradient(45deg, ${this.colors.secondary}, ${this.colors.accent})`,
      borderRadius: "50%",
      opacity: "0.6",
    });

    // Outer ring for professional look
    this.elements.ring = this.createElement("mouse-ring", {
      width: `${this.settings.mainSize + 16}px`,
      height: `${this.settings.mainSize + 16}px`,
      border: `1px solid ${this.colors.primary}60`,
      borderRadius: "50%",
      background: "transparent",
      transition: "all 0.3s ease",
      opacity: "0",
    });

    // Text indicator for special elements
    this.elements.text = this.createElement("mouse-text", {
      background: this.colors.primary,
      color: "white",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "500",
      transform: "translate(-50%, -150%)",
      opacity: "0",
      transition: "opacity 0.3s ease",
      whiteSpace: "nowrap",
      fontFamily: "system-ui, -apple-system, sans-serif",
    });

    // Hide default cursor
    document.body.style.cursor = "none";
  }

  createElement(className, styles) {
    const element = document.createElement("div");
    element.className = className;

    const baseStyles = {
      position: "fixed",
      pointerEvents: "none",
      zIndex: "9999",
      transform: "translate(-50%, -50%)",
      userSelect: "none",
    };

    Object.assign(element.style, baseStyles, styles);
    document.body.appendChild(element);
    return element;
  }

  addEventListeners() {
    // Mouse movement
    document.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.updateTextPosition();
    });

    // Setup hover effects for different element types
    this.setupHoverEffects();

    // Click effect
    document.addEventListener("click", (e) => {
      this.createClickEffect(e.clientX, e.clientY);
    });

    // Scroll effect
    let scrollTimeout;
    window.addEventListener("scroll", () => {
      this.elements.follower.style.opacity = "0.5";
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.elements.follower.style.opacity = "1";
      }, 150);
    });
  }

  setupHoverEffects() {
    // Define element types with specific effects
    const elementTypes = {
      // Navigation and menu items
      "nav a, .nav-link, .menu-item": {
        color: this.colors.primary,
        size: this.settings.hoverSize,
        text: "Navigate",
        ring: true,
      },

      // Buttons and CTAs
      'button, .btn, .cta, input[type="submit"]': {
        color: this.colors.success,
        size: this.settings.hoverSize + 4,
        text: "Click",
        ring: true,
        pulse: true,
      },

      // Service/Product cards
      ".service-card, .product-card, .feature-card, .card": {
        color: this.colors.accent,
        size: this.settings.hoverSize + 8,
        text: "Explore",
        ring: true,
      },

      // Social media and external links
      '.social-link, [href^="http"], .external-link': {
        color: this.colors.secondary,
        size: this.settings.hoverSize,
        text: "External",
        ring: true,
      },

      // Contact forms and inputs
      "input, textarea, select": {
        color: this.colors.accent,
        size: this.settings.mainSize + 8,
        text: "Type here",
        shape: "square",
      },

      // Portfolio/Project items
      ".portfolio-item, .project-card, .case-study": {
        color: this.colors.secondary,
        size: this.settings.hoverSize + 12,
        text: "View Project",
        ring: true,
      },

      // Downloads and documents
      ".download-link, [download], .pdf-link": {
        color: this.colors.success,
        size: this.settings.hoverSize,
        text: "Download",
        ring: true,
      },
    };

    // Apply hover effects
    Object.entries(elementTypes).forEach(([selector, config]) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        el.addEventListener("mouseenter", () => this.onHover(config, el));
        el.addEventListener("mouseleave", () => this.onLeave());
      });
    });
  }

  onHover(config, element) {
    this.isHovering = true;
    this.currentElement = element;

    // Update main cursor
    this.elements.follower.style.width = `${config.size}px`;
    this.elements.follower.style.height = `${config.size}px`;
    this.elements.follower.style.background = config.color;
    this.elements.follower.style.boxShadow = `0 0 30px ${config.color}60`;

    // Shape modification
    if (config.shape === "square") {
      this.elements.follower.style.borderRadius = "4px";
    } else {
      this.elements.follower.style.borderRadius = "50%";
    }

    // Show ring
    if (config.ring) {
      this.elements.ring.style.opacity = "1";
      this.elements.ring.style.width = `${config.size + 20}px`;
      this.elements.ring.style.height = `${config.size + 20}px`;
      this.elements.ring.style.borderColor = `${config.color}40`;
    }

    // Show text
    if (config.text) {
      this.elements.text.textContent = config.text;
      this.elements.text.style.opacity = "1";
      this.elements.text.style.background = config.color;
    }

    // Pulse effect
    if (config.pulse) {
      this.elements.follower.style.animation =
        "mousePulse 1.5s ease-in-out infinite";
    }

    // Add CSS animations if not exists
    this.addAnimationStyles();
  }

  onLeave() {
    this.isHovering = false;
    this.currentElement = null;

    // Reset to default state
    this.elements.follower.style.width = `${this.settings.mainSize}px`;
    this.elements.follower.style.height = `${this.settings.mainSize}px`;
    this.elements.follower.style.background = this.colors.primary;
    this.elements.follower.style.borderRadius = "50%";
    this.elements.follower.style.boxShadow = `0 0 20px ${this.colors.primary}40`;
    this.elements.follower.style.animation = "none";

    // Hide ring and text
    this.elements.ring.style.opacity = "0";
    this.elements.text.style.opacity = "0";
  }

  startAnimation() {
    const animate = () => {
      // Smooth following animation
      this.follower.x +=
        (this.mouse.x - this.follower.x) * this.settings.followSpeed;
      this.follower.y +=
        (this.mouse.y - this.follower.y) * this.settings.followSpeed;

      this.trail.x += (this.mouse.x - this.trail.x) * this.settings.trailSpeed;
      this.trail.y += (this.mouse.y - this.trail.y) * this.settings.trailSpeed;

      // Update positions
      this.elements.follower.style.left = `${this.follower.x}px`;
      this.elements.follower.style.top = `${this.follower.y}px`;

      this.elements.ring.style.left = `${this.follower.x}px`;
      this.elements.ring.style.top = `${this.follower.y}px`;

      this.elements.trail.style.left = `${this.trail.x}px`;
      this.elements.trail.style.top = `${this.trail.y}px`;

      requestAnimationFrame(animate);
    };
    animate();
  }

  updateTextPosition() {
    this.elements.text.style.left = `${this.mouse.x}px`;
    this.elements.text.style.top = `${this.mouse.y}px`;
  }

  createClickEffect(x, y) {
    const ripple = this.createElement("click-ripple", {
      width: "10px",
      height: "10px",
      background: this.colors.accent,
      borderRadius: "50%",
      animation: "clickRipple 0.6s ease-out forwards",
      left: `${x}px`,
      top: `${y}px`,
    });

    setTimeout(() => ripple.remove(), 600);
  }

  setupCompanySpecificEffects() {
    // Logo hover effect
    const logos = document.querySelectorAll(".logo, .brand");
    logos.forEach((logo) => {
      logo.addEventListener("mouseenter", () => {
        this.onHover(
          {
            color: this.colors.primary,
            size: this.settings.hoverSize + 8,
            text: "Home",
            ring: true,
          },
          logo
        );
      });
      logo.addEventListener("mouseleave", () => this.onLeave());
    });

    // Technology stack items
    const techItems = document.querySelectorAll(
      ".tech-item, .skill, .technology"
    );
    if (techItems.length > 0) {
      techItems.forEach((item) => {
        item.addEventListener("mouseenter", () => {
          this.onHover(
            {
              color: this.colors.secondary,
              size: this.settings.hoverSize,
              text: "Technology",
              ring: true,
            },
            item
          );
        });
        item.addEventListener("mouseleave", () => this.onLeave());
      });
    }

    // Team member cards
    const teamCards = document.querySelectorAll(".team-member, .employee-card");
    if (teamCards.length > 0) {
      teamCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          this.onHover(
            {
              color: this.colors.accent,
              size: this.settings.hoverSize + 6,
              text: "Team Member",
              ring: true,
            },
            card
          );
        });
        card.addEventListener("mouseleave", () => this.onLeave());
      });
    }
  }

  addAnimationStyles() {
    if (!document.querySelector("#mouse-effect-styles")) {
      const style = document.createElement("style");
      style.id = "mouse-effect-styles";
      style.textContent = `
                @keyframes mousePulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.1); }
                }
                
                @keyframes clickRipple {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(8);
                        opacity: 0;
                    }
                }
                
                .mouse-follower,
                .mouse-trail,
                .mouse-ring,
                .mouse-text {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `;
      document.head.appendChild(style);
    }
  }

  // Public methods
  updateColors(newColors) {
    Object.assign(this.colors, newColors);
  }

  disable() {
    Object.values(this.elements).forEach((el) => el?.remove());
    document.body.style.cursor = "auto";
  }

  enable() {
    if (window.innerWidth > 768) {
      this.init();
    }
  }
}

// ===== EASY SETUP FOR SOFTWARE COMPANIES =====

// Default configuration for software companies
const defaultSoftwareConfig = {
  primaryColor: "#2563eb", // Professional blue
  secondaryColor: "#7c3aed", // Purple for creativity
  accentColor: "#06b6d4", // Cyan for tech
  successColor: "#10b981", // Green for success
  settings: {
    mainSize: 24,
    hoverSize: 36,
    followSpeed: 0.12,
    trailSpeed: 0.06,
  },
};

// Tech startup configuration
const techStartupConfig = {
  primaryColor: "#6366f1", // Modern indigo
  secondaryColor: "#ec4899", // Pink for innovation
  accentColor: "#14b8a6", // Teal
  successColor: "#10b981",
  settings: {
    mainSize: 20,
    hoverSize: 32,
    followSpeed: 0.15,
    trailSpeed: 0.08,
  },
};

// Corporate configuration
const corporateConfig = {
  primaryColor: "#1f2937", // Dark gray
  secondaryColor: "#3b82f6", // Blue
  accentColor: "#059669", // Green
  successColor: "#10b981",
  settings: {
    mainSize: 26,
    hoverSize: 38,
    followSpeed: 0.1,
    trailSpeed: 0.05,
  },
};

// ===== USAGE EXAMPLES =====

// Initialize with default software company theme
function initSoftwareCompanyMouse() {
  return new SoftwareCompanyMouseEffect(defaultSoftwareConfig);
}

// Initialize with tech startup theme
function initTechStartupMouse() {
  return new SoftwareCompanyMouseEffect(techStartupConfig);
}

// Initialize with corporate theme
function initCorporateMouse() {
  return new SoftwareCompanyMouseEffect(corporateConfig);
}

// Initialize with custom configuration
function initCustomMouse(customConfig) {
  return new SoftwareCompanyMouseEffect(customConfig);
}

// ===== AUTO INITIALIZATION =====
document.addEventListener("DOMContentLoaded", function () {
  // Auto-detect company type from page classes or data attributes
  const body = document.body;
  let mouseEffect;

  if (
    body.classList.contains("tech-startup") ||
    body.dataset.theme === "startup"
  ) {
    mouseEffect = initTechStartupMouse();
  } else if (
    body.classList.contains("corporate") ||
    body.dataset.theme === "corporate"
  ) {
    mouseEffect = initCorporateMouse();
  } else {
    // Default software company theme
    mouseEffect = initSoftwareCompanyMouse();
  }

  // Make it globally accessible
  window.mouseEffect = mouseEffect;
});

// ===== ADDITIONAL FEATURES =====

// Magnetic effect for buttons (optional)
function addMagneticEffect() {
  const magneticElements = document.querySelectorAll(
    ".magnetic, .btn-magnetic"
  );

  if (magneticElements.length > 0) {
    magneticElements.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        el.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0, 0)";
      });
    });
  }
}

// Initialize magnetic effect
document.addEventListener("DOMContentLoaded", addMagneticEffect);
