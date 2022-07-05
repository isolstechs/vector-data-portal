import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HeaderComponent } from './header/header.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { WorldMapComponent } from './world-map/world-map.component';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    SideBarComponent,
    WorldMapComponent,
  ],
  imports: [SharedModule, HomeRoutingModule],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class HomeModule {}
