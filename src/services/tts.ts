/**
 * Text-to-Speech service using the browser's native Web Speech API.
 * This works offline and requires no API key.
 */
export async function speakPose(text: string): Promise<void> {
  console.log(`[TTS Service] Speaking: "${text}"`);
  
  return new Promise((resolve) => {
    // Cancel any ongoing speech to prevent queue buildup
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE'; // Set language to German
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Attempt to select a German voice, preferring Google voices on Android if available
    const voices = window.speechSynthesis.getVoices();
    const germanVoice = voices.find(voice => voice.lang.startsWith('de') && voice.name.includes('Google'))
                     || voices.find(voice => voice.lang.startsWith('de'));

    if (germanVoice) {
      utterance.voice = germanVoice;
    }

    let resolved = false;
    const safeResolve = () => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    };

    utterance.onend = () => {
      safeResolve();
    };

    utterance.onerror = (event) => {
      console.error('TTS Error:', event);
      safeResolve(); // Resolve anyway to avoid blocking the game flow
    };

    // Fallback timeout in case onend never fires
    setTimeout(() => {
      if (!resolved) {
        console.warn('TTS timed out, resolving promise.');
        safeResolve();
      }
    }, 5000);

    window.speechSynthesis.speak(utterance);
  });
}
