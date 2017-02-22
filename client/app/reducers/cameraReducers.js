const constants = {
  still: 'Camera.constants.CaptureMode.still',
  video: 'Camera.constants.CaptureMode.video',
  front: 'Camera.constants.Type.front',
  back: 'Camera.constants.Type.back',
  flashOn: 'Camera.constants.FlashMode.on',
  flashOff: 'Camera.constants.FlashMode.off',
  flashAuto: 'Camera.constants.FlashMode.auto'
};

export default function reducer ( state = {
  captureMode: constants.video,
  captureSide: constants.front,
  flashMode: constants.flashOff
}, action) {
  switch (action.type) {
  case 'TOGGLE_CAPTURE_MODE': {
    if (state.captureMode === constants.video) {
      return {
        ...state,
        captureMode: constants.still
      }
    } else {
      return {
        ...state,
        captureMode: constants.video
      }
    }
  }
  case 'TOGGLE_CAPTURE_SIDE': {
    if (state.captureSide === constants.front) {
      return {
        ...state,
        captureSide: constants.back
      }
    } else {
      return {
        ...state,
        captureSide: constants.front
      }
    }
  }
  case 'TOGGLE_FLASH_MODE': {
    if (state.flashMode === constants.flashOff) {
      return {
        ...state,
        flashMode: constants.flashOn
      }
    } else if (state.flashMode === constants.flashOn) {
      return {
        ...state,
        flashMode: constants.flashAuto
      }
    } else {
      return {
        ...state,
        flashMode: constants.flashOff
      }
    }
  }
  default:
    return state;
  }
}
