const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, "data");
const SETUP_FILE = path.join(DATA_DIR, "setup.json");

const DEFAULT_RATE = 4000;
const DEFAULT_MONTHLY_DAYS = 30;

const DEFAULT_DEVICES = [
  { id: "ac", name: "Điều hòa", hours: 4, quantity: 1 },
  { id: "fridge", name: "Tủ lạnh", hours: 24, quantity: 1 },
  { id: "fan", name: "Quạt điện", hours: 8, quantity: 1 },
  { id: "laptop", name: "Máy tính/Laptop", hours: 4, quantity: 1 },
  { id: "light", name: "Đèn", hours: 5, quantity: 3 },
  { id: "washer", name: "Máy giặt", hours: 0.25, quantity: 1 },
  { id: "dryer", name: "Máy sấy", hours: 0, quantity: 0 },
  { id: "stove", name: "Bếp điện", hours: 0, quantity: 0 },
  { id: "microwave", name: "Lò vi sóng", hours: 0, quantity: 0 }
];

const DEVICE_WATTS = {
  ac: 650,
  fridge: 50,
  fan: 40,
  laptop: 60,
  light: 9,
  washer: 300,
  dryer: 1200,
  stove: 1000,
  microwave: 700
};

const HOUSING_FACTOR = {
  "Phòng trọ": 1,
  "Chung cư": 1.05,
  "Căn hộ mini": 1.08,
  "Ký túc xá": 0.92,
  "Nhà nguyên căn": 1.15
};

const ROOM_SIZE_FACTOR = {
  "under-15": 0.95,
  "15-25": 1,
  "25-40": 1.03,
  "over-40": 1.06
};

const ROOM_HEAT_FACTOR = {
  cool: 0.95,
  normal: 1,
  hot: 1.05,
  very_hot: 1.1
};

const COOKING_FACTOR = {
  none: 0.82,
  sometimes: 1,
  daily: 1.18
};

function clampNumber(value, min, max, fallback) {
  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, parsed));
}

function roundOne(value) {
  return Math.round(value * 10) / 10;
}

function getCurrentMonthYear() {
  const now = new Date();

  return {
    month: now.getMonth() + 1,
    year: now.getFullYear()
  };
}

function shiftMonth(year, month, offset) {
  const date = new Date(year, month - 1 + offset, 1);

  return {
    month: date.getMonth() + 1,
    year: date.getFullYear()
  };
}

function createMonthKey(year, month) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function compareMonthAsc(a, b) {
  return a.year - b.year || a.month - b.month;
}

function compareMonthDesc(a, b) {
  return compareMonthAsc(b, a);
}

function isPastMonth(month, year) {
  const current = getCurrentMonthYear();
  return year < current.year || (year === current.year && month < current.month);
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

function getPeopleFactor(peopleCount) {
  const count = clampNumber(peopleCount, 1, 8, 1);
  return 1 + (count - 1) * 0.03;
}

function getBaselineKwh(setup) {
  const days = clampNumber(setup.monthlyDays, 1, 31, DEFAULT_MONTHLY_DAYS);
  const people = clampNumber(setup.peopleCount, 1, 8, 1);

  return Math.round((18 + (people - 1) * 5) * (days / DEFAULT_MONTHLY_DAYS));
}

function getBillStayFactor(value) {
  if (value === "one_week") {
    return 0.25;
  }

  if (value === "two_weeks") {
    return 0.5;
  }

  if (value === "three_weeks") {
    return 0.75;
  }

  return 1;
}

function getCalibratedKwh(setup) {
  const rate = clampNumber(setup.rate, 1000, 100000, DEFAULT_RATE);
  const days = clampNumber(setup.monthlyDays, 1, 31, DEFAULT_MONTHLY_DAYS);
  const stayFactor = getBillStayFactor(setup.billStayRatio);

  let billKwh = Number(setup.lastKwh || 0);

  if (!billKwh && setup.lastBillCost && rate > 0) {
    billKwh = Number(setup.lastBillCost || 0) / rate;
  }

  if (!billKwh || billKwh <= 0) {
    return 0;
  }

  return Math.round((billKwh / stayFactor) * (days / DEFAULT_MONTHLY_DAYS));
}

function getMinimumEstimatedKwh(setup) {
  const days = clampNumber(setup.monthlyDays, 1, 31, DEFAULT_MONTHLY_DAYS);
  const people = clampNumber(setup.peopleCount, 1, 8, 1);
  const devices = Array.isArray(setup.devices) ? setup.devices : [];

  const acDevice = devices.find((device) => device.id === "ac");
  const fridgeDevice = devices.find((device) => device.id === "fridge");

  const hasAc = acDevice && Number(acDevice.quantity || 0) > 0 && Number(acDevice.hours || 0) > 0;
  const hasFridge = fridgeDevice && Number(fridgeDevice.quantity || 0) > 0;

  let minimumKwh = 70;

  if (hasFridge) {
    minimumKwh += 25;
  }

  if (hasAc) {
    minimumKwh += 40;
  }

  minimumKwh += (people - 1) * 10;

  if (setup.presence === "Thường xuyên") {
    minimumKwh += 12;
  }

  if (setup.presence === "Ít khi") {
    minimumKwh -= 10;
  }

  return Math.max(70, Math.round(minimumKwh * (days / DEFAULT_MONTHLY_DAYS)));
}

function getDeviceUsageFactor(deviceId, setup) {
  const roomSizeFactor = ROOM_SIZE_FACTOR[setup.roomSize] || 1;
  const roomHeatFactor = ROOM_HEAT_FACTOR[setup.roomHeat] || 1;
  const cookingFactor = COOKING_FACTOR[setup.cookingFrequency] || 1;
  const peopleFactor = getPeopleFactor(setup.peopleCount);

  if (deviceId === "ac") {
    return roomSizeFactor * roomHeatFactor;
  }

  if (deviceId === "fan") {
    return roomHeatFactor;
  }

  if (deviceId === "light") {
    return roomSizeFactor;
  }

  if (deviceId === "washer") {
    return peopleFactor;
  }

  if (deviceId === "fridge") {
    return 1 + (peopleFactor - 1) * 0.5;
  }

  if (deviceId === "stove" || deviceId === "microwave") {
    return cookingFactor * peopleFactor;
  }

  return 1;
}

function createDefaultSetup() {
  const current = getCurrentMonthYear();

  return {
    month: current.month,
    year: current.year,
    housingType: "Phòng trọ",
    presence: "Đi làm ban ngày",
    peopleCount: 1,
    roomSize: "15-25",
    roomHeat: "normal",
    cookingFrequency: "sometimes",
    monthlyDays: DEFAULT_MONTHLY_DAYS,
    lastKwh: 0,
    lastBillCost: 0,
    billStayRatio: "full",
    rate: DEFAULT_RATE,
    devices: DEFAULT_DEVICES.map((device) => ({ ...device }))
  };
}

function createDefaultStore() {
  return {
    currentSetup: createDefaultSetup(),
    history: []
  };
}

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(SETUP_FILE)) {
    fs.writeFileSync(SETUP_FILE, JSON.stringify(createDefaultStore(), null, 2), "utf8");
  }
}

