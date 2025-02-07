import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-oauth-button',
  standalone: true,
  imports: [CommonModule, TuiButton],
  host: { class: 'w-full' },
  template: `
    <button
      tuiButton
      appearance="outline"
      class="w-full !justify-start"
      tuiAppearanceMode="checked"
    >
      <div class="bg-white p-2 rounded-full">
        <img class="w-4 {{ imgClass }}" [src]="assetSrc" [alt]="alt ?? title" />
      </div>
      <span class="ml-4">{{ title }}</span>
    </button>
  `,
})
export class OAuthButtonComponent {
  @Input() title: string;
  @Input() imgClass?: string;
  @Input() alt?: string;
  @Input() assetSrc: string;
}
