(function () {
  if (!window.PinkhouseAuth) {
    return;
  }

  document.documentElement.lang = "vi";
  document.title = "PINKHOUSE - Đăng nhập";

  var heading = document.querySelector("h2");
  var intro = document.querySelector("h2 + p");
  var tabButtons = document.querySelectorAll("form .border-b button");
  var labels = document.querySelectorAll("label");
  var forgotLink = document.querySelector("label[for='password'] + a, a[href='#']");
  var submitButton = document.querySelector("form button[type='submit']");
  var guestButton = document.querySelector("form button[type='button'].w-full");
  var divider = document.querySelector(".relative.flex.items-center span");
  var socialLabels = document.querySelectorAll(".grid.grid-cols-2 span.font-label-lg");
  var registerText = document.querySelector("p.text-center");
  var footerLinks = document.querySelectorAll("footer a");
  var footerCopy = document.querySelector("footer span");
  var brandMessage = document.querySelector("section.lg\\:flex p.font-body-lg");
  var forecastLabel = document.querySelector("section.lg\\:flex .font-label-lg");
  var forecastQuote = document.querySelector("section.lg\\:flex .bg-surface\\/10 p.font-body-md");
  var emailInput = document.getElementById("email");
  var passwordInput = document.getElementById("password");
  var rememberLabel = document.querySelector("label[for='remember']");
  var form = document.querySelector("form");
  var registerTab = tabButtons[1];
  var loginTab = tabButtons[0];
  var registerLink = registerText ? registerText.querySelector("a") : null;

  if (heading) {
    heading.textContent = "Chào mừng trở lại";
  }
  if (intro) {
    intro.textContent = "Vui lòng nhập thông tin để đăng nhập vào tài khoản của bạn.";
  }
  if (tabButtons[0]) {
    tabButtons[0].textContent = "Đăng nhập";
  }
  if (tabButtons[1]) {
    tabButtons[1].textContent = "Đăng ký";
  }
  if (labels[0]) {
    labels[0].textContent = "Email hoặc tên đăng nhập";
  }
  if (labels[1]) {
    labels[1].textContent = "Mật khẩu";
  }
  if (forgotLink) {
    forgotLink.textContent = "Quên mật khẩu?";
  }
  if (submitButton) {
    submitButton.textContent = "Đăng nhập";
  }
  if (guestButton) {
    guestButton.innerHTML = '<span class="material-symbols-outlined">person_search</span> Đăng nhập với vai trò khách';
  }
  if (divider) {
    divider.textContent = "HOẶC TIẾP TỤC VỚI";
  }
  if (socialLabels[0]) {
    socialLabels[0].textContent = "Google";
  }
  if (socialLabels[1]) {
    socialLabels[1].textContent = "Facebook";
  }
  if (registerText) {
    registerText.innerHTML = 'Bạn chưa có tài khoản? <a class="text-primary font-label-lg text-label-lg hover:underline ml-xs" href="#">Đăng ký ngay</a>';
    registerLink = registerText.querySelector("a");
  }
  if (footerLinks[0]) {
    footerLinks[0].textContent = "Quyền riêng tư";
  }
  if (footerLinks[1]) {
    footerLinks[1].textContent = "Điều khoản";
  }
  if (footerCopy) {
    footerCopy.textContent = "© 2026 PINKHOUSE";
  }
  if (brandMessage) {
    brandMessage.textContent = "Quản lý năng lượng thông minh hơn cho tương lai bền vững. Dự đoán mức tiêu thụ, tiết kiệm chi phí và dẫn đầu sự thay đổi.";
  }
  if (forecastLabel) {
    forecastLabel.textContent = "Thông tin dự báo";
  }
  if (forecastQuote) {
    forecastQuote.textContent = '"Người dùng tiết kiệm trung bình 18% hóa đơn tiện ích hàng tháng bằng công cụ dự báo tích hợp AI của chúng tôi."';
  }
  if (emailInput) {
    emailInput.placeholder = "Nhập email của bạn";
    emailInput.required = true;
  }
  if (passwordInput) {
    passwordInput.placeholder = "••••••••";
    passwordInput.required = true;
  }
  if (rememberLabel) {
    rememberLabel.textContent = "Ghi nhớ tôi trong 30 ngày";
  }
  if (form) {
    form.noValidate = true;
  }

  function doLogin(profile) {
    window.PinkhouseAuth.login(profile);
  }

  if (!form || !emailInput || !passwordInput || !loginTab || !registerTab) {
    return;
  }

  var mode = "login";

  var passwordFieldWrap = passwordInput.closest("div");
  var emailFieldWrap = emailInput.closest("div");
  var emailLabel = labels[0] || null;
  var passwordLabel = labels[1] || null;
  var rememberWrap = rememberLabel ? rememberLabel.closest("div, label") : null;
  var socialGrid = socialLabels.length ? socialLabels[0].closest(".grid.grid-cols-2") : null;

  var nameFieldWrap = document.createElement("div");
  nameFieldWrap.style.overflow = "hidden";
  nameFieldWrap.style.maxHeight = "0px";
  nameFieldWrap.style.opacity = "0";
  nameFieldWrap.style.transform = "translateY(-8px)";
  nameFieldWrap.style.transition = "all 0.28s ease";

  nameFieldWrap.innerHTML = [
    '<label for="registerName" style="display:block;margin-bottom:8px;font-weight:600;">Họ và tên</label>',
    '<div style="position:relative;">',
    '<input id="registerName" type="text" placeholder="Nhập họ và tên của bạn" style="width:100%;padding:16px 16px;border:1px solid #e5b3c8;border-radius:12px;outline:none;">',
    '</div>'
  ].join("");

  var confirmFieldWrap = document.createElement("div");
  confirmFieldWrap.style.overflow = "hidden";
  confirmFieldWrap.style.maxHeight = "0px";
  confirmFieldWrap.style.opacity = "0";
  confirmFieldWrap.style.transform = "translateY(-8px)";
  confirmFieldWrap.style.transition = "all 0.28s ease";
  confirmFieldWrap.style.marginTop = "16px";

  confirmFieldWrap.innerHTML = [
    '<label for="confirmPassword" style="display:block;margin-bottom:8px;font-weight:600;">Nhập lại mật khẩu</label>',
    '<div style="position:relative;">',
    '<input id="confirmPassword" type="password" placeholder="Nhập lại mật khẩu" style="width:100%;padding:16px 16px;border:1px solid #e5b3c8;border-radius:12px;outline:none;">',
    '</div>'
  ].join("");

  if (emailFieldWrap && passwordFieldWrap) {
    emailFieldWrap.parentNode.insertBefore(nameFieldWrap, emailFieldWrap);
    passwordFieldWrap.parentNode.insertBefore(confirmFieldWrap, passwordFieldWrap.nextSibling);
  }

  var registerNameInput = document.getElementById("registerName");
  var confirmPasswordInput = document.getElementById("confirmPassword");

  function setTabActive(activeTab, inactiveTab) {
    if (activeTab) {
      activeTab.style.color = "#d1006b";
      activeTab.style.borderBottom = "2px solid #d1006b";
      activeTab.style.fontWeight = "700";
      activeTab.style.transition = "all 0.25s ease";
    }
    if (inactiveTab) {
      inactiveTab.style.color = "#6b4d5b";
      inactiveTab.style.borderBottom = "2px solid transparent";
      inactiveTab.style.fontWeight = "500";
      inactiveTab.style.transition = "all 0.25s ease";
    }
  }

  function showBlockSmooth(el) {
    if (!el) {
      return;
    }
    el.style.display = "";
    requestAnimationFrame(function () {
      el.style.maxHeight = "120px";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
      el.style.marginBottom = "16px";
    });
  }

  function hideBlockSmooth(el) {
    if (!el) {
      return;
    }
    el.style.maxHeight = "0px";
    el.style.opacity = "0";
    el.style.transform = "translateY(-8px)";
    el.style.marginBottom = "0px";
  }

  function fadeContent() {
    form.style.transition = "opacity 0.2s ease, transform 0.2s ease";
    form.style.opacity = "0.65";
    form.style.transform = "translateY(4px)";
    setTimeout(function () {
      form.style.opacity = "1";
      form.style.transform = "translateY(0)";
    }, 180);
  }

  function switchMode(nextMode) {
    mode = nextMode;
    fadeContent();

    if (mode === "login") {
      document.title = "PINKHOUSE - Đăng nhập";
      if (heading) {
        heading.textContent = "Chào mừng trở lại";
      }
      if (intro) {
        intro.textContent = "Vui lòng nhập thông tin để đăng nhập vào tài khoản của bạn.";
      }
      if (emailLabel) {
        emailLabel.textContent = "Email hoặc tên đăng nhập";
      }
      if (passwordLabel) {
        passwordLabel.textContent = "Mật khẩu";
      }
      if (emailInput) {
        emailInput.placeholder = "Nhập email của bạn";
      }
      if (passwordInput) {
        passwordInput.placeholder = "••••••••";
      }
      if (submitButton) {
        submitButton.textContent = "Đăng nhập";
      }

      if (forgotLink) {
        forgotLink.style.display = "";
        forgotLink.textContent = "Quên mật khẩu?";
      }

      if (rememberWrap) {
        rememberWrap.style.display = "";
      }
      if (guestButton) {
        guestButton.style.display = "";
      }
      if (divider) {
        divider.parentElement.style.display = "";
      }
      if (socialGrid) {
        socialGrid.style.display = "";
      }
      if (registerText) {
        registerText.style.display = "";
        registerText.innerHTML = 'Bạn chưa có tài khoản? <a class="text-primary font-label-lg text-label-lg hover:underline ml-xs" href="#">Đăng ký ngay</a>';
        registerLink = registerText.querySelector("a");
        if (registerLink) {
          registerLink.addEventListener("click", function (event) {
            event.preventDefault();
            switchMode("register");
          });
        }
      }

      hideBlockSmooth(nameFieldWrap);
      hideBlockSmooth(confirmFieldWrap);

      setTabActive(loginTab, registerTab);
    }

    if (mode === "register") {
      document.title = "PINKHOUSE - Đăng ký";
      if (heading) {
        heading.textContent = "Tạo tài khoản mới";
      }
      if (intro) {
        intro.textContent = "Điền thông tin bên dưới để tạo tài khoản và bắt đầu sử dụng PINKHOUSE.";
      }
      if (emailLabel) {
        emailLabel.textContent = "Email";
      }
      if (passwordLabel) {
        passwordLabel.textContent = "Mật khẩu";
      }
      if (emailInput) {
        emailInput.placeholder = "Nhập email đăng ký";
      }
      if (passwordInput) {
        passwordInput.placeholder = "Tạo mật khẩu";
      }
      if (submitButton) {
        submitButton.textContent = "Tạo tài khoản";
      }

      if (forgotLink) {
        forgotLink.style.display = "none";
      }
      if (rememberWrap) {
        rememberWrap.style.display = "none";
      }
      if (guestButton) {
        guestButton.style.display = "none";
      }
      if (divider) {
        divider.parentElement.style.display = "none";
      }
      if (socialGrid) {
        socialGrid.style.display = "none";
      }
      if (registerText) {
        registerText.style.display = "";
        registerText.innerHTML = 'Bạn đã có tài khoản? <a class="text-primary font-label-lg text-label-lg hover:underline ml-xs" href="#">Đăng nhập ngay</a>';
        registerLink = registerText.querySelector("a");
        if (registerLink) {
          registerLink.addEventListener("click", function (event) {
            event.preventDefault();
            switchMode("login");
          });
        }
      }

      showBlockSmooth(nameFieldWrap);
      showBlockSmooth(confirmFieldWrap);

      setTabActive(registerTab, loginTab);
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var email = emailInput.value.trim();
    var password = passwordInput.value.trim();

    if (!email) {
      emailInput.focus();
      return;
    }

    if (!password) {
      passwordInput.focus();
      return;
    }

    if (mode === "register") {
      var fullName = registerNameInput ? registerNameInput.value.trim() : "";
      var confirmPassword = confirmPasswordInput ? confirmPasswordInput.value.trim() : "";

      if (!fullName) {
        if (registerNameInput) {
          registerNameInput.focus();
        }
        return;
      }

      if (!confirmPassword) {
        if (confirmPasswordInput) {
          confirmPasswordInput.focus();
        }
        return;
      }

      if (password !== confirmPassword) {
        alert("Mật khẩu nhập lại không khớp.");
        if (confirmPasswordInput) {
          confirmPasswordInput.focus();
        }
        return;
      }

      alert("Đăng ký thành công! Bây giờ bạn có thể đăng nhập.");
      switchMode("login");
      emailInput.value = email;
      passwordInput.value = "";
      if (registerNameInput) {
        registerNameInput.value = "";
      }
      if (confirmPasswordInput) {
        confirmPasswordInput.value = "";
      }
      passwordInput.focus();
      return;
    }

    doLogin({
      name: email.split("@")[0] || email,
      email: email,
      role: "member"
    });
  });

  if (guestButton) {
    guestButton.addEventListener("click", function () {
      doLogin({
        name: "Khách",
        email: "",
        role: "guest"
      });
    });
  }

  loginTab.addEventListener("click", function (event) {
    event.preventDefault();
    switchMode("login");
  });

  registerTab.addEventListener("click", function (event) {
    event.preventDefault();
    switchMode("register");
  });

  switchMode("login");
})();