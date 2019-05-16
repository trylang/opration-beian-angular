import { NgModule } from '@angular/core';
import { StatusPipe } from './status.pipe';
import { MywebsitePipe } from './mywebsite.pipe';

@NgModule({
    imports: [],
    declarations: [StatusPipe, MywebsitePipe],
    exports: [StatusPipe, MywebsitePipe],
})
export class PipeModule {}