function getDefaultDevice(deviceId) {
  return DEFAULT_DEVICES.find((device) => device.id === deviceId) || null;
}

function normalizeSetup(input) {
  const defaults = createDefaultSetup();
  const current = getCurrentMonthYear();
  const safeInput = input || {};
  const sourceDevices = Array.isArray(safeInput.devices) ? safeInput.devices : defaults.devices;

  return {
    month: clampNumber(safeInput.month, 1, 12, current.month),
    year: clampNumber(safeInput.year, current.year - 10, current.year + 10, current.year),
    housingType: safeInput.housingType || defaults.housingType,
    presence: safeInput.presence || defaults.presence,
    peopleCount: clampNumber(safeInput.peopleCount, 1, 8, defaults.peopleCount),
    roomSize: safeInput.roomSize || defaults.roomSize,
    roomHeat: safeInput.roomHeat || defaults.roomHeat,
    cookingFrequency: safeInput.cookingFrequency || defaults.cookingFrequency,
    monthlyDays: clampNumber(safeInput.monthlyDays, 1, 31, defaults.monthlyDays),
    lastKwh: clampNumber(safeInput.lastKwh, 0, 10000, defaults.lastKwh),
    lastBillCost: clampNumber(safeInput.lastBillCost, 0, 10000000, defaults.lastBillCost),
    billStayRatio: safeInput.billStayRatio || defaults.billStayRatio,
    rate: clampNumber(safeInput.rate, 1000, 100000, defaults.rate),
    devices: DEFAULT_DEVICES.map((defaultDevice) => {
      const saved = sourceDevices.find((item) => String(item.id || "").trim() === defaultDevice.id) || {};

      return {
        id: defaultDevice.id,
        name: String(saved.name || defaultDevice.name).trim() || defaultDevice.name,
        hours: clampNumber(saved.hours, 0, 24, defaultDevice.hours),
        quantity: clampNumber(saved.quantity, 0, 20, defaultDevice.quantity)
      };
    })
  };
}

function upsertHistoryEntry(historyEntries, setup, savedAt, actualData) {
  const next = Array.isArray(historyEntries) ? historyEntries.slice() : [];
  const normalizedSetup = normalizeSetup(setup);
  const key = createMonthKey(normalizedSetup.year, normalizedSetup.month);
  const existingIndex = next.findIndex((entry) => entry.key === key);
  const existingEntry = existingIndex >= 0 ? next[existingIndex] : {};

  const record = {
    key,
    month: normalizedSetup.month,
    year: normalizedSetup.year,
    savedAt: savedAt || existingEntry.savedAt || new Date().toISOString(),
    setup: normalizedSetup,
    actualCost:
      actualData && actualData.actualCost != null
        ? clampNumber(actualData.actualCost, 0, 100000000, 0)
        : clampNumber(existingEntry.actualCost, 0, 100000000, 0),
    actualKwh:
      actualData && actualData.actualKwh != null
        ? clampNumber(actualData.actualKwh, 0, 100000, 0)
        : clampNumber(existingEntry.actualKwh, 0, 100000, 0),
    actualUpdatedAt:
      actualData && (actualData.actualCost || actualData.actualKwh)
        ? new Date().toISOString()
        : existingEntry.actualUpdatedAt || ""
  };

  if (existingIndex >= 0) {
    next[existingIndex] = record;
  } else {
    next.push(record);
  }

  return next.sort(compareMonthDesc);
}

