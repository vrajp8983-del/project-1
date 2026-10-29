const loginForm = document.getElementById("loginForm");
const loginView = document.getElementById("loginView");
const dashboardView = document.getElementById("dashboardView");
const loginMessage = document.getElementById("loginMessage");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const cameraVideo = document.getElementById("cameraVideo");
const cameraPlaceholder = document.getElementById("cameraPlaceholder");
const cameraStatus = document.getElementById("cameraStatus");
const cameraMessage = document.getElementById("cameraMessage");
const startCameraBtn = document.getElementById("startCameraBtn");
const stopCameraBtn = document.getElementById("stopCameraBtn");
const markAttendanceBtn = document.getElementById("markAttendanceBtn");
const todayStatus = document.getElementById("todayStatus");
const attendanceCount = document.getElementById("attendanceCount");
const historyList = document.getElementById("historyList");
const scanCorners = document.getElementById("scanCorners");

let cameraStream = null;
let currentStudent = "";
const STORAGE_KEY = "attendai_demo_attendance";

togglePassword.addEventListener("click", () => {
  const show = passwordInput.type === "password";
  passwordInput.type = show ? "text" : "password";
  togglePassword.textContent = show ? "Hide" : "Show";
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const studentId = document.getElementById("studentId").value.trim();
  const password = passwordInput.value;
  // Demo-only credentials. Replace with a secure backend for real deployment.
  if ((studentId.toLowerCase() === "student" || studentId.toLowerCase() === "student@college.edu") && password === "123456") {
    currentStudent = "Student";
    document.getElementById("studentName").textContent = currentStudent;
    loginMessage.textContent = "";
    loginView.classList.add("hidden");
    dashboardView.classList.remove("hidden");
    refreshAttendance();
  } else {
    loginMessage.textContent = "Incorrect demo ID or password. Please try again.";
  }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await stopCamera();
  dashboardView.classList.add("hidden");
  loginView.classList.remove("hidden");
  loginForm.reset();
  loginMessage.textContent = "";
});

startCameraBtn.addEventListener("click", async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    cameraMessage.textContent = "Camera access is not supported here. Try a modern browser over HTTPS or localhost.";
    return;
  }
  try {
    cameraMessage.textContent = "Waiting for camera permission…";
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false
    });
    cameraVideo.srcObject = cameraStream;
    cameraVideo.classList.add("visible");
    cameraPlaceholder.classList.add("hidden");
    scanCorners.classList.remove("hidden");
    cameraStatus.textContent = "CAMERA ON";
    cameraStatus.classList.add("active");
    cameraMessage.textContent = "Camera is active. Demo mode does not identify or compare faces.";
    startCameraBtn.disabled = true;
    stopCameraBtn.disabled = false;
    markAttendanceBtn.disabled = false;
  } catch (error) {
    const messages = {
      NotAllowedError: "Camera permission was denied. Allow camera access in your browser settings and try again.",
      NotFoundError: "No camera was found on this device.",
      NotReadableError: "The camera may be in use by another app. Close it and try again."
    };
    cameraMessage.textContent = messages[error.name] || "Unable to open the camera. Check browser permissions and try again.";
  }
});

stopCameraBtn.addEventListener("click", stopCamera);

async function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
  cameraVideo.srcObject = null;
  cameraVideo.classList.remove("visible");
  cameraPlaceholder.classList.remove("hidden");
  scanCorners.classList.add("hidden");
  cameraStatus.textContent = "OFFLINE";
  cameraStatus.classList.remove("active");
  startCameraBtn.disabled = false;
  stopCameraBtn.disabled = true;
  markAttendanceBtn.disabled = true;
  cameraMessage.textContent = "Camera is off. Start it when you're ready.";
}

markAttendanceBtn.addEventListener("click", () => {
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  const records = getRecords();
  if (records.some(record => record.dateKey === dateKey)) {
    cameraMessage.textContent = "Attendance is already marked for today in this browser demo.";
    return;
  }
  records.unshift({
    dateKey,
    dateLabel: today.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }),
    timeLabel: today.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  cameraMessage.textContent = "Demo attendance marked on this device. No face recognition was performed.";
  refreshAttendance();
});

function getRecords() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function refreshAttendance() {
  const records = getRecords();
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  const markedToday = records.some(record => record.dateKey === dateKey);
  todayStatus.textContent = markedToday ? "Present ✓" : "Not marked";
  attendanceCount.textContent = `${records.length} ${records.length === 1 ? "day" : "days"}`;
  if (!records.length) {
    historyList.className = "history-empty";
    historyList.textContent = "Your attendance activity will appear here.";
    return;
  }
  historyList.className = "";
  historyList.replaceChildren();
  records.slice(0, 5).forEach(record => {
    const item = document.createElement("div");
    item.className = "history-item";
    const left = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = "Attendance marked";
    const date = document.createElement("small");
    date.textContent = `${record.dateLabel} · ${record.timeLabel}`;
    left.append(title, date);
    const status = document.createElement("span");
    status.className = "done";
    status.textContent = "PRESENT";
    item.append(left, status);
    historyList.append(item);
  });
}
