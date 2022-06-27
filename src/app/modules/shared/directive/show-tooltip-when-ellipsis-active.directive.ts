import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appShowTooltipWhenEllipsisActive]',
})
export class ShowTooltipWhenEllipsisActiveDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      console.log('in ellipsis directive');
      const element = this.elementRef.nativeElement;
      if (element.offsetWidth < element.scrollWidth) {
        element.title = element.innerHTML;
      }
    }, 500);
  }
}