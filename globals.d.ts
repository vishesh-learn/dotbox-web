// Ambient declarations for globals that are defined in page-specific scripts
// but referenced by shared code (classes.ts, etc.).

declare var initDot: any;
declare var selectedDot: any;
declare var boxes: any[];
declare var made: any;
declare var allPossibleLines: any[];
declare var pendingPossiblelines: any[];
declare var playerTurnList: any;

declare function newColor(existingColors: any[]): string;
declare function getDotRadius(): number;
declare function getComputedSize(element: Element): { width: number; height: number };
declare function getScrollbarSize(): number;
declare function length_to_dotCount(length: number): number;
declare function dotCount_to_length(dotCount: number): number;
declare function loadingStartUI(): void;
declare function loadingEndUI(): void;
declare function keyOnTabIndex(): void;
declare function keyOnElement(element: Element): void;
declare function getRndInteger(min: number, max: number): number;

declare function createPlayerUI(player: any): any;
declare function createRankPlayerUI(player: any): any;
declare function updatePlayerCountView(): void;
declare function getSVGLine(...args: any[]): any;
declare function getSurroundingDots(dot: Dot): Dot[];
declare function getSurroundingLines(line: any): any;
declare function makeBox(square: any, line: any): void;
declare function lineMade(line: any): void;
declare function boxMade(box: any): void;
declare function lineNotExists(line: any, linelist: any[]): boolean;
declare function lineEsToJSON(): any[];
declare function updateLinesUI(): void;
declare function updateBoxesUI(boxes: any[]): void;
declare function autoDrawLine(): void;
declare function setupPlayerTurnList(): void;
declare function setupPlayerTurnListUI(): void;
declare function winBoard(): void;
declare function setCurrPlayerInfo(): void;
declare function prevLineMaker(line: any): void;
declare function playerTurn(isInitial?: boolean): void;
declare function gameBoardBuilder(): void;
declare function gameBoardOverFlow(): void;
declare function svgResize(): void;
declare function nearestDot(x: number, y: number): any;
declare function nearDot(x: number, y: number): any;
declare function goHome(): void;
declare function newGame(): void;
declare function replay(): void;
declare function isEnd(): boolean;
declare function refreshGameLines(): void;
declare function footerInfo(): void;
declare function slideLeft(): void;
declare function setupGameBoard(): void;
declare function getPendingPossiblelines(): any[];
declare function getAllPossibleLines(): any[];
declare function optedCnR(): void;

declare function hueToHex(hue: number | string): string;
declare function toRadialGradientCSSValue(color: string): string;
declare function toHslObject(color: string): { h: number; s: number; l: number };
declare function hslToHex(hsl: any): string;

declare function shareApp(): void;
declare function continueGame(): void;
declare function savedGames(): void;
declare function savedGames_close(): void;
declare function formatDateTimeWithRelativeEn(date: Date): string;
declare function createSavedGameUI(game: any): HTMLElement;
declare function initHome(): void;
declare function tooltip_init(): void;
