Talice = {
  speakWin: () => {
    let utterance = new SpeechSynthesisUtterance("恭喜，你赢了！")
    utterance.rate = 1;
    utterance.pitch = 2;
    window.speechSynthesis.speak(utterance)
  },
  speakCap: (key) => {
    let str = key ? key : "";
    let utterance = new SpeechSynthesisUtterance("吃"+str);
    utterance.rate = 1;
    utterance.pitch = 2;
    window.speechSynthesis.speak(utterance)
  }
}