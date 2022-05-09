import { EventEmitter } from 'events';

export class PointerUtils {
  private events = new EventEmitter();
  private downTs: number;
  private upTs: number;
  private longPressDownTo: number;
  private ignoredEls: HTMLElement[] = [];
  private isHooked = false;

  public pageCoords: { x: number; y: number; };
  public isPressed = false;
  public isLongPress = false;
  public isTouch = false;

  public downPrevent = false;
  public clickPrevent = false;
  public doublePrevent = false;
  public upPrevent = false;
  public enterPrevent = false;
  public leavePrevent = false;
  public MovePrevent = false;
  public CancelPrevent = false;
  public outPrevent = false;
  public overPrevent = false;
  public lockChangePrevent = false;
  public lockErrorPrevent = false;
  public contextMenuPrevent = false;
  public doubleClickTime = 250;
  public longPressTime = 500;
  public previousCoords: { x: number, y: number; } = { x: 0, y: 0 };
  public moveThreshold = 5;
  public longPressOnUp = false;


  public set ignore(el: string | HTMLElement | HTMLElement[]) {
    if (typeof el === 'string') {
      this.ignoredEls = [document.querySelector(el) as HTMLElement];
    } else if (el instanceof HTMLElement) {
      this.ignoredEls = [el];
    } else if (Array.isArray(el)) {
      this.ignoredEls = el;
    }

    this.ignoredEls.forEach(el => {
      const children = el.querySelectorAll('*');
      for (let i = 0; i < children.length; i++) {
        this.ignoredEls.push(children[i] as HTMLElement);
      }
    });
  }

  public downCb: (e: PointerEvent) => unknown = () => null;
  public clickCb: (e: PointerEvent) => unknown = () => null;
  public doubleClickCb: (e: PointerEvent) => unknown = () => null;
  public longPressCb: (e: PointerEvent) => unknown = () => null;
  public upCb: (e: PointerEvent) => unknown = () => null;
  public enterCb: (e: PointerEvent) => unknown = () => null;
  public leaveCb: (e: PointerEvent) => unknown = () => null;
  public moveCb: (e: PointerEvent) => unknown = () => null;
  public cancelCb: (e: PointerEvent) => unknown = () => null;
  public outCb: (e: PointerEvent) => unknown = () => null;
  public overCb: (e: PointerEvent) => unknown = () => null;
  public lockChangeCb: (e: PointerEvent) => unknown = () => null;
  public lockErrorCb: (e: PointerEvent) => unknown = () => null;
  public contextMenuCb: (e: PointerEvent) => unknown = () => null;

  public downEl: HTMLElement;
  public clickEl: HTMLElement;
  public doubleClickEl: HTMLElement;
  public longPressEl: HTMLElement;
  public upEl: HTMLElement;
  public enterEl: HTMLElement;
  public leaveEl: HTMLElement;
  public moveEl: HTMLElement;
  public cancelEl: HTMLElement;
  public outEl: HTMLElement;
  public overEl: HTMLElement;
  public lockChangeEl: HTMLElement;
  public lockErrorEl: HTMLElement;
  public contextMenuEl: HTMLElement;

  public get currentElement(): HTMLElement {
    return document.elementFromPoint(this.pageCoords.x, this.pageCoords.y) as HTMLElement;
  }
  public get currentPath(): HTMLElement[] {
    const path: HTMLElement[] = [];
    let el = this.currentElement;
    while (el) {
      path.push(el);
      el = el.parentElement;
    }
    return path;
  }

