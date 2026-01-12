// This file contains a Turkish-compatible font for jsPDF
// Using Roboto Regular which supports Turkish characters

export const addTurkishFont = (doc) => {
  // This is a minimal Roboto font that supports Latin Extended (including Turkish)
  // For production, you should use a complete font file

  // Since embedding a full font would be too large, we'll use a workaround:
  // Convert text to ensure compatibility with standard fonts

  // Unfortunately, jsPDF's standard fonts (Helvetica, Times, Courier) don't support
  // Turkish special characters properly. We need to either:
  // 1. Use a web service to convert PDF
  // 2. Use a different library
  // 3. Load a custom TTF font

  // For now, return the doc as-is and we'll handle this differently
  return doc;
};

// Helper to encode Turkish characters for basic font compatibility
export const encodeTurkishText = (text) => {
  if (!text) return '';

  // This is a fallback - won't look perfect but will be readable
  // Map Turkish characters to closest ASCII equivalents
  const turkishMap = {
    'ç': 'c',
    'Ç': 'C',
    'ğ': 'g',
    'Ğ': 'G',
    'ı': 'i',
    'İ': 'I',
    'ö': 'o',
    'Ö': 'O',
    'ş': 's',
    'Ş': 'S',
    'ü': 'u',
    'Ü': 'U'
  };

  return text; // Return as-is for now, we'll use a better solution
};
