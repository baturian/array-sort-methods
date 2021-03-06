export default class AnimationFrames {
    defaultTimeout = 0;
    steps = [];
    lastStepTime = null;

    addStep(fn, context, args, timeout) {
      const funcArgs = args || [];
      this.steps.push({
        func: fn.bind(context, ...funcArgs),
        timeout: timeout || 0,
      });
    }

    startAnimation() {
      if (this.steps.length) {
        this.state = 'start';
        this.lastStepTime = Date.now();
        this.step();
      }
    }

    async step() {
      const timePassed = Date.now() - this.lastStepTime;
      const stepsWithoutTimeout = Math.floor(timePassed / (this.defaultTimeout || 1));
      if (stepsWithoutTimeout > 1) {
        await this.removeTimeoutForSeveralSteps(stepsWithoutTimeout);
      }
      if (this.steps.length) {
        if ((this.steps[0].timeout || this.defaultTimeout) <= timePassed) {
          this.lastStepTime = Date.now();
          const currentStep = this.steps.shift();
          currentStep.func();
        }
        requestAnimationFrame(this.step.bind(this));
      } else {
        this.state = 'stop';
      }
    }

    removeTimeoutForSeveralSteps(count) {
      return new Promise((resolve) => {
        const removedSteps = this.steps.splice(0, count);
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < count; i++) {
          if (removedSteps[i]) {
            removedSteps[i].func();
          }
        }
        resolve();
      });
    }

    stopAnimation() {
      this.state = 'stop';
      this.steps = [];
    }

    setDefaultTimeout(timeout) {
      this.defaultTimeout = timeout || 0;
    }
}