  public hook() {
    if (this.isHooked) return;
    this.isHooked = true;
    document.documentElement.addEventListener('pointerdown', this.pointerDownFn.bind(this), false);
    document.documentElement.addEventListener('pointerup', this.pointerUpFn.bind(this), false);
    document.documentElement.addEventListener('pointerenter', this.pointerEnterFn.bind(this), false);
    document.documentElement.addEventListener('pointerleave', this.pointerLeaveFn.bind(this), false);
    document.documentElement.addEventListener('pointermove', this.pointerMoveFn.bind(this), false);
    document.documentElement.addEventListener('pointercancel', this.pointerCancelFn.bind(this), false);
    document.documentElement.addEventListener('pointerout', this.pointerOutFn.bind(this), false);
    document.documentElement.addEventListener('pointerover', this.pointerOverFn.bind(this), false);
    document.documentElement.addEventListener('pointerlockchange', this.pointerLockChangeFn.bind(this), false);
    document.documentElement.addEventListener('pointerlockerror', this.pointerLockErrorFn.bind(this), false);
    document.documentElement.addEventListener('contextmenu', this.pointerContextMenuFn.bind(this), false);
  }

  private pointerDownFn(e: PointerEvent): Promise<PointerEvent> {
    if (this.downPrevent) {
      e.preventDefault();
    }

    if (this.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;
    document.documentElement.releasePointerCapture(e.pointerId);
    this.isPressed = true;
    this.pageCoords = { x: e.pageX, y: e.pageY };

    this.isLongPress = false;
    const prevTs = this.downTs;
    this.downTs = Date.now();
    this.longPressDownTo = setTimeout(() => {
      if (this.isPressed) {
        if (this.longPressEl && this.longPressEl !== e.target) return;
        this.isLongPress = true;
        this.longPressCb(e);
        this.events.emit('longPress', e);
      }
    }, this.longPressTime);


    if (this.downTs - prevTs < this.doubleClickTime) {
      if (this.doubleClickEl && this.doubleClickEl !== e.target) return;
      if (this.doublePrevent) {
        e.preventDefault();
      }
      this.events.emit('doubleClick', e);
      this.doubleClickCb(e);
    }

    if (this.downEl && this.downEl !== e.target) return;
    this.events.emit('pointerdown', e);
    this.downCb(e);
    return Promise.resolve(e);
  }

  private pointerUpFn(e: PointerEvent): Promise<PointerEvent> {

    if (this.upPrevent) {
      e.preventDefault();
    }

    if (this.ignoredEls.includes(e.target as HTMLElement)) return;
    this.pageCoords = { x: e.pageX, y: e.pageY };
    e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;

    this.longPressDownTo && clearTimeout(this.longPressDownTo);
    this.longPressDownTo = null;
    this.upTs = Date.now();
    this.isPressed = false;
    if (e.pointerType === 'touch') {
      this.isTouch = true;

      if (this.upTs - this.downTs > 500) {
        if (this.contextMenuPrevent) e.preventDefault();
      }
    }
    else {
      document.documentElement.releasePointerCapture(e.pointerId);
    }
    if (this.longPressOnUp && !this.isLongPress && this.upTs - this.downTs > this.longPressTime) {
      if (this.longPressEl && this.longPressEl !== e.target) return;
      this.longPressCb(e);
      this.events.emit('longPress', e);
    }

    if (this.upEl && this.upEl !== e.target) return;
    this.events.emit('pointerup', e);
    this.upCb(e);
    return Promise.resolve(e);
  }

  private pointerEnterFn(e: PointerEvent): Promise<PointerEvent> {
    if (this.enterEl && this.enterEl !== e.target) return;

    if (this.enterPrevent) {
      e.preventDefault();
    }

    if (this.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;

    document.documentElement.releasePointerCapture(e.pointerId);
    this.pageCoords = { x: e.pageX, y: e.pageY };
    this.events.emit('pointerenter', e);
    this.enterCb(e);
    return Promise.resolve(e);
  }

  private pointerLeaveFn(e: PointerEvent): Promise<PointerEvent> {
    if (this.leaveEl && this.leaveEl !== e.target) return;
    if (this.leavePrevent) {
      e.preventDefault();
    }

    if (this.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;

    document.documentElement.releasePointerCapture(e.pointerId);
    this.pageCoords = { x: e.pageX, y: e.pageY };
    this.events.emit('pointerleave', e);
    this.leaveCb(e);
    return Promise.resolve(e);
  }

  private pointerMoveFn(e: PointerEvent): Promise<PointerEvent> {
    if (this.moveEl && this.moveEl !== e.target) return;
    if (this.MovePrevent) {
      e.preventDefault();
    }

    if (this.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;


    this.pageCoords = { x: e.pageX, y: e.pageY };
    if (!this.isLongPress && PointerUtils.getDistance(this.previousCoords, this.pageCoords) > this.moveThreshold) {
      clearTimeout(this.longPressDownTo);
      this.longPressDownTo = null;
      this.isLongPress = false;
    }

    document.documentElement.releasePointerCapture(e.pointerId);
    this.events.emit('pointermove', e);
    this.moveCb(e);
    return Promise.resolve(e);
  }

  private pointerCancelFn(e: PointerEvent): Promise<PointerEvent> {
    if (this.cancelEl && this.cancelEl !== e.target) return;
    if (this.CancelPrevent) {
      e.preventDefault();
    }

    if (this.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;

    document.documentElement.releasePointerCapture(e.pointerId);
    this.pageCoords = { x: e.pageX, y: e.pageY };
    this.events.emit('pointercancel', e);
    this.cancelCb(e);
    return Promise.resolve(e);
  }

  private pointerOutFn(e: PointerEvent): Promise<PointerEvent> {
    if (this.outEl && this.outEl !== e.target) return;
    if (this.outPrevent) {
      e.preventDefault();
    }

    if (this.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;

    document.documentElement.releasePointerCapture(e.pointerId);
    this.pageCoords = { x: e.pageX, y: e.pageY };
    this.events.emit('pointerout', e);
    this.outCb(e);
    return Promise.resolve(e);
  }

  private pointerOverFn(e: PointerEvent): Promise<PointerEvent> {
    if (this.overEl && this.overEl !== e.target) return;
    if (this.overPrevent) {
      e.preventDefault();
    }

    if (this.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;

    document.documentElement.releasePointerCapture(e.pointerId);
    this.pageCoords = { x: e.pageX, y: e.pageY };
    this.events.emit('pointerover', e);
    this.overCb(e);
    return Promise.resolve(e);
  }

  private pointerLockChangeFn(e: PointerEvent): Promise<PointerEvent> {
    if (this.lockChangeEl && this.lockChangeEl !== e.target) return;
    if (this.lockChangePrevent) {
      e.preventDefault();
    }

    if (this.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;

    document.documentElement.releasePointerCapture(e.pointerId);
    this.pageCoords = { x: e.pageX, y: e.pageY };
    this.events.emit('pointerlockchange', e);
    this.lockChangeCb(e);
    return Promise.resolve(e);
  }

  private pointerLockErrorFn(e: PointerEvent): Promise<PointerEvent> {
    if (this.lockErrorEl && this.lockErrorEl !== e.target) return;
    if (this.lockErrorPrevent) {
      e.preventDefault();
    }

    if (this.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;

    document.documentElement.releasePointerCapture(e.pointerId);
    this.pageCoords = { x: e.pageX, y: e.pageY };
    this.events.emit('pointerlockerror', e);
    this.lockErrorCb(e);
    return Promise.resolve(e);
  }

  private pointerContextMenuFn(e: PointerEvent): Promise<PointerEvent> {
    if (this.contextMenuEl && this.contextMenuEl !== e.target) return;
    if (this.contextMenuPrevent) {
      e.preventDefault();
    }

    if (this.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? this.isTouch = true : this.isTouch = false;

    if (e.pointerType != "touch") {
      document.documentElement.releasePointerCapture(e.pointerId);
    }
    this.pageCoords = { x: e.pageX, y: e.pageY };
    this.events.emit('contextmenu', e);
    this.contextMenuCb(e);
    return Promise.resolve(e);
  }

  public destroy(): void {
    this.isHooked = false;
    document.documentElement.removeEventListener('pointerdown', this.pointerDownFn.bind(this), false);
    document.documentElement.removeEventListener('pointerup', this.pointerUpFn.bind(this), false);
    document.documentElement.removeEventListener('pointerenter', this.pointerEnterFn.bind(this), false);
    document.documentElement.removeEventListener('pointerleave', this.pointerLeaveFn.bind(this), false);
    document.documentElement.removeEventListener('pointermove', this.pointerMoveFn.bind(this), false);
    document.documentElement.removeEventListener('pointercancel', this.pointerCancelFn.bind(this), false);
    document.documentElement.removeEventListener('pointerout', this.pointerOutFn.bind(this), false);
    document.documentElement.removeEventListener('pointerover', this.pointerOverFn.bind(this), false);
    document.documentElement.removeEventListener('pointerlockchange', this.pointerLockChangeFn.bind(this), false);
    document.documentElement.removeEventListener('pointerlockerror', this.pointerLockErrorFn.bind(this), false);
    document.documentElement.removeEventListener('contextmenu', this.pointerContextMenuFn.bind(this), false);
  }

  public static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  public static getDistance(a: { x: number, y: number; }, b: { x: number, y: number; }): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }

  public static getAngle(a: { x: number, y: number; }, b: { x: number, y: number; }): number {
    return Math.atan2(b.y - a.y, b.x - a.x);
  }

  public static getAngleDeg(a: { x: number, y: number; }, b: { x: number, y: number; }): number {
    return Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
  }

  public static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  public static click(x: number, y: number): MouseEvent {
    const evt = new MouseEvent('click', {
      clientX: x,
      clientY: y
    });
    (document.elementFromPoint(x, y)).dispatchEvent(evt);
    return evt;
  }

  public static mousedown(x: number, y: number): MouseEvent {
    const evt = new MouseEvent('mousedown', {
      clientX: x,
      clientY: y
    });
    (document.elementFromPoint(x, y)).dispatchEvent(evt);
    return evt;
  }

  public static mouseup(x: number, y: number): MouseEvent {
    const evt = new MouseEvent('mouseup', {
      clientX: x,
      clientY: y
    });
    (document.elementFromPoint(x, y)).dispatchEvent(evt);
    return evt;
  }

  public static mousemove(x: number, y: number): MouseEvent {
    const evt = new MouseEvent('mousemove', {
      clientX: x,
      clientY: y
    });
    (document.elementFromPoint(x, y)).dispatchEvent(evt);
    return evt;
  }

  public static mousewheel(x: number, y: number, delta: number): WheelEvent {
    const evt = new WheelEvent('wheel', {
      clientX: x,
      clientY: y,
      deltaY: delta
    });
    (document.elementFromPoint(x, y)).dispatchEvent(evt);
    return evt;
  }

  public static changeEventCoords(e: PointerEvent, pos: { x: number, y: number; }): Promise<PointerEvent> {
    const evt = new PointerEvent(e.type, {
      ...e,
      clientX: pos.x,
      clientY: pos.y,
      screenX: pos.x,
      screenY: pos.y
    });
    return Promise.resolve(evt);
  }

  public static isScrollable(el: HTMLElement): boolean {
    const hasScrollableContent = el.scrollHeight > el.clientHeight;

    const overflowYStyle = window.getComputedStyle(el).overflowY;
    const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;

    return hasScrollableContent && !isOverflowHidden;
  }

  public static getScrollableParent(el: HTMLElement): HTMLElement {
    return !el || el === document.body
      ? document.body
      : PointerUtils.isScrollable(el)
        ? el
        : PointerUtils.getScrollableParent(el.parentElement);
  }
}

export default PointerUtils;
