import { SaveFileService } from '../../../../services/file-services/save-file/save-file.service';
import { FileLoaderService } from '../../../../services/file-services/file-loader/file-loader.service';
import { ACPAEnclosure } from '../../enums/acpa-enclossure';
import { Cp2020ACPAWeapon } from '../../models/cp2020-acpa-weapon';
import {
  faPlus,
  faTrash,
  faFilePdf,
  faRedo,
  faFile,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { Cp2020ACPAComponent } from '../../models/cp2020-acpa-component';
import { Cp2020AcpaArmor } from '../../models/cp2020-acpa-armor';
import { Cp2020ACPAChassis } from '../../models/cp2020-acpa-chassis';
import { Cp2020ACPABuilderService } from '../../services/cp2020-acpa-builder/cp2020-acpa-builder.service';
import { Cp2020ACPA, ACPA } from '../../models';
import { Cp2020ACPADataAttributesService } from '../../services/cp2020-acpa-data-attrbutes/cp2020-acpa-data-attributes.service';
import { AcpaAttributeData } from '../../models/acpa-attribute-data';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'cs-cp2020-acpa-form',
  templateUrl: './cp2020-acpa-form.component.html',
  styleUrls: ['./cp2020-acpa-form.component.css'],
})
export class Cp2020AcpaFormComponent implements OnInit {
  faPlus = faPlus;
  faTrash = faTrash;
  faRedo = faRedo;

  modalRef: BsModalRef;
  config = {
    keyboard: true,
    class: 'modal-dialog-centered modal-lg',
  };

  attributeData: AcpaAttributeData = {
    chassis: [],
    armor: [],
    realityInterfaces: [],
    controlSystems: [],
    components: [],
    weapons: [],
  };

  currACPA = new Cp2020ACPA();
  selectedName = '';
  selectedManufacturer = '';
  selectedNote = '';
  selectedChassis = new Cp2020ACPAChassis();
  selectedArmor = new Cp2020AcpaArmor();
  selectedInterface = new Cp2020ACPAComponent();
  selectedControl = new Cp2020ACPAComponent();
  selectedTroopSize = 0;
  selectedComponentCat = 'x';
  selectedComponent = new Cp2020ACPAComponent();
  selectedWeaponCat = 'x';
  selectedLocation = '';
  availableSpaces = 0;
  selectedEnclosure: ACPAEnclosure = ACPAEnclosure.internal;

  get filteredArmor(): Array<Cp2020AcpaArmor> {
    return this.attributeData.armor.filter(
      (armor) => armor.sp < this.selectedChassis?.str * 2
    );
  }

  installableComponents = new Array<Cp2020ACPAComponent>();
  installableWeapons = new Array<Cp2020ACPAWeapon>();

  get isDisabled(): boolean {
    return this.currACPA.chassis.str < 10;
  }

  get equipmentColumnOne(): Array<Cp2020ACPAComponent | Cp2020ACPAWeapon> {
    const count = Math.ceil(this.currACPA.equipment.length / 2);
    return this.currACPA.equipment.slice(0, count);
  }

  get equipmentColumnTwo(): Array<Cp2020ACPAComponent | Cp2020ACPAWeapon> {
    const count = Math.ceil(this.currACPA.equipment.length / 2);
    return this.currACPA.equipment.slice(count);
  }

  constructor(
    private attributesService: Cp2020ACPADataAttributesService,
    private acpaBuilderService: Cp2020ACPABuilderService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.attributesService.getData().subscribe((data) => {
      this.attributeData = data;
      this.acpaBuilderService.acpa.subscribe((acpa: ACPA) => {
        this.currACPA = new Cp2020ACPA(acpa);
        const index = this.attributeData.chassis.findIndex(
          (chassis) =>
            this.currACPA.chassis?.str === chassis?.str &&
            this.currACPA.chassis?.name === chassis?.name
        );
        this.selectedChassis = this.attributeData.chassis[index];
        this.selectedArmor = this.attributeData.armor.find(
          (armor) => armor.sp === this.currACPA.armor.sp
        );
        this.selectedInterface = this.attributeData.realityInterfaces.find(
          (intrfc) => intrfc.name === this.currACPA.realityInterface.name
        );
        this.selectedControl = this.attributeData.controlSystems.find(
          (control) => control.name === this.currACPA.controlSystem.name
        );
        this.selectedTroopSize = acpa.trooperSize;
        this.selectedManufacturer = acpa.manufacturer;
        this.selectedName = acpa.name;
        this.selectedNote = acpa.notes;
      });
    });
  }

  updateChassis() {
    this.acpaBuilderService.updateChassis(this.selectedChassis);
  }

  updateArmor() {
    this.acpaBuilderService.updateArmor(this.selectedArmor);
  }

  updateInterface() {
    this.acpaBuilderService.updateInterface(this.selectedInterface);
  }
  updateControl() {
    this.acpaBuilderService.updateControlSystem(this.selectedControl);
  }

