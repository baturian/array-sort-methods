export default class AsyncQueue {
  constructor() {
    this.current = Promise.resolve(false);
    this.stop = false;
    this.timeout = 200;
  }

  addJobToQueue(fn, force) {
    this.stop = force ? false : this.stop;

    this.current = this.current.then(() => new Promise((resolve) => {
      setTimeout(() => {
        if (!this.stop) fn();
        else this.stopJobs();
        resolve();
      }, this.timeout);
    }));
  }

  stopJobs() {
    this.stop = true;
    this.current = Promise.resolve(false);
  }

  unblockJobs() {
    this.stop = false;
  }
}