function normalizeHistoryEntries(entries) {
  let history = [];

  (Array.isArray(entries) ? entries : []).forEach((entry) => {
    const sourceSetup = entry && entry.setup ? entry.setup : entry;

    if (!sourceSetup) {
      return;
    }

    const normalizedSetup = normalizeSetup({
      ...sourceSetup,
      month: entry.month != null ? entry.month : sourceSetup.month,
      year: entry.year != null ? entry.year : sourceSetup.year
    });

    history = upsertHistoryEntry(history, normalizedSetup, entry.savedAt, {
      actualCost: entry.actualCost,
      actualKwh: entry.actualKwh
    });
  });

  return history;
}

function normalizeStore(raw) {
  if (raw && raw.currentSetup) {
    const currentSetup = normalizeSetup(raw.currentSetup);
    const history = upsertHistoryEntry(normalizeHistoryEntries(raw.history), currentSetup, raw.currentSetup.savedAt);

    return {
      currentSetup,
      history
    };
  }

  const legacySetup = normalizeSetup(raw || {});

  return {
    currentSetup: legacySetup,
    history: upsertHistoryEntry([], legacySetup)
  };
}

function loadStore() {
  ensureDataFile();

  try {
    const raw = JSON.parse(fs.readFileSync(SETUP_FILE, "utf8"));
    const normalized = normalizeStore(raw);

    if (!raw || !raw.currentSetup || !Array.isArray(raw.history)) {
      saveStore(normalized);
    }

    return normalized;
  } catch (error) {
    const fallback = createDefaultStore();
    saveStore(fallback);
    return normalizeStore(fallback);
  }
}

function saveStore(store) {
  fs.writeFileSync(
    SETUP_FILE,
    JSON.stringify(
      {
        currentSetup: normalizeSetup(store.currentSetup || {}),
        history: normalizeHistoryEntries(store.history)
      },
      null,
      2
    ),
    "utf8"
  );
}

function calculateDashboard(setupInput) {
  const setup = normalizeSetup(setupInput);
  const housingFactor = HOUSING_FACTOR[setup.housingType] || 1;
  const monthlyDays = clampNumber(setup.monthlyDays, 1, 31, DEFAULT_MONTHLY_DAYS);

  const perDevice = setup.devices
    .map((device) => {
      const baseWatt = DEVICE_WATTS[device.id] || 100;
      const quantity = Math.max(0, Number(device.quantity != null ? device.quantity : 1) || 0);
      const usageFactor = getDeviceUsageFactor(device.id, setup);
      const monthlyKwh = ((baseWatt * device.hours * quantity * monthlyDays) / 1000) * housingFactor * usageFactor;
      const fallbackDevice = getDefaultDevice(device.id);

      return {
        ...device,
        name: device.name || (fallbackDevice ? fallbackDevice.name : "Thiết bị"),
        watt: baseWatt,
        quantity,
        usageFactor,
        monthlyKwh,
        monthlyCost: Math.round(monthlyKwh * setup.rate)
      };
    })
    .filter((device) => device.monthlyKwh > 0);

  const baselineKwh = getBaselineKwh(setup);

  if (baselineKwh > 0) {
    perDevice.push({
      id: "other",
      name: "Thiết bị nhỏ / điện nền",
      hours: 0,
      quantity: 1,
      watt: 0,
      usageFactor: 1,
      monthlyKwh: baselineKwh,
      monthlyCost: Math.round(baselineKwh * setup.rate)
    });
  }

  let totalKwh = perDevice.reduce((sum, device) => sum + device.monthlyKwh, 0);
  const calibratedKwh = getCalibratedKwh(setup);

  if (calibratedKwh > 0 && totalKwh > 0) {
    const scale = calibratedKwh / totalKwh;

    perDevice.forEach((device) => {
      device.monthlyKwh = device.monthlyKwh * scale;
      device.monthlyCost = Math.round(device.monthlyKwh * setup.rate);
    });

    totalKwh = calibratedKwh;
  }

  if (calibratedKwh <= 0 && totalKwh > 0) {
    const minimumKwh = getMinimumEstimatedKwh(setup);

    if (totalKwh < minimumKwh) {
      const scale = minimumKwh / totalKwh;

      perDevice.forEach((device) => {
        device.monthlyKwh = device.monthlyKwh * scale;
        device.monthlyCost = Math.round(device.monthlyKwh * setup.rate);
      });

      totalKwh = minimumKwh;
    }
  }

  const totalCost = Math.round(totalKwh * setup.rate);

  const breakdown = perDevice
    .map((device) => ({
      id: device.id,
      name: device.name,
      hours: device.hours,
      quantity: device.quantity,
      watt: device.watt,
      monthlyKwh: Math.round(device.monthlyKwh),
      monthlyCost: device.monthlyCost,
      percent: totalKwh > 0 ? Math.round((device.monthlyKwh / totalKwh) * 100) : 0
    }))
    .sort((a, b) => b.percent - a.percent);

  const tips = breakdown.slice(0, 3).map((device) => ({
    title: `Tối ưu ${device.name}`,
    description: `${device.name} đang chiếm khoảng ${device.percent}% lượng điện. PINKHOUSE sẽ ưu tiên thiết bị này trong kế hoạch tiết kiệm theo mục tiêu.`
  }));

  return {
    month: setup.month,
    year: setup.year,
    monthlyDays,
    totalKwh: Math.round(totalKwh),
    totalCost,
    deltaPercent: 0,
    breakdown,
    perDevice,
    tips
  };
}

