import { MatButtonModule } from '@angular/material/button';
import { Component, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule

@Component({
  standalone: true,
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css'],
  imports: [MatDialogModule, NgIf, MatButtonModule,MatIconModule],
})
export class ImageModalComponent {
  zoomLevel: number = 1;
  isPanning: boolean = false;
  startX: number = 0;
  startY: number = 0;
  translateX: number = 0;
  translateY: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }
  ) { }

  // Scroll wheel for zoom
  @HostListener('wheel', ['$event'])
  onWheelScroll(event: WheelEvent) {
    event.preventDefault();
    if (event.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  zoomIn() {
    this.zoomLevel = Math.min(5, this.zoomLevel + 0.1); // Max zoom level 5
  }

  zoomOut() {
    this.zoomLevel = Math.max(1, this.zoomLevel - 0.1); // Min zoom level 1
  }
  // Mouse down event to start panning
  onMouseDown(event: MouseEvent) {
    if (this.zoomLevel > 1) {
      this.isPanning = true;
      this.startX = event.clientX - this.translateX;
      this.startY = event.clientY - this.translateY;
      event.preventDefault(); // Prevent default actions like text selection
    }
  }

  // Mouse move event to pan the image
  onMouseMove(event: MouseEvent) {
    if (this.isPanning) {
      this.translateX = event.clientX - this.startX;
      this.translateY = event.clientY - this.startY;
    }
  }

  // Mouse up event to stop panning
  onMouseUp() {
    this.isPanning = false;
  }

  close() {
    this.dialogRef.close();
  }
}