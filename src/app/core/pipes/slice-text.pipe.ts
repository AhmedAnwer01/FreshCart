import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sliceText',
  standalone: true
})
export class SliceTextPipe implements PipeTransform {

  transform(text: string, wordCount: number): string {
    return text.split(" ", wordCount).join(" ");
  }

}
