import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, TemplateRef } from '@angular/core';
import { NgxPicaModule, NgxPicaService } from '@digitalascetic/ngx-pica';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxPicaModule, ImageCropperComponent],
  host: { class: 'flex flex-col items-center' },
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
export class ChangeAvatarDialogComponent {
  private readonly dialogs = inject(TuiDialogService);

  imageChangedEvent: Event | null = null;
  croppedImage = ''; // base64
  canvasRotation = 0; // Dùng thay cho transform.rotate

  private ngxPicaService: NgxPicaService = inject(NgxPicaService);
  private http: HttpClient = inject(HttpClient);

  protected showDialog(content: TemplateRef<TuiDialogContext>): void {
    this.dialogs.open(content, { dismissible: true }).subscribe();
  }

  fileChangeEvent(event: Event): void {
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
      console.log(response);
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
