import { EventEmitter } from 'events';
import Draggable from './draggable';
import { TextOptions } from './linkOptions';
import Options from './linkOptions';

export class Link {
  // create svg link between two elements with
  public start: Draggable;
  public end: Draggable;
  private get id(): string {
    return this.start.generateLinkId(this.end);
  }
  private get startLinkIndex(): number {
    return this.start.links.get(this.id)?.index + 0.5 || 0;
  }
  private get endLinkIndex(): number {
    return this.end.links.get(this.id)?.index + 0.5 || 0;
  }
  private svg: SVGElement;
  private path: SVGPathElement;
  private startCoords: { x: number, y: number } = { x: 0, y: 0 };
  private endCoords: { x: number, y: number } = { x: 0, y: 0 };
  private curveStartCoords: { x: number, y: number } = { x: 0, y: 0 };
  private curveEndCoords: { x: number, y: number } = { x: 0, y: 0 };
  private offsetStart: { x: number, y: number } = { x: 0, y: 0 };
  private offsetEnd: { x: number, y: number } = { x: 0, y: 0 };
  private previousStartDiff: { x: number, y: number } = { x: 0, y: 0 };
  private previousEndDiff: { x: number, y: number } = { x: 0, y: 0 };
  private previousStartSide: { start: { x: number, y: number, side: string }, end: { x: number, y: number, side: string } } = { start: { x: 0, y: 0, side: 'left' }, end: { x: 0, y: 0, side: 'right' } };
  private options: Options;
  private insertedSvg = false;
  private lastSideSwitchTs = 0;
  private linkStartEl: HTMLElement;
  private linkEndEl: HTMLElement;
  private linkMidEl: HTMLElement;
  private linkStartElDimensions: DOMRect;
  private linkEndElDimensions: DOMRect;
  private linkMidElDimensions: DOMRect;
  private events = new EventEmitter();
  private get svgPath(): { d: string } {
    return {
      d: `M ${this.startCoords.x},${this.startCoords.y} C ${this.curveStartCoords.x},${this.curveStartCoords.y},${this.curveEndCoords.x},${this.curveEndCoords.y} ${this.endCoords.x},${this.endCoords.y}`
    };
  }

  private get hookSide(): {
    start: { x: number, y: number, side: string },
    end: { x: number, y: number, side: string }
  } {
    const diff = {
      x: this.end.elementCoords.x - this.start.elementCoords.x,
      y: this.end.elementCoords.y - this.start.elementCoords.y
    };

    //compare the difference between current difference and previous diff to prevent flickering
    if (Date.now() - this.lastSideSwitchTs < 200 || Math.abs(diff.x - this.previousStartDiff.x) < this.options.sideSwitchThreshold && Math.abs(diff.y - this.previousStartDiff.y) < this.options.sideSwitchThreshold) {
      return this.previousStartSide;
    }

    this.previousStartDiff = diff;
    this.lastSideSwitchTs = Date.now();

    const startSideOffset = this.startLinkIndex / 5;
    const endSideOffset = this.endLinkIndex / 5;

    if (Math.abs(diff.x) > Math.abs(diff.y)) {
      if (diff.x > 0.1) {
        this.previousStartSide = {
          start: {
            x: this.start.boundaries.width - this.options.innerOffsetStart,
            y: this.start.boundaries.height * startSideOffset,
            side: 'right'
          },
          end: {
            x: this.options.innerOffsetEnd,
            y: this.end.boundaries.height * endSideOffset,
            side: 'left'
          }
        };
        return this.previousStartSide;
      }
      else {
        this.previousStartSide = {
          start: {
            x: this.options.innerOffsetStart,
            y: this.start.boundaries.height * startSideOffset,
            side: 'left'
          },
          end: {
            x: this.end.boundaries.width - this.options.innerOffsetEnd,
            y: this.end.boundaries.height * endSideOffset,
            side: 'right'
          }
        };
        return this.previousStartSide;
      }
    }
    else {
      if (diff.y > 0.1) {
        this.previousStartSide = {
          start: {
            x: this.start.boundaries.width * startSideOffset,
            y: this.start.boundaries.height - this.options.innerOffsetStart,
            side: 'bottom'
          },
          end: {
            x: this.end.boundaries.width * endSideOffset,
            y: this.options.innerOffsetEnd,
            side: 'top'
          }
        };
        return this.previousStartSide;
      }
      else {
        this.previousStartSide = {
          start: {
            x: this.start.boundaries.width * startSideOffset,
            y: this.options.innerOffsetStart,
            side: 'top'
          },
          end: {
            x: this.end.boundaries.width * endSideOffset,
            y: this.end.boundaries.height - this.options.innerOffsetEnd,
            side: 'bottom'
          }
        };
        return this.previousStartSide;
      }
    }
  }

