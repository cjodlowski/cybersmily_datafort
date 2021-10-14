import { CommonUiModule } from './shared/modules/common-ui/common-ui.module';
import { HttpClientModule } from '@angular/common/http';
import { ApphomeModule } from './apphome/apphome.module';
import { NpcProfileModalComponent } from './shared/modules/npcs/npcProfileModal/npcprofilemodal.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule, AppBootstrapModule } from './shared/modules';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SaveFileService, DataService } from './shared/services/file-services';
import { PipesModule } from './shared/pipes/pipes.module';
@NgModule({
  declarations: [
    AppComponent
    ,NpcProfileModalComponent
  ],
  imports: [
    AppBootstrapModule,
    CommonUiModule,
    SharedModule,
    HttpClientModule,
    ApphomeModule,
    PipesModule,
    AppRoutingModule /* Keep last as it is important for routing */
  ],
  entryComponents: [NpcProfileModalComponent],
  providers: [
    DataService,
    SaveFileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
