(function () {
  var BACKEND_URL = "http://localhost:3000/api/history";
  var LOCAL_DRAFT_KEY = "pinkhouseSetupDraft";
  var LOCAL_HISTORY_KEY = "pinkhouseSetupHistory";
  var DEFAULT_RATE = 4000;
  var DEFAULT_MONTHLY_DAYS = 30;
  var VERIFIED_STATUS = "\u0110\u00e3 x\u00e1c minh";
  var PENDING_STATUS = "Ch\u1edd h\u00f3a \u0111\u01a1n";
  var EMPTY_STATUS = "Ch\u01b0a c\u00f3 d\u1eef li\u1ec7u";
  var DEFAULT_DEVICES = [
    { id: "ac", name: "\u0110i\u1ec1u h\u00f2a", hours: 8, quantity: 1 },
    { id: "fridge", name: "T\u1ee7 l\u1ea1nh", hours: 24, quantity: 1 },
    { id: "fan", name: "Qu\u1ea1t \u0111i\u1ec7n", hours: 12, quantity: 1 },
    { id: "laptop", name: "M\u00e1y t\u00ednh/Laptop", hours: 4, quantity: 1 },
    { id: "light", name: "\u0110\u00e8n", hours: 6, quantity: 4 },
    { id: "washer", name: "M\u00e1y gi\u1eb7t", hours: 1, quantity: 1 },
    { id: "dryer", name: "M\u00e1y s\u1ea5y", hours: 1, quantity: 0 },
    { id: "stove", name: "B\u1ebfp \u0111i\u1ec7n", hours: 2, quantity: 1 },
    { id: "microwave", name: "L\u00f2 vi s\u00f3ng", hours: 1, quantity: 1 }
  ];
  var DEVICE_WATTS = {
    ac: 1100,
    fridge: 150,
    fan: 70,
    laptop: 65,
    light: 15,
    washer: 500,
    dryer: 1800,
    stove: 2000,
    microwave: 1200
  };
  var HOUSING_FACTOR = {
    "Ph\u00f2ng tr\u1ecd": 1,
    "Chung c\u01b0": 1.05,
    "C\u0103n h\u1ed9 mini": 1.08,
    "K\u00fd t\u00fac x\u00e1": 0.92,
    "Nh\u00e0 nguy\u00ean c\u0103n": 1.15
  };

  function byId(id) {
    return document.getElementById(id);
  }

  if (!byId("historyTrendChart") || !byId("historyRecentList")) {
    return;
  }

  function clampNumber(value, min, max, fallback) {
    var parsed = Number(value);
    if (Number.isNaN(parsed)) {
      return fallback;
    }
    return Math.max(min, Math.min(max, parsed));
  }

  function roundOne(value) {
    return Math.round(value * 10) / 10;
  }

  function getCurrentMonthYear() {
    var now = new Date();
    return {
      month: now.getMonth() + 1,
      year: now.getFullYear()
    };
  }

  function shiftMonth(year, month, offset) {
    var date = new Date(year, month - 1 + offset, 1);
    return {
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };
  }

  function createMonthKey(year, month) {
    return year + "-" + String(month).padStart(2, "0");
  }

  function compareMonthAsc(a, b) {
    return a.year - b.year || a.month - b.month;
  }

  function compareMonthDesc(a, b) {
    return compareMonthAsc(b, a);
  }

  function calculateDeltaPercent(currentValue, previousValue) {
    if (!previousValue) {
      return 0;
    }
    return roundOne(((currentValue - previousValue) / previousValue) * 100);
  }

  function calculateEstimatedSavings(totalCost) {
    return Math.round(totalCost * 0.08);
  }

  function formatVnd(value) {
    return new Intl.NumberFormat("vi-VN").format(Math.round(Number(value) || 0)) + "\u0111";
  }

  function formatDelta(value, fallbackText) {
    if (fallbackText) {
      return fallbackText;
    }

    var numeric = Number(value || 0);
    var sign = numeric > 0 ? "+" : "";
    var output = Number.isInteger(numeric) ? String(numeric) : numeric.toFixed(1);
    return sign + output + "%";
  }

  function getDefaultSetup() {
    var current = getCurrentMonthYear();
    return {
      month: current.month,
      year: current.year,
      housingType: "Ph\u00f2ng tr\u1ecd",
      presence: "\u0110i l\u00e0m ban ng\u00e0y",
      rate: DEFAULT_RATE,
      devices: DEFAULT_DEVICES.map(function (device) {
        return Object.assign({}, device);
      })
    };
  }

  function normalizeSetup(input) {
    var defaults = getDefaultSetup();
    var current = getCurrentMonthYear();
    var sourceDevices = Array.isArray(input && input.devices) ? input.devices : defaults.devices;

    return {
      month: clampNumber(input && input.month, 1, 12, current.month),
      year: clampNumber(input && input.year, current.year - 10, current.year + 10, current.year),
      housingType: (input && input.housingType) || defaults.housingType,
      presence: (input && input.presence) || defaults.presence,
      rate: clampNumber(input && input.rate, 1000, 100000, DEFAULT_RATE),
      devices: DEFAULT_DEVICES.map(function (defaultDevice) {
        var saved = sourceDevices.find(function (item) {
          return String((item && item.id) || "").trim() === defaultDevice.id;
        }) || {};

        return {
          id: defaultDevice.id,
          name: String(saved.name || defaultDevice.name).trim() || defaultDevice.name,
          hours: clampNumber(saved.hours, 0, 24, defaultDevice.hours),
          quantity: clampNumber(saved.quantity, 0, 20, defaultDevice.quantity)
        };
      })
    };
  }

  function calculateDashboard(setup) {
    var housingFactor = HOUSING_FACTOR[setup.housingType] || 1;
    var perDevice = setup.devices
      .map(function (device) {
        var baseWatt = DEVICE_WATTS[device.id] || 100;
        var quantity = Math.max(0, Number(device.quantity != null ? device.quantity : 1) || 0);
        var monthlyKwh = ((baseWatt * device.hours * quantity * DEFAULT_MONTHLY_DAYS) / 1000) * housingFactor;
        return {
          name: device.name,
          monthlyKwh: monthlyKwh
        };
      })
      .filter(function (device) {
        return device.monthlyKwh > 0;
      });

    var totalKwh = perDevice.reduce(function (sum, device) {
      return sum + device.monthlyKwh;
    }, 0);

    return {
      totalKwh: Math.round(totalKwh),
      totalCost: Math.round(totalKwh * setup.rate)
    };
  }

  function isPastMonth(month, year) {
    var current = getCurrentMonthYear();
    return year < current.year || (year === current.year && month < current.month);
  }

  function createEntryView(entry, previousEntry) {
    var dashboard = calculateDashboard(entry.setup);
    var previousDashboard = previousEntry ? calculateDashboard(previousEntry.setup) : null;
    var status = isPastMonth(entry.month, entry.year) ? VERIFIED_STATUS : PENDING_STATUS;

    return {
      key: entry.key,
      month: entry.month,
      year: entry.year,
      label: "Th\u00e1ng " + entry.month + " " + entry.year,
      shortLabel: "T" + entry.month,
      savedAt: entry.savedAt,
      totalCost: dashboard.totalCost,
      totalKwh: dashboard.totalKwh,
      deltaPercent: calculateDeltaPercent(dashboard.totalCost, previousDashboard ? previousDashboard.totalCost : 0),
      estimatedSavings: calculateEstimatedSavings(dashboard.totalCost),
      status: status,
      actualCost: status === VERIFIED_STATUS ? dashboard.totalCost : 0,
      actualKwh: status === VERIFIED_STATUS ? dashboard.totalKwh : 0
    };
  }

  function getLocalSetupHistory() {
    var draft = null;
    var history = [];

    try {
      draft = JSON.parse(localStorage.getItem(LOCAL_DRAFT_KEY) || "null");
    } catch (error) {
      draft = null;
    }

    try {
      history = JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) || "[]");
    } catch (error) {
      history = [];
    }

    var entries = [];

    history.forEach(function (item) {
      var setup = normalizeSetup(item || {});
      entries.push({
        key: createMonthKey(setup.year, setup.month),
        month: setup.month,
        year: setup.year,
        savedAt: item.savedAt || new Date().toISOString(),
        setup: setup
      });
    });

    if (draft) {
      var normalizedDraft = normalizeSetup(draft);
      var draftKey = createMonthKey(normalizedDraft.year, normalizedDraft.month);
      entries = entries.filter(function (entry) {
        return entry.key !== draftKey;
      });
      entries.unshift({
        key: draftKey,
        month: normalizedDraft.month,
        year: normalizedDraft.year,
        savedAt: new Date().toISOString(),
        setup: normalizedDraft
      });
    }

    var unique = new Map();
    entries.forEach(function (entry) {
      unique.set(entry.key, entry);
    });

    return Array.from(unique.values()).sort(compareMonthDesc);
  }

  function buildLocalHistoryPayload() {
    var entriesDesc = getLocalSetupHistory();
    var currentSetup = entriesDesc.length ? entriesDesc[0].setup : getDefaultSetup();
    var currentKey = createMonthKey(currentSetup.year, currentSetup.month);
    var entriesAsc = entriesDesc.slice().sort(compareMonthAsc);
    var currentIndex = Math.max(
      0,
      entriesAsc.findIndex(function (entry) {
        return entry.key === currentKey;
      })
    );
    var currentEntry = entriesAsc[currentIndex] || entriesAsc[entriesAsc.length - 1] || {
      key: currentKey,
      month: currentSetup.month,
      year: currentSetup.year,
      savedAt: new Date().toISOString(),
      setup: currentSetup
    };
    var previousEntry = currentIndex > 0 ? entriesAsc[currentIndex - 1] : null;
    var currentView = createEntryView(currentEntry, previousEntry);
    var byKey = new Map(entriesDesc.map(function (entry) {
      return [entry.key, entry];
    }));
    var trend = [];
    var offset;

    for (offset = 5; offset >= 0; offset -= 1) {
      var slot = shiftMonth(currentSetup.year, currentSetup.month, -offset);
      var slotKey = createMonthKey(slot.year, slot.month);
      var slotEntry = byKey.get(slotKey);

      if (!slotEntry) {
        trend.push({
          key: slotKey,
          month: slot.month,
          year: slot.year,
          label: "Th\u00e1ng " + slot.month + " " + slot.year,
          shortLabel: "T" + slot.month,
          totalCost: 0,
          totalKwh: 0,
          actualCost: 0,
          actualKwh: 0,
          deltaPercent: 0,
          estimatedSavings: 0,
          status: EMPTY_STATUS,
          isEmpty: true
        });
        continue;
      }

      var slotIndex = entriesAsc.findIndex(function (entry) {
        return entry.key === slotKey;
      });
      var previousForSlot = slotIndex > 0 ? entriesAsc[slotIndex - 1] : null;
      trend.push(createEntryView(slotEntry, previousForSlot));
    }

    var maxTrendCost = Math.max.apply(
      null,
      [1].concat(
        trend.map(function (item) {
          return Math.max(item.totalCost || 0, item.actualCost || 0);
        })
      )
    );

    var trendWithHeights = trend.map(function (item) {
      return Object.assign({}, item, {
        forecastHeight: item.totalCost > 0 ? Math.max(10, Math.round((item.totalCost / maxTrendCost) * 100)) : 0,
        actualHeight: item.actualCost > 0 ? Math.max(10, Math.round((item.actualCost / maxTrendCost) * 100)) : 0
      });
    });

    var recent = entriesDesc.slice(0, 6).map(function (entry) {
      var entryIndex = entriesAsc.findIndex(function (item) {
        return item.key === entry.key;
      });
      var previousForEntry = entryIndex > 0 ? entriesAsc[entryIndex - 1] : null;
      return createEntryView(entry, previousForEntry);
    });

    return {
      current: currentView,
      trend: trendWithHeights,
      recent: recent
    };
  }

  function renderSummary(current) {
    var costNode = byId("historyCurrentCost");
    var savingsNode = byId("historySavingsValue");
    var deltaRow = byId("historyCurrentDeltaRow");
    var deltaValue = byId("historyCurrentDeltaValue");

    if (!current) {
      if (costNode) {
        costNode.textContent = "0\u0111";
      }
      if (savingsNode) {
        savingsNode.textContent = "0\u0111";
      }
      if (deltaRow) {
        deltaRow.innerHTML = '<span class="text-on-surface-variant font-bold">' + EMPTY_STATUS + "</span>";
      }
      return;
    }

    if (costNode) {
      costNode.textContent = formatVnd(current.totalCost);
    }
    if (savingsNode) {
      savingsNode.textContent = formatVnd(current.estimatedSavings);
    }

    if (deltaValue) {
      deltaValue.textContent = formatDelta(current.deltaPercent);
      deltaValue.className = current.deltaPercent <= 0 ? "text-tertiary font-bold" : "text-secondary font-bold";
    }

    if (deltaRow) {
      deltaRow.className = "font-body-sm text-body-sm flex items-center gap-xs " + (current.deltaPercent <= 0 ? "text-secondary" : "text-on-surface-variant");
      deltaRow.innerHTML = '<span class="' + (current.deltaPercent <= 0 ? "text-tertiary" : "text-secondary") + ' font-bold" id="historyCurrentDeltaValue">' + formatDelta(current.deltaPercent) + "</span> so v\u1edbi th\u00e1ng tr\u01b0\u1edbc";
    }
  }

  function renderTrend(trend) {
    var chartNode = byId("historyTrendChart");
    if (!chartNode) {
      return;
    }

    chartNode.innerHTML = [
      '<div class="absolute w-full top-0 border-t border-surface-container-high h-px"></div>',
      '<div class="absolute w-full top-1/2 border-t border-surface-container-high h-px"></div>'
    ]
      .concat(
        (trend || []).map(function (item) {
          var actualStyle = item.actualHeight > 0
            ? "height: " + item.actualHeight + "%;"
            : "height: 4%; opacity: 0.25;";
          var forecastStyle = item.forecastHeight > 0
            ? "height: " + item.forecastHeight + "%;"
            : "height: 4%; opacity: 0.2;";

          return [
            '<div class="flex-1 flex flex-col justify-end group cursor-default min-w-0" title="' + item.label + ": " + formatVnd(item.totalCost) + '">',
            '<div class="w-full bg-surface-variant rounded-t-sm transition-opacity" style="' + actualStyle + '"></div>',
            '<div class="w-full bg-primary rounded-t-sm -mt-4 opacity-90 transition-opacity z-10 shadow-sm shadow-primary/10" style="' + forecastStyle + '"></div>',
            '<span class="text-center font-label-sm text-label-sm text-on-surface-variant mt-xs">' + item.shortLabel + "</span>",
            "</div>"
          ].join("");
        })
      )
      .join("");
  }

  function renderRecent(recent) {
    var listNode = byId("historyRecentList");
    if (!listNode) {
      return;
    }

    if (!recent || !recent.length) {
      listNode.innerHTML = [
        '<div class="lg:col-span-3 bg-surface border border-outline-variant rounded-xl p-md text-on-surface-variant">',
        '<div class="font-label-lg text-label-lg text-on-surface mb-xs">' + EMPTY_STATUS + " theo th\u00e1ng</div>",
        "<p>H\u00e3y v\u00e0o m\u00e0n nh\u1eadp li\u1ec7u, ch\u1ecdn th\u00e1ng v\u00e0 n\u0103m r\u1ed3i l\u01b0u d\u1ef1 \u0111o\u00e1n \u0111\u1ec3 b\u1ea3ng l\u1ecbch s\u1eed b\u1eaft \u0111\u1ea7u th\u1ed1ng k\u00ea.</p>",
        "</div>"
      ].join("");
      return;
    }

    listNode.innerHTML = recent.map(function (item) {
      var statusClass = item.status === VERIFIED_STATUS
        ? "bg-secondary-container text-on-secondary-container"
        : "bg-surface-container-high text-on-surface-variant";
      var statusIcon = item.status === VERIFIED_STATUS ? "check_circle" : "pending";
      var deltaText = Math.abs(Number(item.deltaPercent)) < 0.05 ? "--" : formatDelta(item.deltaPercent);
      var deltaClass = deltaText === "--" ? "text-on-surface-variant" : (Number(item.deltaPercent) <= 0 ? "text-tertiary" : "text-secondary");

      return [
        '<div class="bg-surface border border-outline-variant rounded-xl p-md hover:shadow-[0_4px_12px_0_rgba(183,0,94,0.05)] transition-shadow duration-300">',
        '<div class="flex justify-between items-start mb-md">',
        "<div>",
        '<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-xs">' + item.label + "</span>",
        '<div class="font-headline-sm text-headline-sm text-on-surface">' + formatVnd(item.totalCost) + "</div>",
        "</div>",
        '<div class="' + statusClass + ' font-label-sm text-label-sm px-sm py-xs rounded-full flex items-center gap-xs"><span class="material-symbols-outlined text-[14px]">' + statusIcon + "</span> " + item.status + "</div>",
        "</div>",
        '<div class="grid grid-cols-2 gap-sm border-t border-surface-variant pt-sm">',
        "<div>",
        '<span class="font-label-sm text-label-sm text-on-surface-variant block">\u0110i\u1ec7n n\u0103ng s\u1eed d\u1ee5ng</span>',
        '<span class="font-body-sm text-body-sm text-on-surface">' + item.totalKwh + " kWh</span>",
        "</div>",
        "<div>",
        '<span class="font-label-sm text-label-sm text-on-surface-variant block">Ch\u00eanh l\u1ec7ch</span>',
        '<span class="font-body-sm text-body-sm ' + deltaClass + '">' + deltaText + "</span>",
        "</div>",
        "</div>",
        "</div>"
      ].join("");
    }).join("");
  }

  function bindActions() {
    document.querySelectorAll("main section button, aside button").forEach(function (button) {
      if (button.dataset.historyBound === "true") {
        return;
      }
      var iconNode = button.querySelector(".material-symbols-outlined");
      var iconName = iconNode ? (iconNode.textContent || "").trim() : "";
      var textContent = button.textContent || "";
      if (!/D\u1ef1 \u0111o\u00e1n/i.test(textContent) && iconName !== "add" && iconName !== "add_circle") {
        return;
      }

      button.dataset.historyBound = "true";
      button.addEventListener("click", function () {
        window.location.href = window.PinkhouseAuth
          ? window.PinkhouseAuth.routes.setup
          : encodeURI("/trang nh\u1eadp th\u00f4ng tin/code.html");
      });
    });
  }

  function renderAll(data) {
    renderSummary(data && data.current);
    renderTrend((data && data.trend) || []);
    renderRecent((data && data.recent) || []);
    bindActions();
  }

  function loadHistory() {
    return fetch(BACKEND_URL)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("History request failed: " + response.status);
        }
        return response.json();
      })
      .catch(function () {
        return buildLocalHistoryPayload();
      });
  }

  function boot() {
    loadHistory().then(renderAll);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