function getSavingTemplate(device) {
  if (device.id === "ac") {
    return {
      title: "Giảm thời gian dùng điều hòa",
      category: "Thiết bị công suất lớn",
      difficulty: "Hiệu quả cao",
      priority: "Ưu tiên 1",
      maxRatio: 0.35,
      description: "Điều hòa thường là thiết bị làm hóa đơn tăng nhanh nhất. Nên giảm thời gian dùng, tăng nhiệt độ hợp lý và kết hợp quạt để vẫn mát nhưng ít tốn điện hơn.",
      productSuggestion: "Hẹn giờ tắt, dùng chế độ sleep, đặt 26-28°C, vệ sinh lọc gió định kỳ.",
      habit: "Giảm 1-2 giờ mỗi ngày hoặc chỉ bật khi phòng đã đóng kín."
    };
  }

  if (device.id === "dryer") {
    return {
      title: "Hạn chế dùng máy sấy",
      category: "Thiết bị công suất lớn",
      difficulty: "Hiệu quả cao",
      priority: "Ưu tiên 1",
      maxRatio: 0.6,
      description: "Máy sấy có công suất rất cao. Nếu dùng thường xuyên, đây là nhóm nên giảm trước để hóa đơn xuống rõ.",
      productSuggestion: "Ưu tiên phơi tự nhiên, chỉ sấy khi thật cần hoặc chọn máy sấy có chế độ cảm biến.",
      habit: "Gom đồ giặt, vắt kỹ trước khi sấy và không sấy từng mẻ nhỏ."
    };
  }

  if (device.id === "stove" || device.id === "microwave") {
    return {
      title: "Tối ưu thiết bị nấu ăn",
      category: "Nấu ăn",
      difficulty: "Dễ làm",
      priority: "Ưu tiên 2",
      maxRatio: 0.22,
      description: "Bếp điện, lò vi sóng hoặc thiết bị hâm nóng nếu dùng nhiều lần trong ngày sẽ tạo chi phí cộng dồn khá lớn.",
      productSuggestion: "Nấu một lần đủ dùng, rã đông trước khi hâm, tắt thiết bị ngay sau khi dùng.",
      habit: "Gom thời gian nấu và hạn chế bật thiết bị nhiều lần trong ngày."
    };
  }

  if (device.id === "fridge") {
    return {
      title: "Tối ưu tủ lạnh, không nên tắt",
      category: "Thiết bị chạy liên tục",
      difficulty: "Trung bình",
      priority: "Ưu tiên 2",
      maxRatio: 0.12,
      description: "Tủ lạnh chạy 24/24 nên không nên tắt để tiết kiệm. Thay vào đó hãy giảm hao phí bằng cách dùng đúng cách.",
      productSuggestion: "Không mở cửa quá lâu, không nhét quá đầy, chỉnh nhiệt độ vừa phải.",
      habit: "Kiểm tra gioăng cửa, đặt tủ nơi thoáng và tránh sát nguồn nhiệt."
    };
  }

  if (device.id === "washer") {
    return {
      title: "Giảm số lần giặt nhỏ lẻ",
      category: "Sinh hoạt",
      difficulty: "Dễ làm",
      priority: "Ưu tiên 3",
      maxRatio: 0.2,
      description: "Máy giặt không phải lúc nào cũng chiếm nhiều nhất, nhưng giặt nhiều lần với lượng đồ ít sẽ gây lãng phí điện và nước.",
      productSuggestion: "Chọn chế độ tiết kiệm, giặt đủ tải và hạn chế giặt quá nhiều lần trong tuần.",
      habit: "Gom đồ giặt theo mẻ vừa đủ thay vì giặt lắt nhắt."
    };
  }

  if (device.id === "fan") {
    return {
      title: "Điều chỉnh thời gian dùng quạt",
      category: "Làm mát",
      difficulty: "Dễ làm",
      priority: "Ưu tiên 3",
      maxRatio: 0.22,
      description: "Quạt có công suất thấp hơn điều hòa nhưng nếu dùng nhiều giờ mỗi ngày thì vẫn tạo chi phí cộng dồn.",
      productSuggestion: "Dùng hẹn giờ ban đêm, vệ sinh cánh quạt và ưu tiên quạt DC inverter nếu cần thay mới.",
      habit: "Tắt khi ra ngoài và giảm các khung giờ không cần thiết."
    };
  }

  if (device.id === "light") {
    return {
      title: "Tối ưu hệ thống đèn",
      category: "Chiếu sáng",
      difficulty: "Rất dễ",
      priority: "Ưu tiên 4",
      maxRatio: 0.35,
      description: "Đèn không quá tốn riêng lẻ, nhưng nhiều bóng bật trong nhiều giờ mỗi ngày vẫn làm hóa đơn tăng.",
      productSuggestion: "Dùng bóng LED 7-9W, tắt đèn khi ra khỏi phòng và tận dụng ánh sáng tự nhiên.",
      habit: "Tạo thói quen tắt đèn ở khu vực không sử dụng."
    };
  }

  if (device.id === "laptop") {
    return {
      title: "Tối ưu máy tính/laptop",
      category: "Thiết bị học tập/làm việc",
      difficulty: "Dễ làm",
      priority: "Ưu tiên 4",
      maxRatio: 0.15,
      description: "Laptop hoặc máy tính dùng nhiều giờ mỗi ngày có thể tiết kiệm thêm bằng cách giảm thời gian sạc và tắt khi không dùng.",
      productSuggestion: "Bật chế độ tiết kiệm pin, giảm độ sáng màn hình, rút sạc khi đầy.",
      habit: "Không để máy sleep cả đêm khi không cần thiết."
    };
  }

  return {
    title: `Tối ưu ${device.name}`,
    category: "Thiết bị phụ",
    difficulty: "Dễ làm",
    priority: "Ưu tiên thêm",
    maxRatio: 0.1,
    description: `${device.name} có thể giảm thêm bằng cách tắt nguồn, rút điện hoặc giảm thời gian sử dụng không cần thiết.`,
    productSuggestion: "Ưu tiên thiết bị có nhãn tiết kiệm năng lượng khi thay mới.",
    habit: "Kiểm tra thiết bị đang bật trước khi ra ngoài hoặc trước khi ngủ."
  };
}

