export default {
  isCallingBot(text: string) {
    if (!text) return;
    const normalizedText = text.toLowerCase();
    const panggilan = ['fubuki', 'buki', 'shirakami', 'fub'];
    return panggilan.some(
      (panggilan) =>
        normalizedText.startsWith(panggilan + ' ') ||
        normalizedText.startsWith('halo ' + panggilan) ||
        normalizedText.startsWith('hallo ' + panggilan) ||
        normalizedText.startsWith('hei ' + panggilan) ||
        normalizedText.startsWith('eh ' + panggilan) ||
        normalizedText.startsWith('hai ' + panggilan),
    );
  },
};
