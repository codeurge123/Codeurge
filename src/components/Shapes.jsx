import { NB } from "../constants/theme.js";


export function Shapes() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Big yellow circle */}
      <div
        style={{
          position: "absolute",
          top: 200,
          right: 10,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: NB.yellow,
          border: `3px solid ${NB.black}`,
          boxShadow: `6px 6px 0 ${NB.black}`,
          animation: "wiggle 6s ease-in-out infinite",
        }}
      />
      {/* Pink star */}
      <div
        style={{
          position: "absolute",
          top: 260,
          right: "18%",
          fontSize: 40,
          animation: "wiggle 4s ease-in-out infinite 1s",
        }}
      >
        ✦
      </div>
      {/* Blue square */}
      <div
        style={{
          position: "absolute",
          top: 230,
          right: "30%",
          width: 32,
          height: 32,
          background: NB.blue,
          border: `2px solid ${NB.black}`,
          transform: "rotate(18deg)",
          boxShadow: `3px 3px 0 ${NB.black}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 130,
          right: "10%",
          width: 32,
          height: 32,
          background: NB.blue,
          border: `2px solid ${NB.black}`,
          transform: "rotate(18deg)",
          boxShadow: `3px 3px 0 ${NB.black}`,
        }}
      />
      {/* Red dot */}
      <div
        style={{
          position: "absolute",
          top: 240,
          right: "12%",
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: NB.red,
          border: `2px solid ${NB.black}`,
        }}
      />
      {/* Lightning */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: "24%",
          fontSize: 32,
          color: NB.yellow,
          textShadow: `2px 2px 0 ${NB.black}`,
          animation: "pop 3s ease-in-out infinite",
        }}
      >
        ⚡
      </div>
      {/* Keyboard emoji */}
      <div
        style={{
          position: "absolute",
          top: 310,
          right: "6%",
          fontSize: 72,
          filter: "drop-shadow(4px 4px 0 #0D0D0D)",
          animation: "wiggle 8s ease-in-out infinite 2s",
        }}
      >
        ⌨️
      </div>
    </div>
  );
}