function createSavingAction(device, setup, rate, index) {
  const monthlyKwh = Number(device.monthlyKwh || 0);
  const monthlyCost = Number(device.monthlyCost || monthlyKwh * rate);
  const hours = Number(device.hours || 0);
  const quantity = Number(device.quantity || 0);

  if (monthlyKwh <= 0 || monthlyCost <= 0) {
    return null;
  }

  const template = getSavingTemplate(device);
  let savingKwh = monthlyKwh * template.maxRatio;

  if (device.id === "ac" && hours > 0) {
    const suggestedHours = Math.max(3, Math.round(hours * 0.75 * 10) / 10);
    const savedHours = Math.max(0, hours - suggestedHours);
    const byHour = monthlyKwh * (savedHours / Math.max(hours, 1));
    savingKwh = Math.max(byHour, monthlyKwh * 0.18);
  }

  if (device.id === "light" && quantity <= 1) {
    savingKwh = monthlyKwh * 0.18;
  }

  if (device.id === "fridge") {
    savingKwh = monthlyKwh * 0.1;
  }

  const estimatedSaving = Math.max(0, Math.round(savingKwh * rate));
  const estimatedKwhSaving = Math.max(0, Math.round(savingKwh));

  return {
    deviceId: device.id,
    deviceName: device.name,
    type: device.id === "ac" || device.id === "dryer" ? "usage" : "habit",
    title: template.title,
    category: template.category,
    difficulty: template.difficulty,
    priority: template.priority || `Ưu tiên ${index + 1}`,
    description: `${template.description} Thiết bị đang xét: ${device.name}, dùng khoảng ${hours} giờ/ngày, số lượng ${quantity}.`,
    productSuggestion: template.productSuggestion,
    habit: template.habit,
    estimatedSaving,
    estimatedKwhSaving,
    reduceKwh: estimatedKwhSaving
  };
}

function createGeneralSavingAction(needSave, rate, index) {
  const templates = [
    {
      title: "Tắt thiết bị chạy nền",
      category: "Thiết bị phụ",
      difficulty: "Rất dễ",
      priority: "Ưu tiên thêm",
      ratio: 0.16,
      description: "Một số thiết bị vẫn tiêu thụ điện khi cắm liên tục dù không dùng trực tiếp.",
      productSuggestion: "Ổ cắm, sạc, laptop, TV, thiết bị standby.",
      habit: "Trước khi ngủ hoặc ra ngoài, kiểm tra lại ổ cắm và thiết bị đang bật."
    },
    {
      title: "Chia lịch dùng thiết bị công suất lớn",
      category: "Thói quen sử dụng",
      difficulty: "Trung bình",
      priority: "Bổ sung",
      ratio: 0.14,
      description: "Không nên bật nhiều thiết bị công suất lớn cùng lúc vì dễ làm hóa đơn tăng nhanh.",
      productSuggestion: "Máy lạnh, bếp điện, máy sấy, lò vi sóng.",
      habit: "Gom việc cần dùng điện nhưng tránh bật đồng thời quá nhiều thiết bị."
    },
    {
      title: "Theo dõi điện trong 7 ngày",
      category: "Theo dõi",
      difficulty: "Dễ làm",
      priority: "Bổ sung",
      ratio: 0.1,
      description: "Theo dõi ngắn hạn giúp biết thiết bị nào làm tiền điện tăng bất thường.",
      productSuggestion: "Ghi lại số điện đầu tuần và cuối tuần hoặc dùng ổ cắm đo điện.",
      habit: "Kiểm tra số điện mỗi tuần để điều chỉnh trước khi hết tháng."
    }
  ];

  const item = templates[index % templates.length];
  const saving = Math.max(10000, Math.round(needSave * item.ratio));

  return {
    deviceId: `general-${index}`,
    deviceName: "Thói quen tổng hợp",
    type: "habit",
    title: item.title,
    category: item.category,
    difficulty: item.difficulty,
    priority: item.priority,
    description: item.description,
    productSuggestion: item.productSuggestion,
    habit: item.habit,
    estimatedSaving: saving,
    estimatedKwhSaving: rate > 0 ? Math.round(saving / rate) : 0,
    reduceKwh: rate > 0 ? Math.round(saving / rate) : 0
  };
}

