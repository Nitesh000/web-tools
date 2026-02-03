/**
 * GIF Encoder Web Worker
 * Uses gif.js library for client-side GIF encoding
 */

import GIF from 'gif.js';

export interface GifEncoderMessage {
  type: 'encode';
  frames: ImageData[];
  width: number;
  height: number;
  quality: number;
  delay: number;
}

export interface GifEncoderProgress {
  type: 'progress';
  progress: number;
}

export interface GifEncoderComplete {
  type: 'complete';
  blob: Blob;
}

export interface GifEncoderError {
  type: 'error';
  message: string;
}

export type GifEncoderResult = GifEncoderProgress | GifEncoderComplete | GifEncoderError;

self.onmessage = (event: MessageEvent<GifEncoderMessage>) => {
  const { type, frames, width, height, quality, delay } = event.data;

  if (type !== 'encode') {
    self.postMessage({ type: 'error', message: 'Unknown message type' } as GifEncoderError);
    return;
  }

  if (!frames || frames.length === 0) {
    self.postMessage({ type: 'error', message: 'No frames provided' } as GifEncoderError);
    return;
  }

  try {
    // Quality ranges from 1 (best) to 20 (worst) in gif.js
    // We receive quality as 1-100, so we need to invert and scale
    const gifQuality = Math.max(1, Math.min(20, Math.round(21 - (quality / 100) * 20)));

    const gif = new GIF({
      workers: 2,
      quality: gifQuality,
      width,
      height,
      workerScript: '/gif.worker.js',
    });

    // Add frames
    frames.forEach((frameData) => {
      gif.addFrame(frameData, { delay });
    });

    gif.on('progress', (p: number) => {
      self.postMessage({ type: 'progress', progress: Math.round(p * 100) } as GifEncoderProgress);
    });

    gif.on('finished', (blob: Blob) => {
      self.postMessage({ type: 'complete', blob } as GifEncoderComplete);
    });

    gif.render();
  } catch (error) {
    self.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Unknown encoding error',
    } as GifEncoderError);
  }
};