  private get hookElements(): {
    start: { x: number, y: number },
    end: { x: number, y: number },
    mid: { x: number, y: number }
  } {
    const hookside = this.hookSide;

    if (hookside.start.side == 'left') {
      return {
        start: {
          x: this.startCoords.x - this.linkStartElDimensions.width,
          y: this.startCoords.y - this.linkStartElDimensions.height - this.options.strokeWidth
        },
        end: {
          x: this.endCoords.x,
          y: this.endCoords.y - this.linkEndElDimensions.height - this.options.strokeWidth
        },
        mid: {
          x: (this.startCoords.x + this.endCoords.x) / 2 - this.linkMidElDimensions.width / 2,
          y: (this.startCoords.y + this.endCoords.y) / 2 - this.linkMidElDimensions.height - this.options.strokeWidth
        }
      };
    }
    else if (hookside.start.side == 'right') {
      return {
        start: {
          x: this.startCoords.x,
          y: this.startCoords.y - this.linkStartElDimensions.height - this.options.strokeWidth
        },
        end: {
          x: this.endCoords.x - this.linkEndElDimensions.width,
          y: this.endCoords.y - this.linkEndElDimensions.height - this.options.strokeWidth
        },
        mid: {
          x: (this.startCoords.x + this.endCoords.x) / 2 - this.linkMidElDimensions.width / 2,
          y: (this.startCoords.y + this.endCoords.y) / 2 - this.linkMidElDimensions.height - this.options.strokeWidth
        }
      };
    }
    else if (hookside.start.side == 'top') {
      return {
        start: {
          x: this.startCoords.x - this.linkStartElDimensions.width - this.options.strokeWidth,
          y: this.startCoords.y - this.linkStartElDimensions.height
        },
        end: {
          x: this.endCoords.x - this.linkEndElDimensions.width - this.options.strokeWidth,
          y: this.endCoords.y
        },
        mid: {
          x: (this.startCoords.x + this.endCoords.x) / 2 - this.linkMidElDimensions.width - this.options.strokeWidth,
          y: (this.startCoords.y + this.endCoords.y) / 2 - this.linkMidElDimensions.height / 2
        }
      };
    }
    else if (hookside.start.side == 'bottom') {
      return {
        start: {
          x: this.startCoords.x + this.options.strokeWidth,
          y: this.startCoords.y
        },
        end: {
          x: this.endCoords.x - this.linkEndElDimensions.width - this.options.strokeWidth,
          y: this.endCoords.y - this.linkEndElDimensions.height
        },
        mid: {
          x: (this.startCoords.x + this.endCoords.x) / 2 - this.linkMidElDimensions.width - this.options.strokeWidth,
          y: (this.startCoords.y + this.endCoords.y) / 2 - this.linkMidElDimensions.height / 2
        }
      };
    }
  }

  public get startText(): string {
    return this.options.linkStartText.text;
  }

  public get endText(): string {
    return this.options.linkEndText.text;
  }

  public get midText(): string {
    return this.options.linkMidText.text;
  }

  constructor(options: Options = {}) {
    this.options = {
      fill: 'none',
      stroke: '#000',
      strokeWidth: 2,
      innerOffsetStart: -15,
      innerOffsetEnd: -15,
      curve: 0.7,
      updateOnEnd: false,
      opacity: 1,
      dash: [0, 0],
      linkStartSide: 'left',
      sideSwitchThreshold: 50,
      ...options
    };

    this.options.linkStartText = {
      text: '',
      fontSize: '1rem',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontColor: '#121212',
      padding: '0.5rem',
      ...options.linkStartText
    };

    this.options.linkEndText = {
      text: '',
      fontSize: '1rem',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontColor: '#121212',
      padding: '0.5rem',
      ...options.linkEndText
    };

    this.options.linkMidText = {
      text: '',
      fontSize: '1rem',
      fontWeight: 'bold',
      fontStyle: 'normal',
      fontColor: '#121212',
      padding: '1.2rem',
      ...options.linkMidText
    };

    this.initSvg()
      .then(this.initElements.bind(this));
  }

