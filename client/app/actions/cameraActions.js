import types from './types';

export function toggleCaptureMode () {
  return {
    type: types.ToggleCaptureMode
  };
}

export function toggleCaptureSide () {
  return {
    type: types.ToggleCaptureSide
  };
}

export function toggleFlashMode () {
  return {
    type: types.ToggleFlashMode
  };
}