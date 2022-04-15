import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JsonDataFiles } from './../../shared/services/file-services';
import { SeoService } from './../../shared/services/seo/seo.service';
import { WeaponGroup } from '../../shared/cp2020/cp2020weapons/models';
import { DataService } from './../../shared/services/file-services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-moreguns',
  templateUrl: './moreguns.component.html',
  styleUrls: ['./moreguns.component.css'],
})
export class MoregunsComponent implements OnInit {
  weaponList$: Observable<Array<WeaponGroup>>;
  constructor(private dataService: DataService, private seo: SeoService) {}

  ngOnInit() {
    this.seo.updateMeta(
      'Cyberpunk 2020 More Guns',
      "2020-07, Cybersmily's Datafort Cyberpunk 2020 More Guns is a complied list of guns from The Edge of the Sword Vol 1 and Solo of Fortune."
    );
    this.getWeapons();
  }

  private getWeapons() {
    this.weaponList$ = this.dataService
      .GetJson<{ weapons: Array<WeaponGroup> }>(
        JsonDataFiles.CP2020_MORE_GUNS_JSON
      )
      .pipe(map((data) => data.weapons));
  }
}