  private initSvg(): Promise<Link> {
    return new Promise((resolve) => {
      this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      this.path.setAttribute('stroke-dasharray', this.options.dash.join(','));
      this.path.setAttribute('stroke-linecap', 'round');
      this.path.setAttribute('stroke-linejoin', 'round');
      this.svg.style.position = 'absolute';
      this.svg.style.top = '0';
      this.svg.style.left = '0';
      // this.svg.setAttribute('width', '0');
      // this.svg.setAttribute('height', '0');
      this.svg.style.pointerEvents = 'none';
      this.path.setAttribute('stroke', this.options.stroke);
      this.path.setAttribute('stroke-width', this.options.strokeWidth.toString());
      this.path.setAttribute('fill', this.options.fill);
      this.path.setAttribute('marker-end', 'url(#pointer)');
      this.svg.style.transition = 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      this.svg.style.userSelect = 'none';
      this.svg.style.overflow = 'visible';
      this.svg.appendChild(this.path);
      resolve(this);
    });
  }

  private initElements(): Promise<Link> {
    return new Promise((resolve) => {

      const start = document.createElement('div');
      const end = document.createElement('div');
      const mid = document.createElement('div');

      start.style.position = 'absolute';
      start.style.top = '0';
      start.style.left = '0';
      start.style.fontSize = this.options.linkStartText.fontSize;
      start.style.color = this.options.linkStartText.fontColor;
      start.style.fontWeight = this.options.linkStartText.fontWeight;
      start.style.fontStyle = this.options.linkStartText.fontStyle;
      start.style.lineHeight = '0.8';
      start.style.padding = this.options.linkStartText.padding;
      start.style.transition = 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      start.style.userSelect = 'none';
      start.style.cursor = 'pointer';
      start.style.boxSizing = 'border-box';
      start.innerHTML = this.options.linkStartText.text;
      start.onclick = () => this.emit('startClick', this);
      this.linkStartEl = this.svg.parentElement.appendChild(start);

      end.style.position = 'absolute';
      end.style.top = '0';
      end.style.left = '0';
      end.style.fontSize = this.options.linkEndText.fontSize;
      end.style.color = this.options.linkEndText.fontColor;
      end.style.fontWeight = this.options.linkEndText.fontWeight;
      end.style.fontStyle = this.options.linkEndText.fontStyle;
      end.style.lineHeight = '0.8';
      end.style.padding = this.options.linkEndText.padding;
      end.style.transition = 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      end.style.userSelect = 'none';
      end.style.cursor = 'pointer';
      end.style.boxSizing = 'border-box';
      end.innerHTML = this.options.linkEndText.text;
      end.onclick = () => this.emit('endClick', this);
      this.linkEndEl = this.svg.parentElement.appendChild(end);

      mid.style.position = 'absolute';
      mid.style.top = '0';
      mid.style.left = '0';
      mid.style.fontSize = this.options.linkMidText.fontSize;
      mid.style.color = this.options.linkMidText.fontColor;
      mid.style.fontWeight = this.options.linkMidText.fontWeight;
      mid.style.fontStyle = this.options.linkMidText.fontStyle;
      mid.style.lineHeight = '0.8';
      mid.style.padding = this.options.linkMidText.padding;
      mid.style.transition = 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      mid.style.userSelect = 'none';
      mid.style.cursor = 'pointer';
      mid.style.boxSizing = 'border-box';
      mid.innerHTML = this.options.linkMidText.text;
      mid.onclick = () => this.emit('midClick', this);
      this.linkMidEl = this.svg.parentElement.appendChild(mid);

      this.updateHookElementDimensions().then(resolve.bind(this, this));
    });
  }

  public setStartText(text: TextOptions): Promise<Link> {
    return new Promise((resolve) => {
      text = {
        ...this.options.linkStartText,
        ...text,
      };
      this.linkStartEl.style.position = 'absolute';
      this.linkStartEl.style.top = '0';
      this.linkStartEl.style.left = '0';
      this.linkStartEl.style.fontSize = text.fontSize;
      this.linkStartEl.style.color = text.fontColor;
      this.linkStartEl.style.fontWeight = text.fontWeight;
      this.linkStartEl.style.fontStyle = text.fontStyle;
      this.linkStartEl.style.padding = text.padding;
      this.linkStartEl.innerHTML = text.text;
      this.options.linkStartText = text;
      this.updateHookElementDimensions().then(resolve.bind(this, this));
    });
  }

