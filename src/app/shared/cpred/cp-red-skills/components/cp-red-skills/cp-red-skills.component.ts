import {
  faFilter,
  faSearch,
  faSort,
  faTimes,
  faPlus,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { CpRedSkillManagerService } from './../../services/cp-red-skill-manager/cp-red-skill-manager.service';
import { Component, OnInit } from '@angular/core';
import { CpRedCharacterSkill } from '../../models';

@Component({
  selector: 'cs-cp-red-skills',
  templateUrl: './cp-red-skills.component.html',
  styleUrls: ['./cp-red-skills.component.css'],
})
export class CpRedSkillsComponent implements OnInit {
  faSearch = faSearch;
  faFilter = faFilter;
  faSort = faSort;
  faTimes = faTimes;
  faPlus = faPlus;
  faSave = faSave;

  skills$: Observable<Array<CpRedCharacterSkill>>;

  newSkill: CpRedCharacterSkill = new CpRedCharacterSkill();

  sortOn: string = 'name';
  sortDirection: boolean = false;
  searchText: string = '';
  groupBy: string = 'name';

  constructor(private skillManager: CpRedSkillManagerService) {}

  ngOnInit(): void {
    this.skills$ = this.skillManager.skills;
  }
}
