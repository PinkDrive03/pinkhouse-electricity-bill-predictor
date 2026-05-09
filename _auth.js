(function () {
  var PROJECT_FOLDER = "stitch_pinkhouse_bill_predictor";
  var SESSION_KEY = "pinkhouseAuthSession";

  function getBasePath() {
    var pathname = decodeURIComponent(window.location.pathname || "");
    var marker = "/" + PROJECT_FOLDER + "/";
    var index = pathname.lastIndexOf(marker);

    if (index === -1) {
      return "";
    }

    return pathname.slice(0, index + marker.length - 1);
  }

  function toPage(folder) {
    return encodeURI(getBasePath() + "/" + folder + "/code.html");
  }

  var routes = {
    login: toPage("dang nhap"),
    home: toPage("trang ch\u1ee7 pinkhouse"),
    setup: toPage("trang nh\u1eadp th\u00f4ng tin"),
    dashboard: toPage("dashboard 1"),
    dashboard2: toPage("dashboard 2"),
    tips: toPage("lstk 1"),
    history: toPage("lstk 2")
  };

  function getSession() {
    try {
      var raw = window.localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function isAuthenticated() {
    return !!getSession();
  }

  function login(profile) {
    var safeProfile = profile || {};
    var payload = {
      name: safeProfile.name || "Kh\u00e1ch",
      email: safeProfile.email || "",
      role: safeProfile.role || "member",
      loginAt: new Date().toISOString()
    };

    window.localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    window.location.replace(routes.home);
  }

  function logout() {
    window.localStorage.removeItem(SESSION_KEY);
    window.location.replace(routes.login);
  }

  function isLoginPage() {
    return decodeURIComponent(window.location.pathname || "").indexOf("/dang nhap/") !== -1;
  }

  function guardRoute() {
    if (isLoginPage()) {
      if (isAuthenticated()) {
        window.location.replace(routes.home);
      }
      return;
    }

    if (!isAuthenticated()) {
      window.location.replace(routes.login);
    }
  }

  document.addEventListener("click", function (event) {
    var logoutTarget = event.target.closest("[data-auth-action='logout']");
    if (!logoutTarget) {
      return;
    }

    event.preventDefault();
    logout();
  });

  window.PinkhouseAuth = {
    routes: routes,
    getSession: getSession,
    isAuthenticated: isAuthenticated,
    login: login,
    logout: logout
  };

  guardRoute();
})();
