import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { SystemUrl } from '../services/system-url.service';

@Directive({
  selector: '[assetSrc]',
})
export class AssetSrcDirective implements OnChanges {
  @Input() assetSrc!: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private systemUrl: SystemUrl
  ) {}

  ngOnChanges() {
    const imgElement = this.el.nativeElement as HTMLElement;
    // Remove the leading "/" if present
    const path = this.assetSrc.startsWith('/') ? this.assetSrc.slice(1) : this.assetSrc;
    // Create the full path
    const fullPath = `${this.systemUrl.AssetsBaseURL}/${path}`;
    // Set the attribute for the element
    this.renderer.setAttribute(imgElement, 'src', fullPath);
  }
}
