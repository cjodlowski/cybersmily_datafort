import { DiceService } from './../dice/dice.service';
import { JsonDataFiles } from './../../json-data-files';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { DataService } from './../data.service';
import { Injectable } from '@angular/core';
import { Cp2020ArmorLayer } from '../../models/cp2020character/cp2020-armor-layer';

@Injectable({
  providedIn: 'root'
})
export class ArmorDataService {

  private armorList: Array<Cp2020ArmorLayer>;

  constructor(private dataService: DataService) { }

  getArmorList(): Observable<Array<Cp2020ArmorLayer>> {
    if (this.armorList) {
      return of(this.armorList);
    }
    return this.dataService.GetJson(JsonDataFiles.CP2020_ARMOR_DATA_LIST_JSON)
    .pipe(
      map( data => {
        this.armorList = data;
        return this.armorList;
      })
    );
  }

  generateArmorLayer(diceService: DiceService): Observable<Cp2020ArmorLayer> {
    if (this.armorList) {
      return of(this.getLayer(this.armorList, diceService));
    }
    return this.dataService.GetJson(JsonDataFiles.CP2020_ARMOR_DATA_LIST_JSON)
    .pipe(
      map( data => {
        this.armorList = data;
        return this.getLayer(this.armorList, diceService);
      })
    );
  }

  getLayer(list:Array<Cp2020ArmorLayer>, diceService: DiceService) {
    return list[diceService.generateNumber(0,(list.length - 1))];
  }
}
