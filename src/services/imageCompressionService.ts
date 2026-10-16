import { CompressedImage } from '../types';

export interface CompressionResult {
  success: boolean;
  image?: CompressedImage;
  error?: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  savedPercentage: number;
}

/**
 * Calculates byte size of a Base64 string / Data URL.
 */
export function getBase64SizeBytes(dataUrl: string): number {
  if (!dataUrl) return 0;
  const base64Data = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
  const padding = (base64Data.match(/=+$/) || [''])[0].length;
  return Math.floor((base64Data.length * 3) / 4) - padding;
}

/**
 * Formats bytes into readable text (Ko / Mo / B) in Malagasy / Metric.
 */
export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} Ko`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} Mo`;
}

/**
 * Checks whether browser supports WebP canvas export.
 */
function supportsWebP(): boolean {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch {
    return false;
  }
}

/**
 * Automatically resizes and compresses an image file using Canvas.
 * - Max dimensions: 800 x 800 px (preserving aspect ratio, no upscaling)
 * - Target size: < 150 Ko
 * - Quality steps: starts at 0.8, steps down gradually if needed
 * - Strict loop limit to prevent freezing
 */
export async function compressImageFile(file: File): Promise<CompressionResult> {
  const originalSizeBytes = file.size;

  // Validate mime type
  if (!file.type.startsWith('image/')) {
    return {
      success: false,
      error: 'Tsy sary azo ekena ity rakitra ity. Safidio sary JPG, PNG na WebP.',
      originalSizeBytes,
      compressedSizeBytes: originalSizeBytes,
      savedPercentage: 0,
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => {
      resolve({
        success: false,
        error: 'Tsy afaka novakiana ilay sary.',
        originalSizeBytes,
        compressedSizeBytes: originalSizeBytes,
        savedPercentage: 0,
      });
    };

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => {
        resolve({
          success: false,
          error: 'Tsy afaka nampidirina ilay sary.',
          originalSizeBytes,
          compressedSizeBytes: originalSizeBytes,
          savedPercentage: 0,
        });
      };

      img.onload = () => {
        try {
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          const TARGET_MAX_BYTES = 150 * 1024; // 150 Ko

          let { width, height } = img;

          // Only scale down, never scale up
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({
              success: false,
              error: 'Tsy afaka namboarina ny canvas ho an\'ny compression.',
              originalSizeBytes,
              compressedSizeBytes: originalSizeBytes,
              savedPercentage: 0,
            });
            return;
          }

          // Draw white background in case of transparent PNG converted to JPEG
          const preferredMime = supportsWebP() ? 'image/webp' : 'image/jpeg';
          if (preferredMime === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Iterative compression stepping
          let quality = 0.82;
          let dataUrl = canvas.toDataURL(preferredMime, quality);
          let currentBytes = getBase64SizeBytes(dataUrl);

          const maxSteps = 5;
          let step = 0;

          while (currentBytes > TARGET_MAX_BYTES && quality > 0.35 && step < maxSteps) {
            quality -= 0.12;
            dataUrl = canvas.toDataURL(preferredMime, quality);
            currentBytes = getBase64SizeBytes(dataUrl);
            step++;
          }

          // Absolute hard cap per single image: 350 Ko (to ensure multiple images fit in a document)
          const ABSOLUTE_IMAGE_LIMIT = 350 * 1024;
          if (currentBytes > ABSOLUTE_IMAGE_LIMIT) {
            resolve({
              success: false,
              error: `Lehibe loatra ilay sary (${formatBytes(currentBytes)}). Tsy afaka nahena latsaky ny 350 Ko. Mba safidio sary kely kokoa azafady.`,
              originalSizeBytes,
              compressedSizeBytes: currentBytes,
              savedPercentage: 0,
            });
            return;
          }

          const savedPercentage = Math.max(
            0,
            Math.round(((originalSizeBytes - currentBytes) / originalSizeBytes) * 100)
          );

          resolve({
            success: true,
            originalSizeBytes,
            compressedSizeBytes: currentBytes,
            savedPercentage,
            image: {
              dataUrl,
              mimeType: preferredMime,
              width,
              height,
              sizeBytes: currentBytes,
              originalSizeBytes,
            },
          });
        } catch (err) {
          resolve({
            success: false,
            error: err instanceof Error ? err.message : 'Nisy olana nandritra ny compression.',
            originalSizeBytes,
            compressedSizeBytes: originalSizeBytes,
            savedPercentage: 0,
          });
        }
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Estimates total Firestore document payload size in bytes.
 * Firestore limit is 1,048,576 bytes (1 MiB).
 * We enforce a strict safety threshold of 700 KiB (716,800 bytes).
 */
export function estimateDocumentSizeBytes(data: Record<string, unknown>): number {
  try {
    const jsonStr = JSON.stringify(data);
    // UTF-8 byte length calculation
    return new TextEncoder().encode(jsonStr).length;
  } catch {
    return 0;
  }
}

export const FIRESTORE_DOC_MAX_SAFE_BYTES = 700 * 1024; // 700 KiB

export function isDocumentWithinSafeLimit(data: Record<string, unknown>): {
  safe: boolean;
  sizeBytes: number;
  formattedSize: string;
  limitBytes: number;
} {
  const sizeBytes = estimateDocumentSizeBytes(data);
  return {
    safe: sizeBytes <= FIRESTORE_DOC_MAX_SAFE_BYTES,
    sizeBytes,
    formattedSize: formatBytes(sizeBytes),
    limitBytes: FIRESTORE_DOC_MAX_SAFE_BYTES,
  };
}