function buildSmartSavingPlan(setupInput, dashboard, targetCostInput) {
  const setup = normalizeSetup(setupInput);
  const currentCost = Math.max(0, Number(dashboard.totalCost || 0));
  const currentKwh = Math.max(0, Number(dashboard.totalKwh || 0));
  const rate = Math.max(1, Number(setup.rate || DEFAULT_RATE));
  const pricePerKwh = rate;

  const defaultTarget = Math.round(currentCost * 0.85);
  let targetCost = Number(String(targetCostInput == null ? "" : targetCostInput).replace(/[^\d.-]/g, ""));

  if (!targetCost || targetCost <= 0) {
    targetCost = defaultTarget;
  }

  if (targetCost > currentCost) {
    targetCost = currentCost;
  }

  targetCost = Math.round(targetCost);

  const needSave = Math.max(0, currentCost - targetCost);
  const needKwh = rate > 0 ? needSave / rate : 0;

  let actions = (dashboard.perDevice || [])
    .map((device, index) => createSavingAction(device, setup, rate, index))
    .filter(Boolean)
    .sort((a, b) => b.estimatedSaving - a.estimatedSaving);

  let selectedActions = [];
  let plannedSaving = 0;

  actions.forEach((action) => {
    if (selectedActions.length < 6 && (plannedSaving < needSave || selectedActions.length < 3)) {
      selectedActions.push(action);
      plannedSaving += Number(action.estimatedSaving || 0);
    }
  });

  let generalIndex = 0;

  while (selectedActions.length < 4 && needSave > 0) {
    const extra = createGeneralSavingAction(needSave, rate, generalIndex);
    selectedActions.push(extra);
    plannedSaving += Number(extra.estimatedSaving || 0);
    generalIndex += 1;
  }

  selectedActions = selectedActions.slice(0, 6);
  plannedSaving = selectedActions.reduce((sum, action) => sum + Number(action.estimatedSaving || 0), 0);

  if (needSave > 0 && plannedSaving > needSave * 1.15) {
    let remainingNeed = needSave;

    selectedActions = selectedActions.map((action, index) => {
      if (remainingNeed <= 0) {
        return {
          ...action,
          estimatedSaving: 0,
          estimatedKwhSaving: 0,
          reduceKwh: 0
        };
      }

      const originalSaving = Number(action.estimatedSaving || 0);
      let adjustedSaving = originalSaving;

      if (index === selectedActions.length - 1 || originalSaving > remainingNeed) {
        adjustedSaving = Math.max(0, Math.round(remainingNeed));
      }

      remainingNeed -= adjustedSaving;

      return {
        ...action,
        estimatedSaving: adjustedSaving,
        estimatedKwhSaving: rate > 0 ? Math.round(adjustedSaving / rate) : 0,
        reduceKwh: rate > 0 ? Math.round(adjustedSaving / rate) : 0
      };
    }).filter((action) => Number(action.estimatedSaving || 0) > 0 || needSave <= 0);

    plannedSaving = selectedActions.reduce((sum, action) => sum + Number(action.estimatedSaving || 0), 0);
  }

  if (needSave <= 0) {
    selectedActions = [
      {
        deviceId: "goal-done",
        deviceName: "Tổng quan",
        type: "habit",
        title: "Bạn đã đạt mục tiêu chi phí",
        category: "Tổng quan",
        difficulty: "Không cần giảm",
        priority: "Ổn định",
        description: "Mức tiền mục tiêu đang cao hơn hoặc bằng hóa đơn dự kiến hiện tại nên chưa cần giảm thêm thiết bị.",
        productSuggestion: "Tiếp tục duy trì thói quen sử dụng hiện tại.",
        habit: "Theo dõi hóa đơn cuối tháng để kiểm tra mức tiêu thụ thực tế.",
        estimatedSaving: 0,
        estimatedKwhSaving: 0,
        reduceKwh: 0
      }
    ];
    plannedSaving = 0;
  }

  const expectedCost = Math.max(0, currentCost - plannedSaving);
  const progress = needSave > 0 ? Math.min(100, Math.round((plannedSaving / needSave) * 100)) : 100;
  const score = needSave <= 0 ? 100 : Math.max(0, Math.min(100, Math.round((targetCost / Math.max(currentCost, 1)) * 100)));

  let level = "Dễ áp dụng";

  if (needSave <= 0) {
    level = "Đã đạt mục tiêu";
  } else if (needSave > currentCost * 0.3) {
    level = "Cần giảm mạnh";
  } else if (needSave > currentCost * 0.18) {
    level = "Tối ưu nghiêm túc";
  }

  let status = "Cần tối ưu thêm";

  if (needSave <= 0) {
    status = "Đã đạt mục tiêu";
  } else if (progress >= 95) {
    status = "Kế hoạch gần đạt mục tiêu";
  } else if (progress >= 60) {
    status = "Có thể giảm đáng kể";
  } else {
    status = "Cần thêm dữ liệu hoặc giảm mạnh hơn";
  }

  return {
    dataReady: currentCost > 0,
    currentCost: Math.round(currentCost),
    currentKwh: Math.round(currentKwh),
    totalKwh: Math.round(currentKwh),
    pricePerKwh: Math.round(pricePerKwh),
    targetCost: Math.round(targetCost),
    needSave: Math.round(needSave),
    needKwh: Math.round(needKwh),
    plannedSaving: Math.round(plannedSaving),
    estimatedSaving: Math.round(plannedSaving),
    expectedCost: Math.round(expectedCost),
    progress,
    score,
    level,
    status,
    actions: selectedActions
  };
}

