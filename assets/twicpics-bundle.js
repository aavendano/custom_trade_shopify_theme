(() => {
  // assets/custom.js
  function safeLocalStorage() {
    try {
      if (window.self !== window.top) {
        console.warn("[Theme] Running in sandboxed environment - localStorage may not be available");
        return {
          getItem: function(key) {
            try {
              return localStorage.getItem(key);
            } catch (e) {
              console.warn("[Theme] localStorage getItem failed:", e.message);
              return null;
            }
          },
          setItem: function(key, value) {
            try {
              localStorage.setItem(key, value);
            } catch (e) {
              console.warn("[Theme] localStorage setItem failed:", e.message);
            }
          },
          removeItem: function(key) {
            try {
              localStorage.removeItem(key);
            } catch (e) {
              console.warn("[Theme] localStorage removeItem failed:", e.message);
            }
          },
          clear: function() {
            try {
              localStorage.clear();
            } catch (e) {
              console.warn("[Theme] localStorage clear failed:", e.message);
            }
          }
        };
      }
      return localStorage;
    } catch (e) {
      console.warn("[Theme] localStorage not available:", e.message);
      return {
        getItem: () => null,
        setItem: () => {
        },
        removeItem: () => {
        },
        clear: () => {
        }
      };
    }
  }
  var storage = safeLocalStorage();
  function handleCSPViolations() {
    if (window.self !== window.top) {
      console.warn("[Theme] Running in sandboxed environment - CSP violations may occur");
      window.addEventListener("error", function(event) {
        if (event.message && event.message.includes("Content Security Policy")) {
          console.warn("[Theme] CSP violation detected, continuing gracefully");
          event.preventDefault();
        }
      });
      window.addEventListener("unhandledrejection", function(event) {
        if (event.reason && event.reason.message && event.reason.message.includes("Content Security Policy")) {
          console.warn("[Theme] CSP violation in promise, continuing gracefully");
          event.preventDefault();
        }
      });
    }
  }
  handleCSPViolations();
  function handleTouchInterventions() {
    if (window.self !== window.top) {
      console.warn("[Theme] Running in sandboxed environment - touch interventions may occur");
      let isScrolling = false;
      document.addEventListener("touchstart", function() {
        isScrolling = false;
      }, { passive: true });
      document.addEventListener("touchmove", function(event) {
        isScrolling = true;
      }, { passive: true });
      document.addEventListener("touchend", function(event) {
        if (!isScrolling) {
        }
        isScrolling = false;
      }, { passive: true });
      const originalPreventDefault = Event.prototype.preventDefault;
      Event.prototype.preventDefault = function() {
        if (this.type === "touchmove" && isScrolling) {
          console.warn("[Theme] Prevented touchmove preventDefault during scroll");
          return;
        }
        return originalPreventDefault.apply(this, arguments);
      };
    }
  }
  handleTouchInterventions();
})();
