export default class TimedOutBehaivor {
  constructor(timeout) {
    this.job = null;
    this.timeout = timeout || 200;
  }

  comlpete(fn, context, args) {
    const funcArgs = args || [];
    this.job = {
      fn: fn.bind(context, ...funcArgs),
      id: this.constructor.generateUID(),
    };
    this.fn = fn;
    this.refreshTimer();
  }

  // eslint-disable-next-line class-methods-use-this
  static generateUID() {
    const id = `f${(+Date.now()).toString(16)}`;
    return id;
  }

  refreshTimer() {
    if (this.timeOutId) {
      clearTimeout(this.timeOutId);
      this.timeOutId = null;
    }
    this.timeOutId = setTimeout(() => {
      if (this.job) {
        this.job.fn();
      }
    }, this.timeout);
  }
}
