import { EventEmitter } from 'events';

export class PointerUtils {
  private static events = new EventEmitter();
  private static downTs: number;
  private static upTs: number;
  private static longPressDownTo: number;
  private static ignoredEls: HTMLElement[] = [];
  private static isHooked = false;

  public static pageCoords: { x: number; y: number };
  public static isPressed = false;
  public static isLongPress = false;
  public static isTouch = false;

  public static downPrevent = false;
  public static doublePrevent = false;
  public static upPrevent = false;
  public static enterPrevent = false;
  public static leavePrevent = false;
  public static MovePrevent = false;
  public static CancelPrevent = false;
  public static outPrevent = false;
  public static overPrevent = false;
  public static lockChangePrevent = false;
  public static lockErrorPrevent = false;
  public static contextMenuPrevent = false;
  public static doubleClickTime = 250;
  public static longPressTime = 500;
  public static previousCoords: { x: number, y: number } = { x: 0, y: 0 };
  public static moveThreshold = 5;
  public static longPressOnUp = false;
  public static set ignore(el: string | HTMLElement | HTMLElement[]) {
    if (typeof el === 'string') {
      PointerUtils.ignoredEls = [document.querySelector(el) as HTMLElement];
    } else if (el instanceof HTMLElement) {
      PointerUtils.ignoredEls = [el];
    } else if (Array.isArray(el)) {
      PointerUtils.ignoredEls = el;
    }

    PointerUtils.ignoredEls.forEach(el => {
      const children = el.querySelectorAll('*');
      for (let i = 0; i < children.length; i++) {
        PointerUtils.ignoredEls.push(children[i] as HTMLElement);
      }
    });
  }

  public static downCb: (e: PointerEvent) => unknown = () => null;
  public static upCb: (e: PointerEvent) => unknown = () => null;
  public static enterCb: (e: PointerEvent) => unknown = () => null;
  public static leaveCb: (e: PointerEvent) => unknown = () => null;
  public static moveCb: (e: PointerEvent) => unknown = () => null;
  public static cancelCb: (e: PointerEvent) => unknown = () => null;
  public static outCb: (e: PointerEvent) => unknown = () => null;
  public static overCb: (e: PointerEvent) => unknown = () => null;
  public static lockChangeCb: (e: PointerEvent) => unknown = () => null;
  public static lockErrorCb: (e: PointerEvent) => unknown = () => null;
  public static contextMenuCb: (e: PointerEvent) => unknown = () => null;
  public static doubleClickCb: (e: PointerEvent) => unknown = () => null;
  public static longPressCb: (e: PointerEvent) => unknown = () => null;
  public static get currentElement(): HTMLElement {
    return document.elementFromPoint(PointerUtils.pageCoords.x, PointerUtils.pageCoords.y) as HTMLElement;
  }
  public static get currentPath(): HTMLElement[] {
    const path: HTMLElement[] = [];
    let el = PointerUtils.currentElement;
    while (el) {
      path.push(el);
      el = el.parentElement;
    }
    return path;
  }

