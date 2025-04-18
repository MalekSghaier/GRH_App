// count-up.directive.ts (version améliorée)
import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[countUp]',
  standalone: true
})
export class CountUpDirective implements OnInit {
  @Input() countUp: number = 0;
  @Input() duration: number = 2;
  @Input() startOnlyWhenVisible: boolean = true;

  private element: HTMLElement;
  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    if (this.startOnlyWhenVisible) {
      this.setupIntersectionObserver();
    } else {
      this.animateCount();
    }
  }

  private setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCount();
          this.observer?.unobserve(this.element);
        }
      });
    }, { threshold: 0.5 });

    this.observer.observe(this.element);
  }

  private animateCount() {
    const start = 0;
    const end = this.countUp;
    const duration = this.duration * 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentValue = Math.floor(progress * end);

      this.element.textContent = currentValue.toString();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}