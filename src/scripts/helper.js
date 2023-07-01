export function toggleFullscreen() {
  if (!document.fullscreenElement) {
    // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  } else {
    if (document.fullscreenEnabled) {
      document.exitFullscreen();
    }
  }
}
