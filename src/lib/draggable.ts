export class Draggable {
  maxX: number;
  maxY: number;
  draggable: HTMLElement;
  elementId: string;
  eventType: string;
  eventTarget: HTMLElement;
  mPose: {
    x: number,
    y: number
  } = { y: 0, x: 0 };
  elementPos: {
    x: number,
    y: number
  } = { y: 0, x: 0 };
  mirror: HTMLElement;
  transformer: HTMLElement;
  mousePressed: boolean;
  boundingBox: {
    x: number,
    y: number,
    width: number,
    height: number,
    left: number,
    right: number,
    top: number,
    bottom: number
  };
  mirrorOffset: {
    top: number,
    left: number
  } = { top: 0, left: 0 };
  pageCoords: {
    x: number,
    y: number
  } = { x: 0, y: 0 };
  initialOffset: {
    x: number,
    y: number
  } = { x: 0, y: 0 };
  cursorOffsetX: number;
  cursorOffsetY: number;
  animationFrame: number;
  lastUpdatedTs: number;
  mouseDownTs: number;
  easeEnabled: boolean;
  dragging: boolean;
  dragAllowed: boolean;
  options: any;
  scroll: {
    x: number,
    y: number
  } = { x: 0, y: 0 };
  initialScroll = {
    x: window.scrollX,
    y: window.scrollY
  };

  public get isTouch(): boolean {
    return this.eventType === 'touchstart' || this.eventType === 'touchmove';
  }

  public get calcPos(): { x: number, y: number } {
    console.log(this.maxY + this.initialScroll.y, this.mPose.y - this.initialOffset.y + this.mirrorOffset.top);
    return {
      x: Math.max(-this.initialOffset.x - this.initialScroll.x, Math.min(this.maxX, this.mPose.x - this.initialOffset.x + this.mirrorOffset.left)),
      y: Math.max(-this.initialOffset.y - this.initialScroll.y, Math.min(this.maxY, this.mPose.y - this.initialOffset.y + this.mirrorOffset.top))
    };
  }

  public get posError(): { x: number, y: number } {
    return {
      x: Math.abs(this.elementPos.x + this.initialOffset.x - this.mPose.x - this.mirrorOffset.left),
      y: Math.abs(this.elementPos.y + this.initialOffset.y - this.mPose.y - this.mirrorOffset.top)
    };
  }

  constructor(element: HTMLElement | string, options: object) {
    this.options = {
      maxX: document.documentElement.scrollWidth,
      maxY: document.documentElement.scrollHeight,
      ease: true,
      holdTime: 100,
      ...options
    };
    this.maxX = this.options.maxX;
    this.maxY = this.options.maxY;
    this.easeEnabled = this.options.ease;
    this.draggable = element instanceof HTMLElement ? element : document.querySelector(element);

    this.initDoc()
      .then(this.initMirror.bind(this))
      .then(this.getInitialDimentions.bind(this))
      .then(this.addMirrorProps.bind(this))
      .then(this.hookEvents.bind(this))
      .then(this.getPos.bind(this))
      .then(this.calculateMirrorOffset.bind(this));
  }

  process(event) {
    return new Promise((resolve) => {
      if (this.easeEnabled) {
        this.ease(event);
      } else {
        this.setPos(event);
      }
      resolve(this);
    });
  }

  initDoc() {
    return new Promise((resolve) => {

      const mouseUpdateFn = (event) => {
        this.pageCoords = {
          x: event.clientX ?? event.touches[0].clientX,
          y: event.clientY ?? event.touches[0].clientY
        };
      };

      document.addEventListener('mousemove', mouseUpdateFn.bind(this), false);
      document.addEventListener('mouseenter', mouseUpdateFn.bind(this), false);
      document.addEventListener('touchmove', mouseUpdateFn.bind(this), false);
      document.addEventListener('touchstart', mouseUpdateFn.bind(this), false);
      resolve(this);
    });
  }

  initMirror() {
    return new Promise((resolve) => {
      this.mirror = document.createElement(this.draggable.tagName);
      this.transformer = document.createElement('div');
      this.transformer.style.height = '100%';
      this.transformer.style.width = '100%';
      this.transformer.innerHTML = this.draggable.innerHTML;
      this.mirror.appendChild(this.transformer);
      document.body.appendChild(this.mirror);
      resolve(this);
    });
  }

  calculateMirrorDimensions() {
    return new Promise((resolve) => {
      const bounding = this.draggable.getBoundingClientRect();
      const boundingMirror = this.mirror.getBoundingClientRect();
      this.scroll = {
        x: window.scrollX,
        y: window.scrollY
      };
      this.boundingBox = {
        x: boundingMirror.x,
        y: boundingMirror.y,
        width: bounding.width,
        height: bounding.height,
        left: boundingMirror.left,
        right: boundingMirror.right,
        top: boundingMirror.top,
        bottom: boundingMirror.bottom
      };
      resolve(this);
    });
  }

  getInitialDimentions() {
    return new Promise((resolve) => {
      const bounding = this.draggable.getBoundingClientRect();
      this.boundingBox = {
        x: bounding.x,
        y: bounding.y,
        width: bounding.width,
        height: bounding.height,
        left: bounding.left + this.initialScroll.x,
        right: bounding.right,
        top: bounding.top + this.initialScroll.y,
        bottom: bounding.bottom
      };
      this.initialOffset = {
        x: bounding.x,
        y: bounding.y
      };
      resolve(this);
    });
  }

  getInitialPos() {
    return new Promise((resolve) => {
      const bounding = this.mirror.getBoundingClientRect();
      this.boundingBox = {
        x: bounding.x,
        y: bounding.y,
        width: this.boundingBox.width,
        height: this.boundingBox.height,
        left: bounding.left,
        right: bounding.right,
        top: bounding.top,
        bottom: bounding.bottom
      };
      resolve(this);
    });
  }


  addMirrorProps() {
    return new Promise((resolve) => {
      this.transformer.classList.add(...this.draggable.classList);
      this.mirror.style.position = 'absolute';
      this.mirror.style.zIndex = '9999';
      this.mirror.style.opacity = '0.8';
      this.mirror.style.width = this.boundingBox.width + 'px';
      this.mirror.style.height = this.boundingBox.height + 'px';
      this.mirror.style.left = this.boundingBox.left + 'px';
      this.mirror.style.top = this.boundingBox.top + 'px';
      this.mirror.style.cursor = 'grab';
      this.mirror.classList.add('mirror-elmnt');
      this.draggable.classList.add('draggable-elmnt');
      this.transformer.classList.add('transformer-elmnt');
      resolve(this);
    });
  }

  hookEvents() {
    return new Promise((resolve) => {
      this.mirror.onmousedown = this.mirror.ontouchstart = this.drag.bind(this);
      this.mirror.onmousemove = this.mirror.ontouchmove = this.drag.bind(this);
      this.mirror.onmouseup = this.mirror.ontouchend = this.drag.bind(this);
      resolve(this);
    });
  }

  calculateMirrorOffset(event) {
    return new Promise(async (resolve) => {
      await this.calculateMirrorDimensions();
      this.mirrorOffset.left = this.boundingBox.left + (this.scroll.x - this.initialScroll.x) - this.mPose.x;
      this.mirrorOffset.top = this.boundingBox.top + (this.scroll.y - this.initialScroll.y) - this.mPose.y;
      resolve(this);
    });
  }

  setPos(event) {
    return new Promise((resolve) => {
      const pos = this.calcPos;
      this.elementPos = { x: pos.x, y: pos.y };
      resolve(this);
    });
  }

  getPos(event) {
    return new Promise((resolve) => {
      this.mPose.x = this.pageCoords.x;
      this.mPose.y = this.pageCoords.y;
      resolve(this);
    });
  }

  ease(event) {
    return new Promise((resolve) => {
      const pos = this.calcPos;
      this.elementPos.x = this.lerp(this.elementPos.x, pos.x, 0.05);
      this.elementPos.y = this.lerp(this.elementPos.y, pos.y, 0.05);
      resolve(this);
    });
  }

  updateCycle(event) {
    const error = this.posError;
    if (!this.mousePressed && error.x < 0.1 && error.y < 0.1 && Date.now() - this.mouseDownTs > 100) {
      cancelAnimationFrame(this.animationFrame);
    }
    else {
      this.process(event)
        .then(this.draw.bind(this));
      this.animationFrame = requestAnimationFrame(this.updateCycle.bind(this));
    }

  }

  draw() {
    return new Promise((resolve) => {
      this.mirror.style.transform = `translate3d(${this.elementPos.x}px, ${this.elementPos.y}px, 0)`;
      this.lastUpdatedTs = Date.now();
      resolve(this);
    });
  }

  lerp(a, b, n) {
    return (1 - n) * a + n * b;
  }

  wait(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this);
      }, ms);
    });
  }

  allowDrag() {
    return new Promise((resolve) => {
      this.dragAllowed = true;
      resolve(this);
    });
  }

  disallowDrag() {
    return new Promise((resolve) => {
      this.dragAllowed = false;
      resolve(this);
    });
  }

  hookDocumentEvents(event) {
    return new Promise((resolve) => {
      document.onmouseup = document.ontouchend = () => {
        this.evtUp(event);
      };
      document.onmousemove = document.ontouchmove = () => {
        this.evtDragging(event);
      };
      resolve(this);
    });
  }

  unhookDocumentEvents() {
    return new Promise((resolve) => {
      document.onmouseup = null;
      document.onmousemove = null;
      resolve(this);
    });
  }

  evtDown(event) {
    this.mousePressed = true;
    this.mirror.style.userSelect = 'none';
    this.mouseDownTs = Date.now();

    this.hookDocumentEvents(event)
      .then(this.updateCycle.bind(this))
      .then(this.wait.bind(this, this.options.holdTime))
      .then(this.getPos.bind(this))
      .then(this.calculateMirrorOffset.bind(this))
      .then(this.allowDrag.bind(this));

    document.documentElement.style.cursor = 'grabbing';
    this.mirror.classList.remove('mirror-up');
    this.mirror.classList.add('mirror-down');
    this.draggable.classList.remove('draggable-up');
    this.draggable.classList.add('draggable-down');
  }

  evtDragging(event) {
    if (!this.dragAllowed) return;
    this.getPos(event);
    if (!this.dragging) {
      this.dragging = true;
      this.mirror.classList.remove('mirror-down');
      this.mirror.classList.add('mirror-dragging');
      this.draggable.classList.remove('draggable-down');
      this.draggable.classList.add('draggable-dragging');
    }

  }

  evtUp(event) {
    this.dragging = false;
    this.mousePressed = false;
    document.onmouseup = null;
    document.onmousemove = null;

    this.unhookDocumentEvents()
      .then(this.disallowDrag.bind(this));

    this.mirror.style.userSelect = 'auto';
    this.mirror.style.cursor = 'grab';
    document.documentElement.style.cursor = 'auto';
    this.mirror.classList.remove('mirror-dragging');
    this.mirror.classList.add('mirror-up');
    this.draggable.classList.remove('draggable-dragging');
    this.draggable.classList.add('draggable-up');
  }

  drag(event) {

    // event.stopPropagation();
    event.preventDefault();
    this.eventTarget = event.target;
    this.elementId = event.target.id;
    this.eventType = event.type;

    // start drag
    if (!this.mousePressed && (this.eventType == 'mousedown' || this.eventType == 'touchstart')) {
      this.evtDown(event);
    }

    // drag
    if (this.mousePressed && (this.eventType == 'mousemove' || this.eventType == 'touchmove')) {
      this.evtDragging(event);
    }

    // stop drag
    if (this.mousePressed && (this.eventType == 'mouseup' || this.eventType == 'touchend')) {
      this.evtUp(event);
    }
  }
}

export default Draggable;