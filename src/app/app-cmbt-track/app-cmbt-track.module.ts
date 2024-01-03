import { CmbtTrckThreatLevelService } from './services/cmbt-trck-threat-level.service';
import { Cp2020CyberwareModule } from './../shared/cp2020/cp2020-cyberware/cp2020-cyberware.module';
import { Cp2020ArmorModule } from './../shared/cp2020/cp2020-armor/cp2020-armor.module';
import { Cp2020WoundsModule } from './../shared/cp2020/cp2020wounds/cp2020wounds.module';
import { Cp2020StatsModule } from './../shared/cp2020/cp2020-stats/cp2020-stats.module';
import { Cp2020weaponsModule } from './../shared/cp2020/cp2020weapons/cp2020weapons.module';
import { CmbtTrckOppChartService } from './services/cmbt-trck-opp-chart.service';
import { CommonUiModule } from './../shared/modules/common-ui/common-ui.module';
import { PipesModule } from './../shared/pipes/pipes.module';
import { Cp2020RolesDataService } from './../shared/cp2020/cp2020-role/services/cp2020-roles-data.service';
import { CombatTrackerService } from './services/combat-tracker.service';
import { SkillListService } from './../shared/cp2020/cp2020-skills/services';
import { OpponentTrackerService } from './services/opponent-tracker.service';
import { DiceService } from './../shared/services/dice/dice.service';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCmbtTrackRoutingModule } from './app-cmbt-track-routing.module';
import { CmbtTrckFormComponent } from './cmbt-trck-form/cmbt-trck-form.component';
import { CmbtTrckOpponentCardComponent } from './cmbt-trck-opponent-card/cmbt-trck-opponent-card.component';
import { CmbtTrkCyberComponent } from './cmbt-trk-cyber/cmbt-trk-cyber.component';
import { CmbtTrckMainComponent } from './cmbt-trck-main/cmbt-trck-main.component';
import { CmbtTrckInstructionsComponent } from './cmbt-trck-instructions/cmbt-trck-instructions.component';
import { CmbtTrckGearComponent } from './cmbt-trck-gear/cmbt-trck-gear.component';
import { Cp2020SkillsModule } from '../shared/cp2020/cp2020-skills/cp2020-skills.module';

@NgModule({
  declarations: [
    CmbtTrckFormComponent,
    CmbtTrckOpponentCardComponent,
    CmbtTrkCyberComponent,
    CmbtTrckMainComponent,
    CmbtTrckInstructionsComponent,
    CmbtTrckGearComponent
  ],
  imports: [
    CommonUiModule,
    CommonModule,
    PipesModule,
    AppCmbtTrackRoutingModule,
    Cp2020weaponsModule,
    Cp2020StatsModule,
    Cp2020WoundsModule,
    Cp2020ArmorModule,
    Cp2020SkillsModule,
    Cp2020CyberwareModule
  ],
  providers: [
    DiceService,
    OpponentTrackerService,
    CmbtTrckOppChartService,
    CombatTrackerService,
    SkillListService,
    Cp2020RolesDataService,
    CmbtTrckThreatLevelService
  ]
})
export class AppCmbtTrackModule { }
