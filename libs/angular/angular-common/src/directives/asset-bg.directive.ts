import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { SystemUrl } from '../services/system-url.service';

@Directive({
  selector: '[assetBg]',
})
export class AssetBgDirective implements OnChanges {
  @Input() assetBg!: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private systemUrl: SystemUrl
  ) {}

  ngOnChanges() {
    const imgElement = this.el.nativeElement as HTMLElement;
    // Remove the leading "/" if present
    const path = this.assetBg.startsWith('/') ? this.assetBg.slice(1) : this.assetBg;
    // Create the full path
    const fullPath = `${this.systemUrl.AssetsBaseURL}/${path}`;
    // Set the attribute for the element
    this.renderer.setStyle(imgElement, 'background-image', `url('${fullPath}')`);
  }
}
