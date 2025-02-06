import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { DOMAIN_COMPONENTS, EbbDomain } from '@ebizbase/angular-domain';

@Directive({ selector: '[ebbAssetSrc]' })
export class AssetSrcDirective implements OnChanges {
  @Input() ebbAssetSrc!: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private domain: EbbDomain
  ) {}

  ngOnChanges() {
    if (this.ebbAssetSrc) {
      const imgElement = this.el.nativeElement as HTMLElement;
      // Remove the leading "/" if present
      const path = this.ebbAssetSrc.startsWith('/') ? this.ebbAssetSrc.slice(1) : this.ebbAssetSrc;
      // Create the full path
      const fullPath = `${this.domain.getUrl(DOMAIN_COMPONENTS.ASSET)}/${path}`;
      // Set the attribute for the element
      this.renderer.setAttribute(imgElement, 'src', fullPath);
    }
  }
}
