import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialImportsModule } from './angular-material-imports.module';
import { CustomDateRangeMenuComponent } from './components/custom-date-range-menu/custom-date-range-menu.component';
import { DateRangeCalendarComponent } from './components/custom-date-range-menu/date-range-calendar/date-range-calendar.component';
import { DateRangeCalendarHeaderComponent } from './components/custom-date-range-menu/date-range-calendar/date-range-calendar-header/date-range-calendar-header.component';
import { ImportCallRecordsFileModalComponent } from './components/import-call-records-file-modal/import-call-records-file-modal.component';
import { ChartModule } from 'primeng/chart';
import { SharedService } from './services/shared.service';
import { ExportFileModalComponent } from './components/export-file-modal/export-file-modal.component';
import { ImportPrefixFileModalComponent } from './components/import-prefix-file-modal/import-prefix-file-modal.component';
import { CountryListModalComponent } from './components/country-list-modal/country-list-modal.component';

@NgModule({
  declarations: [
    CustomDateRangeMenuComponent,
    DateRangeCalendarComponent,
    DateRangeCalendarHeaderComponent,
    ImportPrefixFileModalComponent,
    ImportCallRecordsFileModalComponent,
    ExportFileModalComponent,
    CountryListModalComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialImportsModule,
    ChartModule,
    NgScrollbarModule,
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
    NgScrollbarModule,
  ],
})
export class SharedModule {}
