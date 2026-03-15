"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";

type Cell = [number, number];
type MessageType = "DEBUG" | "ERROR" | "INFO" | "WARN";

type Message = {
  id: number;
  text: string;
  type: MessageType;
};

type PlannerTheme = {
  pageBg: string;
  text: string;
  panelBg: string;
  border: string;
  grid: string;
  obstacle: string;
  start: string;
  end: string;
  path: string;
  conflict: string;
  background: string;
  buttonBg: string;
  buttonText: string;
  buttonActiveBg: string;
  obstacleActiveBg: string;
  messageInfo: string;
  messageSuccess: string;
  messageDebug: string;
  messageWarn: string;
  messageError: string;
};

const THEME_COLORS: { dark: PlannerTheme; light: PlannerTheme } = {
  dark: {
    pageBg: "#0f172a",
    text: "#e2e8f0",
    panelBg: "#1e293b",
    border: "#334155",
    grid: "#64748b",
    obstacle: "#f97316",
    start: "#4ade80",
    end: "#f87171",
    path: "#60a5fa",
    conflict: "#f59e0b",
    background: "#020617",
    buttonBg: "#1e293b",
    buttonText: "#e2e8f0",
    buttonActiveBg: "#334155",
    obstacleActiveBg: "#fed7aa",
    messageInfo: "#94a3b8",
    messageSuccess: "#60a5fa",
    messageDebug: "#38bdf8",
    messageWarn: "#fb923c",
    messageError: "#fda4af",
  },
  light: {
    pageBg: "#e2e8f0",
    text: "#0f172a",
    panelBg: "#f8fafc",
    border: "#cbd5e1",
    grid: "#1f2937",
    obstacle: "#ea580c",
    start: "#16a34a",
    end: "#dc2626",
    path: "#2563eb",
    conflict: "#9ca3af",
    background: "#ffffff",
    buttonBg: "#ffffff",
    buttonText: "#0f172a",
    buttonActiveBg: "#e2e8f0",
    obstacleActiveBg: "#fdba74",
    messageInfo: "#64748b",
    messageSuccess: "#2563eb",
    messageDebug: "#2563eb",
    messageWarn: "#ea580c",
    messageError: "#dc2626",
  },
};

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function sameCell(a: Cell | null, b: Cell | null): boolean {
  if (!a || !b) return false;
  return a[0] === b[0] && a[1] === b[1];
}

function isInsideGrid(cell: Cell, cols: number, rows: number): boolean {
  return cell[0] >= 0 && cell[0] < cols && cell[1] >= 0 && cell[1] < rows;
}

function heuristic(a: Cell, b: Cell): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

function doAStar(
  grid: number[][],
  start: Cell,
  end: Cell,
  displayMessage: (message: string, type?: MessageType) => void,
): Cell[] {
  if (!grid || grid.length === 0 || grid[0]?.length === 0) {
    displayMessage("Invalid grid", "ERROR");
    return [];
  }

  const cols = grid.length;
  const rows = grid[0].length;
  const [sx, sy] = start;
  const [ex, ey] = end;

  if (sx < 0 || sx >= cols || sy < 0 || sy >= rows) {
    displayMessage("Start is outside the grid", "ERROR");
    return [];
  }
  if (ex < 0 || ex >= cols || ey < 0 || ey >= rows) {
    displayMessage("End is outside the grid", "ERROR");
    return [];
  }
  if (grid[sx][sy] === 0) {
    displayMessage("Start is on an obstacle", "ERROR");
    return [];
  }
  if (grid[ex][ey] === 0) {
    displayMessage("End is on an obstacle", "ERROR");
    return [];
  }
  if (sx === ex && sy === ey) {
    return [start];
  }

  const openList: Cell[] = [start];
  const closedSet = new Set<string>();
  const parent = new Map<string, Cell>();
  const gCost = new Map<string, number>([[cellKey(start), 0]]);
  const fCost = new Map<string, number>([[cellKey(start), heuristic(start, end)]]);

  displayMessage("Starting A* search", "DEBUG");

  while (openList.length > 0) {
    let current = openList[0];
    let bestF = fCost.get(cellKey(current)) ?? Number.POSITIVE_INFINITY;

    for (const node of openList.slice(1)) {
      const fn = fCost.get(cellKey(node)) ?? Number.POSITIVE_INFINITY;
      if (fn < bestF) {
        bestF = fn;
        current = node;
      }
    }

    if (current[0] === end[0] && current[1] === end[1]) {
      displayMessage("Goal reached", "DEBUG");
      const path: Cell[] = [current];
      let walkerKey = cellKey(current);
      while (parent.has(walkerKey)) {
        const prev = parent.get(walkerKey)!;
        path.push(prev);
        walkerKey = cellKey(prev);
      }
      path.reverse();
      return path;
    }

    const currentIndex = openList.findIndex((c) => c[0] === current[0] && c[1] === current[1]);
    if (currentIndex >= 0) openList.splice(currentIndex, 1);
    closedSet.add(cellKey(current));

    const [cx, cy] = current;
    const neighbours: Cell[] = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1],
    ];

    for (const [nx, ny] of neighbours) {
      if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
      if (grid[nx][ny] === 0) continue;

      const neighbour: Cell = [nx, ny];
      const neighbourKey = cellKey(neighbour);
      if (closedSet.has(neighbourKey)) continue;

      const tentativeG = (gCost.get(cellKey(current)) ?? Number.POSITIVE_INFINITY) + 1;
      const oldG = gCost.get(neighbourKey);

      if (oldG === undefined || tentativeG < oldG) {
        parent.set(neighbourKey, current);
        gCost.set(neighbourKey, tentativeG);
        fCost.set(neighbourKey, tentativeG + heuristic(neighbour, end));

        if (!openList.some((c) => c[0] === nx && c[1] === ny)) {
          openList.push(neighbour);
        }
      }
    }
  }

  displayMessage("No path found", "WARN");
  return [];
}