  public static hook() {
    if (PointerUtils.isHooked) return;
    PointerUtils.isHooked = true;
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

  private static pointerDownFn(e: PointerEvent): Promise<PointerEvent> {

    if (PointerUtils.downPrevent) {
      e.preventDefault();
    }

    if (PointerUtils.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? PointerUtils.isTouch = true : PointerUtils.isTouch = false;
    document.documentElement.releasePointerCapture(e.pointerId);
    PointerUtils.isPressed = true;
    PointerUtils.pageCoords = { x: e.pageX, y: e.pageY };

    PointerUtils.isLongPress = false;
    const prevTs = PointerUtils.downTs;
    PointerUtils.downTs = Date.now();
    PointerUtils.longPressDownTo = setTimeout(() => {
      if (PointerUtils.isPressed) {
        PointerUtils.isLongPress = true;
        PointerUtils.longPressCb(e);
        PointerUtils.events.emit('longPress', e);
      }
    }, PointerUtils.longPressTime);


    if (PointerUtils.downTs - prevTs < PointerUtils.doubleClickTime) {
      if (PointerUtils.doublePrevent) {
        e.preventDefault();
      }
      PointerUtils.events.emit('doubleClick', e);
      PointerUtils.doubleClickCb(e);
    }

    PointerUtils.events.emit('pointerdown', e);
    PointerUtils.downCb(e);
    return Promise.resolve(e);
  }

  private static pointerUpFn(e: PointerEvent): Promise<PointerEvent> {

    if (PointerUtils.upPrevent) {
      e.preventDefault();
    }

    if (PointerUtils.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? PointerUtils.isTouch = true : PointerUtils.isTouch = false;


    PointerUtils.longPressDownTo && clearTimeout(PointerUtils.longPressDownTo);
    PointerUtils.longPressDownTo = null;
    PointerUtils.upTs = Date.now();
    PointerUtils.isPressed = false;
    if (e.pointerType === 'touch') {
      PointerUtils.isTouch = true;

      if (PointerUtils.upTs - PointerUtils.downTs > 500) {
        if (PointerUtils.contextMenuPrevent) e.preventDefault();
      }
    }
    else {
      document.documentElement.releasePointerCapture(e.pointerId);
    }
    if (PointerUtils.longPressOnUp && !PointerUtils.isLongPress && PointerUtils.upTs - PointerUtils.downTs > PointerUtils.longPressTime) {
      PointerUtils.longPressCb(e);
      PointerUtils.events.emit('longPress', e);
    }
    PointerUtils.pageCoords = { x: e.pageX, y: e.pageY };
    PointerUtils.events.emit('pointerup', e);
    PointerUtils.upCb(e);
    return Promise.resolve(e);
  }

  private static pointerEnterFn(e: PointerEvent): Promise<PointerEvent> {

    if (PointerUtils.enterPrevent) {
      e.preventDefault();
    }

    if (PointerUtils.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? PointerUtils.isTouch = true : PointerUtils.isTouch = false;

    document.documentElement.releasePointerCapture(e.pointerId);
    PointerUtils.pageCoords = { x: e.pageX, y: e.pageY };
    PointerUtils.events.emit('pointerenter', e);
    PointerUtils.enterCb(e);
    return Promise.resolve(e);
  }

  private static pointerLeaveFn(e: PointerEvent): Promise<PointerEvent> {

    if (PointerUtils.leavePrevent) {
      e.preventDefault();
    }

    if (PointerUtils.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? PointerUtils.isTouch = true : PointerUtils.isTouch = false;

    document.documentElement.releasePointerCapture(e.pointerId);
    PointerUtils.pageCoords = { x: e.pageX, y: e.pageY };
    PointerUtils.events.emit('pointerleave', e);
    PointerUtils.leaveCb(e);
    return Promise.resolve(e);
  }

  private static pointerMoveFn(e: PointerEvent): Promise<PointerEvent> {

    if (PointerUtils.MovePrevent) {
      e.preventDefault();
    }

    if (PointerUtils.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? PointerUtils.isTouch = true : PointerUtils.isTouch = false;


    PointerUtils.pageCoords = { x: e.pageX, y: e.pageY };
    if (!PointerUtils.isLongPress && PointerUtils.getDistance(PointerUtils.previousCoords, PointerUtils.pageCoords) > PointerUtils.moveThreshold) {
      clearTimeout(PointerUtils.longPressDownTo);
      PointerUtils.longPressDownTo = null;
      PointerUtils.isLongPress = false;
    }

    document.documentElement.releasePointerCapture(e.pointerId);
    PointerUtils.events.emit('pointermove', e);
    PointerUtils.moveCb(e);
    return Promise.resolve(e);
  }

  private static pointerCancelFn(e: PointerEvent): Promise<PointerEvent> {

    if (PointerUtils.CancelPrevent) {
      e.preventDefault();
    }

    if (PointerUtils.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? PointerUtils.isTouch = true : PointerUtils.isTouch = false;

    document.documentElement.releasePointerCapture(e.pointerId);
    PointerUtils.pageCoords = { x: e.pageX, y: e.pageY };
    PointerUtils.events.emit('pointercancel', e);
    PointerUtils.cancelCb(e);
    return Promise.resolve(e);
  }

  private static pointerOutFn(e: PointerEvent): Promise<PointerEvent> {

    if (PointerUtils.outPrevent) {
      e.preventDefault();
    }

    if (PointerUtils.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? PointerUtils.isTouch = true : PointerUtils.isTouch = false;

    document.documentElement.releasePointerCapture(e.pointerId);
    PointerUtils.pageCoords = { x: e.pageX, y: e.pageY };
    PointerUtils.events.emit('pointerout', e);
    PointerUtils.outCb(e);
    return Promise.resolve(e);
  }

  private static pointerOverFn(e: PointerEvent): Promise<PointerEvent> {

    if (PointerUtils.overPrevent) {
      e.preventDefault();
    }

    if (PointerUtils.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? PointerUtils.isTouch = true : PointerUtils.isTouch = false;

    document.documentElement.releasePointerCapture(e.pointerId);
    PointerUtils.pageCoords = { x: e.pageX, y: e.pageY };
    PointerUtils.events.emit('pointerover', e);
    PointerUtils.overCb(e);
    return Promise.resolve(e);
  }

  private static pointerLockChangeFn(e: PointerEvent): Promise<PointerEvent> {

    if (PointerUtils.lockChangePrevent) {
      e.preventDefault();
    }

    if (PointerUtils.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? PointerUtils.isTouch = true : PointerUtils.isTouch = false;

    document.documentElement.releasePointerCapture(e.pointerId);
    PointerUtils.pageCoords = { x: e.pageX, y: e.pageY };
    PointerUtils.events.emit('pointerlockchange', e);
    PointerUtils.lockChangeCb(e);
    return Promise.resolve(e);
  }

  private static pointerLockErrorFn(e: PointerEvent): Promise<PointerEvent> {

    if (PointerUtils.lockErrorPrevent) {
      e.preventDefault();
    }

    if (PointerUtils.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? PointerUtils.isTouch = true : PointerUtils.isTouch = false;

    document.documentElement.releasePointerCapture(e.pointerId);
    PointerUtils.pageCoords = { x: e.pageX, y: e.pageY };
    PointerUtils.events.emit('pointerlockerror', e);
    PointerUtils.lockErrorCb(e);
    return Promise.resolve(e);
  }

  private static pointerContextMenuFn(e: PointerEvent): Promise<PointerEvent> {

    if (PointerUtils.contextMenuPrevent) {
      e.preventDefault();
    }

    if (PointerUtils.ignoredEls.includes(e.target as HTMLElement)) return;

    e.pointerType === 'touch' ? PointerUtils.isTouch = true : PointerUtils.isTouch = false;

    if (e.pointerType != "touch") {
      document.documentElement.releasePointerCapture(e.pointerId);
    }
    PointerUtils.pageCoords = { x: e.pageX, y: e.pageY };
    PointerUtils.events.emit('contextmenu', e);
    PointerUtils.contextMenuCb(e);
    return Promise.resolve(e);
  }

  public static destroy(): void {
    PointerUtils.isHooked = false;
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

  public static getDistance(a: { x: number, y: number }, b: { x: number, y: number }): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }

  public static getAngle(a: { x: number, y: number }, b: { x: number, y: number }): number {
    return Math.atan2(b.y - a.y, b.x - a.x);
  }

  public static getAngleDeg(a: { x: number, y: number }, b: { x: number, y: number }): number {
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

  public static changeEventCoords(e: PointerEvent, pos: { x: number, y: number }): Promise<PointerEvent> {
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
