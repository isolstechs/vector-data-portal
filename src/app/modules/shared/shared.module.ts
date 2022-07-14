import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialImportsModule } from './angular-material-imports.module';
import { CustomDateRangeMenuComponent } from './components/custom-date-range-menu/custom-date-range-menu.component';
import { DateRangeCalendarComponent } from './components/custom-date-range-menu/date-range-calendar/date-range-calendar.component';
import { DateRangeCalendarHeaderComponent } from './components/custom-date-range-menu/date-range-calendar/date-range-calendar-header/date-range-calendar-header.component';
import { ImportFileModalComponent } from './components/import-file-modal/import-file-modal.component';
import { ChartModule } from 'primeng/chart';
import { SharedService } from './services/shared.service';
import { ExportFileModalComponent } from './components/export-file-modal/export-file-modal.component';
import { ImportPrefixFileModalComponent } from './components/import-prefix-file-modal/import-prefix-file-modal.component';

@NgModule({
  declarations: [
    CustomDateRangeMenuComponent,
    DateRangeCalendarComponent,
    DateRangeCalendarHeaderComponent,
    ImportPrefixFileModalComponent,
    ImportFileModalComponent,
    ExportFileModalComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialImportsModule,
    ChartModule,
  ],
  providers: [SharedService],
  exports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialImportsModule,
    CustomDateRangeMenuComponent,
    ChartModule,
  ],
})
export class SharedModule {}
