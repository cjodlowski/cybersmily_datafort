import { ArmorRandomGenSettingsService } from './../services/armor-random-gen-settings/armor-random-gen-settings.service';
import { ArmorGeneratorService } from './../services/armor-generator/armor-generator.service';
import { ArmorCostCalculatorService,
  ArmorDataAttributesService } from './../services';

import { DiceService } from './../../../services/dice/dice.service';
import { faDice, faRedo } from '@fortawesome/free-solid-svg-icons';

import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Cp2020ArmorPiece, ArmorSpChartEntry, Cp2020ArmorAttributeLists, PieceOfClothing, ArmorOption, CP2020ArmorRandomSettings } from './../models';

@Component({
  selector: 'cs-cp2020-armor-detail',
  templateUrl: './cp2020-armor-detail.component.html',
  styleUrls: ['./cp2020-armor-detail.component.css']
})
export class Cp2020ArmorDetailComponent implements OnInit, OnChanges {
  faDice = faDice;
  faRedo = faRedo;

  currArmor = new Cp2020ArmorPiece();
  armorAttributes = new Cp2020ArmorAttributeLists();
  spValues = new Array<ArmorSpChartEntry>();

  selectedClothing: PieceOfClothing;
  selectedQuality: ArmorOption;
  selectedStyle: ArmorOption;
  settings = new CP2020ArmorRandomSettings();

  // piece of clothes
  @Input()
  armor = new Cp2020ArmorPiece();

  @Output()
  change = new EventEmitter<Cp2020ArmorPiece>();

  get selectedSP(): ArmorSpChartEntry {
    return this.spValues.filter(sp => sp.sp === this.currArmor.baseSP)[0];
  }

  set selectedSP(value: ArmorSpChartEntry) {
    this.currArmor.baseSP = value.sp;
    this.setLocationSP();
    this.currArmor.ev = value.ev[this.currArmor.clothes.wt] ?? 0;
    console.log('changeSP', this.currArmor);
    this.update();
  }

  constructor(private dice: DiceService,
    private armorDataAttributesService: ArmorDataAttributesService,
    private costCalculatorService: ArmorCostCalculatorService,
    private armorGeneratorService: ArmorGeneratorService,
    private randomSettings: ArmorRandomGenSettingsService
    ) { }

  ngOnInit() {
    this.currArmor = new Cp2020ArmorPiece(this.armor);
    this.armorDataAttributesService.getData()
    .subscribe( data => {
      this.armorAttributes = new Cp2020ArmorAttributeLists(data);
      this.setSelected();
    });
    this.randomSettings.settings.subscribe( settings => {
      this.settings = settings;
    });
  }

  ngOnChanges() {
    this.currArmor = new Cp2020ArmorPiece(this.armor);
    this.setSelected();
  }

  getOptionValue(optionName: string) {
    return this.currArmor.options.some(opt => opt.name === optionName);
  }

  changeClothing() {
    this.currArmor.clothes = this.selectedClothing;
    this.spValues = this.armorAttributes.armorChart.filter( sp => sp.mod[this.currArmor.clothes.wt] !== undefined);
    if(this.currArmor.name === '') {
      this.currArmor.name = this.currArmor.clothes.name;
    }
    this.setLocationSP();
    this.update();
  }

  changeOption(event, option: ArmorOption) {
    const index = this.currArmor.options.findIndex(opt => opt.name === option.name);
    if (index > -1 && !event.target.checked) {
      this.currArmor.options.splice(index, 1);
    } else if(event.target.checked){
      this.currArmor.options.push(option);
    }
    this.update();
  }

 refresh() {
   this.currArmor = new Cp2020ArmorPiece();
   this.setSelected();
   this.update();
 }


  generate() {
    this.currArmor = this.armorGeneratorService.generate(this.settings, this.dice, this.armorAttributes);
    this.setSelected();

    this.spValues = this.armorAttributes.armorChart.filter( sp => sp.mod[this.currArmor.clothes.wt] !== undefined);
     this.update();
  }

  update() {
    this.currArmor.style = this.selectedStyle;
    this.currArmor.quality = this.selectedQuality;
    this.currArmor.cost = this.costCalculatorService.calculateCost(this.currArmor, this.armorAttributes.armorChart);
    this.change.emit(this.currArmor);
  }

  private setSelected() {
    this.selectedClothing = this.armorAttributes.clothes.find(cloth => cloth.name === this.currArmor.clothes.name);
    this.selectedQuality = this.armorAttributes.qualities.find(quality => quality.name === this.currArmor.quality.name);
    this.selectedStyle = this.armorAttributes.styles.find(style => style.name === this.currArmor.style.name);
  }

  private setLocationSP() {
    if(this.currArmor.clothes.loc.includes('head')) {
      this.currArmor.locations.head = this.currArmor.baseSP;
    } else {
      delete this.currArmor.locations.head;
    }

    if(this.currArmor.clothes.loc.includes('torso')) {
      this.currArmor.locations.torso = this.currArmor.baseSP;
    } else {
      delete this.currArmor.locations.torso;
    }

    if(this.currArmor.clothes.loc.includes('arm')) {
      this.currArmor.locations.rarm = this.currArmor.baseSP;
      this.currArmor.locations.larm = this.currArmor.baseSP;
    } else {
      delete this.currArmor.locations.rarm;
      delete this.currArmor.locations.larm;
    }

    if(this.currArmor.clothes.loc.includes('leg')) {
      this.currArmor.locations.rleg = this.currArmor.baseSP;
      this.currArmor.locations.lleg = this.currArmor.baseSP;
    } else {
      delete this.currArmor.locations.rleg;
      delete this.currArmor.locations.lleg;
    }
  }

}