export default function PathPlannerApp(): JSX.Element {
  const { resolvedTheme } = useTheme();
  const [gridWidth, setGridWidth] = useState<number>(20);
  const [gridHeight, setGridHeight] = useState<number>(10);
  const [activeMode, setActiveMode] = useState<"obstacle" | "start" | "end" | null>(null);
  const [obstacles, setObstacles] = useState<Cell[]>([]);
  const [start, setStart] = useState<Cell | null>(null);
  const [end, setEnd] = useState<Cell | null>(null);
  const [path, setPath] = useState<Cell[]>([]);
  const [indicator, setIndicator] = useState<"grey" | "green" | "red">("grey");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const timerRef = useRef<number | null>(null);
  const nextMessageId = useRef(1);
  const isDarkMode =
    resolvedTheme === "dark" ||
    (resolvedTheme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const theme = useMemo(() => THEME_COLORS[isDarkMode ? "dark" : "light"], [isDarkMode]);

  const obstacleSet = useMemo(() => new Set(obstacles.map(cellKey)), [obstacles]);

  const displayMessage = useCallback((message: string, type: MessageType = "DEBUG") => {
    setMessages((prev) => [
      { id: nextMessageId.current++, text: `[${type}] ${message}`, type },
      ...prev,
    ]);
  }, []);

  const stopAnimation = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => stopAnimation(), [stopAnimation]);

  const resetPlanner = useCallback(() => {
    stopAnimation();
    displayMessage(`Resetting grid to ${gridWidth} x ${gridHeight}`, "INFO");
    setIndicator("grey");
    setObstacles([]);
    setPath([]);
    setStart(null);
    setEnd(null);
    setActiveMode(null);
  }, [displayMessage, gridHeight, gridWidth, stopAnimation]);

  const createGrid = useCallback((): number[][] => {
    const grid = Array.from({ length: gridWidth }, () => Array.from({ length: gridHeight }, () => 1));
    for (const [x, y] of obstacles) {
      if (isInsideGrid([x, y], gridWidth, gridHeight)) {
        grid[x][y] = 0;
      }
    }
    return grid;
  }, [gridHeight, gridWidth, obstacles]);

  const clearCurrentPath = useCallback(() => {
    stopAnimation();
    setPath([]);
    setIndicator("grey");
  }, [stopAnimation]);

  const addObstacle = useCallback((cell: Cell) => {
    if (!isInsideGrid(cell, gridWidth, gridHeight)) return;
    if (obstacleSet.has(cellKey(cell))) return;
    if (sameCell(cell, start) || sameCell(cell, end)) return;
    clearCurrentPath();
    setObstacles((prev) => [...prev, cell]);
  }, [clearCurrentPath, end, gridHeight, gridWidth, obstacleSet, start]);

  const handleCellInteraction = useCallback((cell: Cell) => {
    if (!isInsideGrid(cell, gridWidth, gridHeight)) return;

    if (activeMode === "start") {
      if (obstacleSet.has(cellKey(cell)) || sameCell(cell, end)) return;
      clearCurrentPath();
      setStart(cell);
      return;
    }

    if (activeMode === "end") {
      if (obstacleSet.has(cellKey(cell)) || sameCell(cell, start)) return;
      clearCurrentPath();
      setEnd(cell);
      return;
    }

    if (activeMode === "obstacle") {
      addObstacle(cell);
    }
  }, [activeMode, addObstacle, clearCurrentPath, end, gridHeight, gridWidth, obstacleSet, start]);

  const validateReturnedPath = useCallback((uncheckedPath: Cell[]): Cell[] => {
    const cleaned: Cell[] = [];
    for (const cell of uncheckedPath) {
      if (!isInsideGrid(cell, gridWidth, gridHeight)) {
        displayMessage("Path outside grid", "ERROR");
        setIndicator("red");
        return [];
      }
      if (obstacleSet.has(cellKey(cell))) {
        displayMessage("Path intersects obstacle", "WARN");
        setIndicator("red");
        return [];
      }
      cleaned.push(cell);
    }
    setIndicator("green");
    return cleaned.filter((cell) => !sameCell(cell, start) && !sameCell(cell, end));
  }, [displayMessage, end, gridHeight, gridWidth, obstacleSet, start]);

  const runPlanner = useCallback(() => {
    if (!start || !end) {
      displayMessage("Start and End must be set", "WARN");
      setIndicator("red");
      return;
    }

    clearCurrentPath();
    displayMessage("Running algorithm", "INFO");

    try {
      const grid = createGrid();
      const uncheckedPath = doAStar(grid, start, end, displayMessage);

      if (uncheckedPath.length === 0) {
        displayMessage("No path returned", "ERROR");
        setIndicator("red");
        return;
      }

      const checkedPath = validateReturnedPath(uncheckedPath);
      if (checkedPath.length === 0) return;

      displayMessage("Drawing path", "INFO");
      const queue = [...checkedPath];
      setPath([]);
      const interval = Math.max(60, Math.floor(1000 / Math.max(queue.length, 1)));
      timerRef.current = window.setInterval(() => {
        if (queue.length === 0) {
          stopAnimation();
          return;
        }
        const nextCell = queue.shift()!;
        setPath((prev) => [...prev, nextCell]);
      }, interval);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      displayMessage(`React/TypeScript: "${message}"`, "ERROR");
      setIndicator("red");
    }
  }, [clearCurrentPath, createGrid, displayMessage, end, start, stopAnimation, validateReturnedPath]);

  const undoObstacle = useCallback(() => {
    if (obstacles.length === 0) return;
    clearCurrentPath();
    setObstacles((prev) => prev.slice(0, -1));
  }, [clearCurrentPath, obstacles.length]);

  const indicatorColor = indicator === "green" ? theme.start : indicator === "red" ? theme.end : theme.grid;

  const cellSize = useMemo(() => {
    const maxWidth = 900;
    const maxHeight = 420;
    return Math.max(20, Math.floor(Math.min(maxWidth / gridWidth, maxHeight / gridHeight)));
  }, [gridHeight, gridWidth]);

  const renderCell = (x: number, y: number) => {
    const cell: Cell = [x, y];
    const key = cellKey(cell);
    const isObstacle = obstacleSet.has(key);
    const isStart = sameCell(cell, start);
    const isEnd = sameCell(cell, end);
    const isPath = path.some((p) => p[0] === x && p[1] === y);

    let background = theme.background;
    if (isObstacle) background = theme.obstacle;
    else if (isStart) background = theme.start;
    else if (isEnd) background = theme.end;
    else if (isPath) background = isObstacle ? theme.conflict : theme.path;

    return (
      <button
        key={key}
        type="button"
        onMouseDown={() => {
          setIsMouseDown(true);
          handleCellInteraction(cell);
        }}
        onMouseEnter={() => {
          if (isMouseDown && activeMode === "obstacle") handleCellInteraction(cell);
        }}
        onMouseUp={() => setIsMouseDown(false)}
        style={{
          width: cellSize,
          height: cellSize,
          border: `1px solid ${theme.grid}`,
          background,
          padding: 0,
          cursor: "pointer",
        }}
        aria-label={`cell-${x}-${y}`}
      />
    );
  };

  return (
    <div
      onMouseLeave={() => setIsMouseDown(false)}
      onMouseUp={() => setIsMouseDown(false)}
      style={{
        fontFamily: "Inter, Arial, sans-serif",
        padding: 0,
        minHeight: "auto",
        background: "transparent",
        color: theme.text,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          background: theme.panelBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 16,
          padding: 20,
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.16)",
        }}
      >
       

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 12,
            alignItems: "stretch",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              minHeight: 80,
              maxHeight: 120,
              overflowY: "auto",
              background: theme.background,
              border: `1px solid ${theme.border}`,
              borderRadius: 12,
              padding: 12,
            }}
          >
            {messages.length === 0 ? (
              <span style={{ color: theme.messageInfo }}>No messages yet.</span>
            ) : (
              messages.map((msg) => {
                const color =
                  msg.type === "ERROR"
                    ? theme.messageError
                    : msg.type === "WARN"
                      ? theme.messageWarn
                      : msg.type === "DEBUG"
                        ? theme.messageDebug
                        : theme.messageInfo;
                return (
                  <div key={msg.id} style={{ color, marginBottom: 4 }}>
                    {msg.text}
                  </div>
                );
              })
            )}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
            <button type="button" onClick={() => setMessages([])} style={buttonStyle(false, theme.buttonActiveBg, theme)}>
              CLEAR
            </button>
            <div
              style={{
                width: 40,
                minWidth: 40,
                borderRadius: 10,
                border: `1px solid ${theme.border}`,
                background: indicatorColor,
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "end",
            marginBottom: 20,
          }}
        >
          <label style={fieldStyle}>
            <span>Width</span>
            <input
              type="number"
              min={1}
              max={99}
              value={gridWidth}
              onChange={(e) => setGridWidth(Math.max(1, Number(e.target.value) || 1))}
            style={{ ...inputStyle, border: `1px solid ${theme.border}` }}
            />
          </label>

          <label style={fieldStyle}>
            <span>Height</span>
            <input
              type="number"
              min={1}
              max={99}
              value={gridHeight}
              onChange={(e) => setGridHeight(Math.max(1, Number(e.target.value) || 1))}
            style={{ ...inputStyle, border: `1px solid ${theme.border}` }}
            />
          </label>

          <button type="button" onClick={resetPlanner} style={buttonStyle(false, theme.buttonActiveBg, theme)}>
            Reset
          </button>
          <button
            type="button"
            onClick={() => setActiveMode((prev) => (prev === "obstacle" ? null : "obstacle"))}
            style={buttonStyle(activeMode === "obstacle", theme.obstacleActiveBg, theme)}
          >
            Add Obstacles
          </button>
          <button type="button" onClick={undoObstacle} style={buttonStyle(false, theme.buttonActiveBg, theme)}>
            Undo Obstacle
          </button>
          <button
            type="button"
            onClick={() => setActiveMode((prev) => (prev === "start" ? null : "start"))}
            style={buttonStyle(activeMode === "start", theme.start, theme)}
          >
            Add Start
          </button>
          <button
            type="button"
            onClick={() => setActiveMode((prev) => (prev === "end" ? null : "end"))}
            style={buttonStyle(activeMode === "end", theme.end, theme)}
          >
            Add End
          </button>
          <div style={{ flex: 1 }} />
          <button type="button" onClick={runPlanner} style={buttonStyle(false, theme.buttonActiveBg, theme)}>
            Run
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridWidth}, ${cellSize}px)`,
            justifyContent: "center",
            userSelect: "none",
            background: theme.background,
            border: `2px solid ${theme.grid}`,
            width: "fit-content",
            margin: "0 auto",
          }}
        >
          {Array.from({ length: gridHeight }, (_, y) =>
            Array.from({ length: gridWidth }, (_, x) => renderCell(x, y)),
          )}
        </div>
      </div>
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {
  width: 88,
  height: 38,
  borderRadius: 10,
  padding: "0 10px",
  fontSize: 16,
};

function buttonStyle(active: boolean, activeColor: string, theme: PlannerTheme): React.CSSProperties {
  return {
    height: 40,
    padding: "0 14px",
    borderRadius: 10,
    border: `1px solid ${theme.border}`,
    background: active ? activeColor : theme.buttonBg,
    color: active ? "#fff" : theme.buttonText,
    fontWeight: 700,
    cursor: "pointer",
  };
}
