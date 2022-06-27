import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { ImportFileModalComponent } from './components/import-file-modal/import-file-modal.component';

@NgModule({
  declarations: [HomeComponent, ImportFileModalComponent],
  imports: [SharedModule, HomeRoutingModule],
})
export class HomeModule {}
