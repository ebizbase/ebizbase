import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { DOMAIN_COMPONENTS, EbbDomain } from '@ebizbase/angular-domain';

@Directive({ selector: '[ebbAssetBg]' })
export class EbbAssetBg implements OnChanges {
  @Input() ebbAssetBg?: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private domain: EbbDomain
  ) {}

  ngOnChanges() {
    if (this.ebbAssetBg) {
      const imgElement = this.el.nativeElement as HTMLElement;
      // Remove the leading "/" if present
      const path = this.ebbAssetBg.startsWith('/') ? this.ebbAssetBg.slice(1) : this.ebbAssetBg;
      // Create the full path
      const fullPath = `${this.domain.getUrl(DOMAIN_COMPONENTS.ASSET)}/${path}`;
      // Set the attribute for the element
      this.renderer.setStyle(imgElement, 'background-image', `url('${fullPath}')`);
    }
  }
}
