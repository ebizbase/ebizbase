import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { NgxPicaModule, NgxPicaService } from '@digitalascetic/ngx-pica';
import { EbbAppService } from '@ebizbase/angular-app';
import { EcommaSite } from '@ebizbase/angular-common';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-change-avatar',
  standalone: true,
  imports: [CommonModule, NgxPicaModule, ImageCropperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host ::ng-deep .cropper-container {
        position: relative;
        width: 100%;
        max-width: 300px;
        margin: auto;
      }

      :host ::ng-deep .cropper-mask {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        max-width: 256px;
        max-height: 256px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.7);
        box-shadow: 0 0 0 10000px rgba(0, 0, 0, 0.5);
        pointer-events: none;
      }
    `,
  ],
  host: {
    class: 'flex flex-col items-center',
  },
  template: `
    <input type="file" (change)="fileChangeEvent($event)" accept="image/*" />
    <div class="w-64">
      <image-cropper
        [imageChangedEvent]="imageChangedEvent"
        [maintainAspectRatio]="true"
        [aspectRatio]="1"
        [canvasRotation]="canvasRotation"
        format="png"
        (imageCropped)="imageCropped($event)"
      >
      </image-cropper>
    </div>
    <button (click)="rotateLeft()">⟲ Rotate Left</button>
    <button (click)="rotateRight()">⟳ Rotate Right</button>
    <button (click)="uploadImage()">Upload</button>
  `,
})
export class ChangeAvatarComponent {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0; // Dùng thay cho transform.rotate
  @Output() imageUploaded = new EventEmitter<string>();

  constructor(
    private site: EcommaSite,
    private app: EbbAppService,
    private ngxPicaService: NgxPicaService,
    private http: HttpClient
  ) {
    this.site.title = 'Change Avatar';
    this.app.pageInfo = {
      contentSize: 'xs',
      heading: { title: 'Change Avatar', previous: '/personal-info/avatar' },
    };
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.canvasRotation = 0; // Reset xoay khi chọn ảnh mới
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  rotateLeft() {
    this.canvasRotation = (this.canvasRotation - 1) % 4; // Giảm 90 độ
  }

  rotateRight() {
    this.canvasRotation = (this.canvasRotation + 1) % 4; // Tăng 90 độ
  }

  async uploadImage() {
    if (!this.croppedImage) {
      return;
    }

    const file = await this.base64ToFile(this.croppedImage, 'avatar.png');
    const compressedFile = await this.compressImage(file);

    const formData = new FormData();
    formData.append('file', compressedFile);

    this.http.post<{ url: string }>('/api/upload-avatar', formData).subscribe((response) => {
      this.imageUploaded.emit(response.url);
    });
  }

  private base64ToFile(base64: string, filename: string): Promise<File> {
    return fetch(base64)
      .then((res) => res.blob())
      .then((blob) => new File([blob], filename, { type: 'image/png' }));
  }

  private async compressImage(file: File): Promise<File> {
    return this.ngxPicaService.resizeImage(file, 256, 256).toPromise() as Promise<File>;
  }
}
