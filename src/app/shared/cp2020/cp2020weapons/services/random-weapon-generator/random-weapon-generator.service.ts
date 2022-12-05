import { DataWeapon } from './../../models/data-weapon';
import { map } from 'rxjs/operators';
import { WeaponDataService } from './../weapon-data.service';
import { RandomWeaponFilters } from './../../models/random-weapon-filters';
import { Observable } from 'rxjs';
import { CpPlayerWeapon } from './../../models/cp-player-weapon';
import { DiceService } from './../../../../services/dice/dice.service';
import { Injectable } from '@angular/core';
import { listenToTriggers } from 'ngx-bootstrap/utils';

@Injectable({
  providedIn: 'root',
})
export class RandomWeaponGeneratorService {
  constructor(
    private wpnDataService: WeaponDataService,
    private dice: DiceService
  ) {}

  generate(filters: RandomWeaponFilters): Observable<CpPlayerWeapon> {
    return this.wpnDataService.WeaponList.pipe(
      map((weaponList) => {
        const list = this.filterList(filters, new Array(...weaponList));
        const roll = this.dice.generateNumber(0, list.length - 1);
        const wpn = new CpPlayerWeapon(list[roll]);
        return wpn;
      })
    );
  }

  generateList(
    filters: RandomWeaponFilters,
    count: number
  ): Observable<Array<CpPlayerWeapon>> {
    return this.wpnDataService.WeaponList.pipe(
      map((weaponList) => {
        const list = this.filterList(filters, new Array(...weaponList));
        const result = new Array<CpPlayerWeapon>();
        for (let i = 0; i < count; i++) {
          const roll = this.dice.generateNumber(0, list.length - 1);
          result.push(new CpPlayerWeapon(list[roll]));
        }
        return result;
      })
    );
  }

  private filterList(
    filters: RandomWeaponFilters,
    list: Array<DataWeapon>
  ): Array<DataWeapon> {
    if (filters.category) {
      list = list.filter((wpn) => filters.category.includes(wpn?.category));
    }
    if (filters.subcategory) {
      list = list.filter((wpn) =>
        filters.subcategory.includes(wpn?.subcategory)
      );
    }
    if (filters.ammo) {
      list = list.filter((wpn) => filters.ammo.includes(wpn.ammo));
    }
    if (filters.cost) {
      list = list.filter((wpn) => wpn?.cost <= filters.cost);
    }
    if (filters.avail) {
      list = list.filter((wpn) => filters.avail.includes(wpn.avail));
    }
    if (filters.conc) {
      list = list.filter((wpn) => filters.conc.includes(wpn.conc));
    }
    if (filters.type) {
      list = list.filter((wpn) => filters.type.includes(wpn.type));
    }
    return list;
  }
}