function createHistoryView(entry, previousEntry) {
  const dashboard = calculateDashboard(entry.setup);
  const previousDashboard = previousEntry ? calculateDashboard(previousEntry.setup) : null;
  const actualCost = clampNumber(entry.actualCost, 0, 100000000, 0);
  const actualKwh = clampNumber(entry.actualKwh, 0, 100000, 0);
  const hasActual = actualCost > 0 || actualKwh > 0;
  const status = hasActual ? "Đã có hóa đơn" : "Chờ hóa đơn";

  return {
    key: entry.key,
    month: entry.month,
    year: entry.year,
    label: `Tháng ${entry.month} ${entry.year}`,
    shortLabel: `T${entry.month}`,
    savedAt: entry.savedAt,
    actualUpdatedAt: entry.actualUpdatedAt || "",
    totalCost: dashboard.totalCost,
    totalKwh: dashboard.totalKwh,
    deltaPercent: calculateDeltaPercent(dashboard.totalCost, previousDashboard ? previousDashboard.totalCost : 0),
    estimatedSavings: calculateEstimatedSavings(dashboard.totalCost),
    status,
    actualCost,
    actualKwh,
    breakdown: dashboard.breakdown,
    tips: dashboard.tips
  };
}

function buildHistoryResponse(store) {
  const currentSetup = normalizeSetup(store.currentSetup || {});
  const historyDesc = upsertHistoryEntry(normalizeHistoryEntries(store.history), currentSetup);
  const historyAsc = historyDesc.slice().sort(compareMonthAsc);
  const currentKey = createMonthKey(currentSetup.year, currentSetup.month);
  const currentIndex = Math.max(
    0,
    historyAsc.findIndex((entry) => entry.key === currentKey)
  );
  const currentEntry = historyAsc[currentIndex] || historyAsc[historyAsc.length - 1] || null;
  const previousEntry = currentIndex > 0 ? historyAsc[currentIndex - 1] : null;
  const currentView = currentEntry ? createHistoryView(currentEntry, previousEntry) : null;
  const byKey = new Map(historyDesc.map((entry) => [entry.key, entry]));

  const trend = [];

  for (let offset = 5; offset >= 0; offset -= 1) {
    const slot = shiftMonth(currentSetup.year, currentSetup.month, -offset);
    const key = createMonthKey(slot.year, slot.month);
    const entry = byKey.get(key);

    if (!entry) {
      trend.push({
        key,
        month: slot.month,
        year: slot.year,
        label: `Tháng ${slot.month} ${slot.year}`,
        shortLabel: `T${slot.month}`,
        totalCost: 0,
        totalKwh: 0,
        actualCost: 0,
        actualKwh: 0,
        deltaPercent: 0,
        estimatedSavings: 0,
        status: "Chưa có dữ liệu",
        isEmpty: true
      });
      continue;
    }

    const entryIndex = historyAsc.findIndex((item) => item.key === key);
    const previousForSlot = entryIndex > 0 ? historyAsc[entryIndex - 1] : null;
    trend.push(createHistoryView(entry, previousForSlot));
  }

  const maxTrendCost = Math.max(
    1,
    ...trend.map((item) => Math.max(item.totalCost || 0, item.actualCost || 0))
  );

  const trendWithHeights = trend.map((item) => ({
    ...item,
    forecastHeight: item.totalCost > 0 ? Math.max(10, Math.round((item.totalCost / maxTrendCost) * 100)) : 0,
    actualHeight: item.actualCost > 0 ? Math.max(10, Math.round((item.actualCost / maxTrendCost) * 100)) : 0
  }));

  const recent = historyDesc.slice(0, 6).map((entry) => {
    const entryIndex = historyAsc.findIndex((item) => item.key === entry.key);
    const previousForEntry = entryIndex > 0 ? historyAsc[entryIndex - 1] : null;
    return createHistoryView(entry, previousForEntry);
  });

  return {
    current: currentView,
    trend: trendWithHeights,
    recent
  };
}

