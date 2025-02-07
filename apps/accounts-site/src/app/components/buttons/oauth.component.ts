import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-oauth-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-2 rounded-full">
      <img [class]="imgClass" [src]="assetSrc" [alt]="alt ?? title" />
    </div>
    <span class="ml-4">
      {{ title }}
    </span>
  `,
})
export class OAuthButtonComponent {
  @Input() title: string;
  @Input() alt?: string;
  @Input() imgClass?: string;
  @Input() assetSrc: string;
}
