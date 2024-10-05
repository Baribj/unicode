export function getLocalStorageThemeMode() {
  return localStorage.getItem("mode") || "";
}

export function setLocalStorageThemeMode(mode: string) {
  return localStorage.setItem("mode", mode);
}
