import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Cp2020ACPADataAttributesService } from './../../services/cp2020-acpa-data-attrbutes/cp2020-acpa-data-attributes.service';
import { ACPAEnclosure } from './../../enums/acpa-enclossure';
import { Cp2020ACPAWeapon, Cp2020ACPAComponent } from '../../models';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cs-cp2020-acpa-select-equipment',
  templateUrl: './cp2020-acpa-select-equipment.component.html',
  styleUrls: ['./cp2020-acpa-select-equipment.component.css'],
})
export class Cp2020AcpaSelectEquipmentComponent implements OnInit {
  weaponCategories$: Observable<Array<string>>;
  weaponList$: Observable<Array<Cp2020ACPAWeapon>>;

  componentCategories$: Observable<Array<string>>;
  componentList$: Observable<Array<Cp2020ACPAComponent>>;

  selectedOption = { type: '', category: '' };

  @Input()
  location = '';

  @Input()
  enclosureType: ACPAEnclosure = ACPAEnclosure.internal;

  @Input()
  availableSpaces: number;

  @Output()
  chooseEquipment = new EventEmitter<Cp2020ACPAWeapon | Cp2020ACPAComponent>();

  constructor(private acpaDataService: Cp2020ACPADataAttributesService) {}

  ngOnInit(): void {
    this.weaponCategories$ = this.acpaDataService
      .getData()
      .pipe(
        map((data) =>
          data.weapons
            .map((wpn) => wpn.category)
            .filter((value, index, self) => self.indexOf(value) === index)
        )
      );
    this.componentCategories$ = this.acpaDataService
      .getData()
      .pipe(
        map((data) =>
          data.components
            .map((comp) => comp.category)
            .filter((value, index, self) => self.indexOf(value) === index)
        )
      );
    this.componentList$ = this.acpaDataService
      .getData()
      .pipe(map((data) => this.filterComponents(data.components)));
    this.weaponList$ = this.acpaDataService
      .getData()
      .pipe(map((data) => this.filterWeapons(data.weapons)));
  }

  filterWeapons(list: Array<Cp2020ACPAWeapon>): Array<Cp2020ACPAWeapon> {
    console.log('filterWeapons');
    return this.filterList(list) as Array<Cp2020ACPAWeapon>;
  }

  filterComponents(
    list: Array<Cp2020ACPAComponent>
  ): Array<Cp2020ACPAComponent> {
    console.log('filterComponents');
    return this.filterList(list) as Array<Cp2020ACPAComponent>;
  }

  filterList(
    list: Array<Cp2020ACPAComponent | Cp2020ACPAWeapon>
  ): Array<Cp2020ACPAComponent | Cp2020ACPAWeapon> {
    switch (this.enclosureType) {
      case ACPAEnclosure.internal:
        return list.filter(
          (item) =>
            (item?.internal?.includes(this.location) ||
              item?.internal?.includes('any')) &&
            item.spaces > 0 &&
            item.spaces <= this.availableSpaces
        );
      case ACPAEnclosure.external:
        return list.filter(
          (item) =>
            (item?.external?.includes(this.location) ||
              item?.external?.includes('any')) &&
            item.spaces > 0 &&
            item.spaces <= this.availableSpaces
        );
      case ACPAEnclosure.carried:
        return list.filter(
          (item) =>
            item?.external?.includes('handed') ||
            item?.external?.includes('any') ||
            item.spaces === 0
        );
      default:
        return new Array<Cp2020ACPAWeapon | Cp2020ACPAComponent>();
    }
  }

  selectEquipment(equip: Cp2020ACPAComponent | Cp2020ACPAWeapon) {
    this.chooseEquipment.emit(equip);
  }
}