  public setEndText(text: TextOptions): Promise<Link> {
    return new Promise((resolve) => {
      text = {
        ...this.options.linkEndText,
        ...text,
      };
      this.linkEndEl.style.position = 'absolute';
      this.linkEndEl.style.top = '0';
      this.linkEndEl.style.left = '0';
      this.linkEndEl.style.fontSize = text.fontSize;
      this.linkEndEl.style.color = text.fontColor;
      this.linkEndEl.style.fontWeight = text.fontWeight;
      this.linkEndEl.style.fontStyle = text.fontStyle;
      this.linkEndEl.style.padding = text.padding;
      this.linkEndEl.innerHTML = text.text;
      this.options.linkEndText = text;
      this.updateHookElementDimensions().then(resolve.bind(this, this));
    });
  }

  public setMidText(text: TextOptions): Promise<Link> {
    return new Promise((resolve) => {
      text = {
        ...this.options.linkMidText,
        ...text,
      };
      this.linkMidEl.style.fontSize = text.fontSize;
      this.linkMidEl.style.color = text.fontColor;
      this.linkMidEl.style.fontWeight = text.fontWeight;
      this.linkMidEl.style.fontStyle = text.fontStyle;
      this.linkMidEl.style.padding = text.padding;
      this.linkMidEl.innerHTML = text.text;
      this.options.linkMidText = text;
      this.updateHookElementDimensions().then(resolve.bind(this, this));
    });
  }

  public static initiateLink(event: PointerEvent, options: Options = {}, attachingLinkOptions: Options = {}): Promise<Link> {
    return new Promise(async (resolve) => {

      const startPoint = await Draggable.spawnPoint({ x: event.pageX, y: event.pageY });
      const endPoint = await Draggable.spawnActivePoint({ x: event.pageX, y: event.pageY });

      attachingLinkOptions = {
        updateOnEnd: false,
        innerOffsetEnd: 0,
        innerOffsetStart: 0,
        strokeWidth: 3,
        dash: [1, 7],
        stroke: 'rgb(100, 170, 246)',
        linkStartText: {
          ...options.linkStartText,
          fontColor: 'rgb(100, 170, 246)',
        },
        linkMidText: {
          ...options.linkMidText,
          fontColor: 'rgb(100, 170, 246)',
        },
        linkEndText: {
          ...options.linkEndText,
          fontColor: 'rgb(100, 170, 246)',
        },
        ...attachingLinkOptions,
      };

      startPoint.attachTo(endPoint, {
        ...options,
        ...attachingLinkOptions,
      });

      endPoint.once('up', async () => {
        const start = await Draggable.getDraggableFromPoint(startPoint.nonCorrectedPos);
        const end = await Draggable.getDraggableFromPoint(endPoint.nonCorrectedPos);
        let link: Link;
        if (start && end) {
          let id = start.generateLinkId(end);
          link = start.links.get(id)?.link;
          link?.destroy();
          await start.attachTo(end, options);
          id = start.generateLinkId(end);
          link = await start.links.get(id)?.link;
          link?.update();
          start.release();
          end.release();
        }
        startPoint.destroy();
        endPoint.destroy();
        resolve(link);
      });
    });
  }

  public attachStart(draggable: Draggable): Promise<Link> {
    return new Promise((resolve) => {
      this.start = draggable;
      if (!this.insertedSvg) {
        this.insertedSvg = true;
        this.start.getElement.parentElement.appendChild(this.svg);
      }
      this.hookStart();
      resolve(this);
    });
  }

  public attachEnd(draggable: Draggable): Promise<Link> {
    return new Promise((resolve) => {
      this.end = draggable;
      if (!this.insertedSvg) {
        this.insertedSvg = true;
        this.end.getElement.parentElement.appendChild(this.svg);
      }
      this.hookEnd();
      resolve(this);
    });
  }

  public hideLink() {
    return new Promise((resolve) => {
      this.svg.style.opacity = '0';
      this.linkStartEl.style.opacity = '0';
      this.linkEndEl.style.opacity = '0';
      this.linkMidEl.style.opacity = '0';
      resolve(this);
    });
  }

  public showLink() {
    return new Promise((resolve) => {
      this.svg.style.opacity = `${this.options.opacity}`;
      this.linkStartEl.style.opacity = `${this.options.opacity}`;
      this.linkEndEl.style.opacity = `${this.options.opacity}`;
      this.linkMidEl.style.opacity = `${this.options.opacity}`;
      resolve(this);
    });
  }

  private hookStart(): Promise<Link> {
    return new Promise((resolve) => {

      this.start.on('initialized', (draggable) => {
        this.update();
      });

      this.options.updateOnEnd ? this.start.on('down', this.hideLink.bind(this)) : null;

      this.start.on(this.options.updateOnEnd ? 'end' : 'moving', (draggable) => {
        this.update();
      });

      this.options.updateOnEnd ? this.start.on('end', this.showLink.bind(this)) : null;
      resolve(this);
    });
  }

