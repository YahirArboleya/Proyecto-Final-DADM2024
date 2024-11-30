import { Game, AUTO, Scale } from "phaser";
import { PlayScene } from "./PlayScene.js";
import { ScoreScene } from "./ScoreScene.js";


  export function launch() {
    return new Game({
      type: AUTO,
      scale: {
        mode: Scale.FIT, // O Scale.NONE si prefieres un tamaño fijo
        width: window.innerWidth,
        height: window.innerHeight,
        autoCenter: Scale.CENTER_BOTH,
      },
      parent: "game",
      backgroundColor: "#201726",
      physics: {
        default: "arcade",
      },
      scene: [PlayScene, ScoreScene],
    });
  }
  