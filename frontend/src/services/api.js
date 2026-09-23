import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const client = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("signify_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors so callers always get a readable message string.
function unwrap(promise) {
  return promise
    .then((res) => res.data)
    .catch((err) => {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Something went wrong. Please try again.";
      const wrapped = new Error(message);
      wrapped.status = err.response?.status;
      throw wrapped;
    });
}

// ---- Auth ----
export function register({ name, email, password }) {
  return unwrap(client.post("/auth/register", { name, email, password }));
}

export function login({ email, password }) {
  return unwrap(client.post("/auth/login", { email, password }));
}

export function getCurrentUser() {
  return unwrap(client.get("/auth/me"));
}

export function logout() {
  return unwrap(client.post("/auth/logout", {}));
}

// ---- Prediction ----
export function predictSign(landmarks, { save = false } = {}) {
  return unwrap(client.post("/predict", { landmarks, save }));
}

export function getModelStatus() {
  return unwrap(client.get("/model-status"));
}

// ---- History ----
export function getHistory(params = {}) {
  return unwrap(client.get("/history", { params }));
}

export function addHistory({ prediction, confidence }) {
  return unwrap(client.post("/history", { prediction, confidence }));
}

export function deleteHistoryItem(id) {
  return unwrap(client.delete(`/history/${id}`));
}

export function clearHistory() {
  return unwrap(client.delete("/history"));
}

// ---- Dataset collection ----
export function collectSample({ label, landmarks }) {
  return unwrap(client.post("/dataset/collect", { label, landmarks }));
}

export function getDatasetStats() {
  return unwrap(client.get("/dataset/stats"));
}

// ---- Admin ----
export function getAdminOverview() {
  return unwrap(client.get("/admin/overview"));
}

export function getAdminUsers() {
  return unwrap(client.get("/admin/users"));
}

export function getAdminModelInfo() {
  return unwrap(client.get("/admin/model"));
}

// ---- Health ----
export function checkHealth() {
  return unwrap(client.get("/health"));
}

export default client;
