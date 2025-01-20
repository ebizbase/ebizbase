import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AssetSrcDirective } from '../directives';
import { SystemUrl } from '../services/system-url.service';

@Component({
  selector: 'not-found-error',
  standalone: true,
  imports: [CommonModule, AssetSrcDirective],
  template: `
    <div class="py-32 mx-auto px-6 max-w-2xl flex flex-col md:flex-row items-center">
      <main class="flex flex-1 flex-col justify-center space-y-3">
        <a [href]="homeUrl"><img assetSrc="images/logos/wordmark.svg" alt="Logo" /></a>
        <h1 class="text-lg">404. That’s an error.</h1>
        <p>The requested URL was not found on this server. That's all we know.</p>
      </main>
      <aside class="hidden md:block">
        <img assetSrc="images/errors/404.svg" alt="Logo" />
      </aside>
    </div>
  `,
})
export class NotFoundComponent {
  readonly homeUrl;
  constructor(
    private systemUrl: SystemUrl,
    private titleService: Title
  ) {
    this.homeUrl = this.systemUrl.HomeSiteBaseURL;
    this.titleService.setTitle('Error 404 - Not Found');
  }
}
