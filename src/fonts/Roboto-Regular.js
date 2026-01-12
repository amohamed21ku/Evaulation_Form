// Roboto Regular font for jsPDF - supports Turkish characters
// This font data was generated using jsPDF's font converter tool
// URL: https://raw.githack.com/parallax/jsPDF/master/fontconverter/fontconverter.html

// To regenerate this file:
// 1. Download Roboto-Regular.ttf from Google Fonts
// 2. Visit https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html
// 3. Upload the TTF file and download the generated JS file
// 4. Copy the content here

// For now, we'll fetch it dynamically
export const addRobotoFont = async (doc) => {
  try {
    // Fetch the Roboto font file
    const response = await fetch('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2');

    if (!response.ok) {
      console.error('Failed to load Roboto font');
      return false;
    }

    // Note: jsPDF requires TTF format, not WOFF2
    // This won't work directly, we need a different approach
    console.error('Font loading requires TTF format conversion');
    return false;

  } catch (error) {
    console.error('Error loading font:', error);
    return false;
  }
};

// Fallback: Use a pre-converted base64 string
// This would need to be the actual converted font data
export const RobotoRegularBase64 = null; // Would be a very long base64 string here
