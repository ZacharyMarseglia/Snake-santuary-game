import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import Phaser from "phaser";
import { GameScene } from "./GameScene.js";

const PhaserGame = forwardRef(function PhaserGame({ save, onEvent }, ref) {
  const hostRef = useRef(null);
  const gameRef = useRef(null);
  const sceneRef = useRef(null);
  const eventRef = useRef(onEvent);
  eventRef.current = onEvent;

  useImperativeHandle(ref, () => ({
    useAbility: () => sceneRef.current?.useAbility(),
    setPaused: (paused) => sceneRef.current?.setPaused(paused),
    returnToSanctuary: () => sceneRef.current?.returnToSanctuary()
  }));

  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: hostRef.current,
      backgroundColor: "#8fbe78",
      scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
      physics: { default: "arcade", arcade: { debug: false } },
      scene: GameScene,
      render: { antialias: true, roundPixels: false }
    });
    gameRef.current = game;
    game.scene.start("world", {
      save,
      eventsOut: (event) => {
        if (event.type === "ready") sceneRef.current = game.scene.getScene("world");
        eventRef.current(event);
      }
    });
    return () => {
      sceneRef.current = null;
      game.destroy(true);
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.applySave(save);
  }, [save]);

  return <div className="phaser-host" ref={hostRef} />;
});

export default PhaserGame;