  updateTroopSize() {
    this.acpaBuilderService.updateTroopSize(this.selectedTroopSize);
  }

  showInternalComponent(
    location: string,
    availableSpaces: number,
    template: TemplateRef<any>
  ) {
    this.installableComponents = this.attributeData.components.filter(
      (item) => item.spaces > 0 && item.spaces <= availableSpaces * 4
    );
    this.installableWeapons = this.attributeData.weapons.filter(
      (item) => item.spaces > 0 && item.spaces <= availableSpaces * 4
    );
    this.showEquipment(
      location,
      availableSpaces,
      ACPAEnclosure.internal,
      template
    );
  }

  showExternalComponent(
    location: string,
    availableSpaces: number,
    template: TemplateRef<any>
  ) {
    this.installableComponents = this.attributeData.components.filter(
      (item) => item.spaces > 0 && item.spaces <= availableSpaces * 4
    );
    this.installableWeapons = this.attributeData.weapons.filter(
      (item) => item.spaces > 0 && item.spaces <= availableSpaces * 4
    );
    this.showEquipment(
      location,
      availableSpaces,
      ACPAEnclosure.external,
      template
    );
  }

  showCarriedComponent(
    location: string,
    availableSpaces: number,
    template: TemplateRef<any>
  ) {
    this.installableComponents = this.attributeData.components.filter(
      (item) => item.spaces === 0
    );
    this.installableWeapons = this.attributeData.weapons;
    this.showEquipment(
      location,
      availableSpaces,
      ACPAEnclosure.carried,
      template
    );
  }

  showEquipment(
    location: string,
    availableSpaces: number,
    enclosure: ACPAEnclosure,
    template: TemplateRef<any>
  ) {
    this.selectedEnclosure = enclosure;
    this.selectedLocation = location?.toLocaleLowerCase();
    this.availableSpaces = availableSpaces * 4;
    this.showModal(template);
  }

  addEquipment(equip: Cp2020ACPAWeapon | Cp2020ACPAComponent) {
    const type = this.selectedEnclosure;
    this.acpaBuilderService.addEquipment(this.selectedLocation, type, equip);
    this.modalRef.hide();
  }
  removeInternalComponent(
    location: string,
    equip: Cp2020ACPAWeapon | Cp2020ACPAComponent
  ) {
    this.removeComponent(location, ACPAEnclosure.internal, equip);
  }

  removeExternalComponent(
    location: string,
    equip: Cp2020ACPAWeapon | Cp2020ACPAComponent
  ) {
    this.removeComponent(location, ACPAEnclosure.external, equip);
  }

  removeCarriedComponent(index: number) {
    this.acpaBuilderService.removeCarriedEquipment(index);
  }

  removeComponent(
    location: string,
    type: ACPAEnclosure,
    equip: Cp2020ACPAWeapon | Cp2020ACPAComponent
  ) {
    this.acpaBuilderService.removeEquipment(
      location.toLowerCase().replace(' ', ''),
      type,
      equip
    );
  }

  updateName() {
    this.acpaBuilderService.updateName(this.selectedName);
  }

  updateManufacturer() {
    this.acpaBuilderService.updateManufacturer(this.selectedManufacturer);
  }

  updateLocations() {
    this.acpaBuilderService.setLocations(this.currACPA, this.currACPA.chassis);
  }

  updateNote() {
    this.acpaBuilderService.updateNote(this.selectedNote);
  }

  toggleWad() {
    this.acpaBuilderService.toggleWad();
  }

  updateMA() {
    this.acpaBuilderService.updateMA(this.currACPA.ma);
  }

  reset() {
    this.acpaBuilderService.update(new Cp2020ACPA());
  }

  showModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  showLocationChoice(
    component: Cp2020ACPAComponent,
    template: TemplateRef<any>
  ) {
    this.selectedComponent = component;
    this.showModal(template);
  }

  getWeight(wt: number): number {
    return this.acpaBuilderService.calculateItemWeight(wt);
  }

  getHands(locations: string): string {
    if (!locations || !locations.includes('handed')) {
      return '';
    }
    return locations.split('|').filter((loc) => loc.includes('handed'))[0];
  }
  getLocations(locations: string): Array<string> {
    const loc = [];
    if (locations === null) {
      return loc;
    }
    if (locations.includes('head') || locations.includes('any')) {
      loc.push('head');
    }
    if (locations.includes('torso') || locations.includes('any')) {
      loc.push('torso');
    }
    if (locations.includes('arms') || locations.includes('any')) {
      loc.push('r arm');
      loc.push('l arm');
    }
    if (locations.includes('legs') || locations.includes('any')) {
      loc.push('r leg');
      loc.push('l leg');
    }
    return loc;
  }

  nameIsCollection(name: string): boolean {
    return name?.startsWith('(');
  }
}
