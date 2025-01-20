import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AssetSrcDirective } from '../directives';
import { SystemUrl } from '../services/system-url.service';

@Component({
  selector: 'bad-request-error',
  standalone: true,
  imports: [CommonModule, AssetSrcDirective],
  template: `
    <div class="py-32 mx-auto px-6 max-w-2xl flex flex-col md:flex-row items-center">
      <main class="flex flex-1 flex-col justify-center space-y-3">
        <a [href]="homeUrl"><img assetSrc="images/logos/wordmark.svg" alt="Logo" /></a>
        <h1 class="text-lg">400. That’s an error.</h1>
        <p>
          The server cannot process the request because it is malformed. It should not be retried.
          That’s all we know.
        </p>
      </main>
      <aside class="hidden md:block">
        <img assetSrc="images/errors/400.svg" alt="Logo" />
      </aside>
    </div>
  `,
})
export class BadRequestComponent {
  readonly homeUrl;

  constructor(
    private systemUrl: SystemUrl,
    private titleService: Title
  ) {
    this.homeUrl = this.systemUrl.HomeSiteBaseURL;
    this.titleService.setTitle('Error 400 - Bad Request');
  }
}
