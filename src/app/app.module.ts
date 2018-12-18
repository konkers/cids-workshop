import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { StorageServiceModule } from 'angular-webstorage-service';
import { NgxIfEmptyOrHasItemsModule } from 'ngx-if-empty-or-has-items';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemComponent } from './item/item.component';
import { ShopsComponent, ShopsDialogComponent } from './shops/shops.component';
import { LocationTrackerComponent } from './location-tracker/location-tracker.component';
import { ShopItemPickerComponent } from './shop-item-picker/shop-item-picker.component';
import { IconComponent } from './icon/icon.component';
import { LocationDetailComponent } from './location-detail/location-detail.component';
import { LocationSummaryComponent } from './location-summary/location-summary.component';
import { PoiComponent } from './poi/poi.component';
import { KeyItemTrackerComponent } from './key-item-tracker/key-item-tracker.component';
import { KeyItemComponent } from './key-item/key-item.component';
import { CharacterTrackerComponent } from './character-tracker/character-tracker.component';
import { CharacterComponent } from './character/character.component';

const appRoutes: Routes = [
  { path: 'loc/:loc', component: LocationDetailComponent },
  { path: 'shop/:loc/:type', component: ShopItemPickerComponent },
  { path: 'items', component: ItemListComponent },
  { path: '**', component: ItemListComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    ItemListComponent,
    ItemComponent,
    ShopsComponent,
    ShopsDialogComponent,
    LocationTrackerComponent,
    ShopItemPickerComponent,
    IconComponent,
    LocationDetailComponent,
    LocationSummaryComponent,
    PoiComponent,
    KeyItemTrackerComponent,
    KeyItemComponent,
    CharacterTrackerComponent,
    CharacterComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    ),

    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    StorageServiceModule,
    FlexLayoutModule,

    DragDropModule,
    NgxIfEmptyOrHasItemsModule,

    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
  ],
  entryComponents: [ShopsDialogComponent],
  providers: [{ provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }],
  bootstrap: [AppComponent]
})
export class AppModule { }
