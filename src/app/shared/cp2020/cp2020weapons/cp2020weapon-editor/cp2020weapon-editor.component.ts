import { Cp2020WeaponMagazine } from './../models/cp-2020-weapon-magazine';
import { CpPlayerWeaponOption } from './../models/cp-player-weapon-option';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { faSave, faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CpPlayerWeapon, WeaponProperties } from './../models';
import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';

@Component({
  selector: 'cs-cp2020weapon-editor',
  templateUrl: './cp2020weapon-editor.component.html',
  styleUrls: ['./cp2020weapon-editor.component.css'],
})
export class Cp2020weaponEditorComponent implements OnInit {
  faSave = faSave;
  faPen = faPen;
  faPlus = faPlus;
  faTrash = faTrash;

  weaponTypes = WeaponProperties.types;
  availabilities = WeaponProperties.availabilities;
  concealments = WeaponProperties.concealments;
  reliabilites = WeaponProperties.reliabilites;
  newWeapon: CpPlayerWeapon;
  modalRef: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: 'modal-dialog-centered modal-lg'
  };

  newMagMultiplier: number =1;
  newMagType: number = 5;
  newMagSubtype: string = '';

  get newMagCost(): number {
    return this.newWeapon.shots * this.newMagMultiplier * this.newMagType;
  }

  @Input()
  weapon: CpPlayerWeapon = new CpPlayerWeapon();

  @Output()
  updateWeapon: EventEmitter<CpPlayerWeapon> = new EventEmitter<
    CpPlayerWeapon
  >();

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
    this.newWeapon = new CpPlayerWeapon(this.weapon);
  }

  update() {
    if (this.newWeapon.name && this.newWeapon.name !== '') {
      this.updateWeapon.emit(this.newWeapon);
      this.newWeapon = new CpPlayerWeapon();
    }
  }

  updateOptions(options: Array<CpPlayerWeaponOption>){
    this.newWeapon.options = new Array(...options);
  }

  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  closeModal() {
    this.modalRef.hide();
  }

  addMagazine() {
    const mag = {
      ammo: this.weapon.ammo,
      used: 0,
      capacity: (this.weapon.shots * this.newMagMultiplier),
      cost: this.newMagCost,
      multiplier: this.newMagMultiplier,
      subtype: (this.newMagSubtype != '') ? this.newMagSubtype : undefined
    };
    this.newWeapon.magazines.push(mag);
  }

  delteMagazine(index: number) {
    this.newWeapon.magazines.splice(index, 1);
  }
}