function buildDashboardResponse(store) {
  const currentSetup = normalizeSetup(store.currentSetup || {});
  const dashboard = calculateDashboard(currentSetup);
  const history = buildHistoryResponse({
    ...store,
    currentSetup
  });

  return {
    ...dashboard,
    deltaPercent: history.current ? history.current.deltaPercent : 0
  };
}

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", "0");
  res.header("Surrogate-Control", "no-store");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.static(ROOT_DIR));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "pinkhouse-backend"
  });
});

app.get("/api/setup", (_req, res) => {
  res.json(loadStore().currentSetup);
});

app.post("/api/setup", (req, res) => {
  const normalizedSetup = normalizeSetup(req.body || {});
  const currentStore = loadStore();

  const nextStore = {
    currentSetup: normalizedSetup,
    history: upsertHistoryEntry(normalizeHistoryEntries(currentStore.history), normalizedSetup)
  };

  saveStore(nextStore);

  res.json({
    ok: true,
    setup: normalizedSetup,
    dashboard: buildDashboardResponse(nextStore),
    history: buildHistoryResponse(nextStore)
  });
});

app.get("/api/dashboard", (_req, res) => {
  res.json(buildDashboardResponse(loadStore()));
});

app.get("/api/savings-plan", (req, res) => {
  const store = loadStore();
  const setup = normalizeSetup(store.currentSetup || {});
  const dashboard = calculateDashboard(setup);
  const targetCost = req.query.targetCost;

  res.json(buildSmartSavingPlan(setup, dashboard, targetCost));
});

app.get("/api/history", (_req, res) => {
  res.json(buildHistoryResponse(loadStore()));
});

app.post("/api/actual-bill", (req, res) => {
  const month = clampNumber(req.body.month, 1, 12, 0);
  const year = clampNumber(req.body.year, 2000, 2100, 0);
  const actualCost = clampNumber(req.body.actualCost, 0, 100000000, 0);
  const actualKwh = clampNumber(req.body.actualKwh, 0, 100000, 0);

  if (!month || !year) {
    return res.status(400).json({
      ok: false,
      message: "Thiếu tháng hoặc năm cần cập nhật."
    });
  }

  if (!actualCost && !actualKwh) {
    return res.status(400).json({
      ok: false,
      message: "Nhập ít nhất tiền điện thực tế hoặc số kWh thực tế."
    });
  }

  const store = loadStore();
  const history = normalizeHistoryEntries(store.history);
  const key = createMonthKey(year, month);
  let targetEntry = history.find((entry) => entry.key === key);

  if (!targetEntry) {
    const baseSetup = normalizeSetup(store.currentSetup || {});
    targetEntry = {
      key,
      month,
      year,
      savedAt: new Date().toISOString(),
      setup: normalizeSetup({
        ...baseSetup,
        month,
        year
      })
    };
  }

  const nextHistory = upsertHistoryEntry(history, targetEntry.setup, targetEntry.savedAt, {
    actualCost,
    actualKwh
  });

  const nextStore = {
    currentSetup: normalizeSetup(store.currentSetup || {}),
    history: nextHistory
  };

  saveStore(nextStore);

  res.json({
    ok: true,
    message: "Đã lưu hóa đơn thực tế.",
    history: buildHistoryResponse(nextStore)
  });
});

app.get("/api/debug-current-setup", (_req, res) => {
  const store = loadStore();
  const setup = normalizeSetup(store.currentSetup || {});
  const dashboard = calculateDashboard(setup);

  res.json({
    setup,
    dashboard,
    savingsPlan: buildSmartSavingPlan(setup, dashboard, req.query.targetCost)
  });
});

app.get("/api/clear-bill-calibration", (_req, res) => {
  const store = loadStore();
  const setup = Object.assign({}, store.currentSetup || createDefaultSetup());

  setup.lastKwh = 0;
  setup.lastBillCost = 0;
  setup.billStayRatio = "full";

  store.currentSetup = setup;
  saveStore(store);

  const normalizedSetup = normalizeSetup(setup);

  res.json({
    ok: true,
    message: "Đã xóa dữ liệu bill gần nhất. App sẽ dự đoán lại theo thiết bị.",
    setup: normalizedSetup,
    dashboard: calculateDashboard(normalizedSetup)
  });
});

app.get("/api/reset-all-data", (_req, res) => {
  if (fs.existsSync(SETUP_FILE)) {
    fs.unlinkSync(SETUP_FILE);
  }

  const freshStore = createDefaultStore();
  saveStore(freshStore);

  res.json({
    ok: true,
    message: "Đã reset toàn bộ dữ liệu server về mặc định.",
    setup: freshStore.currentSetup,
    dashboard: calculateDashboard(freshStore.currentSetup)
  });
});

app.get("/", (_req, res) => {
  res.redirect(encodeURI("/dang nhap/code.html"));
});

app.listen(PORT, () => {
  console.log(`Pinkhouse backend is running at http://localhost:${PORT}`);
});