/**
 * Achievement photos shown in the coverflow carousel.
 *
 * Imported directly rather than fetched: the list is static, so a runtime
 * round-trip only delayed the images behind hydration.
 */
export const ACHIEVEMENT_IMAGES: readonly string[] = [
  "/achievements/me-presenting-houston-space-center.webp",
  "/achievements/me-presenting-johnston-space-center-nasa.webp",
  "/achievements/me-presenting-technology-association-of-iowa.webp",
  "/achievements/meeting-principal-ceo-dan-houston.webp",
];