  private hookEnd(): Promise<Link> {
    return new Promise((resolve) => {

      this.end.on('initialized', (draggable) => {
        this.update();
      });

      this.options.updateOnEnd ? this.end.on('down', this.hideLink.bind(this)) : null;

      this.end.on(this.options.updateOnEnd ? 'end' : 'moving', (draggable) => {
        this.update();
      });

      this.options.updateOnEnd ? this.end.on('end', this.showLink.bind(this)) : null;
      resolve(this);
    });
  }

  private updateCoords(): Promise<Link> {
    return new Promise((resolve) => {
      const hookside = this.hookSide;
      this.startCoords = {
        x: this.start.elementCoords.x + hookside.start.x,
        y: this.start.elementCoords.y + hookside.start.y
      };

      this.endCoords = {
        x: this.end.elementCoords.x + hookside.end.x,
        y: this.end.elementCoords.y + hookside.end.y
      };
      resolve(this);
    });
  }

  private updateCurveCoords(): Promise<Link> {
    return new Promise((resolve) => {
      const hookside = this.hookSide;

      const curve = {
        start: {
          x: hookside.start.side === 'left' || hookside.start.side === 'right' ? ((this.endCoords.x - this.startCoords.x) / 2) * this.options.curve : 0,
          y: hookside.start.side === 'top' || hookside.start.side === 'bottom' ? ((this.endCoords.y - this.startCoords.y) / 2) * this.options.curve : 0
        },
        end: {
          x: hookside.start.side === 'left' || hookside.start.side === 'right' ? ((this.startCoords.x - this.endCoords.x) / 2) * this.options.curve : 0,
          y: hookside.start.side === 'top' || hookside.start.side === 'bottom' ? ((this.startCoords.y - this.endCoords.y) / 2) * this.options.curve : 0
        }
      };

      this.curveStartCoords = {
        x: this.startCoords.x + curve.start.x,
        y: this.startCoords.y + curve.start.y
      };

      this.curveEndCoords = {
        x: this.endCoords.x + curve.end.x,
        y: this.endCoords.y + curve.end.y
      };

      resolve(this);
    });
  }

  private updateSvg(): Promise<Link> {
    return new Promise((resolve) => {
      this.path.setAttribute('d', this.svgPath.d);
      resolve(this);
    });
  }

  private updateElements(): Promise<Link> {
    return new Promise((resolve) => {
      const hookElements = this.hookElements;
      this.linkStartEl.style.transform = `translate(${hookElements.start.x}px, ${hookElements.start.y}px)`;
      this.linkEndEl.style.transform = `translate(${hookElements.end.x}px, ${hookElements.end.y}px)`;
      this.linkMidEl.style.transform = `translate(${hookElements.mid.x}px, ${hookElements.mid.y}px)`;
      resolve(this);
    });
  }

  public update(): Promise<Link> {
    return new Promise((resolve) => {
      if (this.start && this.end) {
        this.updateCoords()
          .then(this.updateCurveCoords.bind(this))
          .then(this.updateSvg.bind(this))
          .then(this.updateElements.bind(this))
          .then(this.emit.bind(this, 'update'))
          .then(resolve.bind(this, this));
      }
      else {
        resolve(this);
      }
    });
  }

  private updateHookElementDimensions(): Promise<Link> {
    return new Promise((resolve) => {
      this.linkStartElDimensions = this.linkStartEl.getBoundingClientRect();
      this.linkEndElDimensions = this.linkEndEl.getBoundingClientRect();
      this.linkMidElDimensions = this.linkMidEl.getBoundingClientRect();
      resolve(this);
    });
  }

  private emit(event: string, ...args: any): Promise<Link> {
    return new Promise((resolve) => {
      this.events.emit(event, ...args);
      resolve(this);
    });
  }

  public on(event: string, callback: (event: any) => void): void {
    this.events.on(event, callback);
  }

  public off(event: string, callback: (event: any) => void): void {
    this.events.off(event, callback);
  }

  public once(event: string, callback: (event: any) => void): void {
    this.events.on(event, callback);
  }

  public destroy(): void {
    this.start.links.delete(this.id);
    this.end.links.delete(this.id);
    this.linkStartEl.remove();
    this.linkEndEl.remove();
    this.linkMidEl.remove();
    this.path.remove();
    this.svg.remove();
    ~this;
  }
}

export default Link;
