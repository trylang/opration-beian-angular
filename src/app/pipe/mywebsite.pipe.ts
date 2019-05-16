import { Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'mywebsite'})
export class MywebsitePipe implements PipeTransform {
  transform(websites: any[]) {
    return websites.filter(website => website.icpWebsiteStatus != 1);
  }
}